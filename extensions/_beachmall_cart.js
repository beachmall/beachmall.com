/* **************************************************************

   Copyright 2013 Zoovy, Inc.

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.

************************************************************** */





var beachmall_cart = function(_app) {
	var theseTemplates = new Array('');
	var r = {


	vars : {},
	
////////////////////////////////////   CALLBACKS    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\



	callbacks : {
//executed when extension is loaded. should include any validation that needs to occur.
		init : {
			onSuccess : function()	{
				var r = false; //return false if extension won't load for some reason (account config, dependencies, etc).

				//if there is any functionality required for this extension to load, put it here. such as a check for async google, the FB object, etc. return false if dependencies are not present. don't check for other extensions.
				r = true;

				return r;
				},
			onError : function()	{
//errors will get reported for this callback as part of the extensions loading.  This is here for extra error handling purposes.
//you may or may not need it.
				_app.u.dump('BEGIN beachmall_cart.callbacks.init.onError');
				}
			},
			
			startExtension : {
				onSuccess : function() {
					_app.templates.cartTemplate.on('complete.beachmall_cart',function(event,$ele,P) {
						//_app.ext.beachmall_cart.u.execCouponAdd($('.cartCouponButton','#modalCart'));
						
					});

				},
				onError : function() {
					_app.u.dump('START beachmall_cart.callbacks.startExtension.onError');
				}
			},
			
			showTransitTimes : {
				onSuccess : function(tagObj) {
					_app.u.dump("BEGIN beachmall_cart.callbacks.showTransitTimes");
					var $container = false; //transit info. will end up here
						//use cutoff from response, not product
						//but find $container by matching stid added to it in index w/ response stid
					$('.cartItemWrapper','.inLineCart').each(function(){ //look at each cartItemWrapper in cart
						tagObj.backorder = $(this).attr('data-backorder'); //add backorder attrib to tagObj for use in getTransitInfo later
						var geoSTID = $(this).attr('data-geostid'); //record its geostid value
							//check if this geostid value matches the response value, and set container if it does
						if (geoSTID.indexOf(_app.u.makeSafeHTMLId(tagObj.stid)) != -1) {
							$container = $(this);
							$('.cartPutLoadingHere',$container).removeClass('loadingBG'); //may want to remove this later on...
							return false; //there is only one, once it's found no need to continue
						}
					});
						//if $container is still false here, then the stid couldn't be matched for some reason
					if(!$container ) {
						_app.u.dump('This line item shipping info. could not be determined: '+tagObj);
					}
			
					var data = _app.data[tagObj.datapointer]; //shortcut.	
		
						//if ground on all set to 1, an item has no expedited shipping (and/or is backorder), make all methods ground
					if($('.cartTemplateShippingContainer').attr('groundonall') == 1) {
						index = _app.ext.beachmall_begin.u.getSlowestShipMethod(data['@Services']);
						var ground = true; //true will bypass additional shipping methods later
						_app.u.dump(" -> index: "+index);
					}
					else {
						var ground = false;
						var thisCartDetail = _app.data['cartDetail|'+_app.model.fetchCartID()];
						_app.u.dump(" -> $container.length: "+$container.length);
						if(!$.isEmptyObject(data['@Services'])) {
							_app.u.dump(" -> @Services is not empty");
							var index = _app.ext.beachmall_cart.u.getShipMethodByID(data['@Services'],thisCartDetail.want.shipping_id);
							_app.u.dump(thisCartDetail.want.shipping_id);
							_app.u.dump(index);
							if(!index) {
							//	index = _app.ext.beachmart.u.getFastestShipMethod(data['@Services']);
								index = _app.ext.beachmall_begin.u.getSlowestShipMethod(data['@Services']);
							}
							_app.u.dump(" -> index: "+index);
							
						}
					}
						//index could be false if no methods were available. or could be int starting w/ 0
					if(index >= 0) {
	/*prob w/ $container selector*/						$('.transitContainer',$container).empty().append(_app.ext.beachmall_cart.u.getTransitInfo(tagObj,data,index,ground)); //empty first so when reset by zip change, no duplicate info is displayed.
					}
					
					//$('.cartShippingInformation .loadingBG',$container).removeClass('loadingBG');
					$('.loadingText',$container).hide();
				},
				onError : function(responseData,uuid) {
	//					alert("got here");
	//error handling is a case where the response is delivered (unlike success where datapointers are used for recycling purposes)
					_app.u.handleErrors(responseData,uuid); //a default error handling function that will try to put error message in correct spot or into a globalMessaging element, if set. Failing that, goes to modal.
				}
				
				
			}, //showTransitTimes
		
		}, //callbacks



////////////////////////////////////   ACTION    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

//actions are functions triggered by a user interaction, such as a click/tap.
//these are going the way of the do do, in favor of app events. new extensions should have few (if any) actions.
		a : { 
		
// TODO : check this function over. seems to have some old calls, and id's that need updating for it to work. 
			//Data must already be in memory to execute this action.
			//added as a .click to the shipping method
			showShipGridInModal : function(datapointer, cart){
			_app.u.dump('----> showShipGridInModal datapointer'); _app.u.dump(datapointer);
				var $parent = $('#modalShipGrid').empty();
				
				//the modal opens as quick as possible so users know something is happening.
				//open if it's been opened before so old data is not displayed. placeholder content (including a loading graphic, if set) will be populated pretty quick.
				if($parent.length == 0)	{
					$parent = $("<div \/>").attr({"id":"modalShipGrid","title":"Estimated Shipping Times and Methods"}).appendTo('body');
					$parent.dialog({modal: true,width:400,height:200,autoOpen:false});  //browser doesn't like percentage for height
					}
				
				//empty the existing cart and add a loadingBG so that the user sees something is happening.
				$parent.dialog('open').addClass('loadingBG');
					
				if(datapointer && !$.isEmptyObject(_app.data[datapointer]))	{
					var $table = $("<table />").addClass('center');
					$table.append("<tr class='ztable_row_head'><td>Method</td><td>Est. Arrival</td></tr>");
					var services = _app.data[datapointer]['@Services']
					var L = services.length;
					_app.u.dump(" -> @Services.length: "+L);
//MARK TO DO: FIND OUT IF EACH PRODUCT'S SHIPPING METHODS CAN BE ATTAINED HERE TO BE SURE NO PRODUCT SPECIFIC UNAVAILABLE METHODS ARE SHOWN
					for(var i = 0; i < L; i += 1)	{
						if(cart) { //if this is in the cart, only show methods that match what is available in the cart shipping area
//							_app.u.dump('-->'); _app.u.dump($('.cartShipMethods').text()); _app.u.dump(services[i].method);
							var shipMethods = $('.cartShipMethods').text();
						dump(shipMethods); _app.u.dump(services[i].method);
							if(shipMethods.indexOf(services[i].method) != -1 && services[i].method != 'UPS Next Day Air') {
					//			$table.append(_app.renderFunctions.transmogrify({'id':'service_'+services[i].id},"shipGridTemplate",services[i]));
								$table.tlc({"dataset":services[i],"verb":"transmogrify",templateid:"shipGridTemplate"});
								//rd.$tag.tlc({'datapointer':rd.datapointer, verb:"transmogrify", templateid:"dropdownAnchorListTemplate"});
							}
						}
						else {
//							_app.u.dump(" S -> "+i+") id: "+services[i].id);
							//var methods = _app.data[datapointer]['@methods']; MARK: THIS MAY STILL WORK, WON'T KNOW TILL CART OPERATES...
							var methods = _app.data[datapointer]['@Services'][i].method;
							var methL = methods.length;
							//_app.u.dump(" S -> "+i+") id: "+services[i].method);
							//if(methods[i]) _app.u.dump(" M -> "+i+") id: "+methods);
							for(var j=0; j < methL; j +=1) {
								if(services[i].method == methods[j].method) {
									$table.append(_app.renderFunctions.transmogrify({'id':'service_'+services[i].id},"shipGridTemplate",services[i]));
								}
							}
					//------$table.append(_app.renderFunctions.transmogrify({'id':'method_'+methods[i].id},"shipGridTemplate",methods[i]));
						}
					}
					$parent.removeClass('loadingBG').append($table);

					}
				else	{
					_app.u.dump("WARNING! showShipGridInModal either had no datapointer passed ["+datapointer+"] or data.datapointer is empty");
					//uh oh. how'd this happen.
					$parent.removeClass('loadingBG').append(_app.u.formatMessage("Uh oh! It seems something went wrong. We apologize for the inconveniece but the data can not be retrieved right now."));
					}
//				_app.u.dump($content);
				}, //showShipGridInModal
			
		}, //Actions
		
		
////////////////////////////////////   TLCFORMATS    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

//renderFormats are what is used to actually output data.
//on a data-bind, format: is equal to a renderformat. extension: tells the rendering engine where to look for the renderFormat.
//that way, two render formats named the same (but in different extensions) don't overwrite each other.
		tlcFormats : {		

			//REPLACED W/ A TLC IN TEMPLATES, REMOVE ONCE TESTED. Changes header in shipping section based on whether or not a zip code has been entered there
	//		displayorshippingtext : function(data,thisTLC) {
	//			var thisCartDetail = _app.data['cartDetail|'+_app.model.fetchCartID()];
	//			if(_app.data.thisCartDetail && _app.data.thisCartDetail.ship && _app.data.thisCartDetail.ship.postal) {$tag.append('Shipping:');}
	//			else {$tag.append('Delivery:');}
	//		},
	//		safestid : function(data,thisTLC) {
	//			var pid = data.globals.binds.var;
	//			var $tag = data.globals.tags[data.globals.focusTag];
	//			if(data.value && data.value.stid) {
	//				$tag.attr('data-geoSTID',_app.u.makeSafeHTMLId(data.value.stid));
	//			}
	//		}
			
		},

////////////////////////////////////   RENDERFORMATS    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

//renderFormats are what is used to actually output data.
//on a data-bind, format: is equal to a renderformat. extension: tells the rendering engine where to look for the renderFormat.
//that way, two render formats named the same (but in different extensions) don't overwrite each other.
		renderFormats : {
		
			//needed to format money outside of standard call for some reason...
			beachmoney : function($tag,data)	{
	//			_app.u.dump('BEGIN view.formats.beachMoney');
				var amount = data.bindData.isElastic ? (data.value / 100) : data.value;
	//			_app.u.dump('amount:'); _app.u.dump(amount);
				if(amount)	{
					var r,o,sr;
					r = data.bindData.prepend ? data.bindData.prepend : "";
					r += _app.u.formatMoney(amount,data.bindData.currencysign,'',data.bindData.hidezero);
	//					_app.u.dump(' -> attempting to use var. value: '+data.value);
	//					_app.u.dump(' -> currencySign = "'+data.bindData.currencySign+'"');

					//if the value is greater than .99 AND has a decimal, put the 'change' into a span to allow for styling.
					if(r.indexOf('.') > 0)	{
	//					_app.u.dump(' -> r = '+r);
						sr = r.split('.');
						o = sr[0];
						if(sr[1])	{o += '<span class="cents">.'+sr[1]+'<\/span>'}
						$tag.html(o);
						}
					else	{
						$tag.html(r);
						}
					}
				else {$tag.addClass('displayNone');}
			}, //beachMoney

			//Puts message indicating expedited shipping isn't available in cart if applicable to any items there
			expshipmessage : function($tag, data) {
				var thisCartDetail = _app.data['cartDetail|'+_app.model.fetchCartID()]['@ITEMS'];
				var products = [];
				for(var index in thisCartDetail){
					if(thisCartDetail[index].product[0] != '%') {
						products.push(thisCartDetail[index].product);
					}
				}
				var numRequests = 0;
				for(var index in products){
					var _tag = {
						'callback':function(rd){
							if(_app.model.responseHasErrors(rd)){
								//If an item in your cart gets an error, you're gonna have a bad time...
								_app.u.throwMessage(rd);
								}
							else{
								if(_app.data[rd.datapointer]['%attribs']['user:prod_ship_expavail'] && _app.data[rd.datapointer]['%attribs']['user:prod_ship_expavail'] == 1){
									//do nothing, expedited shipping is available.
								}
								else {	//if the attrib isn't set, expedited shipping is not available
									$tag.text('Expedited shipping not available for this order');
										//if one item has no expedited shipping no items have it, hide time in transit
									$tag.parent().attr('groundonall',1);
							/*		$('.shipMessage','#cartTemplateForm').hide();
									$('.estimatedArrivalDate','#cartTemplateForm').hide();
									$('.deliveryLocation','#cartTemplateForm').hide();
									$('.deliveryMethod','#cartTemplateForm').hide();
							*/	}
					//			if(_app.data[rd.datapointer]['%attribs']['zoovy:base_price'] > 200){
					//				$tag.text('The rent is too damn high!');
					//				}
								}
							}
						};	
					numRequests += _app.ext.store_prodlist.calls.appProductGet.init({'pid':products[index]},_tag, 'immutable');
					//_app.u.dump('HERE'); _app.u.dump(numRequests);
					}
				if(numRequests > 0){_app.model.dispatchThis('immutable');}
			}, //expShipMessage
			
			//Puts shipping surcharge text (which will have a tool tip on it) in cart if applicable to any items there
			shipsurmessage : function($tag, data) {
				var thisCartDetailItems = _app.data['cartDetail|'+_app.model.fetchCartID()]['@ITEMS'];
				var thisCartDetailShip = _app.data['cartDetail|'+_app.model.fetchCartID()]['@SHIPMETHODS'];
				var products = [];
				for(var index in thisCartDetailItems) {
					if(thisCartDetailItems[index].product[0] != '%') {
						products.push(thisCartDetailItems[index].product);
					}
				}
				//_app.u.dump(products);
				var numRequests = 0;
				for(var index in products) {
					var _tag = {
						'callback':function(rd) {
							if(_app.model.responseHasErrors(rd)) {
								_app.u.throwMessage(rd);
							}
							else {
								if(_app.data[rd.datapointer]['%attribs']['user:prod_shipping'] && thisCartDetailShip && thisCartDetailShip[0] && thisCartDetailShip[0].amount) {
									$tag.text('Shipping Surcharge');
									setTimeout(function(){
										$('.orderShipMethod','#modalCartContents')
											.empty()
											.css('position','relative')
											.append("<a class='floatLeft clearfix tipifyCart' href='#'><span class='surcharge'>Surcharge</span> / Shipping: </a>")
											.append("<div class='toolTip2 displayNone'>"
													+	"If the calculated shipping cost is not zero, then shipping surcharge is applied for "
													+	"items and destinations applicable. More details of this charge is stated on the shipping tab of the product page"
												+	"</div>");
										},250);
									setTimeout(function(){$('.orderShipMethod','#modalCartContents').mouseenter(function(){	$('.toolTip2','#modalCartContents').show();}).mouseleave(function(){	$('.toolTip2','#modalCartContents').hide();});},250);
								}
							}
						}
					};
					numRequests += _app.ext.store_prodlist.calls.appProductGet.init({'pid':products[index]},_tag,'immutable');
				}
				if(numRequests > 0){_app.model.dispatchThis('immutable');}
			}, //shipSurMessage
			
				//adds product name on cart list item and puts a link on it by 
				//converting stid into pid and doing show content on it.
			cartprodname : function ($tag, data) {
					//get the product name and bind data if any show on the line item in the cart
				var o = '';
				if(data.value.prod_name) {
					if(jQuery.isEmptyObject(data.bindData))	{o = data.value.prod_name}
					else {o += data.value.prod_name;}
				}
				
				var stid = data.value.stid
		//		_app.u.dump('Who is this is?'); _app.u.dump(stid);
					//if it's an assembly or a promo kill the anchor and replace w/ an h4
				if((stid && stid[0] == '%') || data.value.asm_master)	{
					$tag.before('<h4>'+o+'</h4>');
					$tag.remove();
				}
				else { //isn't a promo or assembly, add a the link
					if (stid.indexOf('/') != -1 || (stid.indexOf('/') != -1 && stid.indexOf(':') !== -1)) {
						var pid = _app.u.makeSafeHTMLId(stid.split('/')[0]);
					}
					else if(stid.indexOf(':') != -1) {
						var pid = _app.u.makeSafeHTMLId(stid.split(':')[0]);
					}
					else {
						pid = _app.u.makeSafeHTMLId(stid);
					}
					$tag.text(o); 
					$tag.attr('href',_app.ext.store_routing.u.productAnchor(pid, o));
				}
			}, //showContentSTID
			
			//gets each cart item and displays a non-expedite message on it if user:prod_ship_expavail isn't set.
			//Possible that showshiplatency in beachmall_store ext will replace this altogether. 
			showshiplatencycart : function($tag, data) {
				var products = [];
				for(var index in data.value){
					if(data.value[index].product[0] != '%') {
						products.push(data.value[index].product);
					}
				}
				//_app.u.dump('---------->'); _app.u.dump(data.value);
				
				var numRequests = 0;
				for(var index in products){
					var _tag = {
						'callback':function(rd){
							if(_app.model.responseHasErrors(rd)){
								//If an item in your cart gets an error, you're gonna have a bad time...
								_app.u.throwMessage(rd);
								}
							else{
							//user:prod_shipping_msg'];
							//var us1ts = data.value['%attribs']['us1:ts'
									//if user:prod_ship_expavail is present and checked (set to 1) expedited shipping is available, show no message.
								if(_app.data[rd.datapointer]['%attribs']['user:prod_ship_expavail'] && _app.data[rd.datapointer]['%attribs']['user:prod_ship_expavail'] == 1){}
								else {	//the attribute is zero or not set, but either way no expedited shipping is available, show the message
									$tag.text('Expedited shipping not available');
								}
					//			if(_app.data[rd.datapointer]['%attribs']['zoovy:base_price'] > 200){
					//				$tag.text('The rent is too damn high!');
					//				}
								}
							}
						};	
					numRequests += _app.ext.store_prodlist.calls.appProductGet.init({'pid':products[index]},_tag, 'immutable');
					}
				if(numRequests > 0){_app.model.dispatchThis('immutable');}
			},
			
				//hide the update button on assembly products, put "(included)" text in it's place
			hideifasm : function($tag, data) {
				if((data.value.stid && data.value.stid[0] == '%') || data.value.asm_master)	{
					$tag.hide()
					if($tag.attr('data-included') == 1) {
						$tag.after('(included)');
					}
				}
			},
			
				//gets list of accessories from product (if present) and makes a list of them
			accessoryproductlist : function($tag, data) {
				if(data.value.stid && data.value.stid[0] == '%' || data.value.asm_master) {
					return; //promos and assembly items don't get accessories list
				}
				else {
					var pid = _app.ext.beachmall_cart.u.pidFromStid(data.value.stid);
					var stid = _app.u.makeSafeHTMLId(data.value.stid);
					setTimeout(function(){ //time out because appProductGet was coming back undefined
						var prod = _app.data['appProductGet|'+pid];
						if(prod && prod['%attribs'] && prod['%attribs']['zoovy:accessory_products']) {
							$('[data-acc="show"]',$tag.parent()).removeClass('displayNone'); //show button to reveal list
							$('.cartItemWrapper[data-geostid='+stid+']').css('height','200px'); //make line item taller to fit list & button
							data.bindData.csv = prod['%attribs']['zoovy:accessory_products']; //add list to bindData
							data.bindData.loadsTemplate = $tag.attr('data-loadsTemplate');
							data.bindData.withInventory = $tag.attr('data-withInventory');
							data.bindData.withVariations = $tag.attr('data-withVariations');
							data.bindData.hide_pagination = $tag.attr('data-hide_pagination');
							_app.ext.store_prodlist.u.buildProductList(data.bindData,$tag); //make list
						}
					},1000);
				}
			}, //accessoryProductList
			
				//checks for % at beginning of sku to see if item is a promo, sets css to red if so. 
			redmoney : function($tag, data) {
				if(data.value && data.value[0] == '%') {
					$tag.css('color','#e0463a');
				} else {}
			}

		}, //renderFormats
////////////////////////////////////   UTIL [u]   \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

//utilities are typically functions that are exected by an event or action.
//any functions that are recycled should be here.
		u : {
			
			//shows tool tip in cart	
			handleCartToolTip : function($context) {
				$('.tipifyCart', $context).each(function(){
					var $this = $(this);
					$this.parent().css('position','relative'); //this is what makes the tooltip appear next to the link instead of off in space.
					$this.mouseover(function(){	$('.toolTip',$this.parent()).show();}).mouseout(function(){	$('.toolTip',$this.parent()).hide();});
				});
			},
/**MARK THIS DOESN'T WORK RIGHT */			
			updateCartSummary : function()	{
				$('#modalCartContents').replaceWith(_app.renderFunctions.createTemplateInstance('cartTemplate','modalCartContents'));
				_app.calls.refreshCart.init({'callback':'translateTemplate','parentID':'modalCartContents'},'immutable');
				_app.ext.beachmall_cart.u.handleCartToolTip($('#modalCart'));
				//don't set this up with a getShipping because we don't always need it.  Add it to parent functions when needed.
			},
			
			//separates pid out of stid for use in cart
			pidFromStid : function(stid) {
				if (stid.indexOf('/') != -1 || (stid.indexOf('/') != -1 && stid.indexOf(':') != -1)) {
					var pid = _app.u.makeSafeHTMLId(stid.split('/')[0]);
				}
				else if(stid.indexOf(':') != -1) {
					var pid = stid.split(':')[0];
					pid = _app.u.makeSafeHTMLId(pid[0]);
				}
				else {
					pid = _app.u.makeSafeHTMLId(stid);
				}
				return pid;
			},
			
			initEstArrival : function(infoObj, stid){
				_app.u.dump("BEGIN beachmall_cart.u.initEstArrival");
				var pid = infoObj.pid;
				var zip;
				var thisCartDetail = _app.data['cartDetail|'+_app.model.fetchCartID()];
				if(thisCartDetail && thisCartDetail.ship && thisCartDetail.ship.postal) {
					dump('----in if zip');
					zip = thisCartDetail.ship.postal;
				}
//				dump('----Why no zip'); dump(thisCartDetail); dump(thisCartDetail.ship); dump(thisCartDetail.ship.postal); dump(zip);

				//if there is a zip, getShipQuotes, otherwise tell user to enter their zip
				if(zip) {	
					_app.u.dump(" -> zip code is cart ["+zip+"]. Use it");
					_app.ext.beachmall_cart.u.getShipQuotes(zip, pid, stid); //function also gets city/state from googleapi
				}
				else {
					_app.u.dump(" -> no zip code entered. Info will be added when zip is entered.");
					$('.cartPutLoadingHere.loadingBG', '.cartItemWrapper[data-geoSTID='+stid+']').removeClass('loadingBG').append('Enter your zip-code in the field at the bottom of the cart to see shipping estimates.');
				//	_app.u.dump(" -> no zip code entered. request via whereAmI");

				//	_app.calls.whereAmI.init({'callback':'handleWhereAmI','extension':'beachmart'},'passive');
				//	_app.model.dispatchThis('mutable');
				}

			},
			
			getShipQuotes : function(zip, pid, stid)	{
				_app.u.dump("BEGin beachmall_cart.u.getShipQuotes"); dump(stid);
			//	var $context = $(_app.u.jqSelector('#','cartStuffList_'+stid));
				var $context = $(_app.u.jqSelector('.productListTemplateCart[data-stid="'+stid+'"]'));
				
				var _tag = {
					"stid" : stid,
					"$context" : $context,
					"callback" : function(rd) {
						if(_app.model.responseHasErrors(rd)){
							//If an item in your cart gets an error, you're gonna have a bad time...
							_app.u.throwMessage(rd);
						}
						
						else {
							var prod = _app.data[rd.datapointer];
							var $thisContext = rd.$context;
							//here, inventory check is done instead of isProductPurchaseable, because is used specifically to determine whether or not to show shipping.
							// the purchaseable function takes into account considerations which have no relevance here (is parent, price, etc).
			//				_app.u.dump(_app.data['appProductGet|'+pid]);
							if(_app.ext.store_product.u.getProductInventory(prod) <= 0){ dump('---if 0 inventory');
								//no inventory. Item not purchaseable. Don't get shipping info
								$('.cartShippingInformation .cartPutLoadingHere',$thisContext).removeClass('loadingBG').hide();
								$('.timeInTransitMessaging',$thisContext).append("Inventory not available.");
								}
							else if(_app.data['appProductGet|'+pid] && _app.data['appProductGet|'+pid]['%attribs']['is:preorder'])	{ dump('---else if (preorder)');
								_app.ext.beachmall_cart.u.handlePreorderShipDate($thisContext,pid);
								}
							else if(zip) { dump('----- else if (zip)');
								var thisCartDetail = _app.data['cartDetail|'+_app.model.fetchCartID()];
								dump(" -> zip: "+zip); dump(thisCartDetail.ship.city); dump(thisCartDetail.ship.region);

								var prodArray = new Array();
								prodArray.push(pid);
								_app.ext.beachmall_begin.calls.time.init({},'passive');
								_app.ext.beachmall_begin.calls.appShippingTransitEstimate.init({"@products":prodArray,"ship_postal":zip,"ship_country":"US"},{'callback':'showTransitTimes','extension':'beachmall_cart','stid':stid,'pid':pid},'passive');
								//	thisCartDetail['data.ship_zip'] = _app.data[tagObj.datapointer].zip; //need this local for getShipQuotes's callback.
								_app.model.dispatchThis('passive'); //potentially a slow request that should interfere with the rest of the load.
								//go get the shipping rates.
							}
							else { _app.u.dump("WARNING! no zip passed into getShipQuotes"); }
						}
					}
				};
				_app.ext.store_product.calls.appProductGet.init(stid,_tag, 'immutable');
				_app.model.dispatchThis('immutable');

			}, //getShipQuotes
			
			//shows the date a preorder item will ship on in the cart.
			handlePreorderShipDate : function($context,pid){
				_app.u.dump("BEGIN beachmart.u.handlePreorderShipDate");
				_app.u.dump("SANITY! this item is a preorder.");
				var message;
				var product = _app.data['appProductGet|'+pid];
				dump(product);
				//if no date is set in salesrank, don't show any shipping info.
				if(product['%attribs']['zoovy:prod_salesrank'])
					message = "Will ship on "+_app.ext.beachmall_dates.u.yyyymmdd2Pretty(product['%attribs']['zoovy:prod_salesrank'])

				$('.cartPutLoadingHere',$context).removeClass('loadingBG');
				//$('.loadingText',$container).hide();
				$('.transitContainer',$context).text(message);
			},
			
			//pass in the @services object in a appShippingTransitEstimate and the index in that object of the fastest shipping method will be returned.
			getShipMethodByID : function(servicesObj,ID,useProdPage)	{
				var r = false; //what is returned. will be index of data object
				var thisCartDetail = _app.data['cartDetail|'+_app.model.fetchCartID()];
				dump('-----SHIPMETHODS:'); dump(thisCartDetail["@SHIPMETHODS"]);
				if(thisCartDetail && thisCartDetail["@SHIPMETHODS"]){
				//if(_app.data.cartShippingMethods && _app.data.cartShippingMethods["@methods"]){
					var method = false;
					for(var i=0; i < thisCartDetail["@SHIPMETHODS"].length; i++){
						if(thisCartDetail["@SHIPMETHODS"][i].id.split(':')[1] == ID){
							method = thisCartDetail["@SHIPMETHODS"][i].method;
							break;
							}
						}
					if(method){
						if(typeof servicesObj == 'object')	{
							var L = servicesObj.length;
							for(var i = 0; i < L; i += 1)	{
								if(servicesObj[i].method == method)	{
									r = i;
									break; //no need to continue in loop.
									}
								}
							}
						else	{
							_app.u.dump("WARNING! servicesObj passed into getFastestShipMethod is empty or not an object. servicesObj:");
							_app.u.dump(servicesObj);
							}
						}
					else { _app.u.dump("WARNING! no shipping method of that ID was found."); }
					}
				else { _app.u.dump("WARNING! attempting to getShipMethodByID but cartShippingMethods or cartShippingMethods.@methods not available"); }
				
//				_app.u.dump(" -> fastest index: "+r);
				return r;
				}, //getShipMethodByID
				
				getTransitInfo : function(tagObj,data,index,ground)	{
					_app.u.dump("BEGIN beachmall_cart.u.getTransitInfo"); dump(tagObj); dump(data);
					
					var pid = tagObj.pid;
					var prodAttribs = _app.data['appProductGet|'+pid]['%attribs'];
					var thisCartDetail = _app.data['cartDetail|'+_app.model.fetchCartID()];

	//				dump('getTransitInfo cartDetail'); dump(thisCartDetail.ship.city); dump(thisCartDetail.ship.region); dump(thisCartDetail.postal);
					var $r = $("<div class='shipSummaryContainer' \/>"); //what is returned. jquery object of shipping info.
					if(thisCartDetail && thisCartDetail.ship && (thisCartDetail.ship.city || thisCartDetail.ship.region || thisCartDetail.postal)) {
						var tempCity = thisCartDetail.ship.city ? thisCartDetail.ship.city : "";
						var tempRegion = thisCartDetail.ship.region ? thisCartDetail.ship.region : "";
						var tempPostal = thisCartDetail.ship.postal ? thisCartDetail.ship.postal : "";
						$r.append("<span class='shipMessage'></span></span><span class='estimatedArrivalDate'></span><span class='shipCity'> "+tempCity+"</span><span class='shipRegion'> "+tempRegion+"</span><span class='shipPostal'> "+tempPostal+" </span><span class='deliveryMethod'></span>");
					}
					else {
						$r.append("<span class='shipMessage'></span></span><span class='estimatedArrivalDate'></span><span class='shipCity'></span><span class='shipRegion'></span><span class='shipPostal'></span><span class='deliveryMethod'></span>");
					}
					var hour = Number(data.cutoff_hhmm.substring(0,2)) + 3; //add 3 to convert to EST.
					var minutes = data.cutoff_hhmm.substring(2);

					if(prodAttribs['user:prod_shipping_msg'] == "Ships Today by 12 Noon EST"){
						if(_app.data.time && _app.data.time.unix)	{
							var date = new Date(_app.data.time.unix*1000);
							var hours = date.getHours();
							}
						$('.shipMessage',$r).append("Order "+(hours < 9 ? 'today' : 'tomorrow')+" before "+hour+":"+minutes+"EST for arrival on ");
						}
					else	{
						$('.shipMessage',$r).append("Order today for arrival on ");
						}

					if(prodAttribs['user:prod_ship_expavail'] && prodAttribs['user:prod_ship_expavail'] == 1 && !ground)	{
						var shipMeth = $('input[type="radio"]:checked','.cartShipMethods').parent().text().split(":");
						shipMeth = shipMeth[0];
						//$('.deliveryMethod',$r).append(data['@Services'][index]['method'])
						$('.deliveryMethod',$r).append("by " + shipMeth);
						$('.deliveryMethod',$r).append("<span class='zlink'> (Need it faster?)</span>").addClass('pointer').click(function(){
							_app.ext.beachmall_cart.a.showShipGridInModal('appShippingTransitEstimate','appShippingTransitEstimate', 'cart');
							});
							
						var $shipMethodsUL = $('.cartShipMethods', '.inLineCart');
						if(_app.data.appShippingTransitEstimate && _app.data.appShippingTransitEstimate['@Services'] && !$shipMethodsUL.data('transitized')) {
							//_app.u.dump('@services: ----------------->'); _app.u.dump(_app.data.appShippingTransitEstimate['@Services']);
							_app.ext.beachmall_cart.u.addDatesToRadioButtons(_app.data.appShippingTransitEstimate['@Services'], $shipMethodsUL);
							}
					}
					else	{
							//if one item has expedited shipping is not available, no other methods show up (will ship ground)
						_app.u.dump(" -> prodAttribs['user:prod_ship_expavail']: "+prodAttribs['user:prod_ship_expavail']);
						$('.deliveryMethod',$r).append("by UPS Ground");
							
						if(prodAttribs['user:prod_ship_expavail'] && prodAttribs['user:prod_ship_expavail'] == 1) {
							//only put "not available" message on items that don't have expavail set to 1
						}
						else { 
							$r.append("<div class='expShipMessage'></div>");
							$('.expShipMessage',$r).append("<span class='zhint inconspicuouseZhint'>Expedited shipping not available for this item</span>");
							$('#cartTemplateForm').addClass('cartHasNoExpedite');
						}
					}

					if(tagObj.backorder) {
						var futureShipDate = _app.ext.beachmart_dates.u.getFutureDate(tagObj.backorder, data['@Services'][index]['arrival_yyyymmdd'].slice(0,8));
						$('.estimatedArrivalDate',$r).append(_app.ext.beachmall_dates.u.yyyymmddNoSeconds2Pretty(futureShipDate)+" to");
					} else {
						$('.estimatedArrivalDate',$r).append(_app.ext.beachmall_dates.u.yyyymmddNoSeconds2Pretty(data['@Services'][index]['arrival_yyyymmdd'])+" to");
					}
					//_app.ext.beachmart.u.fetchLocationInfoByZip(thisCartDetail.ship.postal);

					return $r;
				}, //getTransitInfo
				
				//add estimated shipping arrival dates to ship method radio buttons
				//perform check for services data in calling function 
				addDatesToRadioButtons : function(services, $shipMethodsUL) {
					//_app.u.dump('addDatesToRadioButtons services: ---------------->'); _app.u.dump(services);
					var L = services.length;
					$('li', $shipMethodsUL).each(function() {
						var shipMeth = $(this).text().split(":");
						for (i=L-1; i>-1; i--) { //go backwards since services are listed w/ fastest first and radio buttons slowest first
							if(shipMeth[0] == services[i].method) { //if there is a match, append the date to the li
								var $container = $('<span class="radioShipTime">(arrival on '+_app.ext.beachmall_dates.u.yyyymmddNoSeconds2Pretty(services[i]["arrival_yyyymmdd"])+')</span>');
								$(this).append($container);
								$('.cartTemplateShippingContainer').css('width','54%'); //make the shipping section wider to keep it all on one line
								$shipMethodsUL.data('transitized',true); //set data so this doesn't have to get called multiple times
								break; //once a match is found, no need to keep going
							}
						}
					});
				} //addDatesToRadioButtons
		
		}, //u [utilities]

		
//////////////////////////////////////  EVENTS  \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\		
		
//app-events are added to an element through data-app-event="extensionName|functionName"
//right now, these are not fully supported, but they will be going forward. 
//they're used heavily in the admin.html file.
//while no naming convention is stricly forced, 
//when adding an event, be sure to do off('click.appEventName') and then on('click.appEventName') to ensure the same event is not double-added if app events were to get run again over the same template.
		e : {
			execCouponAdd : function($btn, p){
				p.preventDefault();
				var $fieldset = $btn.closest('fieldset'),
				$form = $btn.closest('form'),
				$input = $("[name='coupon']",$fieldset);
				
				var $cart = $btn.closest('[data-template-role=cart]');
				var cartid = $cart.data('cartid');
				//$btn.button('disable');
				//update the panel only on a successful add. That way, error messaging is persistent. success messaging gets nuked, but coupon will show in cart so that's okay.
				_app.ext.cco.calls.cartCouponAdd.init($input.val(), cartid,{"callback":function(rd){

					if(_app.model.responseHasErrors(rd)){
						$fieldset.anymessage({'message':rd});
					}
					else	{
						$input.val(''); //reset input only on success.  allows for a typo to be corrected.
						$fieldset.anymessage(_app.u.successMsgObject('Your coupon has been added.'));
						//_app.ext.orderCreate.u.handlePanel($form,'chkoutCartItemsList',['empty','translate','handleDisplayLogic','handleAppEvents']);
//							_gaq.push(['_trackEvent','Checkout','User Event','Cart updated - coupon added']);
						window[_app.vars.analyticsPointer]('send', 'event','Checkout','User Event','Cart updated - coupon added');
					}

				}}, 'immutable');
				//_app.ext.orderCreate.u.handleCommonPanels($form);
				$cart.trigger('fetch', {'Q':'immutable'});
				_app.model.dispatchThis('immutable');
				},
				
				//animates scroll from top e-mail cart button to lower e-mail cart form, and opens form. 
				scrolltoemailcart : function($ele,p) {
					p.preventDefault();
					var $context = $ele.closest(".checkoutButtonsContainer");
					var $emailCart = $(".cartBar",$context);
					var offset = $emailCart.offset().top + $(window).height()/2;
					$('html,body').animate({scrollTop: offset}, 1000);
					setTimeout(function(){$("[data-mail-cart='show']",".inLineCart").trigger('click');},500);
					return false;
				},
				
				//animates cart e-mail form into view, shows close button in form
				showcartemail : function($ele,p) {
					p.preventDefault();
					var $parent = $ele.closest('[data-mail-cart="parent"]');
					$parent.animate({'height':'180px','width':'220px'},500).addClass('noHover');
					$ele.css({'cursor':'auto'});
					$('[data-mail-cart="hide"]',$parent).css('display','inline');
					return false;
				}, //showcartemail
				
				//animates cart e-mail form out of view, hides close button in form
				hidecartemail : function($ele,p) {
					p.preventDefault();
					var $parent = $ele.closest('[data-mail-cart="parent"]');
					$parent.animate({'height':'27px','width':'110px'},500);
					setTimeout(function() {
						$parent.removeClass('noHover');
						$ele.css('display','none');
						$('[data-mail-cart="show"]',$parent).css({'cursor':'pointer'});
					},550);
					return false;
				}, //hidecartemail
				
				//processes cart e-mail form and calls appMashUpRedis for it
				emailcart : function($ele,p) {
					p.preventDefault();
					var $form = $ele.closest("form");
//					dump('-----start email cart...');
					var uName = $('input[type="text"]',$form).val();
					var eAddress = $('input[type="email"]',$form).val();
					var newsletter = $('input[type="checkbox"]',$form).is(':checked');
					var params = {
						'_cartid' 	: _app.model.fetchCartID(),
						'platform' 	: 'appMashUpRedis-EMAILCART.json',
						'%vars' 	: {
									  'email':eAddress,
									  'fullname':uName
						},
						'_cmd'		: 'appMashUpRedis',
						'_tag'		: {
							'callback':function(rd){
								if(_app.model.responseHasErrors(rd)) {
									$form.anymessage({'message':rd});
								}
								else {
									$form.anymessage(_app.u.successMsgObject('Your message has been sent.'));
									setTimeout(function(){_app.ext.beachmall_cartemail.a.hideCartEmail($('span',$form),$form);},10000);
	//								_gaq.push(['_trackEvent','Cart','User Event','Cart e-mailed']);
									window[_app.vars.analyticsPointer]('send', 'event','Checkout','User Event','Cart e-mailed');
								}
							}
						}
					};
					_app.model.addDispatchToQ(params,'immutable');
					_app.model.dispatchThis('immutable');
					return false;
				}, //emailcart
				
				//reveals recommended accessories list, hides itself, shows "hide" accessories button
				showcartacc : function($ele,p) {
					p.preventDefault();
					$ele.hide().css('opacity','0');
					$('[data-acc="hide"]',$ele.parent()).animate({'opacity':'1'}).show();
					$('[data-acc="list"]',$ele.parent()).animate({'height':'40px'});
					return false;
				},
				
				//hides recommended accessories list, hides itself, show "reveal" accessories button
				hidecartacc : function($ele,p) {
					p.preventDefault();
					$ele.hide().css('opacity','0');
					$('[data-acc="show"]',$ele.parent()).animate({'opacity':'1'}).show();
					$('[data-acc="list"]',$ele.parent()).animate({'height':'0px'});
					return false;
				},
				
			} //e [app Events]
		} //r object.
	return r;
	}
