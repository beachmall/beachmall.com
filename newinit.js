(function(_app){
var configURI = (document.location.protocol == 'file:') ? _app.vars.testURL+'jsonapi/config.js' : _app.vars.baseURL+'jsonapi/config.js';

//Load the config.js script asynchronously.  When it finishes loading, we can start up the app
_app.u.loadScript(configURI,function(){
	//in some cases, such as the zoovy UI, zglobals may not be defined. If that's the case, certain vars, such as jqurl, must be passed in via P in initialize:
	_app.vars.username = zGlobals.appSettings.username.toLowerCase(); //used w/ image URL's.
	//need to make sure the secureURL ends in a / always. doesn't seem to always come in that way via zGlobals
	_app.vars.secureURL = zGlobals.appSettings.https_app_url;
	_app.vars.domain = zGlobals.appSettings.sdomain; //passed in ajax requests.
	_app.vars.jqurl = (document.location.protocol === 'file:') ? _app.vars.testURL+'jsonapi/' : '/jsonapi/';
	
	var startupRequires = ['quickstart','beachmall_begin','store_prodlist','dropdown-template-min.html'];
	
	_app.require(startupRequires, function(){
		setTimeout(function(){$('#appView').removeClass('initFooter');}, 1200);
		_app.ext.quickstart.callbacks.startMyProgram.onSuccess();
		
		_app.ext.beachmall_begin.u.addChat("41TM",$("[data-chat='header']","#appView"));
		_app.ext.beachmall_begin.u.addChat("yXFh",$("[data-chat='footer']","#appView"));
		//_app.ext.beachmall_begin.calls.whereAmI.init({'callback':'handleWhereAmI','extension':'beachmall_begin'},'passive');
		_app.ext.beachmall_begin.u.renderHeaderDropdown();
		$.extend(handlePogs.prototype,_app.ext.beachmall_begin.variations);
		_app.ext.beachmall_begin.u.startTooltip();
		
		_app.ext.beachmall_begin.u.scribeScript($('head'),"resources/jquery.carouFredSel-6.2.0.min.js","js"); 
		_app.ext.beachmall_begin.u.scribeScript($('head'),"resources/jquery.touchSwipe-1.3.3.min.js","js");
		_app.ext.beachmall_begin.u.scribeScript($('[data-noton="nomove"]'),"https://seal.verisign.com/getseal?host_name=www.beachmall.com&amp;size=S&amp;use_flash=NO&amp;use_transparent=NO&amp;lang=en","js"); 
		//_app.ext.beachmall_begin.u.scribeScript($('head'),"extensions/cart_message/styles.css","css"); //commented to reduce loading until cart message is fixed.
		_app.ext.beachmall_begin.u.scribeScript($('head'),"googleapis-libs-jqueryiu-1.10.2-theme-uilightnes-jqueryui-min.css","css");
		_app.ext.beachmall_begin.u.scribeScript($('head'),"https://fonts.googleapis.com/css?family=Open+Sans%7COswald%7CMontserrat","css");
		_app.ext.beachmall_begin.u.scribeScript($('head'),"resources/anyplugins-min.css","css");
		//_app.ext.beachmall_begin.u.scribeScript($('head'),"_beachmall_styles-min.css","css");
		
		//make sure minicart stays up to date. 
		_app.ext.beachmall_begin.vars.mcSetInterval = setInterval(function(){
			_app.ext.quickstart.u.handleMinicartUpdate({'datapointer':'cartDetail|'+_app.model.fetchCartID()});
		},4000);
		
		//makeDisallow() moved into productTemplate Event. Uncomment and load prod page to generate disallow list. edit list in beachmall_product extension.
		
		});
	}); //The config.js is dynamically generated.
	
_app.extend({
	"namespace" : "quickstart",
	"filename" : "app-quickstart.js"
	});

_app.couple('quickstart','addPageHandler',{
	"pageType" : "static",
	"require" : [],
	"handler" : function($container, infoObj){   dump('static coupler infoObj'); dump(infoObj); 
		var deferred = $.Deferred();
		infoObj.defPipeline.addDeferred(deferred);
		if(infoObj.deferred){
			infoObj.defPipeline.addDeferred(infoObj.deferred);
			}
		//We use infoObj.require here because the router handlers may have put something in there.
		//By nature, the static page handler requires nothing, but the templates it renders may require all kinds of stuff
		infoObj.require = infoObj.require || [];
		_app.require(infoObj.require,function(){
			infoObj.verb = 'translate';
			infoObj.templateid = infoObj.templateID;
			var $page = new tlc().runTLC(infoObj);
			//$page.tlc(infoObj);
			$page.data('templateid',infoObj.templateid);
			$page.data('pageid',infoObj.id);
			$container.append($page);
			infoObj.state = 'complete';
			//this method is synchronous so no extra deferred required
			_app.renderFunctions.handleTemplateEvents($page,infoObj);
			deferred.resolve();
			});
		}
	});

_app.extend({
	"namespace" : "order_create",
	"filename" : "extensions/checkout/extension.js"
	});

_app.couple('quickstart','addPageHandler',{
	"pageType" : "checkout",
	"require" : ['order_create','cco', 'extensions/checkout/active.html'],
	"handler" : function($container, infoObj, require){
		var deferred = $.Deferred();
		infoObj.defPipeline.addDeferred(deferred);
		infoObj.templateID = 'checkoutTemplate';
		_app.require(require,function(){
			$container.attr('id', 'checkoutContainer');
			_app.ext.order_create.a.startCheckout($container,_app.model.fetchCartID());
			infoObj.state = 'complete'; //needed for handleTemplateEvents.
			_app.renderFunctions.handleTemplateEvents($container,infoObj);
			deferred.resolve();
			});
		}
	});
	
_app.extend({
	"namespace" : "cco",
	"filename" : "extensions/cart_checkout_order.js"
	});

_app.couple('quickstart','addPageHandler',{
	"pageType" : "cart",
	"require" : ['cco','order_create','templates.html','beachmall_begin','beachmall_lists','beachmall_cart','beachmall_dates','store_routing','store_product'],
	"handler" : function($container, infoObj, require){
		infoObj.deferred = $.Deferred();
		infoObj.defPipeline.addDeferred(infoObj.deferred);
		infoObj.navcat = zGlobals.appSettings.rootcat;
		infoObj.cartid = _app.model.fetchCartID();
		infoObj.templateID = 'cartTemplate';
		infoObj.trigger = 'fetch';
		_app.require(require,function(){
			//var $cart = new tlc().getTemplateInstance('cartTemplate');
			//var $cart = $(_app.renderFunctions.createTemplateInstance('cartTemplate',infoObj));
			var $cart = _app.ext.cco.a.getCartAsJqObj(infoObj);
			$container.append($cart);
			
			$cart.on('complete',function(){
				$("[data-app-role='shipMethodsUL']",$(this)).find(":radio").each(function(){
					$(this).attr('data-app-change','quickstart|cartShipMethodSelect');
					});
				});

			$cart.trigger(infoObj.trigger,$.extend({'Q':'mutable'},infoObj));
				_app.model.dispatchThis('mutable');
			
			// _app.calls.cartDetail.init(_app.model.fetchCartID(),{
				// 'callback':'tlc',
				// 'onComplete' : function(){
					// infoObj.state = 'complete';
					// _app.renderFunctions.handleTemplateEvents($cart,$.extend(true,{},infoObj));
					// },
				// 'jqObj' : $cart,
				// 'verb' : 'translate'
				// },'mutable');
			// _app.model.dispatchThis('mutable');
			});
		}
	});
_app.u.bindTemplateEvent(function(templateID){ return (templateID == 'cartTemplate' || templateID == 'fieldcamTemplate')},'depart.destroy',function(event, $context, infoObj){
	var $page = $context.closest('[data-app-uri]');
	if($page){
		$page.empty().remove();
		}
	});

_app.extend({
	"namespace" : "store_routing",
	"filename" : "extensions/store_routing.js"
	});
	//formerly in startup callback of store_routing
_app.router.addAlias('product',		function(routeObj){_app.ext.quickstart.a.showContent(routeObj.value,	$.extend({'pageType':'product'}, routeObj.params));});
_app.router.appendHash({'type':'match','route':'/product/{{pid}}/{{name}}*','callback':'product'});
_app.router.appendHash({'type':'match','route':'/product/{{pid}}*','callback':'product'});


_app.router.addAlias('homepage',	function(routeObj){_app.ext.quickstart.a.showContent(routeObj.value,	$.extend({'pageType':'homepage'}, routeObj.params));});
_app.router.appendHash({'type':'exact','route':'/home','callback':'homepage'});
_app.router.appendHash({'type':'exact','route':'/home/','callback':'homepage'});
_app.router.appendHash({'type':'exact','route':'/','callback':'homepage'});

_app.router.addAlias('category',	function(routeObj){_app.ext.quickstart.a.showContent(routeObj.value,	$.extend({'pageType':'category'}, routeObj.params));});
_app.router.appendHash({'type':'match','route':'/category/{{navcat}}*','callback':'category'});

_app.router.addAlias('search',		function(routeObj){_app.ext.quickstart.a.showContent(routeObj.value,	$.extend({'pageType':'search','require':['quickstart','beachmall_lists','powerreviews_reviews','store_product']}, routeObj.params));});
_app.router.appendHash({'type':'match','route':'/search/tag/{{tag}}*','callback':'search'});
_app.router.appendHash({'type':'match','route':'/search/keywords/{{KEYWORDS}}*','callback':'search'});

_app.router.addAlias('checkout',	function(routeObj){_app.ext.quickstart.a.showContent(routeObj.value,	$.extend({'pageType':'checkout', 'requireSecure':true}, routeObj.params));});
_app.router.appendHash({'type':'exact','route':'/checkout','callback':'checkout'});
_app.router.appendHash({'type':'exact','route':'/checkout/','callback':'checkout'});

_app.router.addAlias('cart',	function(routeObj){_app.ext.quickstart.a.showContent(routeObj.value,	$.extend({'pageType':'cart'}, routeObj.params));});
_app.router.appendHash({'type':'exact','route':'/cart','callback':'cart'});
_app.router.appendHash({'type':'exact','route':'/cart/','callback':'cart'});

_app.router.appendHash({'type':'exact','route':'/404','callback':function(routeObj){
	$.extend(routeObj.params,{
		'pageType':'static',
		'templateID':'pageNotFoundTemplate',
		'require':['templates.html','store_routing','beachmall_begin']
		});
	_app.ext.quickstart.a.showContent(routeObj.value,routeObj.params);
	}});

_app.router.appendHash({'type':'exact','route':'/about_us/','callback':function(routeObj){
	$.extend(routeObj.params,{
		'pageType':'static',
		'templateID':'aboutUsTemplate',
		'require':['templates.html','store_routing']
		});
	_app.ext.quickstart.a.showContent(routeObj.value,routeObj.params);
	}});
_app.router.appendHash({'type':'exact','route':'/contact_us/','callback':function(routeObj){
	$.extend(routeObj.params,{
		'pageType':'static',
		'templateID':'contactUsTemplate',
		'require':['templates.html','store_routing']
		});
	_app.ext.quickstart.a.showContent(routeObj.value,routeObj.params);
	}});
_app.router.appendHash({'type':'exact','route':'/frequently_asked_questions/','callback':function(routeObj){
	$.extend(routeObj.params,{
		'pageType':'static',
		'templateID':'faqTemplate',
		'require':['templates.html','store_routing']
		});
	dump(routeObj.params);
	routeObj.params.deferred = $.Deferred();
	_app.ext.quickstart.a.showContent(routeObj.value,routeObj.params);
	}});
_app.u.bindTemplateEvent('faqTemplate','complete.faq',function(event, $context, infoObj){
	$context.off('complete.faq');
	dump('in faq complete event');
	_app.require(['store_crm','templates.html'],function(){
		_app.ext.store_crm.calls.appFAQsAll.init({'jqObj':$('.faqContent',$context),'deferred':infoObj.deferred,'callback':'showFAQTopics','extension':'store_crm','templateID':'faqTopicTemplate'});
		_app.model.dispatchThis();			
		});
	});
_app.router.appendHash({'type':'exact','route':'/payment_policy/','callback':function(routeObj){
	$.extend(routeObj.params,{
		'pageType':'static',
		'templateID':'paymentTemplate',
		'require':['templates.html','store_routing']
		});
	_app.ext.quickstart.a.showContent(routeObj.value,routeObj.params);
	}});
_app.router.appendHash({'type':'exact','route':'/privacy_policy/','callback':function(routeObj){
	$.extend(routeObj.params,{
		'pageType':'static',
		'templateID':'privacyTemplate',
		'require':['templates.html','store_routing']
		});
	_app.ext.quickstart.a.showContent(routeObj.value,routeObj.params);
	}});
_app.router.appendHash({'type':'exact','route':'/return_policy/','callback':function(routeObj){
	$.extend(routeObj.params,{
		'pageType':'static',
		'templateID':'returnTemplate',
		'require':['templates.html','store_routing']
		});
	_app.ext.quickstart.a.showContent(routeObj.value,routeObj.params);
	}});
_app.router.appendHash({'type':'exact','route':'/shipping_policy/','callback':function(routeObj){
	$.extend(routeObj.params,{
		'pageType':'static',
		'templateID':'shippingTemplate',
		'require':['templates.html','store_routing']
		});
	_app.ext.quickstart.a.showContent(routeObj.value,routeObj.params);
	}});
_app.router.appendHash({'type':'exact','route':'/recently_veiwed/','callback':function(routeObj){
	$.extend(routeObj.params,{
		'pageType':'static',
		'templateID':'recentTemplate',
		'require':['templates.html','beachmall_lists','store_routing']
		});
	_app.ext.quickstart.a.showContent(routeObj.value,routeObj.params);
	}});
	
_app.router.appendHash({'type':'exact','route':'/site-map/','callback':function(routeObj){
	$.extend(routeObj.params,{
		'pageType':'static',
		'templateID':'siteMapTemplate',
		'require':['templates.html','beachmall_begin','store_routing']
		});
	_app.ext.quickstart.a.showContent(routeObj.value,routeObj.params);
}});

_app.router.appendHash({'type':'exact','route':'/my_account/','callback':function(routeObj){
	$.extend(routeObj.params,{
		'pageType':'static',
		'login' : true,
		'templateID':'myAccountTemplate',
		'require':['cco','templates.html']
		});
	$("[data-modal='login']").empty().tlc({verb:"transmogrify", templateid:"loginTemplate"});
	_app.ext.quickstart.a.showContent(routeObj.value,routeObj.params);
	}});
_app.u.bindTemplateEvent('myAccountTemplate','complete.customer',function(event, $context, infoObj){
	_app.ext.cco.calls.appCheckoutDestinations.init(_app.model.fetchCartID(),{},'mutable'); //needed for country list in address editor.
	_app.model.addDispatchToQ({"_cmd":"buyerAddressList","_tag":{'callback':'tlc','jqObj':$('.mainColumn',$context),'verb':'translate','datapointer':'buyerAddressList'}},'mutable');
	_app.model.dispatchThis();							
	});
_app.router.appendHash({'type':'exact','route':'/my_order_history/','callback':function(routeObj){
	$.extend(routeObj.params,{
		'pageType':'static',
		'login' : true,
		'templateID':'orderHistoryTemplate',
		'require':['templates.html']
		});
	$("[data-modal='login']").empty().tlc({verb:"transmogrify", templateid:"loginTemplate"});
	_app.ext.quickstart.a.showContent(routeObj.value,routeObj.params);
	}});
_app.u.bindTemplateEvent('orderHistoryTemplate','complete.customer',function(event, $context, infoObj){
	_app.model.addDispatchToQ({"_cmd":"buyerPurchaseHistory","_tag":{'callback':'tlc','jqObj':$('.mainColumn',$context),'verb':'translate','datapointer':'buyerPurchaseHistory'}},'mutable');
	_app.model.dispatchThis();							
	});
_app.router.appendHash({'type':'exact','route':'/change_password/','callback':function(routeObj){
	$.extend(routeObj.params,{
		'pageType':'static',
		'login' : true,
		'templateID':'changePasswordTemplate',
		'require':['templates.html']
		});
	_app.ext.quickstart.a.showContent(routeObj.value,routeObj.params);
	}});
_app.u.bindTemplateEvent('changePasswordTemplate','complete.customer',function(event, $context, infoObj){
	_app.model.addDispatchToQ({"_cmd":"buyerPurchaseHistory","_tag":{
		"datapointer":"buyerPurchaseHistory",
		"callback":"tlc",
		"verb" : "translate",
		"jqObj" : $("[data-app-role='orderList']",$context).empty()
		}},"mutable");
	_app.model.dispatchThis();							
	});
_app.router.appendHash({'type':'exact','route':'/my_wishlist/','callback':function(routeObj){
	$.extend(routeObj.params,{
		'pageType':'static',
		'login' : true,
		'templateID':'customerListsTemplate',
		'require':['templates.html']
		});
	$("[data-modal='login']").empty().tlc({verb:"transmogrify", templateid:"loginTemplate"});
	_app.ext.quickstart.a.showContent(routeObj.value,routeObj.params);
	}});
_app.u.bindTemplateEvent('customerListsTemplate','complete.customer',function(event, $context, infoObj){
	_app.model.addDispatchToQ({"_cmd":"buyerProductLists","_tag":{"datapointer":"buyerProductLists",'verb':'translate','jqObj': $('.mainColumn',$context),'callback':'tlc',onComplete : function(rd){
//data formatting on lists is unlike any other format for product, so a special handler is used.				
		function populateBuyerProdlist(listID,$context)	{
			//add the product list ul here because tlc statement has list ID for bind.
			$("[data-buyerlistid='"+listID+"']",$context).append("<ul data-tlc=\"bind $var '.@"+listID+"'; store_prodlist#productlist  --hideSummary='1' --withReviews='1' --withVariations='1' --withInventory='1' --templateid='productListTemplateBuyerList'  --legacy;\" class='listStyleNone fluidList clearfix noPadOrMargin productList'></ul>");
			_app.model.addDispatchToQ({"_cmd":"buyerProductListDetail","listid":listID,"_tag" : {'datapointer':'buyerProductListDetail|'+listID,"listid":listID,'callback':'buyerListAsProdlist','extension':'quickstart', "require":"store_prodlist",'jqObj':$("[data-buyerlistid='"+listID+"'] ul",$context)}},'mutable');
			}
		
		var data = _app.data[rd.datapointer]['@lists']; //shortcut
		var L = data.length;
		var numRequests = 0;
		for(var i = 0; i < L; i += 1)	{
			populateBuyerProdlist(data[i].id,rd.jqObj)
			}
		_app.model.dispatchThis('mutable');
		//no sense putting 1 list into an accordion.
		if(L > 1)	{
			$('.applyAccordion',rd.jqObj).accordion({heightStyle: "content"});
			}
		}}},"mutable");
	_app.model.dispatchThis();							
	});
		
_app.u.bindTemplateEvent(function(){return true;}, 'complete.routing', function(event, $context, infoObj){
	if(infoObj){
		var canonical = "";
		
		var $routeEle = $('[data-canonical]',$context);
		if($routeEle.length){ canonical = $routeEle.attr('data-canonical'); }
		else{
			canonical = $context.closest('[data-app-uri]').attr('data-app-uri');
			}
		
		var $canonical = $('link[rel=canonical]')
		if(!$canonical.length){
			dump('NO CANONICAL IN THE DOCUMENT');
			$canonical = $('<link rel="canonical" href="" />');
			$('head').append($canonical);
			}
		$canonical.attr('href', canonical);
		}
	});
	
_app.extend({
	"namespace" : "store_tracking",
	"filename" : "extensions/store_tracking.js"
	});
_app.extend({
	"namespace" : "beachmall_tracking",
	"filename" : "extensions/_beachmall_tracking.js"
});
_app.couple('order_create','addOrderCompleteHandler',{
	'handler':function(P){
		_app.require('store_tracking',function(){
			if(P && P.datapointer && _app.data[P.datapointer] && _app.data[P.datapointer].order){
				var order = _app.data[P.datapointer].order;
				var $context = $('.checkoutSuccess');
				var orderTotal = order.sum.order_total;
				var orderID = order.our.orderid;
				dump('BEACHMALL_TRACKING: infoObj, datapointer, _app.data datapointer, and order exist');
				dump("TRACKING EXTENSION VARS: orderTotal, orderID, order:"); dump(orderTotal); dump(orderID); dump(order);
				
			//	_app.ext.beachmall_tracking.u.addAdwords(orderTotal);
				//creates the pixel image from the adwords no-script portion of the code and adds to conversion page.
				var gc_id = 1056650724;
				var gc_language = "en";
				var gc_format = "2";
				var gc_color = "ffffff";
				var gc_label = "0dneCJ6-wwEQ5Ovs9wM";
				var gc_value = orderTotal;
				var gc_currency = "USD";
				var g_remarketing_only = false;
				var guid = "ON";
				var url = "https://www.googleadservices.com/pagead/conversion/"+gc_id
					+"/?value="+gc_value
					+"&amp;currency_code="+gc_currency
					+"&amp;label="+gc_label
					+"&amp;guid="+guid
					+"&amp;script=0";
				$("body").append("<img src='"+url+"' height='1' width='1' style='border-style:none;' alt='' class='adwpix'/>");
			
				//_app.ext.beachmall_tracking.u.addBing($context,{'bing_domain_id':'248869','bing_cp':'5050'});
				//var $bingAds = $('[data-bingads]',$context);
				var bingID =	248869;
				var bingurl = "https://"+bingID+".r.msn.com/?type=1&cp=1";
				$("body").append("<img src='"+bingurl+"' width=1 height=1 />");
				
				
		//		_app.ext.beachmall_tracking.u.addShopping('448218', orderID, orderTotal);
		//		_app.ext.beachmall_tracking.u.addShopzilla('182786', orderID, orderTotal);
		//		_app.ext.beachmall_tracking.u.addPronto('104759', orderID, orderTotal);
		//		_app.ext.beachmall_tracking.u.addNextag('3865748', orderID, orderTotal);
		//		_app.ext.beachmall_tracking.u.addPriceGrabber($context,'10090');
		//		_app.ext.beachmall_tracking.u.addBecome('EC32A6A4ED7F110E', orderID, orderTotal);
		//		_app.ext.beachmall_tracking.u.addAddThis($context);
		//		_app.ext.beachmall_tracking.u.addFacebook('6009135221658');
				
				var plugins = zGlobals.plugins;
				// note: order is an object that references the raw (public) cart
				// order.our.xxxx  order[@ITEMS], etc.
				// data will appear in google analytics immediately after adding it (there is no delay)
				ga('require', 'ecommerce');
				//analytics tracking
				var r = {
					'id' : order.our.orderid,
					'revenue' : order.sum.items_total,
					'shipping' : order.sum.shp_total,
					'tax' : order.sum.tax_total
					};
				// _app.u.dump(r);
				ga('ecommerce:addTransaction',r);

				for(var i in order['@ITEMS']){
					var item = order['@ITEMS'][i];
					// _app.u.dump(item);
					ga('ecommerce:addItem', {
						'id' : order.our.orderid,
						'name' : item.prod_name,
						'sku' : item.sku,
						'price' : item.base_price,
						'quantity' : item.qty,
						})
					};

				ga('ecommerce:send');
				_app.u.dump('FINISHED store_tracking.onSuccess (google analytics)');
				
				for(var i in plugins){
					if(_app.ext.store_tracking.trackers[i] && _app.ext.store_tracking.trackers[i].enable){
						_app.ext.store_tracking.trackers[i](order, plugins[i]);
						}
					}
				}
			});
		}
	});

//Generate meta information
_app.u.bindTemplateEvent(function(){return true;}, 'complete.metainformation',function(event, $context, infoObj){
	var defaultTitle = "Beach Chairs | Beach Chair Umbrella | Beach Cart | Cabanas & Gear";
	var titlePrefix = "";
	var titlePostfix = "";
	
	var baseTitle = $('[data-seo-title]', $context).attr('data-seo-title') || defaultTitle;
	var desc = $('[data-seo-desc]', $context).attr('data-seo-desc') || '';
	
	document.title = titlePrefix + baseTitle + titlePostfix;
	$('meta[name=description]').attr('content', desc);
	});
	
//Scroll restore
_app.u.bindTemplateEvent(function(){return true;}, 'complete.scrollrestore',function(event, $context, infoObj){
	var scroll = $context.data('scroll-restore');
	if(scroll){
		$('html, body').animate({scrollTop : scroll}, 300);
		}
	else if((infoObj.performJumpToTop === false) ? false : true) {
		$('html, body').animate({scrollTop : 0}, 300);
		}
	else {
		//do nothing
		}
	});
	
_app.u.bindTemplateEvent(function(){return true;}, 'depart.scrollrestore', function(event, $context, infoObj){
	var scroll = $('html').scrollTop()
	$context.data('scroll-restore',scroll);
	});
	
_app.extend({
	"namespace":"beachmall_begin",
	"filename":"extensions/_beachmall_begin.js"
});

_app.u.bindTemplateEvent('homepageTemplate', 'complete.beachmall_homepage',function(event,$context,infoObj) {
	_app.ext.beachmall_homepage.u.getMainBanner();
	_app.ext.beachmall_homepage.u.loadProductsAsList($context,$('.newArrivalUL', $context));
	_app.ext.beachmall_homepage.u.loadProductsAsList($context,$('.bestUL', $context));
	_app.ext.beachmall_homepage.u.loadProductsAsList($context,$('.featuredUL', $context));
	$('.floatingBar',$context).is(":visible") ? "" : $('.floatingBar',$context).show(); //shows floating bar upon return to hompage if it's been closed.
	//_app.ext.beachmall_homepage.u.moveNorton($context); //TODO : post scribe was able to place this where it needed to be, kill it and the function if it stays that way.
	
	if(!$("[data-noton='ins']").data("noton-rendered")) {
		_app.ext.beachmall_begin.u.scribeScript($('[data-noton="ins"]'),"https://seal.verisign.com/getseal?host_name=www.beachmall.com&amp;size=XS&amp;use_flash=NO&amp;use_transparent=YES&amp;lang=en","js"); 
		$("[data-noton='ins']").attr("data-noton-rendered",true);
	}
});
_app.u.bindTemplateEvent('homepageTemplate', 'depart.beachmall_homepage',function(event,$context,infoObj) {
	$('.homeProdSearchNewArrivals2', $context).trigger('destroy').data('isCarousel',false);
	$('.homeProdSearchBestSellers', $context).trigger('destroy').data('isCarousel',false);
	$('.homeProdSearchFeatured', $context).trigger('destroy').data('isCarousel',false);
});

_app.u.bindTemplateEvent('categoryTemplate', 'complete.store_filter',function(event,$context,infoObj) {
	$.extend(handlePogs.prototype,_app.ext.store_filter.variations);
	_app.ext.store_filter.u.startFilterSearch($context,infoObj);
});

_app.u.bindTemplateEvent('categoryTemplateBrands', 'complete.beachmall_begin',function(event,$context,infoObj) {
	_app.ext.beachmall_begin.u.tabify($context,".brandsTabs");
});

_app.u.bindTemplateEvent('categoryTemplateBrands', 'complete.beachmall_lists',function(event,$context,infoObj) {
	_app.ext.beachmall_lists.u.countBrandsItems($context,"#viewAllProductsTab");
	_app.ext.beachmall_lists.u.countBrandsItems($context,"#featuredProdsTab");
	_app.ext.beachmall_lists.u.countBrandsItems($context,"#bestSellersTab");
});

_app.u.bindTemplateEvent('productTemplate', 'complete.beachmall_product',function(event,$context,infoObj) {
	//_app.ext.beachmall_product.u.makeDisallow(); //uncomment to use, then close it back up. This shouldn't be left running in production.
	_app.ext.beachmall_product.u.initEstArrival(infoObj);
	_app.ext.beachmall_product.u.doMagicStuff();
	_app.ext.beachmall_product.u.replaceReadReviewLink($context,infoObj.pid);
	_app.ext.beachmall_product.u.replaceWriteReviewLink($context,infoObj.pid,"snippet-write-review","pr-snippet-link");
	_app.ext.beachmall_product.u.replaceWriteReviewLink($context,infoObj.pid,"snapshot-write-review","pr-write-review-link");
	_app.ext.beachmall_begin.u.tabify($context,"[data-app-role='xsellTabContainer']");
	_app.ext.beachmall_begin.u.tabify($context,".tabbedProductContent");
	_app.ext.beachmall_product.u.runProductCarousel($context);
	_app.ext.beachmall_product.u.runProductVerticalCarousel($context);
	_app.ext.beachmall_product.u.runProductVerticalCarousel2($context);
	_app.ext.beachmall_product.u.runProductRecentCarousel($context);
	_app.ext.beachmall_product.u.handleProdPageToolTip();
});

_app.u.bindTemplateEvent('productTemplate', 'complete.beachmall_lists',function(event,$context,infoObj) {
	_app.ext.beachmall_lists.u.showRecentlyViewedItems($context,false);
});

_app.u.bindTemplateEvent('productTemplate', 'depart.beachmall_lists',function(event,$context,infoObj) {
	_app.ext.beachmall_lists.u.addRecentlyViewedItems($context, infoObj.pid);
});

_app.u.bindTemplateEvent('recentTemplate', 'complete.beachmall_lists',function(event,$context,infoObj) {
	_app.ext.beachmall_lists.u.showRecentlyViewedItems($context,true);
});

_app.u.bindTemplateEvent('cartTemplate', 'complete.beachmall_cart',function(event,$context,infoObj) {
	_app.ext.beachmall_cart.u.handleCartToolTip($context);
});

_app.u.bindTemplateEvent('createAccountTemplate', 'complete.beachmall_acctcreate',function(event,$context,infoObj) {
	$(".loginMessaging",$context).empty(); //be sure old success (or other) messages are not shown.
});

_app.u.bindTemplateEvent(function(templateID){ return true; },'complete.scrolltop',function(event, $context, infoObj){
	var homepage = $context.closest('[data-app-uri]').attr('data-app-uri');
	if(homepage !== "/"){
		_app.ext.beachmall_begin.u.backToTop($context);
	}
});

_app.router.appendHash({'type':'exact','route':'/create-account/','callback':function(routeObj){
	$.extend(routeObj.params,{
		'pageType':'static',
		'templateID':'createAccountTemplate',
		'require':['templates.html','beachmall_begin','store_routing','beachmall_acctcreate']
		});
	_app.ext.quickstart.a.showContent(routeObj.value,routeObj.params);
}});

_app.extend({
	"namespace":"beachmall_acctcreate",
	"filename":"extensions/_beachmall_acctcreate.js"
});

_app.extend({
	"namespace":"beachmall_homepage",
	"filename":"extensions/_beachmall_homepage.js"
});

_app.extend({
	"namespace":"beachmall_store",
	"filename":"extensions/_beachmall_store.js"
});

_app.extend({
	"namespace":"powerreviews_reviews",
	"filename":"extensions/partner_powerreviews_reviews.js"
});

_app.extend({
	"namespace":"magictoolbox_mzp",
	"filename":"extensions/partner_magictoolbox_mzp.js"
});

_app.extend({
	"namespace":"store_filter",
	"filename":"extensions/_store_filter.js"
});

_app.extend({
	"namespace":"beachmall_lists",
	"filename":"extensions/_beachmall_lists.js"
});

_app.extend({
	"namespace":"beachmall_product",
	"filename":"extensions/_beachmall_product.js"
});

_app.extend({
	"namespace":"beachmall_dates",
	"filename":"extensions/_beachmall_dates.js"
});

_app.extend({
	"namespace":"beachmall_cart",
	"filename":"extensions/_beachmall_cart.js"
});
	

// beachmall custom alias
				_app.router.addAlias('customCatName',	function(routeObj) {
					_app.ext.quickstart.a.showContent(routeObj.route, {'pageType':'category','navcat':routeObj.navcat,'templateID':'categoryTemplate'}); 
					}); 
				_app.router.addAlias('brandCatName',	function(routeObj) {
					_app.ext.quickstart.a.showContent(routeObj.route, {'pageType':'category','navcat':routeObj.navcat,'templateID':'categoryTemplateBrands'});
					}); 
				//the two below were for when the best seller and featured carousels on the homepage were populated w/ search. It may come back into style.
				//_app.router.addAlias('homepagefeatured',	function(routeObj){showContent('search',	{'elasticsearch':{'filter':{'and':[{'or':[{'term':{'tags':'IS_USER4'}},{'term':{'tags':'IS_COLORFUL'}},{'term':{'tags':'IS_USER5'}},{'term':{'user:prod_promo':'IS_USER4'}}]},{'not':{'term':{'tags':'IS_DISCONTINUED'}}}]}}});});
				//_app.router.addAlias('homepagebestseller',	function(routeObj){showContent('search',	{'elasticsearch':{'filter':{'and':[{'term':{'tags':'IS_BESTSELLER'}},{'not':{'term':{'tags':'IS_DISCONTINUED'}}}]}}});});
				
// beachmall custom append
				_app.router.appendHash({'type':'match','route':'/{{seo}}/c/{{navcat}}','callback':'category'});
				_app.router.appendHash({'type':'match','route':'/{{seo}}/p/{{pid}}.html','callback':'product'});
				_app.router.appendHash({'type':'match','route':'/redirect/p/pid={{pid}}','callback':'product'});
				_app.router.appendHash({'type':'match','route':'/homepagefeatured','callback':'homepagefeatured'});
				_app.router.appendHash({'type':'match','route':'/homepagebestseller','callback':'homepagebestseller'});
				_app.router.appendHash({'type':'match','route':'/{{seo}}/bestsellers/c/{{navcat}}*','callback':function(routeObj){
					$.extend(routeObj.params,{
						'pageType':'search',
						'elasticsearch' : {'filter':{'and':[{'term':{'tags':'IS_BESTSELLER'}},{'term':{'app_category':routeObj.params.navcat}},{'not':{'term':{'tags':'IS_DISCONTINUED'}}}]}}
					});
					_app.ext.quickstart.a.showContent(routeObj.value, routeObj.params);
				}});
				_app.router.appendHash({'type':'match','route':'/{{seo}}/featured/c/{{navcat}}*','callback':function(routeObj){
					$.extend(routeObj.params,{
						'pageType':'search',
						'elasticsearch' : {'filter':{'and':[{'or':[{'term':{'tags':'IS_USER6'}},{'term':{'tags':'IS_USER2'}},{'term':{'tags':'IS_USER3'}},{'term':{'prod_promo':'IS_USER4'}}]},{'term':{'app_category':routeObj.params.navcat}},{'not':{'term':{'tags':'IS_DISCONTINUED'}}}]}}
					});
					_app.ext.quickstart.a.showContent(routeObj.value, routeObj.params);
				}});
				_app.router.appendHash({'type':'match','route':'/{{seo}}/clearance/c/{{navcat}}*','callback':function(routeObj){
					$.extend(routeObj.params,{
						'pageType':'search',
						'elasticsearch' : {'filter':{'and':[{'term':{'tags':'IS_CLEARANCE'}},{'term':{'app_category':'.beach-chair.adirondack-furniture'}},{'not':{'term':{'tags':'IS_DISCONTINUED'}}}]}}
					});
					_app.ext.quickstart.a.showContent(routeObj.value, routeObj.params);
				}});
				_app.router.appendHash({'type':'exact','route':'/viewallfeatured/','callback':function(routeObj){
					$.extend(routeObj.params,{
						'pageType':'static',
						'templateID':'categoryTemplateHomepageFeatured',
						'require':['templates.html','prodlist_infinite','store_routing'],
						'dataset':_app.data["appNavcatDetail|$app-site_home-page-featured"]
					});
					_app.ext.quickstart.a.showContent(routeObj.value,routeObj.params);
				}});
				_app.router.appendHash({'type':'exact','route':'/viewallbestseller/','callback':function(routeObj){
					$.extend(routeObj.params,{
						'pageType':'static',
						'templateID':'categoryTemplateHomepageBestseller',
						'require':['templates.html','prodlist_infinite','store_routing'],
						'dataset':_app.data["appNavcatDetail|$app-site_home-page-best-sellers"]
					});
					_app.ext.quickstart.a.showContent(routeObj.value,routeObj.params);
				}});
				

				_app.router.appendHash({'type':'match','route':'/beach-accessories/','navcat':'.beach-accessories','callback':'customCatName'});
				_app.router.appendHash({'type':'match','route':'/beach-bags-totes/','navcat':'.beach-accessories.beach-bags-totes','callback':'customCatName'});
				_app.router.appendHash({'type':'match','route':'/beach-towels-blankets/','navcat':'.beach-accessories.beach-blanket','callback':'customCatName'});
				_app.router.appendHash({'type':'match','route':'/beach-carts/','navcat':'.beach-accessories.beach-cart','callback':'customCatName'});
				_app.router.appendHash({'type':'match','route':'/picnic-backpacks/','navcat':'.beach-accessories.picnic-backpack','callback':'customCatName'});
				_app.router.appendHash({'type':'match','route':'/picnic-baskets/','navcat':'.beach-accessories.picnic-baskets','callback':'customCatName'});
				_app.router.appendHash({'type':'match','route':'/coolers/','navcat':'.beach-accessories.picnic-cooler','callback':'customCatName'});
				_app.router.appendHash({'type':'match','route':'/tailgating/','navcat':'.beach-accessories.tailgating','callback':'customCatName'});
				_app.router.appendHash({'type':'match','route':'/beach-chairs/','navcat':'.beach-chair','callback':'customCatName'});
				_app.router.appendHash({'type':'match','route':'/adirondack/','navcat':'.beach-chair.adirondack-furniture','callback':'customCatName'});
				_app.router.appendHash({'type':'match','route':'/backpack-chairs/','navcat':'.beach-chair.backpack-chair','callback':'customCatName'});
				_app.router.appendHash({'type':'match','route':'/cup-holder-chairs/','navcat':'.beach-chair.beach-chairs','callback':'customCatName'});
				_app.router.appendHash({'type':'match','route':'/beach-chaises/','navcat':'.beach-chair.beach-chaise','callback':'customCatName'});
				_app.router.appendHash({'type':'match','route':'/beach-pool-lounges/','navcat':'.beach-chair.beach-lounges','callback':'customCatName'});
				_app.router.appendHash({'type':'match','route':'/beach-lounges/','navcat':'.beach-chair.beach-lounges.beach-recliner','callback':'customCatName'});
				_app.router.appendHash({'type':'match','route':'/pool-lounges/','navcat':'.beach-chair.beach-lounges.pool-floats','callback':'customCatName'});
				_app.router.appendHash({'type':'match','route':'/canopy-beach-chairs/','navcat':'.beach-chair.canopy-beach-chair','callback':'customCatName'});
				_app.router.appendHash({'type':'match','route':'/padded-beach-chairs/','navcat':'.beach-chair.folding-beach-chairs','callback':'customCatName'});
				_app.router.appendHash({'type':'match','route':'/high-back-beach-chairs/','navcat':'.beach-chair.heavy-beach-chairs','callback':'customCatName'});
				_app.router.appendHash({'type':'match','route':'/large-beach-chairs/','navcat':'.beach-chair.heavy-duty-beach-chairs','callback':'customCatName'});
				_app.router.appendHash({'type':'match','route':'/high-seat-beach-chairs/','navcat':'.beach-chair.high-beach-chair','callback':'customCatName'});
				_app.router.appendHash({'type':'match','route':'/folding-beach-chairs/','navcat':'.beach-chair.lafuma-recliner.lafuma-chairs','callback':'customCatName'});
				_app.router.appendHash({'type':'match','route':'/premium-chairs/','navcat':'.beach-chair.lafuma-recliner','callback':'customCatName'});
				_app.router.appendHash({'type':'match','route':'/low-seat-beach-chairs/','navcat':'.beach-chair.sand-chair','callback':'customCatName'});
				_app.router.appendHash({'type':'match','route':'/lay-flat-beach-chairs/','navcat':'.beach-chair.sand-chairs','callback':'customCatName'});
				_app.router.appendHash({'type':'match','route':'/wooden-beach-chairs/','navcat':'.beach-chair.wooden-beach-chairs','callback':'customCatName'});
_app.router.appendHash({'type':'match','route':'/shop-by-brand/','navcat':'.beach-chairs.beach-gear','callback':'brandCatName'});
				_app.router.appendHash({'type':'match','route':'/copa-sports/','navcat':'.beach-chairs.beach-gear.beach-products','callback':'brandCatName'});
				_app.router.appendHash({'type':'match','route':'/blueridge-chair/','navcat':'.beach-chairs.beach-gear.blueridge-lawn-chair','callback':'brandCatName'});
				_app.router.appendHash({'type':'match','route':'/shadezilla-umbrellas/','navcat':'.beach-chairs.beach-gear.california-umbrellas','callback':'brandCatName'});
				_app.router.appendHash({'type':'match','route':'/ergo-lounger/','navcat':'.beach-chairs.beach-gear.ergo-lounger-chaise','callback':'brandCatName'});
				_app.router.appendHash({'type':'match','route':'/fiberbuilt/','navcat':'.beach-chairs.beach-gear.fiberbuilt-umbrellas','callback':'brandCatName'});
				_app.router.appendHash({'type':'match','route':'/frankford-umbrellas/','navcat':'.beach-chairs.beach-gear.frankford-umbrellas','callback':'brandCatName'});
				_app.router.appendHash({'type':'match','route':'/galtech/','navcat':'.beach-chairs.beach-gear.galtech-umbrellas','callback':'brandCatName'});
				_app.router.appendHash({'type':'match','route':'/gift-baskets/','navcat':'.beach-chairs.beach-gear.gift_baskets','callback':'brandCatName'});
				_app.router.appendHash({'type':'match','route':'/green-corner/','navcat':'.beach-chairs.beach-gear.green-corner-umbrellas','callback':'brandCatName'});
				_app.router.appendHash({'type':'match','route':'/snapper-rock/','navcat':'.beach-chairs.beach-gear.kids-beachwear','callback':'brandCatName'});
				_app.router.appendHash({'type':'match','route':'/lafuma/','navcat':'.beach-chairs.beach-gear.lafuma-chair-recliner','callback':'brandCatName'});
				_app.router.appendHash({'type':'match','route':'/ostrich-chairs/','navcat':'.beach-chairs.beach-gear.ostrich-beach-chair-chaise','callback':'brandCatName'});
				_app.router.appendHash({'type':'match','route':'/picnic-ascot/','navcat':'.beach-chairs.beach-gear.picnic-ascot-accessories','callback':'brandCatName'});
				_app.router.appendHash({'type':'match','route':'/picnic-beyond/','navcat':'.beach-chairs.beach-gear.picnic-basket-beyond','callback':'brandCatName'});
				_app.router.appendHash({'type':'match','route':'/picnic-plus/','navcat':'.beach-chairs.beach-gear.picnic-plus-baskets','callback':'brandCatName'});
				_app.router.appendHash({'type':'match','route':'/picnic-time/','navcat':'.beach-chairs.beach-gear.picnic-time-backpacks','callback':'brandCatName'});
				_app.router.appendHash({'type':'match','route':'/platypus/','navcat':'.beach-chairs.beach-gear.platypus','callback':'brandCatName'});
				_app.router.appendHash({'type':'match','route':'/polywood-furniture/','navcat':'.beach-chairs.beach-gear.polywood-adirondack-chairs','callback':'brandCatName'});
				_app.router.appendHash({'type':'match','route':'/rio-brand/','navcat':'.beach-chairs.beach-gear.rio-beach-chair-umbrellas','callback':'brandCatName'});
				_app.router.appendHash({'type':'match','route':'/shadezilla/','navcat':'.beach-chairs.beach-gear.shadebrella-umbrellas','callback':'brandCatName'});
				_app.router.appendHash({'type':'match','route':'/abo gear/','navcat':'.beach-chairs.beach-gear.sun-tent','callback':'brandCatName'});
				_app.router.appendHash({'type':'match','route':'/abo gear/','navcat':'.beach-chairs.beach-gear.sutherland-baskets','callback':'brandCatName'});
				_app.router.appendHash({'type':'match','route':'/solarguard/','navcat':'.beach-chairs.beach-gear.sutherland-baskets','callback':'brandCatName'});
				_app.router.appendHash({'type':'match','route':'/wonder-wheeler/','navcat':'.beach-chairs.beach-gear.swimwear-bathing-suits','callback':'brandCatName'});
				_app.router.appendHash({'type':'match','route':'/telescope-casual/','navcat':'.beach-chairs.beach-gear.telescope-beach-chairs','callback':'brandCatName'});
				_app.router.appendHash({'type':'match','route':'/wearever-chairs/','navcat':'.beach-chairs.beach-gear.wearever-chairs','callback':'brandCatName'});
_app.router.appendHash({'type':'match','route':'/wheeleez/','navcat':'.beach-chairs.beach-gear.wheeleez-beach-carts','callback':'brandCatName'});
				_app.router.appendHash({'type':'match','route':'/recreation/','navcat':'.beach-sports','callback':'customCatName'});
				_app.router.appendHash({'type':'match','route':'/bodyboards/','navcat':'.beach-sports.bodyboards','callback':'customCatName'});
				_app.router.appendHash({'type':'match','route':'/inflatables/','navcat':'.beach-sports.inflatables','callback':'customCatName'});
				_app.router.appendHash({'type':'match','route':'/pool-floats/','navcat':'.beach-sports.pool-floats','callback':'customCatName'});
				_app.router.appendHash({'type':'match','route':'/skimboards/','navcat':'.beach-sports.skimboards','callback':'customCatName'});
				_app.router.appendHash({'type':'match','route':'/umbrellas-shelters/','navcat':'.beach-umbrellas-shelter','callback':'customCatName'});
				_app.router.appendHash({'type':'match','route':'/beach-cabanas/','navcat':'.beach-umbrellas-shelter.beach-cabana','callback':'customCatName'});
				_app.router.appendHash({'type':'match','route':'/beach-tents-shelters/','navcat':'.beach-umbrellas-shelter.beach-tent-shelters','callback':'customCatName'});
				_app.router.appendHash({'type':'match','route':'/beach-umbrellas/','navcat':'.beach-umbrellas-shelter.beach-umbrella','callback':'customCatName'});
				_app.router.appendHash({'type':'match','route':'/market-patio-umbrellas/','navcat':'.beach-umbrellas-shelter.patio-umbrella','callback':'customCatName'});
				_app.router.appendHash({'type':'match','route':'/6-foot-wide-umbrellas/','navcat':'.beach-umbrellas-shelter.patio-umbrella.6-foot-patio-umbrellas','callback':'customCatName'});
				_app.router.appendHash({'type':'match','route':'/7-foot-wide-umbrellas/','navcat':'.beach-umbrellas-shelter.patio-umbrella.7-foot-patio-umbrellas','callback':'customCatName'});
				_app.router.appendHash({'type':'match','route':'/9-foot-wide-umbrellas-/','navcat':'.beach-umbrellas-shelter.patio-umbrella.offset-umbrellas','callback':'customCatName'});
				_app.router.appendHash({'type':'match','route':'/11-foot-wide-umbrellas-/','navcat':'.beach-umbrellas-shelter.patio-umbrella.market-umbrellas','callback':'customCatName'});
				_app.router.appendHash({'type':'match','route':'/umbrella-accessories/','navcat':'.beach-umbrellas-shelter.umbrella-stand-stands-base','callback':'customCatName'});
				_app.router.appendHash({'type':'match','route':'/beach-wear/','navcat':'.beachwear','callback':'customCatName'});
				_app.router.appendHash({'type':'match','route':'/summer-hats/','navcat':'.beachwear.beach-hat','callback':'customCatName'});
				_app.router.appendHash({'type':'match','route':'/baby-hats/','navcat':'.beachwear.beach-hat.baby-hats','callback':'customCatName'});
				_app.router.appendHash({'type':'match','route':'/kids-sun-hats/','navcat':'.beachwear.beach-hat.kids-hats','callback':'customCatName'});
				_app.router.appendHash({'type':'match','route':'/beach-pool-apparels/','navcat':'.beachwear.beach-swimwear','callback':'customCatName'});
				_app.router.appendHash({'type':'match','route':'/babies-swim-wear/','navcat':'.beachwear.beach-swimwear.babies-swimsuit','callback':'customCatName'});
			//beach-wear used as pretty name twice, prepended swim to the pretty name in seo anchor function to differentiate.
				_app.router.appendHash({'type':'match','route':'/swim-beach-wear/','navcat':'.beachwear.beach-swimwear.beach-wear','callback':'customCatName'});
				_app.router.appendHash({'type':'match','route':'/boys-beach-wear/','navcat':'.beachwear.beach-swimwear.beach-wear.boys-swimwear','callback':'customCatName'});
				_app.router.appendHash({'type':'match','route':'/girls-beach-wear/','navcat':'.beachwear.beach-swimwear.beach-wear.girls-swimwear','callback':'customCatName'});
				_app.router.appendHash({'type':'match','route':'/board-shorts/','navcat':'.beachwear.beach-swimwear.board-shorts','callback':'customCatName'});
				_app.router.appendHash({'type':'match','route':'/boy-board-shorts/','navcat':'.beachwear.beach-swimwear.board-shorts.boys-boardshorts','callback':'customCatName'});
				_app.router.appendHash({'type':'match','route':'/girls-board-shorts/','navcat':'.beachwear.beach-swimwear.board-shorts.girls-board-shorts','callback':'customCatName'});
				_app.router.appendHash({'type':'match','route':'/kids-board-shorts/','navcat':'.beachwear.beach-swimwear.board-shorts.kids','callback':'customCatName'});
				_app.router.appendHash({'type':'match','route':'/kids-swim-wear/','navcat':'.beachwear.beach-swimwear.kids-swimsuit','callback':'customCatName'});
				_app.router.appendHash({'type':'match','route':'/rash-guards/','navcat':'.beachwear.beach-swimwear.rashguard','callback':'customCatName'});
				_app.router.appendHash({'type':'match','route':'/girls-rash-guards/','navcat':'.beachwear.beach-swimwear.rashguard.girls-rash-guard','callback':'customCatName'});
				_app.router.appendHash({'type':'match','route':'/kids-baby-rash-guards/','navcat':'.beachwear.beach-swimwear.rashguard.kids-rash-guard','callback':'customCatName'});
				_app.router.appendHash({'type':'match','route':'/boys-rash-guards/','navcat':'.beachwear.beach-swimwear.rashguard.rashguards','callback':'customCatName'});
				_app.router.appendHash({'type':'match','route':'/love-swimwear/','navcat':'.beach-chairs.beach-gear.women-swimwear-bikinis','callback':'customCatName'});
				_app.router.appendHash({'type':'match','route':'/buyer-guides/','navcat':'.buyer_guides','callback':'customCatName'});
				_app.router.appendHash({'type':'match','route':'/adirondack-chairs-buyer-guide/','navcat':'.buyer_guides.adirondack-chairs','callback':'customCatName'});
				_app.router.appendHash({'type':'match','route':'/backpack-beach-chairs-buyer-guide/','navcat':'.buyer_guides.backpack-beach-chairs','callback':'customCatName'});
				_app.router.appendHash({'type':'match','route':'/beach-bags-buyer-guide/','navcat':'.buyer_guides.beach-bags-beach-totes','callback':'customCatName'});
				_app.router.appendHash({'type':'match','route':'/beach-cabanas-buyer-guide/','navcat':'.buyer_guides.beach-cabanas','callback':'customCatName'});
				_app.router.appendHash({'type':'match','route':'/beach-carts-buyer-guide/','navcat':'.buyer_guides.beach-carts','callback':'customCatName'});
				_app.router.appendHash({'type':'match','route':'/beach-chairs-buyer-guide/','navcat':'.buyer_guides.beach-chairs','callback':'customCatName'});
				_app.router.appendHash({'type':'match','route':'/beach-tents-buyer-guide/','navcat':'.buyer_guides.beach-tents','callback':'customCatName'});
				_app.router.appendHash({'type':'match','route':'/beach-umbrellas-buyer-guide/','navcat':'.buyer_guides.beach-umbrellas','callback':'customCatName'});
				_app.router.appendHash({'type':'match','route':'/beach-wear-buyer-guide/','navcat':'.buyer_guides.beach-wear','callback':'customCatName'});
				_app.router.appendHash({'type':'match','route':'/bodyboards-buyer-guide/','navcat':'.buyer_guides.bodyboards-body-board','callback':'customCatName'});
				_app.router.appendHash({'type':'match','route':'/hammocks-buyer-guide/','navcat':'.buyer_guides.hammocks','callback':'customCatName'});
				_app.router.appendHash({'type':'match','route':'/lafuma-chairs-buyer-guide/','navcat':'.buyer_guides.lafuma-chairs-recliners','callback':'customCatName'});
				_app.router.appendHash({'type':'match','route':'/market-umbrellas-buyer-guide/','navcat':'.buyer_guides.market-umbrellas','callback':'customCatName'});
				_app.router.appendHash({'type':'match','route':'/patio-umbrellas-buyer-guide/','navcat':'.buyer_guides.outdoor-umbrellas','callback':'customCatName'});
				_app.router.appendHash({'type':'match','route':'/picnic-backpacks-buyer-guide/','navcat':'.buyer_guides.picnic-backpacks','callback':'customCatName'});
				_app.router.appendHash({'type':'match','route':'/picnic-baskets-buyer-guide/','navcat':'.buyer_guides.picnic-baskets','callback':'customCatName'});
				_app.router.appendHash({'type':'match','route':'/picnic-blankets-buyer-guide/','navcat':'.buyer_guides.picnic-blankets','callback':'customCatName'});
				_app.router.appendHash({'type':'match','route':'/picnic-coolers-buyer-guide/','navcat':'.buyer_guides.picnic-cooler-beach-coolers','callback':'customCatName'});
				_app.router.appendHash({'type':'match','route':'/skimboards-buyer-guide/','navcat':'.buyer_guides.skimboards-skim-board','callback':'customCatName'});
				_app.router.appendHash({'type':'match','route':'/umbrella-stands-buyer-guide/','navcat':'.buyer_guides.umbrella-stands-bases','callback':'customCatName'});
				_app.router.appendHash({'type':'match','route':'/sitemap/','navcat':'.sitemap','callback':'customCatName'});
				_app.router.appendHash({'type':'match','route':'/affiliates/','navcat':'.affiliates','callback':'customCatName'});
				_app.router.appendHash({'type':'match','route':'/directory/','navcat':'.directory','callback':'customCatName'});
				_app.router.appendHash({'type':'match','route':'/low-price-guarantee/','navcat':'.help.low_price_guarantee','callback':'customCatName'});
				_app.router.appendHash({'type':'match','route':'/surcharge-explanation/','navcat':'.help.surcharge-explanation','callback':'customCatName'});

// _app.u.bindTemplateEvent('productTemplate', 'complete.invcheck',function(event, $context, infoObj){
	// if(!$context.attr('data-invcheck')){
		// $context.attr('data-invcheck','true');
		// var data = _app.data['appProductGet|'+infoObj.pid];
		// var variations = data['@variations'];
		// if(variations.length == 1){
			// var id = variations[0].id;
			// $('select[name='+id+'] option', $context).each(function(){
				// var sku = infoObj.pid+":"+id+""+$(this).attr("value");
				// dump(sku);
				// dump(data["@inventory"][sku]);
				// if(data["@inventory"][sku] && data["@inventory"][sku].AVAILABLE <= 0){
					// //$(this).attr("disabled","disabled");
					// $(this).remove();
					// }
				// });
			// }
		// }
	// });
	
_app.extend({
	"namespace" : "store_prodlist",
	"filename" : "extensions/store_prodlist.js"
	});
	
_app.extend({
	"namespace" : "prodlist_infinite",
	"filename" : "extensions/prodlist_infinite.js"
	});
	
_app.extend({
	"namespace" : "store_navcats",
	"filename" : "extensions/store_navcats.js"
	});
	
_app.couple('quickstart','addPageHandler',{
	"pageType" : "homepage",
	"require" : ['store_navcats','templates.html','store_routing','beachmall_homepage','store_product','powerreviews_reviews','beachmall_lists'],
	"handler" : function($container, infoObj, require){
		infoObj.deferred = $.Deferred();
		infoObj.defPipeline.addDeferred(infoObj.deferred);
		dump('homepage handler');
		infoObj.navcat = zGlobals.appSettings.rootcat;
		_app.require(require,function(){
			infoObj.templateID = 'homepageTemplate';
			_app.ext.store_navcats.u.showPage($container, infoObj);
			});
		}
	});
	
_app.couple('quickstart','addPageHandler',{
	"pageType" : "category",
	"require" : ['store_navcats','store_prodlist','store_product','prodlist_infinite','templates.html','store_routing','store_filter','store_search','powerreviews_reviews','beachmall_begin','beachmall_lists'],
	"handler" : function($container, infoObj, require){
		infoObj.deferred = $.Deferred();
		infoObj.defPipeline.addDeferred(infoObj.deferred);
		if(infoObj.navcat.charAt(0) != '.'){
			infoObj.navcat = '.'+infoObj.navcat
			}
		if(_app.ext.quickstart.vars.session.recentCategories[0] != infoObj.navcat)	{
			_app.ext.quickstart.vars.session.recentCategories.unshift(infoObj.navcat);
			}
		_app.require(require,function(){
			if(infoObj.templateID){}
			else{infoObj.templateID = 'categoryTemplate';}
			if(infoObj.templateID = 'categoryTemplate'){
				infoObj.prodRenderedDeferred = $.Deferred();
				infoObj.defPipeline.addDeferred(infoObj.prodRenderedDeferred);
				}
			_app.ext.store_navcats.u.showPage($container, infoObj);
			});
						
		}
	});
	
_app.extend({
	"namespace" : "store_search",
	"filename" : "extensions/store_search.js"
	});
	
_app.couple('store_search','addUniversalFilter',{
	'filter' : {"has_child":{"type":"sku","query":{"range":{"available":{"gte":1}}}}}
	});
_app.couple('store_search','addUniversalFilter',{
	'filter' : {"not":{"term":{"tags":"IS_DISCONTINUED"}}}
	});
				
_app.couple('quickstart','addPageHandler',{
	"pageType" : "search",
	"require" : ['store_search','templates.html','store_routing'],
	"handler" : function($container, infoObj, require){
		infoObj.deferred = $.Deferred();
		infoObj.defPipeline.addDeferred(infoObj.deferred);
		_app.require(require,function(){
			_app.ext.store_search.u.showSearch($container, infoObj);
			});
						
		}
	});
	
_app.extend({
	"namespace" : "store_product",
	"filename" : "extensions/store_product.js"
	});


_app.couple('quickstart','addPageHandler',{
	"pageType" : "product",
	"require" : ['store_product','store_navcats', 'store_routing', 'beachmall_begin', 'beachmall_product', 'beachmall_dates', 'powerreviews_reviews', 'beachmall_lists', 'store_search', 'store_crm', 'templates.html', 'magictoolbox_mzp'],
	"handler" : function($container, infoObj, require){
		infoObj.deferred = $.Deferred();
		infoObj.defPipeline.addDeferred(infoObj.deferred);
//		if($.inArray(infoObj.pid,_app.ext.quickstart.vars.session.recentlyViewedItems) < 0)	{
//			_app.ext.quickstart.vars.session.recentlyViewedItems.unshift(infoObj.pid);
//			}
//		else	{
//			_app.ext.quickstart.vars.session.recentlyViewedItems.splice(0, 0, _app.ext.quickstart.vars.session.recentlyViewedItems.splice($.inArray(infoObj.pid, _app.ext.quickstart.vars.session.recentlyViewedItems), 1)[0]);
//			}
		//IMPORTANT: requiring every extension needed in order to render the page, including TLC formats in the template
		_app.require(require, function(){
			infoObj.templateID = 'productTemplate';
			_app.ext.store_product.u.showProd($container, infoObj);
			});
		}
	});
	
// _app.extend({
	// "namespace" : "cart_message",
	// "filename" : "extensions/cart_message/extension.js"
	// });
	
_app.extend({
	"namespace" : "store_crm",
	"filename" : "extensions/store_crm.js"
	});
	
// _app.extend({
	// "namespace" : "partner_addthis",
	// "filename" : "extensions/partner_addthis.js"
	// });
// _app.u.bindTemplateEvent('productTemplate', 'complete.test', function(event, $context, infoObj){
	// var $toolbox = $('.socialLinks', $context);
	// if($toolbox.hasClass('addThisRendered')){
		// //Already rendered, don't do it again.
		// }
	// else {
		// $toolbox.addClass('addThisRendered').append(
				// '<div class="addthis_toolbox addthis_default_style addthis_32x32_style">'
			// +		'<a class="addthis_button_preferred_1"></a>'
			// +		'<a class="addthis_button_preferred_2"></a>'
			// +		'<a class="addthis_button_preferred_3"></a>'
			// +		'<a class="addthis_button_preferred_4"></a>'
			// +		'<a class="addthis_button_preferred_5"></a>'
			// +		'<a class="addthis_button_preferred_6"></a>'
			// +		'<a class="addthis_button_preferred_7"></a>'
			// +		'<a class="addthis_button_preferred_8add"></a>'
			// +		'<a class="addthis_button_compact"></a>'
			// +	'</div>');
		
		// _app.ext.partner_addthis.u.toolbox($toolbox, infoObj);
		// }
	// });
	
//_app.rq.push(['script',0,'lightbox/js/lightbox-2.6.min.js']);
//setTimeout(function(){
//_app.rq.push(['script',0,'http://cdn.powerreviews.com/repos/11024/pr/pwr/engine/js/full.js']);
//},0);

_app.model.getGrammar("pegjs");


//Any code that needs to be executed after the app init has occured can go here.
//will pass in the page info object. (pageType, templateID, pid/navcat/show and more)
_app.u.appInitComplete = function()	{
//	_app.u.dump("Executing _appIsLoaded code...");
	
	_app.ext.order_create.checkoutCompletes.push(function(vars,$checkout){
		dump(" -> begin checkoutCOmpletes code: "); dump(vars);
		
		var cartContentsAsLinks = encodeURIComponent(_app.ext.cco.u.cartContentsAsLinks(_app.data[vars.datapointer].order));
	
		
//append this to 
		$("[data-app-role='thirdPartyContainer']",$checkout).append("<h2>What next?</h2><div class='ocm ocmFacebookComment pointer zlink marginBottom checkoutSprite  '></div><div class='ocm ocmTwitterComment pointer zlink marginBottom checkoutSprit ' ></div><div class='ocm ocmContinue pointer zlink marginBottom checkoutSprite'></div>");
		$('.ocmTwitterComment',$checkout).click(function(){
			window.open('http://twitter.com/home?status='+cartContentsAsLinks,'twitter');
			window[_app.vars.analyticsPointer]('send', 'event','Checkout','User Event','Tweeted about order');
			window[_app.vars.analyticsPointer]('send', 'event','Checkout','User Event','Tweeted about order');
			});
		//the fb code only works if an appID is set, so don't show banner if not present.				
		if(_app.u.thisNestedExists("zGlobals.thirdParty.facebook.appId") && typeof FB == 'object')	{
			$('.ocmFacebookComment',$checkout).click(function(){
				_app.ext.quickstart.thirdParty.fb.postToWall(cartContentsAsLinks);
				ga('send','event','Checkout','User Event','FB message about order');
				window[_app.vars.analyticsPointer]('send', 'event','Checkout','User Event','FB message about order');
				});
			}
		else	{$('.ocmFacebookComment').hide()}
		});
	
	//Cart Messaging Responses.
	_app.cmr.push(['chat.join',function(message){
		if(message.FROM == 'ADMIN')	{
			var $ui = _app.ext.quickstart.a.showBuyerCMUI();
			$("[data-app-role='messageInput']",$ui).show();
			$("[data-app-role='messageHistory']",$ui).append("<p class='chat_join'>"+message.FROM+" has joined the chat.<\/p>");
			$('.show4ActiveChat',$ui).show();
			$('.hide4ActiveChat',$ui).hide();
			}
		}]);

	_app.cmr.push(['goto',function(message,$context){
		var $history = $("[data-app-role='messageHistory']",$context);
		$P = $("<P>")
			.addClass('chat_post')
			.append("<span class='from'>"+message.FROM+"<\/span> has sent over a "+(message.vars.pageType || "")+" link for you within this store. <span class='lookLikeLink'>Click here<\/span> to view.")
			.on('click',function(){
				showContent(_app.ext.quickstart.u.whatAmIFor(message.vars),message.vars);
				});
		$history.append($P);
		$history.parent().scrollTop($history.height());
		}]);

	}





//this will trigger the content to load on app init. so if you push refresh, you don't get a blank page.
//it'll also handle the old 'meta' uri params.
//this will trigger the content to load on app init. so if you push refresh, you don't get a blank page.
//it'll also handle the old 'meta' uri params.
_app.router.appendInit({
	'type':'function',
	'route': function(v){
		return {'init':true} //returning anything but false triggers a match.
		},
	'callback':function(f,g){
		$('#clickBlocker').remove();
		dump(" -> triggered callback for appendInit");
		g = g || {};
		var $existingPage = $('#mainContentArea [data-app-uri]');
		if($existingPage.length /*&& $existingPage.attr('data-app-uri') == document.location.pathname*/){
			//We are a transplanted document, let's load accordingly.
			//re-attach template handlers
			var $renderedTemplate = $('[data-templateid]', $existingPage);
			var templateid = $renderedTemplate.attr('data-templateid');
			for(var i in _app.templateEvents){
				var event = _app.templateEvents[i];
				if(event.filterFunc(templateid)){
					dump("Attaching event");
					dump(event);
					$renderedTemplate.on(event.event, event.handler);
					}
				}
			//handleURIChange here will not change the page, but it will execute appropriate events
			//that's why we pass false for the windowHistoryAction- no pushstate
			_app.router.handleURIString($existingPage.attr('data-app-uri'), false, {"retrigger" : true});
			}
		else if (document.location.hash.indexOf("#!") == 0){
			var pathStr = document.location.hash.substr(2);
			var search = false;
			if(pathStr.indexOf('?') >= 0){
				var arr = pathStr.split('?');
				pathStr = arr[0];
				search = arr[1];
				}
			_app.router.handleURIChange("/"+pathStr, search, false, 'replace');
			}
		else if(document.location.protocol == "file:"){
			_app.router.handleURIChange("/", document.location.search, document.location.hash, 'replace');
			}
		else if (g.uriParams.marketplace){
			_app.router.handleURIString('/product/'+g.uriParams.product+'/', 'replace');
			window[_app.vars.analyticsPointer]('send','event','Arrival','Syndication','product '+g.uriParams.product);
			}
		else if(document.location.pathname)	{	
			_app.u.dump('triggering handleHash');
			_app.router.handleURIChange(document.location.pathname, document.location.search, document.location.hash, 'replace');
			}
		else	{
			_app.router.handleURIChange("/", document.location.search, document.location.hash, 'replace');
			_app.u.throwMessage(_app.u.successMsgObject("We're sorry, the page you requested could not be found!"));
			window[_app.vars.analyticsPointer]('send', 'event','init','404 event',document.location.href);
			}
		if(g.uriParams && g.uriParams.meta)	{
			_app.require('cco', function(){
				_app.ext.cco.calls.cartSet.init({'want/refer':g.uriParams.meta,'cartID':_app.model.fetchCartID()},{},'passive');
				});
			}
		if(g.uriParams && g.uriParams.meta_src)	{
			_app.require('cco',function(){
				_app.ext.cco.calls.cartSet.init({'want/refer_src':g.uriParams.meta_src,'cartID':_app.model.fetchCartID()},{},'passive');
				});
			}
		}
	});




})(myApp);
