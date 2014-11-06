/* **************************************************************

   Copyright 2011 Zoovy, Inc.

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




var beachmart = function(_app) {
	var r = {
		vars : { 
			"templates" : ["productListTemplateBundle","shipGridTemplate","productListTemplateThumb","categoryTemplateBrandsBestSellers","categoryTemplateBrandsViewAll","categoryTemplateBrandsFeatured"]},
		callbacks : {
//run when controller loads this extension.  Should contain any validation that needs to be done. return false if validation fails.
			init : {
				onSuccess : function()	{
					var r = true; //return false if extension won't load for some reason (account config, dependencies, etc).


					return r;
					},
				onError : function()	{
//errors will get reported for this callback as part of the extensions loading.  This is here for extra error handling purposes.
//you may or may not need it.
					_app.u.dump('BEGIN _app.ext.beachmart.callbacks.init.onError');
					}
				},
//this is the callback defined to run after extension loads.
			startMyProgram : {
				onSuccess : function()	{
//					_app.u.dump("BEGIN beachmart.callbacks.startMyProgram"); // will write to console, if console is enabled.

					// load the google map api lib
		//			var script = document.createElement("script");
		//			script.type = "text/javascript";
		//			script.src = ((document.location.protocol == 'https:') ? 'https:' : 'http:') + "//maps.googleapis.com/maps/api/js?key=AIzaSyAW4uPPdoxArUsCy2SvCchNQmhX328T2oY&sensor=false&callback=myApp.ext.beachmart.u.instantiateGeoCoder";
		//			document.body.appendChild(script);
					
					_app.ext.beachmart.calls.whereAmI.init({'callback':'handleWhereAmI','extension':'beachmart'},'passive');
					
					// get the estimate arrival code running. works passively.
					_app.templates.productTemplate.on('complete.beachmall_store',function(event,$ele,P) {
						_app.ext.beachmart.u.initEstArrival(P);
					});
/*
					if(_app.u.isSet(SKU))	{
						var parentID = 'productContainer';
						
						$.extend(handlePogs.prototype,_app.ext.beachmart.variations); //extends variations object to include custom formats
						
						$('#mainContentArea').append(_app.renderFunctions.createTemplateInstance('productTemplate',parentID));
	
						_app.ext.store_product.calls._appProductGet.init(SKU,{'callback':'translateAndGetCrossSell','parentID':parentID,'extension':'beachmart'});
						_app.calls.refreshCart.init({'callback':'checkForOrGetShipZip','extension':'beachmart'}); //callback starts chain reaction for displaying est. arrival date.
						_app.model.dispatchThis();
	
						showContent = _app.ext.beachmart.a.showContent;
						if(typeof myAppIsLoaded == 'function')	{
							myAppIsLoaded();
							}

						}
					else	{
						//probably not a product page. do nothing for now.
						}
*/						
					}
				},
			
//this is the callback on a 'refreshCart' request that takes place during init.
//so by the time this executes, we have the cart object in memory.
			checkForOrGetShipZip : {
				
				onSuccess : function(tagObj){

//_app.ext.beachmart.u.initEstArrival();

					},
				onError : function(responseData,uuid)	{
//error handling is a case where the response is delivered (unlike success where datapointers are used for recycling purposes)
					_app.u.handleErrors(responseData,uuid); //a default error handling function that will try to put error message in correct spot or into a globalMessaging element, if set. Failing that, goes to modal.
					}
				
				
				}, //checkForOrGetShipZip




			showTransitTimes : {
				
				onSuccess : function(tagObj){
					_app.u.dump("BEGIN beachmart.callbacks.showTransitTimes");
					_app.u.dump(tagObj);
					//use cutoff from response, not product.
					var $container = $('#productTemplate_'+_app.u.makeSafeHTMLId(SKU));
//					_app.u.dump(" -> $container.length: "+$container.length);
//					dump(_app.data[tagObj.datapointer]);
					var data = _app.data[tagObj.datapointer]; //shortcut.
					if(!$.isEmptyObject(data['@Services']))	{
						_app.u.dump(" -> @Services is not empty");
						var index = _app.ext.beachmart.u.getShipMethodByID(data['@Services'],'UGND');
						if(!index) {
							index = _app.ext.beachmart.u.getFastestShipMethod(data['@Services']);
						}
//						_app.u.dump(" -> index: "+index);
//index could be false if no methods were available. or could be int starting w/ 0
						if(index >= 0)	{
							$('.transitContainer',$container).empty().append(_app.ext.beachmart.u.getTransitInfo(SKU,data,index)); //empty first so when reset by zip change, no duplicate info is displayed.
							}
						
						}
					else {
						var $tryAgain = $("<span class='pointer'>Transit times could not be retrieved at the moment (Try again)</span>");
						$('.transitContainer',$container).empty().append($tryAgain).click(function(){_app.ext.beachmart.a.showZipDialog()}); }
					$('.shippingInformation .loadingBG',$container).removeClass('loadingBG');
					$('.loadingText',$container).hide();	
					},
				onError : function(responseData,uuid)	{
					var $container = $('#productTemplate_'+_app.u.makeSafeHTMLId(SKU));
//					alert("got here");
//error handling is a case where the response is delivered (unlike success where datapointers are used for recycling purposes)
					//_app.u.handleErrors(responseData,uuid); //a default error handling function that will try to put error message in correct spot or into a globalMessaging element, if set. Failing that, goes to modal.
					$('.transitContainer',$container).empty().anymessage(_app.u.youErrObject(""+responseData,uuid));
					}
				
				
				}, //showTransitTimes


//if whereAmI was executed, it means zip was not populated in the cart.
//update the cart shippng fields appropriately.
			handleWhereAmI : {
				
				onSuccess : function(tagObj,attempts){
					attempts = Number(attempts) || 0;
					dump('handleWhereAmI started. #of attempts till cartDetail.ship:'); dump(attempts); 
					dump('----handleWhereAmI'); dump(_app.data[tagObj.datapointer]);
					var cartID = _app.model.fetchCartID();
					var thisCartDetail = _app.data["cartDetail|"+cartID];
					//possible to get here before cartDetail.ship is set, rerun until set if so
					if(thisCartDetail.ship) {
						var data = _app.data[tagObj.datapointer]; 
						//_app.u.dump('----handleWhereAmI:'); _app.u.dump(data);
						
						if(data.zip) {
							//all the data is there, send it in one shot
							if(data.city && data.region && data.zip) {
								//update local cart
								thisCartDetail.ship.city = data.city;
								thisCartDetail.ship.region = data.region;
								thisCartDetail.ship.postal = data.zip;
								//update display classes
								$('.shipCity').text(data.city || "");
								$('.shipRegion').text(data.region || "");
								$('.shipPostal').text(data.zip || "");
								_app.ext.cco.calls.cartSet.init({"ship/city":data.city,"ship/region":data.region,"ship/postal":data.zip,"_cartid":cartID},{},'passive'); 
								_app.model.dispatchThis('passive');
							}
							//only partial data (for what reason?) send it if it's there
							else {
								if(data.city)	{
									thisCartDetail.ship.city = data.city;
									$('.shipCity').text(data.city || "");
									_app.ext.cco.calls.cartSet.init({"ship/city":data.city,"_cartid":cartID},{},'passive');
									}
								if(data.region)	{
									$('.shipRegion').text(data.state || "");
									thisCartDetail.ship.region = data.region;
									_app.ext.cco.calls.cartSet.init({"ship/region":data.region,"_cartid":cartID},{},'passive');
									}
								if(data.zip) {
									$('.shipPostal').text(data.zip || "");
									thisCartDetail.ship.postal = data.zip;
									_app.ext.cco.calls.cartSet.init({"ship/zip":data.zip,"_cartid":cartID},{},'passive');
								}
								if(data.city || data.region || data.zip)	{
									_app.model.dispatchThis('passive');
									}
							}
						}
						//whereAmI didn't return a zip, set cart and make that obvious to user...
						else {
							thisCartDetail.ship.city = "";
							thisCartDetail.ship.region = "";
							thisCartDetail.ship.postal = "";
							//update display classes
							$('.shipCity').text("Location unavailable");
							$('.shipRegion').text("");
							$('.shipPostal').text("");
							_app.ext.cco.calls.cartSet.init({"ship/city":data.city,"ship/region":data.region,"ship/postal":data.zip,"_cartid":cartID},{},'passive'); 
							_app.model.dispatchThis('passive');
							$('#globalMessaging').anymessage({'message':'Postal location could not be determined, you may try again at the top left of the screen'});
						}
							
						//if it's a product page, update the time in transit there. 
						if(_app.ext.quickstart.vars.hotw && _app.ext.quickstart.vars.hotw[0] && _app.ext.quickstart.vars.hotw[0].pageType == 'product' && data.zip)	{				
							var $container = $(_app.u.jqSelector('#',_app.ext.quickstart.vars.hotw[0].parentID));
							$('.timeInTransitMessaging').empty(); //intentionally has no context. once a zip is entered, remove this anywhere it was displayed.
							$('.putLoadingHere',$container).addClass('loadingBG').show();
							$('.loadingText',$container).show();
							$('.shipMessage, .estimatedArrivalDate, .deliveryLocation, .deliveryMethod',$container).empty()				
							_app.ext.beachmart.u.getShipQuotes(data.zip);
						}
						else if (_app.ext.quickstart.vars.hotw && _app.ext.quickstart.vars.hotw[0] && _app.ext.quickstart.vars.hotw[0].pageType == 'product' && !data.zip) {
							var $tryAgain = $("<span class='pointer'>Transit times could not be retrieved at the moment (Try again)</span>");
							$('.transitContainer',$container).empty().append($tryAgain).click(function(){_app.ext.beachmart.a.showZipDialog()});
							$('.shippingInformation .loadingBG',$container).removeClass('loadingBG');
							$('.loadingText',$container).hide()
						}
						else {} //not on a product page. do nothing
						//_app.ext.beachmart.u.getShipQuotes(_app.data[tagObj.datapointer].zip);
					}
					else if (attempts < 8){
						dump('cartDetail.ship null, running again. #of attempts so far:'); dump(attempts);
						attempts++;
						setTimeout(function() { _app.ext.beachmart.callbacks.handleWhereAmI.onSuccess(tagObj,attempts) },250);
					}
					else if (attempts < 9){
						dump('cartDetail.ship null, setting to blank object and running again. #of attempts so far:'); dump(attempts);
						attempts++;
						thisCartDetail.ship = {};
						setTimeout(function() { _app.ext.beachmart.callbacks.handleWhereAmI.onSuccess(tagObj,attempts) },250);
					}
					else { dump('In _app.ext.beachmart.callbacks.handleWhereAmI.onSuccess and cartDetail.ship is not loading, a problem has occured.','error') }
				},
				onError : function(responseData)	{
					var $container = $(_app.u.jqSelector('#',_app.ext.quickstart.vars.hotw[0].parentID));
					//reset all the spans
					$('.putLoadingHere',$container).removeClass('loadingBG');
					$('.loadingText',$container).hide();
					$('.shipMessage, .estimatedArrivalDate, .deliveryLocation, .deliveryMethod',$container).empty()
					$('.timeInTransitMessaging',$container).empty().append("Unable to determine your zip code for estimated arrival date. <span class='pointer zipLink' onClick='myApp.ext.beachmart.a.showZipDialog(); return false;'>click here</span> to enter zip.").show();
					}
				}, //handleWhereAmI
				
			testCallback : {
				onSuccess : function(tagObj){
					dump('----testCallback'); dump(tagObj); dump(_app.data[tagObj.datapointer]);
					_app.ext.beachmart.a.updateTimeInTransit(_app.data[tagObj.datapointer]);
	//			var data = _app.data[tagObj.datapointer]; 
		//_app.ext.beachmart.u.fetchLocationInfoByZip(data.zip);


				},
				onError : function(responseData)	{
					dump('----ERROR IN TEST CALLBACK!!!!!!!!!!!!!!')
				} //testCallback
			},
			
			magicRefresh : {
				
				onSuccess: function(){
					MagicZoomPlus.refresh();
					}
				
				},
			
			translateAndGetCrossSell : {
				onSuccess : function(tagObj)	{
					_app.renderFunctions.translateTemplate(_app.data[tagObj.datapointer],"productContainer");
					if(_app.ext.beachmart.u.getCrossSellers({'pageType':'product','pid':SKU,'templateID':'productTemplate'}))	{
						_app.calls.ping.init({'callback':'magicRefresh','extension':'beachmart'})
						_app.model.dispatchThis();
						
						}
					else	{
						MagicZoomPlus.refresh();
						}
					
//					window.$prodInfotabs = $( "#tabbedProductContent" ).tabs();
					_app.ext.beachmart.u.handleToolTip();

					if(typeof buySAFE == 'object'){
						WriteBuySafeKickers();
						}
//					if(typeof addthis == 'object')	{
//						addthis.toolbox('.addthis_toolbox');
//						}
//slideshow is only activated when necessary (more than six images)
					if($('#imageSlideshow ul').children().length > 6)	{
						$('#imageSlideshow').parent().find('.carouselNav').show();
						$('#imageSlideshow').jCarouselLite({
							auto: false,
							visible: 6,
							scroll: 4,
							btnPrev: function() {
								return $(this).parent().find('.prev');
								},
							btnNext: function() {
								return $(this).parent().find('.next');
								}
							}); //jCarouselList
						}
					else	{
						$('#imageSlideshow, #imageSlideshow ul').css({'margin':0,'padding':0}).width(375); //remove margin so all six pics remain on one row.
						}
//options for the two vertical carousels. did a var to more easily keep them in sync.
var vertCarouselOptions = {
		auto: false,
		visible: 2,
		scroll : 2,
		vertical:true,
		btnPrev: function() {
			return $(this).parent().find('.prev');
			},
		btnNext: function() {
			return $(this).parent().find('.next');
			}
		};

//slideshow is only activated when necessary (more than two product)
					if($('#accessoriesProdlistSlideshow	 ul').children().length > 2)	{
//						_app.u.dump(" -> SHOW ACCESSORIES CAROUSEL");
						$('#accessoriesProdlistSlideshow').parent().find('.carouselNav').show();

	$('#accessoriesProdlistSlideshow').jCarouselLite(vertCarouselOptions); //jCarouselList

						}
//slideshow is only activated when necessary (more than two product)
					if($('#relatedProdlistSlideshow	 ul').children().length > 2)	{
//						_app.u.dump(" -> SHOW RELATED ITEMS CAROUSEL");
						$('#relatedProdlistSlideshow .carouselNav').show();
	$('#relatedProdlistSlideshow').jCarouselLite(vertCarouselOptions); //jCarouselList
						}
				

					
					},
				onError : function(responseData,uuid)	{
//error handling is a case where the response is delivered (unlike success where datapointers are used for recycling purposes)
					_app.u.handleErrors(responseData,uuid); //a default error handling function that will try to put error message in correct spot or into a globalMessaging element, if set. Failing that, goes to modal.
					}
				},//getCrossSellers
				
