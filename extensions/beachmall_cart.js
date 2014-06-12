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
						_app.ext.beachmall_cart.u.handleCartToolTip($('#modalCart'));
					});
					
					//make sure minicart stays up to date. 
					_app.ext.beachmall_cart.vars.mcSetInterval = setInterval(function(){
						_app.ext.quickstart.u.handleMinicartUpdate({'datapointer':'cartDetail|'+_app.model.fetchCartID()});
					},4000);
				},
				onError : function() {
					_app.u.dump('START beachmall_cart.callbacks.startExtension.onError');
				}
			}
		}, //callbacks



////////////////////////////////////   ACTION    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

//actions are functions triggered by a user interaction, such as a click/tap.
//these are going the way of the do do, in favor of app events. new extensions should have few (if any) actions.
		a : {
		
				//reveals recommended accessories list, hides itself, shows "hide" accessories button
			showCartAcc : function($this) {
				$this.hide().css('opacity','0');
				$('.cartHideAccButton',$this.parent()).animate({'opacity':'1'}).show();
				$('.cartAccList',$this.parent()).animate({'height':'40px'});
			},
			
				//hides recommended accessories list, hides itself, show "reveal" accessories button
			hideCartAcc : function($this) {
				$this.hide().css('opacity','0');
				$('.cartShowAccButton',$this.parent()).animate({'opacity':'1'}).show();
				$('.cartAccList',$this.parent()).animate({'height':'0px'});
			},
		
		}, //Actions

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
			
			//Changes header in shipping section based on whether or not a zip code has been entered there
			displayorshippingtext : function($tag) {
				var thisCartDetail = _app.data['cartDetail|'+_app.model.fetchCartID()];
				if(_app.data.thisCartDetail && _app.data.thisCartDetail.ship && _app.data.thisCartDetail.ship.postal) {$tag.append('Shipping:');}
				else {$tag.append('Delivery:');}
			},
			
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
					$tag.attr('href','#!product/'+pid+'/')
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
							$('.cartShowAccButton',$tag.parent()).removeClass('displayNone'); //show button to reveal list
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
		
		}, //u [utilities]

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
					
				}
			} //e [app Events]
		} //r object.
	return r;
	}
