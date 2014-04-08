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
						_app.ext.beachmall_cart.u.execCouponAdd($('.cartCouponButton','#modalCart'));
						_app.ext.beachmall_cart.u.handleCartToolTip($('#modalCart'));
					});
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
		
			}, //Actions

////////////////////////////////////   RENDERFORMATS    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

//renderFormats are what is used to actually output data.
//on a data-bind, format: is equal to a renderformat. extension: tells the rendering engine where to look for the renderFormat.
//that way, two render formats named the same (but in different extensions) don't overwrite each other.
		renderFormats : {
		
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
				var thisCartDetail = _app.data['cartDetail|'+_app.model.fetchCartID()]
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
			} //shipSurMessage

		}, //renderFormats
////////////////////////////////////   UTIL [u]   \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

//utilities are typically functions that are exected by an event or action.
//any functions that are recycled should be here.
		u : {
		
			execCouponAdd : function($btn)	{
				_app.u.dump($btn.text());
				//$btn.button();
				$btn.off('click._app.ext.beachmall_cart.a.execCouponAdd').on('click._app.ext.beachmall_cart.a.execCouponAdd',function(event){
					event.preventDefault();
					
					var $fieldset = $btn.closest('fieldset'),
					$form = $btn.closest('form'),
					$input = $("[name='coupon']",$fieldset);
					
					//$btn.button('disable');
					//update the panel only on a successful add. That way, error messaging is persistent. success messaging gets nuked, but coupon will show in cart so that's okay.
					_app.ext.cco.calls.cartCouponAdd.init($input.val(),{"callback":function(rd){

						if(_app.model.responseHasErrors(rd)){
							$fieldset.anymessage({'message':rd});
						}
						else	{
							$input.val(''); //reset input only on success.  allows for a typo to be corrected.
							$fieldset.anymessage(_app.u.successMsgObject('Your coupon has been added.'));
							//_app.ext.orderCreate.u.handlePanel($form,'chkoutCartItemsList',['empty','translate','handleDisplayLogic','handleAppEvents']);
//							_gaq.push(['_trackEvent','Checkout','User Event','Cart updated - coupon added']);
						}

					}});
					//_app.ext.orderCreate.u.handleCommonPanels($form);
					_app.ext.beachmall_cart.u.updateCartSummary();
					_app.model.dispatchThis('immutable');
				})
			}, //execCouponAdd
			
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
			}
		
		}, //u [utilities]

//app-events are added to an element through data-app-event="extensionName|functionName"
//right now, these are not fully supported, but they will be going forward. 
//they're used heavily in the admin.html file.
//while no naming convention is stricly forced, 
//when adding an event, be sure to do off('click.appEventName') and then on('click.appEventName') to ensure the same event is not double-added if app events were to get run again over the same template.
		e : {
			} //e [app Events]
		} //r object.
	return r;
	}