//used in init.
			updateMCLineItems : 	{
				onSuccess : function(tagObj)	{
	//				_app.u.dump("BEGIN beachmart.callbacks.updateMCLineItems");
					_app.ext.beachmart.u.handleMinicartUpdate(tagObj);
					$('.atcButton').removeClass('disabled').removeAttr('disabled');
					},
				onError : function(responseData,uuid)	{
					_app.u.handleErrors(responseData,uuid)
					}
				}, //updateMCLineItems				
//used for callback on showCartInModal function
//
			handleCart : 	{
				onSuccess : function(tagObj)	{
					_app.u.dump("BEGIN beachmart.callbacks.onSuccess.handleCart");
					_app.ext.beachmart.u.handleMinicartUpdate(tagObj);
					_app.renderFunctions.translateTemplate(_app.data[tagObj.datapointer].cart,tagObj.parentID);				
					_app.ext.beachmart.u.handleCartUpSell(tagObj.datapointer);
					$('.atcButton').removeClass('disabled').removeAttr('disabled');
					MagicZoomPlus.refresh();
					$('#cartTemplateCostSummary').removeClass('loadingBG');
					},
				onError : function(responseData,uuid)	{
					_app.u.handleErrors(responseData,uuid)
					}
				} //handleCart
				
	
				
			}, //callbacks

		calls : {
			
			appShippingTransitEstimate : {
				init : function(cmdObj,tagObj,Q)	{
					//_app.u.dump("BEGIN beachmart.calls.appShippingTransitEstimate.  [Q: "+Q+"]"); dump(tagObj);
					tagObj = $.isEmptyObject(tagObj) ? {} : tagObj; 
					tagObj.datapointer = "appShippingTransitEstimate";
					this.dispatch(cmdObj,tagObj,Q);
					return true;
					},
				dispatch : function(cmdObj,tagObj,Q)	{
					cmdObj['_tag'] = tagObj;
					cmdObj["_cmd"] = "appShippingTransitEstimate"
					_app.model.addDispatchToQ(cmdObj,Q);	
					}
				},//appShippingTransitEstimate
			time : {
				init : function(tagObj,Q)	{
//					_app.u.dump("BEGIN beachmart.calls.appShippingTransitEstimate.  [Q: "+Q+"]");
					tagObj = $.isEmptyObject(tagObj) ? {} : tagObj; 
					tagObj.datapointer = "time";
					this.dispatch(tagObj,Q);
					return true;
					},
				dispatch : function(tagObj,Q)	{
					_app.model.addDispatchToQ({"_cmd":"time","_tag":tagObj},Q);	
					}
				}, //appShippingTransitEstimate
				
			//returns: areacode, city, country, region, region_name, zip (among other data i didn't think was relevant)
			whereAmI : {
				init : function(_tag,Q)	{
//					dump('----START whereAmI'); dump(_tag); 
			//		var r = 0;
					_tag = $.isEmptyObject(_tag) ? {} : _tag; 
					_tag.datapointer = "whereAmI"
			//		if(_app.model.fetchData('whereAmI') == false)	{
						r = 1;
						this.dispatch(_tag,Q);
			//			}
			//		else	{
	//					_app.u.dump(' -> data is local');
			//			_app.u.handleCallback(_tag);
			//			}
					return r;
					},
				dispatch : function(_tag,Q)	{
//					dump('got into whereAmI dispatch');
					_app.model.addDispatchToQ({"_cmd":"whereAmI","_tag" : _tag},Q || 'mutable');
					} 
				},//whereAmI
			
			}, //calls




/*
#######################

Action

#######################
*/



		a: {
			
//Data must already be in memory to execute this action.
//added as a .click to the shipping method
			showShipGridInModal : function(datapointer, cart){
	_app.u.dump('----> showShipGridInModal datapointer'); _app.u.dump(datapointer);
				var $parent = $('#modalShipGrid').empty();
//the modal opens as quick as possible so users know something is happening.
//open if it's been opened before so old data is not displayed. placeholder content (including a loading graphic, if set) will be populated pretty quick.
				if($parent.length == 0)	{
					$parent = $("<div \/>").attr({"id":"modalShipGrid","title":"Estimated Shipping Times and Methods"}).appendTo('body');
					$parent.dialog({modal: true,width:600,height:300,autoOpen:false});  //browser doesn't like percentage for height
					}
//empty the existing cart and add a loadingBG so that the user sees something is happening.
				$parent.dialog('open').addClass('loadingBG');
					
				if(datapointer && !$.isEmptyObject(_app.data[datapointer]))	{
					var $table = $("<table />").addClass('center');
					$table.append("<tr class='ztable_row_head'><td></td><td>Method</td><td>Est. Arrival</td></tr>");
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
								$table.append(_app.renderFunctions.transmogrify({'id':'service_'+services[i].id},"shipGridTemplate",services[i]));
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
				
			updateShipPostal : function($form)	{
				_app.u.dump("BEGIN beachmall.a.updateShipPostal.");
				var postal = $("[name='ship/postal']",$form).val();
				//var thisCartDetail = _app.data["cartDetail|"+_app.model.fetchCartID()];
//the cartSet doesn't download a fresh copy of the cart, so update the local cart object manually.
	/*			if(thisCartDetail)	{
					if(thisCartDetail.ship)	{
						thisCartDetail.ship.postal = postal; 
						}
					else	{
						thisCartDetail.ship = {'postal':postal}
						}
					}
	*/			if(postal)	{
					_app.u.dump(" -> postal set: "+postal);
					//local cart object will be updated in fetchLocationInfoByZip, cartSet is also run there so that city, region, and zip are all updated
					//
					_app.model.addDispatchToQ({"_cmd":"whereAmI", 'zip':postal, "_tag" : {'callback':'handleWhereAmI','extension':'beachmart', 'datapointer':'whereAmI'}},'mutable');
					_app.model.dispatchThis('mutable');
	//				_app.ext.beachmart.u.fetchLocationInfoByZip(postal,0,_app.ext.beachmart.a.updateTimeInTransit);
					//dump(thisCartDetail.ship.city); dump(thisCartDetail.ship.region); dump(thisCartDetail.ship.postal);
			/*		_app.ext.cco.calls.cartSet.init({
						'ship/postal':postal
						},{
						callback:function(rd){
							if(_app.model.responseHasErrors(rd)){
								$('#globalMessaging').anymessage({'message':rd});
								}
							else	{
								if(_app.ext.quickstart.vars.hotw && _app.ext.quickstart.vars.hotw[0] && _app.ext.quickstart.vars.hotw[0].pageType == 'product')	{
									//update the time in transit.

									var $container = $(_app.u.jqSelector('#',_app.ext.quickstart.vars.hotw[0].parentID));
									_app.ext.beachmart.u.getShipQuotes(postal);
//this happens above in fetchLocationInfoByZip	$('.shipPostal').each(function(){$(this).text(postal);});
									//reset all the spans
									$('.putLoadingHere',$container).addClass('loadingBG');
									$('.loadingText',$container).hide();
									$('.shipMessage, .estimatedArrivalDate, .deliveryLocation, .deliveryMethod',$container).empty()

									}
								else	{} //not on a product page. do nothing.
								}
							}
						},'passive');
					_app.model.dispatchThis('passive');
			*/		}
				else	{
					$('#globalMessaging').anymessage({'message':'In beachmart_custom.u.updateShipPostal, no postal code passed.','gMessage':true})
					}
				
				},
				
			//checks if a product page is open, and updates time in transit for that page created to be used as a callback to cartSet w/ zip from fetchLocationInfoByZip when called from updateShipPostal
			updateTimeInTransit : function(rd) {
				dump('START beachmart.a.updateTimeInTransit');
				dump(rd); dump(rd.country); dump(rd.city); dump(rd.region);
				if(_app.model.responseHasErrors(rd)) {
					$('#globalMessaging').anymessage({'message':rd}); dump('beachmart.a.updateTimeInTransit response had errors');
				}
				else {
					//update the time in transit.
					if(_app.ext.quickstart.vars.hotw && _app.ext.quickstart.vars.hotw[0] && _app.ext.quickstart.vars.hotw[0].pageType == 'product')	{				
						var $container = $(_app.u.jqSelector('#',_app.ext.quickstart.vars.hotw[0].parentID));
						$('.timeInTransitMessaging').empty(); //intentionally has no context. once a zip is entered, remove this anywhere it was displayed.
				//some of these were backwards? copied these from zip dialog and seemed to work better. 	
				//		$('.putLoadingHere',$container).addClass('loadingBG');
				//		$('.loadingText',$container).hide();
				//		$('.shipMessage, .estimatedArrivalDate, .deliveryLocation, .deliveryMethod',$container).empty()
						//reset all the spans
						$('.putLoadingHere',$container).addClass('loadingBG').show();
						$('.loadingText',$container).show();
						$('.shipMessage, .estimatedArrivalDate, .deliveryLocation, .deliveryMethod',$container).empty()				
						_app.ext.beachmart.u.getShipQuotes(rd.zip);
					}
					else {} //not on a product page. do nothing
				}
			},
			
//this is a dumbed down version of this for the product page _app.
			showContent : function(pageType,infoObj)	{
				
				var r = false; 
				if(typeof infoObj != 'object')	{infoObj = {}} //infoObj could be empty for a cart or checkout

//if pageType isn't passed in, we're likely in a popState, so look in infoObj.
				if(pageType){infoObj.pageType = pageType} //pageType
				else if(pageType == '')	{pageType = infoObj.pageType}
				
				infoObj.back = infoObj.back == 0 ? infoObj.back : -1; //0 is no 'back' action. -1 will add a pushState or hash change.
				$(".ui-dialog-content").dialog("close"); //close all modal windows.
				var domain = document.location.protocol == 'https:' ? zGlobals.appSettings.https_app_url : zGlobals.appSettings.http_app_url;
				
				switch(pageType)	{

					case 'product':
	//add item to recently viewed list IF it is not already in the list.				
						document.location = domain+"product/"+infoObj.pid
						break;
	
					case 'homepage':
						document.location = domain
						break;

					case 'category':
						document.location = domain+'category/'+infoObj.navcat
						break;
	
					case 'search':
						document.location = domain+"results.cgis?KEYWORDS="+keywords
						break;
	
					case 'customer':
						if(infoObj.show == 'orders')	{infoObj.show = 'order'} //backwards compatibility for URL
						document.location = domain+"customer/"+infoObj.show
						break;
	
					case 'checkout':
						document.location = _app.vars.secureURL+"c="+_app.sessionId+"/checkout.cgis"
						break;
	
					case 'company':
						document.location = domain+infoObj.show+".cgis";
						break;
	
	
					case 'cart':
						document.location = domain+"cart.cgis";
						break;

					default:
						_app.u.dump("WARNING: unknown page type encountered in showContent");
						alert("We apologize, an unexpected error occured.");
					}
				
				}, //showContent
		
			printByElementID : function(id)	{
//				_app.u.dump("BEGIN beachmart.a.printByElementID");
				if(id && $('#'+id).length)	{
					var html="<html><body style='font-family:sans-serif;'>";
					html+= document.getElementById(id).innerHTML;
					html+="</body></html>";
					
					var printWin = window.open('','','left=0,top=0,width=600,height=600,toolbar=0,scrollbars=0,status=0');
					printWin.document.write(html);
					printWin.document.close();
					printWin.focus();
					printWin.print();
					printWin.close();
					}
				else	{
					_app.u.dump("WARNING! - beachmart.a.printByElementID executed but not ID was passed ["+id+"] or was not found on DOM [$('#'+"+id+").length"+$('#'+id).length+"].");
					}
				}, //printByElementID 
				
				



			showProdAttInDialog : function(pid,attr){
				if(pid && attr)	{
					var content = _app.data['appProductGet|'+pid]['%attribs'][attr];
					if(content)	{
						var $div = $('<div />');
						$div.attr('title','').text(content).dialog({width:550,buttons: {'close': function() {$( this ).dialog( "close" );}}});
						$div.dialog('option', 'title',"|||"); 
						}
					else	{_app.u.dump("WARNING! showProdInDialog tried to load a blank field: _app.data['appProductGet|"+pid+"]['%attribs']["+attr+"]");}
					}
				else	{
					_app.u.dump("WARNING! showProdAttInDialog requires both pid ["+pid+"] and attr  ["+attr+"]  to be set");
					}
				}, //showProdAttInDialog
				
			showZipDialog : function()	{
				
				var $dialog = $('#zipEntryDialog');
				if($dialog.length)	{}//dialog already exists. no mods necessary, just open it.
				else	{
					_app.u.dump("create and show zip dialog");
					$dialog = $("<div>").attr("title","Change Zip for Shipping").dialog({
						modal:true,
						autoOpen:false,
						close: function(event, ui)	{
								$(this).dialog('destroy').empty().remove()
							}
						});
					$dialog.append("<div id='shipDialogMessaging' />");
					$dialog.append("<input type='text' name='data.ship_zip' id='shipDialogZip' required='required' size='10' />");
					var $button = $("<button />").html('Update Zip Code').click(function(){
						var zip = $('#shipDialogZip').val();
						_app.u.dump("BEGIN showZipDialog .click event. zip: '"+zip+"'");

						if(zip && zip.length >= 5 && !isNaN(zip))	{
					_app.model.addDispatchToQ({"_cmd":"whereAmI", 'zip':zip, "_tag" : {'callback':'handleWhereAmI','extension':'beachmart', 'datapointer':'whereAmI'}},'mutable');
					_app.model.dispatchThis('mutable');
							//_app.u.dump('----CART ID:'); _app.u.dump(_app.model.fetchCartID());
							
			/*				var varsCart = _app.model.fetchCartID();
//reset these vars so getShipQuotes doesn't use them.
							if(_app.data["cartDetail|"+varsCart].ship)	{
								_app.data["cartDetail|"+varsCart].ship.city = ""; 
								_app.data["cartDetail|"+varsCart].ship.postal = zip; 
								_app.data["cartDetail|"+varsCart].ship.region = "";
								}
							_app.ext.cco.calls.cartSet.init({"ship/postal":zip,"ship/city":"","ship/region":"","_cartid":_app.model.fetchCartID()},{},'passive');
//if you destroy the cartDetail call, you'll break time in transit.

							var $container = $("#productTemplate_"+_app.u.makeSafeHTMLId(SKU)); //using $container as second param in $ below targets better (lighter and leaves door open for multiple instances later)
							_app.ext.beachmart.u.getShipQuotes(zip);
							$('.timeInTransitMessaging').empty(); //intentionally has no context. once a zip is entered, remove this anywhere it was displayed.
							$('.shipPostal').text(zip);
							//reset all the spans
							$('.putLoadingHere',$container).addClass('loadingBG').show();
							$('.loadingText',$container).show();
							$('.shipMessage, .estimatedArrivalDate, .deliveryLocation, .deliveryMethod',$container).empty()
			*/				$dialog.dialog('close');
							}
						else	{
							$('#shipDialogMessaging').empty().anymessage({"message":"Please enter a valid US zip code"});
							}
						});
					$dialog.append($button)
					}

				
				$dialog.dialog('open');
				
				}

				
		
			}, //action


/*
#######################

RenderFormats

#######################
*/


		renderFormats: {
			
//needed more control over the size.		
			youtubeVideo : function($tag,data){
				var r = "<iframe style='z-index:1;' width='380' height='214' src='https://www.youtube.com/embed/"+data.value+"' frameborder='0' allowfullscreen></iframe>";
				$tag.append(r);
				},
//value is a url. This'll load that url into an iframe.
			iframe : function($tag,data){
				var r = "<iframe style='z-index:1;' width='380' height='300' scrolling='no'  src='"+data.value+"' frameborder='0' ></iframe>";
				$tag.append(r);
				},

			
			ymd2Pretty : function($tag,data)	{
				$tag.append(_app.ext.beachmart.u.yyyymmdd2Pretty(data.value));
				},

			setHrefToImageUrl : function($tag,data){
				var imgSrc = _app.u.makeImage({'tag':0,'w':'','h':'','name':data.value,'b':'ffffff'});
				var pid = $tag.closest('[data-pid]').attr('data-pid');
//				_app.u.dump('IMGSRC => '+imgSrc);
				$tag.attr({'href':imgSrc,'rel':'caption-source:#caption_'+pid});
				},


			searchlink : function($tag,data){
				var keywords = data.value.replace(/ /g,"+");
				var domain = document.location.protocol == 'https:' ? zGlobals.appSettings.https_app_url : zGlobals.appSettings.http_app_url;
				$tag.append("<a class='underline' href='#!search?KEYWORDS="+keywords+"&amp;CATALOG=MFG'>"+data.value+"<\/a>");
			//	$tag.append("<a class='underline' href='"+domain+"results.cgis?KEYWORDS="+keywords+"&amp;CATALOG=MFG'>"+data.value+"<\/a>");
				}, //searchLink


			addPicSlider : function($tag,data)	{
//				_app.u.dump("BEGIN beachmart.renderFormats.addPicSlider: "+data.value);
				if(_app.data['appProductGet|'+data.value])	{
					var pdata = _app.data['appProductGet|'+data.value]['%attribs'];
//if image 1 or 2 isn't set, likely there are no secondary images. stop.
					if(_app.u.isSet(pdata['zoovy:prod_image1']) && _app.u.isSet(pdata['zoovy:prod_image2']))	{
//						_app.u.dump(" -> image1 ["+pdata['zoovy:prod_image1']+"] and image2 ["+pdata['zoovy:prod_image2']+"] both are set.");
//adding this as part of mouseenter means pics won't be downloaded till/unless needed.
// no anonymous function in mouseenter. We'll need this fixed to ensure no double add (most likely) if template re-rendered.
//							$tag.unbind('mouseenter.myslider'); // ensure event is only binded once.
							$tag.bind('mouseenter.myslider',_app.ext.beachmart.u.addPicSlider2UL).bind('mouseleave',function(){window.slider.kill()})
						}
					}
				},


//pass in the sku for the bindata.value so that the original data object can be referenced for additional fields.
// will show price, then if the msrp is MORE than the price, it'll show that and the savings/percentage.
			priceRetailsavingsdifference : function($tag,data)	{
				var o; //output generated.
				var pData = _app.data['appProductGet|'+data.value]['%attribs'];
	//use original pdata vars for display of price/msrp. use parseInts for savings computation only.
				var price = Number(pData['zoovy:base_price']);
				var msrp = Number(pData['zoovy:prod_msrp']);
				if(price > 0 && (msrp - price > 0))	{
					o = _app.u.formatMoney(msrp-price,'$',2,true)
					$tag.append(o);
					}
				else	{
					$tag.hide(); //if msrp > price, don't show savings because it'll be negative.
					}
				}, //priceRetailSavings		


//pass in the sku for the bindata.value so that the original data object can be referenced for additional fields.
// will show price, then if the msrp is MORE than the price, it'll show that and the savings/percentage.
			priceRetailsavingspercentage : function($tag,data)	{
				var o; //output generated.
				var pData = _app.data['appProductGet|'+data.value]['%attribs'];
	//use original pdata vars for display of price/msrp. use parseInts for savings computation only.
				var price = Number(pData['zoovy:base_price']);
				var msrp = Number(pData['zoovy:prod_msrp']);
				if(price > 0 && (msrp - price > 0))	{
					var savings = (( msrp - price ) / msrp) * 100;
					o = savings.toFixed(0)+'%';
					$tag.append(o);
					}
				else	{
					$tag.hide(); //if msrp > price, don't show savings because it'll be negative.
					}
				}, //priceRetailSavings	



//pass in the sku for the bindata.value so that the original data object can be referenced for additional fields.
// will show price, then if the msrp is MORE than the price, it'll show that and the savings/percentage.
			priceretailsavings : function($tag,data)	{
//				_app.u.dump("BEGIN beachmart.s.priceRetailsSavings ["+data.value+"]");
				var o = ''; //output generated.
				var pData = _app.data['appProductGet|'+data.value]['%attribs'];
	//use original pdata vars for display of price/msrp. use parseInts for savings computation only.
				var price = Number(pData['zoovy:base_price']);
				var msrp = Number(pData['zoovy:prod_msrp']);
				var priceModifier = Number(pData['user:prod_has_price_modifiers']);
//				_app.u.dump(" ->: priceMod: "+priceModifier);
//				_app.u.dump(" -> price: "+price);
//				_app.u.dump(" -> msrp: "+msrp);
				if(price > .01)	{
					if(priceModifier < 1) {
						o += "<div class='basePrice'><span class='prompt pricePrompt'>Our Price: <\/span><span class='value' itemprop='price'>";
						o += "<span itemprop='priceCurrency' content='USD'>$"+_app.u.formatMoney(pData['zoovy:base_price'],'$',2,true).substring(1)+"</span>";
						o += "<\/span><\/div>";
					}
					else {
						//wants to have a range of baseprice to baseprice + largest price modifiers displayed for price when using price modifiers. 
						dump('priceretailsavings product:'); //dump(_app.data['appProductGet|'+data.value]['@variations']);
						var maxAddition = 0; //holds the final tally of highest modifiers
						var variations = _app.data['appProductGet|'+data.value]['@variations'];
						for(index in variations) {
							if(variations[index]['type'] == 'imgselect') {	//check for imgselect (will/may have modifiers)
								dump(variations[index]);
								var workingMod = 0;	//will store the current highest price modifier
								var options = variations[index]['@options']
								for(mark in options) {
									dump(options[mark]);
									if(options[mark]['p'] && options[mark]['p'] != "" && options[mark]['p'] != "undefined") {
										var thisPriceMod = Number(options[mark]['p'].substring(1));
										if(thisPriceMod > workingMod) { workingMod = thisPriceMod } //check each option and if it's higher than the last, record it.
									}
								}
								maxAddition += workingMod; dump('maxAddition = '+maxAddition);	//after all options have been checked, store the highest one.
							}
						}
						var maxPrice = Number(pData['zoovy:base_price']) + maxAddition;
						// ORIG CALL BELOW, NEW CALL HAS $ SEPARATED AND GIVEN A SPAN W/ SCHEMA	ATTRIB. 
						//	o += _app.u.formatMoney(pData['zoovy:base_price'],'$',2,true);
						o += "<div class='basePrice floatNone'><span class='prompt pricePrompt'>Our Price From: <\/span><span class='value' itemprop='price'>";
						o += "<span itemprop='priceCurrency' content='USD'>$"+_app.u.formatMoney(pData['zoovy:base_price'],'$',2,true).substring(1)+"</span>";
						if(maxAddition > 0) { //if there was a price modifier recorded we should be ok to show it, otherwise show only "from 'basePrice'" as a failsafe. 
							o += "<\/span>";
							o += "<span class='value'> - "+_app.u.formatMoney(maxPrice,'$',2,true)+"<\/span><\/div>";
						} else {
							o += "<\/span><\/div>";
						}
					}

	//only show the msrp if it is greater than the price.
					if(msrp > price)	{
	//don't bother with savings of less than a buck.
						if(msrp-price > 1)	{
							o += " <span class='savings'>(";
	//						o += _app.u.formatMoney(msrp-price,'$',2,true)
							var savings = (( msrp - price ) / msrp) * 100;
							o += savings.toFixed(0);
							o += "% savings)<\/span>";
							}
					
						o += "<div class='retailPrice'><span class='prompt retailPricePrompt'>List Price: <\/span><span class='value'>";
						o += _app.u.formatMoney(pData['zoovy:prod_msrp'],'$',2,true);
						o += "<\/span><\/div>";
						}
					}
				$tag.append(o);
				}, //priceRetailSavings


//will remove the add to cart button if the item is not purchaseable.
			addtocartbutton : function($tag,data)	{
//				_app.u.dump("BEGIN store_product.renderFunctions.addToCartButton");
//				_app.u.dump(" -> ID before any manipulation: "+$tag.attr('id'));
				var pid = data.value;
// add _pid to end of atc button to make sure it has a unique id.
// add a success message div to be output before the button so that messaging can be added to it.
// atcButton class is added as well, so that the addToCart call can disable and re-enable the buttons.
				$tag.attr('id',$tag.attr('id')+'_'+pid).before("<div class='atcSuccessMessage' id='atcMessaging_"+pid+"'><\/div>");
				var pData = _app.data['appProductGet|'+data.value]
				var hasPreOrderPassed = pData['%attribs']['zoovy:prod_salesrank'] ? _app.ext.beachmart_dates.u.afterToday(pData['%attribs']['zoovy:prod_salesrank']) : true;
				
				if(pData && pData['%attribs'] && pData['%attribs']['is:user1']){
					$tag.val("Back-Order Now").text("Back-Order Now").addClass('addToCartButton backorderButton');
					}
				else if(pData && pData['%attribs'] && pData['%attribs']['is:preorder'] && hasPreOrderPassed){
					$tag.addClass('preorderButton');
					}
				else	{
					$tag.addClass('atcButton')
					}
				
				if(_app.ext.store_product.u.productIsPurchaseable(pid))	{
//product is purchaseable. make sure button is visible and enabled.
					$tag.show().removeClass('displayNone').removeAttr('disabled');
					}
				else	{
					$tag.hide().addClass('displayNone').before("<span class='notAvailableForPurchase'>This item is not available for purchase<\/span>"); //hide button, item is not purchaseable.
					}

//				_app.u.dump(" -> ID at end: "+$tag.attr('id'));
				}, //addToCartButton
		
			}, //renderFormats


/*
#######################

Variations

#######################
*/

		variations: {
			renderOptionIMGGRID_ALT:function(pog) {
			_app.u.dump("BEGIN beachmart.variations.renderOptionIMGGRID_ALT");

var pogid = pog.id;

var $parentDiv = $("<span \/>"); // = $('#div_'+safeid);

//display ? with hint in hidden div IF ghint is set
if(pog['ghint']) {$parentDiv.append(pogs.showHintIcon(pogid,pog['ghint']))}


var $imagesDiv = $("<div />").attr('id','pog_pretty_'+pogid).addClass('clearfix');
$imagesDiv.append("<div class='zhint'>mouse over thumbnail to see larger swatches</div>");


var $selectList = $("<select />").attr({'id':'pog_'+pogid,'name':'pog_'+pogid}).addClass('zform_select');
//use the href's title attribute to set the label so that it changes when a selection is made.  The image 'onclick' does pretty much the same thing.
$selectList.change(function(){
	$("pog_"+pogid+"_id").innerHTML = $("#imgGridHref_"+pogid+"_"+$(this).val()).attr('title')
	})

var i = 0;
var len = pog.options.length;
var selOption,optionTxt,title,sogValue; //recycled

//if the option is 'optional' AND has more than one option, add blank prompt. If required, add a please choose prompt first.
if(len > 0)	{
	optionTxt = (pog['optional'] == 1) ?  "" :  "Please choose (required)";
	selOption = "<option value='' disabled='disabled' selected='selected'>"+optionTxt+"<\/option>";
	$selectList.append(selOption);
	}

//adds options to the select list.
while (i < len) {
	sogValue = pog['options'][i]['v'];
/* compose the title as option prompt: pog prompt price - availabitity. pog html (used for shipping) */
	title = pog['prompt']+": "+pog['options'][i]['prompt'];
	if(pog['options'][i]['p'])
		title += " "+_app.u.formatMoney((Number(_app.data['appProductGet|'+SKU]['%attribs']['zoovy:base_price']) + Number(pog['options'][i]['p'])),'$', 2,false); //display total price. multiply modifier by 1 to treat as js number
	if(pog['options'][i]['html'])	{
		title += ' '+pog['options'][i]['html'].replace(/%20/g,' ') ;
		}
//	else
//		title += ' '+defaultShipTime;

// create a div and put the thumbnail into it.  These'll all get added next to each other and floats will be used to get their appearance right
	var $pogImage = $("<div />").addClass('floatLeft sogImgThumbnail');
//The onclick changes the select list.  selectedIndex is used instead of by id because by id doesn't work in IE.



	$pogImage.append("<a id='imgGridHref_"+pogid+"_"+sogValue+"' href='"+_app.u.makeImage({"w":200,"h":200,"name":pog['options'][i]['img'],"b":"FFFFFF","tag":false})+"' class='MagicZoom' onMouseOver='$(&quot;#pog_"+pogid+"_id&quot).innerHTML = &quot;"+title+"&quot;' onclick=\"$('#pog_"+pogid+"').val('"+sogValue+"'); return false;\" title='"+title+"'><img src='"+_app.u.makeImage({"w":pog.width,"h":pog.height,"name":pog['options'][i]['img'],"b":"FFFFFF","tag":false})+"' alt='"+title+"' border='0' height='"+pog.height+"' width='"+pog.width+"' name='imgGrid_"+pogid+"_"+sogValue+"' id='imgGrid_"+pogid+"_"+sogValue+"'></a>")

	$imagesDiv.append($pogImage); //this'll put the images at the top.

	optionText = pog['options'][i]['prompt'];
//display total price. multiply modifier by 1 to treat as js number
	if(pog['options'][i]['p'])
		optionText += " $"+(( Number(_app.data['appProductGet|'+SKU]['%attribs']['zoovy:base_price'])) + ( pog['options'][i]['p'] * 1 )).toFixed(2); 
	selOption = $("<option />").val(sogValue).text(optionText).attr('id',pogid+"_"+sogValue);
	selOption.appendTo($selectList); 
	i++;
	}

$selectList.appendTo($imagesDiv);

if(pog['ghint']) {$parentDiv.append(pogs.showHintIcon(pogid,pog['ghint']))}

$parentDiv.append($imagesDiv);


				return $parentDiv;
				},  //end IMGGRID_ALT
		
		
			xinit: function($super) {
//				   this.addHandler("type","imggrid","renderOptionIMGGRID_ALT"); //validation for imgGrid is different. need these converted to imgselect as theyu pop up.
				   this.addHandler("type","imgselect","renderOptionIMGGRID_ALT");
				} //xinit

		
			}, //variations



/*
#######################

uities

#######################
*/


		u: {

			
			initEstArrival : function(infoObj,attempts){
				_app.u.dump("BEGIN beachmart.u.initEstArrival");
				attempts = Number(attempts) || 0;
				dump(attempts);
				window.SKU = infoObj.pid; _app.u.dump("GLOBAL SKU IS A TEMPORARY SOLUTION!!!",'warn'); //was originally written in a hybrid store. need to get this more app friendly.
				var zip;
				var thisCartDetail = _app.data["cartDetail|"+_app.model.fetchCartID()];
				if(thisCartDetail && thisCartDetail.ship && thisCartDetail.ship.postal)	{
					zip = thisCartDetail.ship.postal;
					}
				/*
				navigator.geolocation is crappily supported. appears there's no 'if user hits no' support to execute an alternative. at least in FF.
				look at a pre-20120815 copy of this lib for geocoding
				*/

				if(zip)	{
					_app.u.dump(" -> zip code is cart ["+zip+"]. Use it");
					_app.ext.beachmart.u.getShipQuotes(zip); //function also gets city/state from googleapi
					}
				//whereAmI may still be loading if page was loaded to product directly
				else if(attempts < 35) {
					setTimeout(function(){ _app.ext.beachmart.u.initEstArrival(infoObj,attempts + 1 ); },200);
				}
				else	{
					_app.u.dump(" -> no zip code entered. request via whereAmI");
					_app.ext.beachmart.calls.whereAmI.init({'callback':'handleWhereAmI','extension':'beachmart'},'mutable');
					_app.model.dispatchThis('mutable');
					}

				},


//obj is going to be the container around the img. probably a div.
//the internal img tag gets nuked in favor of an ordered list.
			addPicSlider2UL : function(){
//				_app.u.dump("BEGIN beachmart.u.addPicSlider2UL");
				
				var $obj = $(this);
				if($obj.data('slider') == 'rendered')	{
					//do nothing. list has aready been generated.
//					_app.u.dump("the slideshow has already been rendered. re-init");
					window.slider.kill(); //make sure it was nuked.
					window.slider = new imgSlider($('ul',$obj));
					}
				else	{
					$obj.data('slider','rendered'); //used to determine if the ul contents have already been added.
					var pid = $obj.closest('[data-pid]').attr('data-pid');
//					_app.u.dump(" -> pid: "+pid);
					var data = _app.data['appProductGet|'+pid]['%attribs'];
					var $img = $obj.find('img')
					var width = $img.attr('width'); //using width() and height() here caused unusual results in the makeImage function below.
					var height = $img.attr('height');
					$obj.width(width).height(height).css({'overflow':'hidden','position':'relative'});
					var $ul = $('<ul>').addClass('slideMe').css({'height':height+'px','width':'20000px'}); //width hard coded to avoid inheretancy.
					
					var $li; //recycled.
					for(var i = 2; i <= 10; i += 1)	{
						if(data['zoovy:prod_image'+i])	{
							$li = $('<li>').append(_app.u.makeImage({"name":data['zoovy:prod_image'+i],"w":width,"h":height,"b":"FFFFFF","tag":1}));
							$li.appendTo($ul);
							}
						else	{break} //end loop at first empty image spot.
						}
					$li = $("<li>").append($img);
					$ul.prepend($li); //move the original image to the front of the list instead of re-requesting it. prevents a 'flicker' from happening
					$obj.append($ul); //kill existing image. will b replaced w/ imagery in ul.
//					$img.remove(); //get rid of original img instance.
					window.slider = new imgSlider($('ul',$obj))
					}
				},	
				


			getShipQuotes : function(zip)	{
//				_app.u.dump("BEGin beachmart.u.getShipQuotes");
				var $context = $(_app.u.jqSelector('#','productTemplate_'+SKU));

					//if item has user:is_dropship set to one, transit/geo location will be hidden, don't bother going further
				if(_app.data['appProductGet|'+SKU] && _app.data['appProductGet|'+SKU]['%attribs']['user:is_dropship']) {
					if(_app.data['appProductGet|'+SKU]['%attribs']['user:is_dropship'] == 1) {
						return;
					}
				}

				//here, inventory check is done instead of isProductPurchaseable, because is used specifically to determine whether or not to show shipping.
				// the purchaseable function takes into account considerations which have no relevance here (is parent, price, etc).
				if(_app.ext.store_product.u.getProductInventory(_app.data['appProductGet|'+SKU]) <= 0){
					//no inventory. Item not purchaseable. Don't get shipping info
					$('.shippingInformation .putLoadingHere',$context).removeClass('loadingBG').hide();
					$('.timeInTransitMessaging',$context).append("Inventory not available.");
					}
				else if(_app.data['appProductGet|'+SKU] && _app.data['appProductGet|'+SKU]['%attribs']['is:preorder'])	{
					this.handlePreorderShipDate();
					}
				else if(zip)	{
				//	_app.u.dump(" -> zip: "+zip);
				//if the city or the state is already available, don't waste a call to get additional info.
				//this block is also executed for zip update, so allow reset.
	//whereAmI should be autosetting city, region, & zip so removed this until solution is worked up.
	//				var thisCartDetail = _app.data["cartDetail|"+_app.model.fetchCartID()];
	//				if(thisCartDetail && thisCartDetail.ship && (!thisCartDetail.ship.city && !thisCartDetail.ship.region))	{
	//					_app.ext.beachmart.u.fetchLocationInfoByZip(zip);
	//					}
					var prodArray = new Array();
					prodArray.push(SKU);
					dump('SKU -->'); dump(SKU);
			//removed this, at this point there should already be a zip in the cartDetail...
			//		if(thisCartDetail.ship)	{
			//			//thisCartDetail.ship.postal = zip; //update local object so no request for full cart needs to be made for showTransitTimes to work right.
			//			}
			//		else	{
			//			thisCartDetail.ship = {'postal' : zip};
			//			}
			//		_app.ext.cco.calls.cartSet.init({"ship/postal":zip},{},'passive');

					_app.ext.beachmart.calls.time.init({},'mutable');
					dump('-0--ProdArray & zip:'); dump(prodArray); dump(zip);
					_app.ext.beachmart.calls.appShippingTransitEstimate.init({"@products":prodArray,"ship_postal":zip,"ship_country":"US"},{'callback':'showTransitTimes','extension':'beachmart'},'mutable');
				//	_app.data.cartDetail['data.ship_zip'] = _app.data[tagObj.datapointer].zip; //need this local for getShipQuotes's callback.

					_app.model.dispatchThis('mutable'); //potentially a slow request that should interfere with the rest of the load.

					//go get the shipping rates.
					}
				else	{
					_app.u.dump("WARNING! no zip passed into getShipQuotes");
					}
				
				}, //getShipQuotes


			instantiateGeoCoder : function(){
			//	geocoder = new google.maps.Geocoder();
//				dump('---START instantiateGeoCoder');
				//get user coordinates to set cart and geolocation classes with
			//	_app.ext.beachmart.u.getGeoCoords();
			_app.ext.beachmart.calls.whereAmI.init({'callback':'handleWhereAmI','extension':'beachmart'},'passive');
				},

			//this and getZipFromCoords were used w/ the google api and navigator.geolocation, replaced by whereAmI can remove once that has tested long enough.	
			getGeoCoords : function(attempts) {
				var latLong = false; //what is returned, object of coordinates if found, false if not found
				attempts = Number(attempts) || 0;
//				dump('BEGIN beachmart.u.getGeoCoords. Attemps = ');dump(attempts);
				if(typeof geocoder != 'undefined' && typeof geocoder.geocode == 'function')	{
					if(navigator.geolocation) {
//						dump('---navigator.geolocation is present');
						navigator.geolocation.getCurrentPosition(
							function(position){
//								dump(position);	dump(position.coords);
								latLong = {'lat':position.coords.latitude,'longi':position.coords.longitude};
								//get zip code from the coordinates
								_app.ext.beachmart.u.getZipFromCoords(latLong);
								return latLong;
							}
						);
					}
					else if(attempts < 30) {
						setTimeout(function(){_app.ext.beachmart.u.getGeoCoords(attempts+1);},250); //perhaps the navigator or geolocation hasn't loaded yet. try again.
					}
					else {
						_app.u.dump("WARNING! beachmart.u.getGeoCoords could not execute. navigator or geolocation not set. Attempts to load googleapi: "+attempts);
					}
				}
				else if(attempts < 30) {
					setTimeout(function(){_app.ext.beachmart.u.getGeoCoords(attempts+1);},250); //perhaps the maps api hasn't loaded yet. try again.
				}
				else {
					_app.u.dump("WARNING! beachmart.u.getGeoCoords could not execute. Geocoder not set. Attempts to load googleapi: "+attempts);
				}
				
				return latLong;
			},

			getZipFromCoords : function(latLong) {
//				dump('BEGIN beachmart.u.getZipFromCoords');
				//var latLong = {'lat':33.553914,'longi':-117.21392300000001}; //in actuall operation, this will be passed to the function
				var r = false; //what is returned, zip if found, false if not found.
//				dump('-----getZipFromCoords lat & long'); dump(latLong.lat); dump(latLong.longi);
				var gMap = new google.maps.LatLng(latLong.lat, latLong.longi);
				
				geocoder.geocode({'latLng':gMap}, function(results,status){
					if(status == google.maps.GeocoderStatus.OK) {
						for(var i = 0; i < results.length; i++) {
//							dump('----RESULTS & STATUS:'); dump(results[i]); dump(status);
							if(results[i].types == 'postal_code') {
								r = results[i].address_components[0].long_name;
//								dump('getZipFromCoords zip = '); dump(r);
								_app.ext.beachmart.u.fetchLocationInfoByZip(r);
								return r; //no need to check others once zip is found.
							}
						}
					}
					else {dump('ZIP could not be determined by beachmart.u.getZipFromCoords');}
				});
				return r;
			},
			
			fetchLocationInfoByZip : function(zip,attempts,callback)	{
				attempts = Number(attempts) || 0;
//				_app.u.dump("BEGIN beachmart.u.fetchLocationInfoByZip ["+zip+"]. attempt: "+attempts);
				if(zip && typeof geocoder != 'undefined' && typeof geocoder.geocode == 'function')	{
					geocoder.geocode({ 'address': zip}, function(results, status) {
						_app.u.dump(" -> geocode.callback executed. zip: "+zip);
//						_app.u.dump(results);
						if(results.length > 0)	{
//							_app.u.dump(results[0].address_components);
							var city = _app.ext.beachmart.u.getCityFromAddressComponents(results[0].address_components);
							var state = _app.ext.beachmart.u.getStateFromAddressComponents(results[0].address_components);

							//update the local cart object right away, in addition to the server side cart, so that vars are available globally right away.
							var thisCartDetail = _app.data["cartDetail|"+_app.model.fetchCartID()]; 
							if(thisCartDetail && thisCartDetail.ship)	{
								thisCartDetail.ship.city = city;
								thisCartDetail.ship.region = state;
								thisCartDetail.ship.postal = zip;
							}
 
							//calls to fetchLocationInfoByZip by updateShipPostal will have a callback to check if a product page needs time in transit updated
							typeof(callback) == "function" ? _app.ext.cco.calls.cartSet.init({"ship/city":city,"ship/region":state,"ship/postal":zip,"_cartid":_app.model.fetchCartID()},{"callback":callback,"zip":zip},'passive') :
								_app.ext.cco.calls.cartSet.init({"ship/city":city,"ship/region":state,"ship/postal":zip,"_cartid":_app.model.fetchCartID()},{},'passive'); 
							
							$('.shipCity').each(function(){$(this).text(city || "");});//dump(city);
							$('.shipRegion').each(function(){$(this).text(state || "");});
							$('.shipPostal').each(function(){$(this).text(zip || "");});
							_app.model.dispatchThis('passive');
							}
						else	{
							_app.u.dump("NOTICE! google API response had no results.");
							}
						});
					}
				else if(!zip)	{
					_app.u.dump("ERROR! zip not passed into beachmart.u.fetchLocationInfoByZip");
					}
				else if(typeof geocoder != 'undefined' && typeof geocoder.geocode != 'function' && attempts < 30)	{
					_app.ext.beachmart.u.fetchLocationInfoByZip(zip,attempts+1); //perhaps the maps api hasn't loaded yet. try again.
					}
				else	{
					_app.u.dump("WARNING! beachmart.u.fetchLocationInfoByZip could not execute. zip set, but geocoder not. attempts to load googleapi: "+attempts);
					}
				},
				
			//pass in the address_components array from the google api response
			getCityFromAddressComponents : function(AC){
				var r = false; //what is returned. will be city, if able to determine.
				var L = AC.length;
				for(i = 0; i < L; i += 1)	{
					if(AC[i].types[0] == 'locality' || AC[i].types[0] == 'administrative_area_level_2')	{
						r = AC[i].long_name;
						break;
						}
					}
				return r;
				},

			//pass in the address_components array from the google api response
			getStateFromAddressComponents : function(AC){
				var r = false; //what is returned. will be city, if able to determine.
				var L = AC.length;
				for(i = 0; i < L; i += 1)	{
					if(AC[i].types[0] == 'administrative_area_level_1')	{
						r = AC[i].short_name;
						break;
						}
					}
				return r;
				},


			handlePreorderShipDate : function(){
				_app.u.dump("BEGIN beachmart.u.handlePreorderShipDate");
				_app.u.dump("SANITY! this item is (or was) a preorder.");
				var message;
				var product = _app.data['appProductGet|'+SKU];
//if no date is set in salesrank, don't show any shipping info.
				if(product['%attribs']['zoovy:prod_salesrank']) {
					if(_app.ext.beachmart_dates.u.dateAfterToday(product['%attribs']['zoovy:prod_salesrank']))
						message = "Will ship on "+this.yyyymmdd2Pretty(_app.data['appProductGet|'+SKU]['%attribs']['zoovy:prod_salesrank'])
					}
					else { message = "" }
				//var $container = $("#productContainer")
				var $container = $("#productTemplate_"+product.pid)
				
				$('.putLoadingHere',$container).removeClass('loadingBG');
				$('.loadingText',$container).hide();
				$('.transitContainer',$container).text(message);
				},


			handleProdlistMagicThumb : function($obj) {
				$('.mtClickToZoom').hide();
				$('.mtClickToZoom',$obj).show();
				},


//goes throught the product template and gets all skus in the PRODLIST attributes (that are used in the template).
			getCrossSellers : function(P)	{
//_app.u.dump("BEGIN beachmart.u.buildQueriesFromTemplate");
//_app.u.dump(P);

var numRequests = 0; //will be incremented for # of requests needed. if zero, execute showPageContent directly instead of as part of ping. returned.
var elementID; //used as a shortcut for the tag ID, which is requied on a search element. recycled var.

//goes through template.  Put together a list of all the data needed. Add appropriate calls to Q.
_app.templates[P.templateID].find('[data-bind]').each(function()	{

	var $focusTag = $(this);
	var eleid = $focusTag.attr('id') ? $focusTag.attr('id') : ''; //element id. default to blank. used in prodlists.
		
//proceed if data-bind has a value (not empty).
	if(_app.u.isSet($focusTag.attr('data-bind'))){
		
		var bindData = _app.renderFunctions.parseDataBind($focusTag.attr('data-bind')) ;
//		_app.u.dump(bindData);
		var namespace = bindData['var'].split('(')[0];
		var attribute = _app.renderFunctions.parseDataVar(bindData['var']);
//these get used in prodlist and subcat elements (anywhere loadstemplate is used)
		bindData.templateID = bindData.loadsTemplate;
		bindData.parentID = $focusTag.attr('id');


//handle all the queries that are specific to a product.
//by now the product info, including variations, inventory and review 'should' already be in memory (showProd has been executed)
// the callback, showPageContent, does not run transmogrify over the product data. the lists are handled through buildProdlist, so if any new attributes
// are supported that may require a request for additional data, something will need to be added to showPageContent to handle the display.
// don't re-render entire layout. Inefficient AND will break some extensions, such as powerreviews.
		if(P.pid)	{
			if(bindData.format == 'productList')	{
//				_app.u.dump(" -> "+attribute+": "+_app.data['appProductGet|'+P.pid]['%attribs'][attribute]);
				if(_app.u.isSet(_app.data['appProductGet|'+P.pid]['%attribs'][attribute]))	{ 
//bindData is passed into buildProdlist so that any supported prodlistvar can be set within the data-bind. (ex: withInventory = 1)
					bindData.csv = _app.ext.store_prodlist.u.handleAttributeProductList(_app.data['appProductGet|'+P.pid]['%attribs'][attribute]);
//					_app.u.dump("bindData: "); _app.u.dump(bindData);
					numRequests += _app.ext.store_prodlist.u.buildProductList(bindData);
					}
				}

			else if(namespace == 'product')	{
				//do nothing here, but make sure the 'else' for unrecognized namespace isn't reached.
				}
			else	{
				$('#globalMessaging').append(_app.u.formatMessage("Uh oh! unrecognized namespace ["+namespace+"] used on attribute "+attribute+" for pid "+P.pid));
				}
			}// /p.pid
		else	{
			_app.u.dump("Uh oh! Product ID not passed into beachmart.u.getCrossSellers");
			}


		} //ends isset(databind).
	}); //ends each
				return numRequests;
				}, //buildQueriesFromTemplate
		




				
//_app.ext.beachmart.u.handleMinicartUpdate();	THIS IS OUTDATED. SEE SAME FUNCTION IN QUICKSTART.JS TO UPDATE IF NEEDED.		
			handleMinicartUpdate : function(tagObj)	{

				var itemCount = _app.u.isSet(_app.data[tagObj.datapointer].cart['data.item_count']) ? _app.data[tagObj.datapointer].cart['data.item_count'] : _app.data[tagObj.datapointer].cart['data.add_item_count']
//				_app.u.dump(" -> itemCount: "+itemCount);
//used for updating minicarts.
				$('.cartItemCount').text(itemCount);
				var subtotal = _app.u.isSet(_app.data[tagObj.datapointer].cart['data.order_subtotal']) ? _app.data[tagObj.datapointer].cart['data.order_subtotal'] : 0;
				var total = _app.u.isSet(_app.data[tagObj.datapointer].cart['data.order_total']) ? _app.data[tagObj.datapointer].cart['data.order_total'] : 0;
				$('.cartSubtotal').text(_app.u.formatMoney(subtotal,'$',2,false));
				$('.cartTotal').text(_app.u.formatMoney(total,'$',2,false));

				}, //handleMinicartUpdate
			

//will minimize the upsell container and switch any 'hide accessories' buttons to 'show'.
			hideCartUpsell : function()	{
				$('.upsellTD').hide();
				$('.cartSummaryTotalsContainer').width('99%');
				this.handleAccessoryButtons();
				},

//Adds all the  click events to the show and hide upsell buttons.
//also adds the upsell (accessories) for the most recently added item in the cart that qualifies (has accessories)
			handleCartUpSell : function()	{
				_app.u.dump("BEGIN beachmart.u.handleCartUpSell");
//orig var		var stuff = _app.data.cartDetail.stuff;
				var varsCart = _app.data["cartDetail|"+_app.model.fetchCartID()];
				var stuff = varsCart['@ITEMS'];
				var L = stuff.length;

				_app.u.dump(" -> L: "+L);
				var safeID; //recycled. an html/jquery safe version of the stid (which is used for the li id in the cart)
				var stid,$li; //shortcut. recycled.
				var useIndex = false; //will be set to true once 1 product that has options populates the upsell panel
				//cartViewer_TESTD409EV02
//go through cart backwars so that the more recent items added to the cart are likely to have their accessories shown.
//this'll increase the likelyhood that the accessories that show up the user hasn't seen before.
//there is no 'break' in the loop after a success because data-hasaccessories needs to be set.
//data-hasaccessories is used in showUpsellItemsInCart
				for(var i = L-1; i >= 0; i -= 1)	{
					stid = stuff[i].stid;
					safeID = 'cartViewer_'+_app.u.makeSafeHTMLId(stid);
					_app.u.dump(" -> "+i+": "+stid+" and safeID: "+safeID);
					$li = $('#'+safeID);
					if(_app.u.isSet(stuff[i].full_product['zoovy:accessory_products']))	{
						$li.attr('data-hasaccessories','true');

						if(useIndex == false)	{
							//first match for item in cart that has accessories. populate the upsell list.
							//can't execute the showUpsellItemsInCart here because the data-hasaccessories is needed on all product first and it hasn't been added.
							useIndex = i;
							}
						}
					else	{
						$li.attr('data-hasaccessories','false'); 
						}
					}
				_app.u.dump(" -> useIndex: "+useIndex);
//index could be 0, so check for false.
				if(useIndex !== false)	{
					this.showUpsellItemsInCart(stuff[useIndex].stid,stuff[useIndex].full_product['zoovy:accessory_products'].split(','));
					}
				else	{
					this.hideCartUpsell();
					}

				},

/*
The bulk of the accessories display code is here so that this function can be executed onClick for the 'show accessories' in the list itself.

*/
			showUpsellItemsInCart : function(stid,P)	{
				_app.u.dump("BEGIN beachmart.u.showUpsellItemsInCart");
				_app.u.dump(" -> stid: "+stid);
				_app.u.dump(P);
				var prodArray = new Array(); //product array

				$('.upsellTD').show().removeClass('loadingBG'); //make sure upsell panel is visible. could get turned off by user. prodlisttemplate will have individual loading graphics.
				if(stid || P)	{
					if(typeof P == 'object')	{
						prodArray = P;
						}
					else if(typeof P == 'undefined')	{
						//stid was passed, not the csv. go get csv.
						var stuffIndex = Number(_app.ext.store_cart.u.getStuffIndexBySTID(stid));
//						_app.u.dump(" -> stuffIndex: "+stuffIndex);
//						_app.u.dump(" -> accessories: ");
//						_app.u.dump(_app.data.cartDetail.stuff[stuffIndex].full_product['zoovy:accessory_products']);
						if(stuffIndex >= 0)	{
//							_app.u.dump("GOT HERE");
							var varsCart = _app.data["cartDetail|"+_app.model.fetchCartID()];
							prodArray = varsCart.stuff[stuffIndex].full_product['zoovy:accessory_products'].split(',');
//							_app.u.dump(" -> prodArray:"); _app.u.dump(prodArray);

							}
						}
					else	{
						_app.u.dump("WARNING! unknown or empty parameter passed into beachmart.u.showUpsellItemsInCart. P follows:");
						_app.u.dump(P);
						}
						
					if(prodArray.length > 0)	{
						safeID = 'cartViewer_'+_app.u.makeSafeHTMLId(stid);
						this.handleAccessoryButtons();
	
						_app.ext.store_prodlist.u.buildProductList({'csv':prodArray,'parentID':'upsellList','templateID':'productListTemplateBundle','hide_multipage':true});
						$('#'+safeID+' .hideAccessoriesBtn').show();
						$('#'+safeID+' .showAccessoriesBtn').hide();
						}
					else	{
						_app.u.dump("WARNING! beachmart.u.showUpsellItemsInCart received input stid AND/OR p but could not generate a prodlist");
						_app.u.dump(" -> stid: "+stid);
						_app.u.dump(P);
						}
					}
				else	{
					_app.u.dump("WARNING! CSV not defined in beachmart.u.showUpsellItemsInCart.");
					}

				},





//This will set all 'show' buttons to off. It will also set the 'hide' button hidden if the item has no accessories.
//this is only for handling state changes.  The click events are added in handleCartUpSell. If the events are handled here, they'll get applied multiple times
//because this function gets executed with each click.
			handleAccessoryButtons : function()	{
				var $stuffList = $('#cartStuffList');
		
				$('.hideAccessoriesBtn',$stuffList).hide(); //hide all the 'hide accessories' buttons
				$stuffList.children().each(function(index){
//					_app.u.dump(" -> index: "+index);
//					_app.u.dump($(this).attr('id'));
//					_app.u.dump(" -> $(this).attr('data-hasaccessories'): "+$(this).attr('data-hasaccessories'));
					//data-hasaccessories is set in handleCartUpSell				
					if($(this).attr('data-hasaccessories') == 'true')	{
						$('.showAccessoriesBtn',$(this)).show(); //only show the 'show accessories' button if the item has accessories.
						}
					else	{
						$('.showAccessoriesBtn',$(this)).hide(); //make sure the 'show accessories' button is hidden if the item has no accessories.
						}
					});
				},



/*
NOTE
updateCartSummary and updateCartQty are here because a different callback was needed for the cartTemplate to get the upsell feature to work.
once he goes full blown app, this probably won't be necessary anymore. The cross selling code will get executed as part of cartTemplates.onCompletes.
*/


			updateCartSummary : function()	{
				$('#cartTemplateCostSummary').empty().addClass('loadingBG');
				_app.calls.refreshCart.init({'callback':'handleCart','parentID':'modalCartContents','extension':'beachmart','templateID':'cartTemplate'},'immutable');
//don't set this up with a getShipping because we don't always need it.  Add it to parent functions when needed.
				},




			updateCartQty : function($input,tagObj)	{
				
				var stid = $input.attr('data-stid');
				var qty = $input.val();
				
				if(stid && qty && !$input.hasClass('disabled'))	{
					$input.attr('disabled','disabled').addClass('disabled').addClass('loadingBG');
					_app.u.dump('got stid: '+stid);
//some defaulting. a bare minimum callback needs to occur. if there's a business case for doing absolutely nothing
//then create a callback that does nothing. IMHO, you should always let the user know the item was modified.
//you can do something more elaborate as well, just by passing a different callback.
					tagObj = $.isEmptyObject(tagObj) ? {} : tagObj;
					tagObj.callback = tagObj.callback ? tagObj.callback : 'updateCartLineItem';
					tagObj.extension = tagObj.extension ? tagObj.extension : 'store_cart';
					tagObj.parentID = 'cartViewer_'+_app.u.makeSafeHTMLId(stid);
/*
the request for quantity change needs to go first so that the request for the cart reflects the changes.
the dom update for the lineitem needs to happen last so that the cart changes are reflected, so a ping is used.
*/
					_app.ext.store_cart.calls.cartItemUpdate.init(stid,qty);
					this.updateCartSummary();
//lineitem template only gets updated if qty > 1 (less than 1 would be a 'remove').
					if(qty >= 1)	{
						_app.calls.ping.init(tagObj,'immutable');
						}
					else	{
						$('#cartViewer_'+_app.u.makeSafeHTMLId(stid)).empty().remove();
						}
					_app.model.dispatchThis('immutable');
					}
				else	{
					_app.u.dump(" -> a stid ["+stid+"] and a quantity ["+qty+"] are required to do an update cart.");
					}
				},




//obj currently supports one param w/ two values:  action: modal|message
			handleAddToCart : function(formID,obj)	{


if(typeof obj != 'object')	{
	obj = {'action':'message'}
	}

//_app.u.dump("BEGIN store_product.calls.cartItemsAdd.init")
$('#'+formID+' .atcButton').addClass('disabled').attr('disabled','disabled');
if(!formID)	{
	//app error
	}
else	{
	var pid = $('#'+formID+'_product_id').val();
	if(_app.ext.store_product.validate.addToCart(pid))	{
//this product call displays the messaging regardless, but the modal opens over it, so that's fine.
		_app.ext.store_product.calls.cartItemsAdd.init(formID,{'callback':'itemAddedToCart','extension':'beachmart'});
		if(obj.action == 'modal')	{
			_app.ext.store_cart.u.showCartInModal('cartTemplate');
			_app.calls.refreshCart.init({'callback':'handleCart','extension':'beachmart','parentID':'modalCartContents','templateID':'cartTemplate'},'immutable');
			}
		else	{
			_app.calls.refreshCart.init({'callback':'updateMCLineItems','extension':'beachmart'},'immutable');
			}
		_app.model.dispatchThis('immutable');
		}
	else	{
		$('#'+formID+' .atcButton').removeClass('disabled').removeAttr('disabled');
		}
	}
return r;				





				}, //handleAddToCart

//this function should handle all the display logic for Time in Transit. everything that gets enabled or disabled.
// //if(prodAttribs['user:prod_shipping_msg'] == 'Ships Today by 12 Noon EST')

			getTransitInfo : function(pid,data,index)	{
//			_app.u.dump("BEGIN beachmart.u.getTransitInfo");

var prodAttribs = _app.data['appProductGet|'+pid]['%attribs'];

var $r = $("<div class='shipSummaryContainer' \/>"); //what is returned. jquery object of shipping info.
$r.append("<span class='shipMessage'></span>" 
			+	"<span class='estimatedArrivalDate'></span>"
			+	"<span title='Click to change destination zip code' class='deliveryLocation zlink pointer'></span>"
			+	"<div class='deliveryMethod'></div>"
			+	"<div class='expShipMessage'></div>"
		);

var hour = Number(data.cutoff_hhmm.substring(0,2)) + 3; //add 3 to convert to EST.
var minutes = data.cutoff_hhmm.substring(2);
	
	//used to indicate backorder rule should be used (all noexpedite, ground, future arrival date)
	//0=not backorder, 1=backorder w/ salerank ship date, 3=backorder w/ no salerank ship date
var backorder = 0;

	//if item is backorder item, indicate w/ attr data-backorderdate on container for estimate date
if(prodAttribs['is:user1'] == 1 || prodAttribs['is:preorder'] == 1 || prodAttribs['zoovy:prod_is_tags'].indexOf('IS_DISCONTINUED') != -1) {
	if(_app.ext.beachmart_dates.u.appTimeNow()) { //set backorderdate value according to whether or not salesrank date can be determined
		//appTimeNow function broken because no _app.data.time.unix if( (prodAttribs['zoovy:prod_salesrank'] != undefined || prodAttribs['zoovy:prod_salesrank'] > -1)  && prodAttribs['zoovy:prod_salesrank'] > _app.ext.beachmart_dates.u.millisecondsToYYYYMMDD(_app.ext.beachmart_dates.u.appTimeNow())) {
		if( (prodAttribs['zoovy:prod_salesrank'] != undefined || prodAttribs['zoovy:prod_salesrank'] > -1)  && prodAttribs['zoovy:prod_salesrank'] > _app.ext.beachmart_dates.u.millisecondsToYYYYMMDD(new Date(new Date().getTime()))) {
			$('.shipMessage',$r).append("Order today for arrival on ");
			backorder = 1; //if date, then = 1
		} else {
			backorder = 2; //if not date, then = 2
		}
	} else { backorder = 2; } //if app date cannot be determined, then = 2
}
else if(prodAttribs['user:prod_shipping_msg'] == "Ships Today by 12 Noon EST"){
	if(_app.data.time && _app.data.time.unix)	{
		var date = new Date(_app.data.time.unix*1000);
		var hours = date.getHours();
		}
	$('.shipMessage',$r).append("Order "+(hours < 9 ? 'today' : 'tomorrow')+" before "+hour+":"+minutes+"EST for arrival on ");
	}
else	{
	$('.shipMessage',$r).append("Order today for arrival on ");
	}

	
if(prodAttribs['user:prod_ship_expavail'] && prodAttribs['user:prod_ship_expavail'] == 1 && backorder == 0)	{
//if expedited shipping is not available, no other methods show up (will ship ground)
	$('.deliveryMethod',$r).append(data['@Services'][index]['method'])
// MARK wants only available shipping methods for product to show, but they aren't listed in the product record, will need another call to grab this info.
//	$('.deliveryMethod',$r).append(" <span class='zlink'>(Need it faster?)</span>").addClass('pointer').click(function(){
//		_app.ext.beachmart.a.showShipGridInModal('appShippingTransitEstimate');
		//_app.ext.beachmart.a.showShipGridInModal('cartShippingMethods');
//		});
	}
else	{
	_app.u.dump(" -> prodAttribs['user:prod_ship_expavail']: "+prodAttribs['user:prod_ship_expavail']);
	$('.expShipMessage',$r).append("<span class='zhint inconspicuouseZhint'>Expedited shipping not available for this item</span>");
	}

	//check backorder status to determine which date to use for arrival date
if(backorder == 1) {
	var futureShipDate = _app.ext.beachmart_dates.u.getFutureDate(prodAttribs['zoovy:prod_salesrank'], data['@Services'][index]['arrival_yyyymmdd'].slice(0,8));
	$('.estimatedArrivalDate',$r).append(_app.ext.beachmart.u.yyyymmdd2Pretty(futureShipDate)+" to");
} else if (backorder == 2) {
	_app.u.dump('The shipping time could not be determined due to a problem obtaining the date or salesrank value')
} else {
	$('.estimatedArrivalDate',$r).append(_app.ext.beachmart.u.yyyymmdd2Pretty(data['@Services'][index]['arrival_yyyymmdd'])+" to");
}

var varsCart = _app.data["cartDetail|"+_app.model.fetchCartID()];
if(varsCart && varsCart.ship.city && backorder != 2)	{
	$('.deliveryLocation',$r).append(" "+varsCart.ship.city);
	}
if(varsCart && varsCart.ship.region && backorder != 2)	{
	$('.deliveryLocation',$r).append(" "+varsCart.ship.region);
	}
if	(varsCart && varsCart.ship.postal && backorder != 2)	{
	$('.deliveryLocation',$r).append(" "+varsCart.ship.postal+" (change)");
	}
else if (backorder != 2){
	$('.deliveryLocation',$r).append(" (enter zip) ");
	}
$('.deliveryLocation',$r).click(function(){_app.ext.beachmart.a.showZipDialog()});
			return $r;
			}, //getTransitInfo
			
			handleToolTip : function()	{
		//		_app.u.dump("BEGIN beachmart.u.handleToolTip.");
				$('.tipify',$('#appView')).each(function(){
					var $this = $(this);
					$this.parent().css('position','relative'); //this is what makes the tooltip appear next to the link instead of off in space.
					$this.mouseover(function(){	$('.toolTip',$this.parent()).show();}).mouseout(function(){	$('.toolTip',$this.parent()).hide();});
					});
				},
			

//pass in the @services object in a appShippingTransitEstimate and the index in that object of the fastest shipping method will be returned.
			getShipMethodByID : function(servicesObj,ID)        {
				var r = false; //what is returned. will be index of data object
				if(typeof servicesObj == 'object')        {
					var L = servicesObj.length;
					for(var i = 0; i < L; i += 1)        {
						if(servicesObj[i].id == ID)        {
							r = i;
							break; //no need to continue in loop.
							}	
						}
					}
				else {
					_app.u.dump("WARNING! servicesObj passed into getFastestShipMethod is empty or not an object. servicesObj:");
					_app.u.dump(servicesObj);
					}
//              _app.u.dump(" -> fastest index: "+r);
				return r;
				}, //getShipMethodByID
				
				getSlowestShipMethod : function(servicesObj) {
					var r = false; //what is returned, index of ground shipping service, or false
					if(typeof servicesObj == 'object')	{
						var L = servicesObj.length;
						for(var i = 0; i < L; i += 1)	{
							if(servicesObj[i].method == 'UPS Ground')	{
								r = i;
								break; //no need to continue in loop.
							}
						}
					}
					return r;
				},

//pass in the @services object in a appShippingTransitEstimate and the index in that object of the fastest shipping method will be returned.
			getFastestShipMethod : function(servicesObj)	{
				var r = false; //what is returned. will be index of data object
				if(typeof servicesObj == 'object')	{
					var L = servicesObj.length;
					for(var i = 0; i < L; i += 1)	{
						if(servicesObj[i]['is_fastest'])	{
							r = i;
							break; //no need to continue in loop.
							}
						}
					}
				else	{
					_app.u.dump("WARNING! servicesObj passed into getFastestShipMethod is empty or not an object. servicesObj:");
					_app.u.dump(servicesObj);
					}
//				_app.u.dump(" -> fastest index: "+r);
				return r;
				},
			getDOWFromDay : function(X)	{
//				_app.u.dump("BEGIN beachmart.u.getDOWFromDay ["+X+"]");
				var weekdays = new Array('Sun','Mon','Tue','Wed','Thu','Fri','Sat');
				return weekdays[X];
				},
			yyyymmdd2Pretty : function(str)	{
				var r = false;
				if(Number(str))	{
					var year = str.substr(0,4)
					var month = Number(str.substr(4,2));
					var day = str.substr(6,2);
					var d = new Date();
					d.setFullYear(year, (month - 1), day)
//					_app.u.dump(" date obj: "); _app.u.dump(d);
//					_app.u.dump(" -> YYYYMMDD2Pretty ["+str+"]: Y["+year+"]  Y["+month+"]  Y["+day+"] ");
					r = this.getDOWFromDay(d.getDay())+" "+month+"/"+day
					}
				else	{
					_app.u.dump("WARNING! the parameter passed into YYYYMMDD2Pretty is not a numder ["+str+"]");
					}
				return r;
				} //yyyymmdd2Pretty 
		
			} //u

		} //r object.
	return r;
	}