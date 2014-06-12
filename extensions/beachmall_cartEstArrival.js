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



var beachmall_cartestarrival = function(_app) {
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
				_app.u.dump('BEGIN admin_orders.callbacks.init.onError');
				}
			},
			
/*		startExtension : {
			onSuccess : function() {
				_app.templates.productTemplate.on('complete.beachmall_store',function(event,$ele,P) {
							_app.ext.beachmart.u.initEstArrival(P);
				});
			}
			onError : {
				_app.u.dump(
			}
		},
*/			
		showTransitTimes : {
			
			onSuccess : function(tagObj) {
				_app.u.dump("BEGIN beachmall_cartestarrival.callbacks.showTransitTimes");
				var $container = false; //transit info. will end up here
					//use cutoff from response, not product
					//but find $container by matching stid added to it in index w/ response stid
				$('.cartItemWrapper','#modalCart').each(function(){ //look at each cartItemWrapper in cart
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
					index = _app.ext.beachmart.u.getSlowestShipMethod(data['@Services']);
					var ground = true; //true will bypass additional shipping methods later
					_app.u.dump(" -> index: "+index);
				}
				else {
					var ground = false;
					var thisCartDetail = _app.data['cartDetail|'+_app.model.fetchCartID()];
					_app.u.dump(" -> $container.length: "+$container.length);
					if(!$.isEmptyObject(data['@Services'])) {
						_app.u.dump(" -> @Services is not empty");
						var index = _app.ext.beachmall_cartestarrival.u.getShipMethodByID(data['@Services'],thisCartDetail.want.shipping_id);
						_app.u.dump(thisCartDetail.want.shipping_id);
						_app.u.dump(index);
						if(!index) {
						//	index = _app.ext.beachmart.u.getFastestShipMethod(data['@Services']);
							index = _app.ext.beachmart.u.getSlowestShipMethod(data['@Services']);
						}
						_app.u.dump(" -> index: "+index);
						
					}
				}
					//index could be false if no methods were available. or could be int starting w/ 0
				if(index >= 0) {
/*prob w/ $container selector*/						$('.transitContainer',$container).empty().append(_app.ext.beachmall_cartestarrival.u.getTransitInfo(tagObj,data,index,ground)); //empty first so when reset by zip change, no duplicate info is displayed.
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

			}, //Actions

////////////////////////////////////   RENDERFORMATS    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

//renderFormats are what is used to actually output data.
//on a data-bind, format: is equal to a renderformat. extension: tells the rendering engine where to look for the renderFormat.
//that way, two render formats named the same (but in different extensions) don't overwrite each other.
		renderFormats : {
		
			safestid : function($tag, data) {
				if(data.value && data.value.stid) {
					$tag.attr('data-geoSTID',_app.u.makeSafeHTMLId(data.value.stid));
				}
			}

			}, //renderFormats
////////////////////////////////////   UTIL [u]   \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

//utilities are typically functions that are exected by an event or action.
//any functions that are recycled should be here.
		u : {
			
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
					else {
						_app.u.dump("WARNING! no shipping method of that ID was found.");
						}
					}
				else {
					_app.u.dump("WARNING! attempting to getShipMethodByID but cartShippingMethods or cartShippingMethods.@methods not available");
					}
				
//				_app.u.dump(" -> fastest index: "+r);
				return r;
				}, //getShipMethodByID
				
		
			initEstArrival : function(infoObj, stid){

				_app.u.dump("BEGIN beachmall_cartestarrival.u.initEstArrival");
				//window.SKU = infoObj.pid; _app.u.dump("GLOBAL SKU IS A TEMPORARY SOLUTION!!!",'warn'); //was originally written in a hybrid store. need to get this more app friendly.
				var pid = infoObj.pid;
				var zip;
				var thisCartDetail = _app.data['cartDetail|'+_app.model.fetchCartID()];
				if(thisCartDetail && thisCartDetail.ship && thisCartDetail.ship.postal) {
					dump('----in if zip');
					zip = thisCartDetail.ship.postal;
				}
				dump('----Why no zip'); dump(thisCartDetail); dump(thisCartDetail.ship); dump(thisCartDetail.ship.postal); dump(zip);
				/*
				navigator.geolocation is crappily supported. appears there's no 'if user hits no' support to execute an alternative. at least in FF.
				look at a pre-20120815 copy of this lib for geocoding
				*/
					//if there is a zip, getShipQuotes, otherwise tell user to enter their zip
				if(zip) {	
					_app.u.dump(" -> zip code is cart ["+zip+"]. Use it");
					_app.ext.beachmall_cartestarrival.u.getShipQuotes(zip, pid, stid); //function also gets city/state from googleapi
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
				_app.u.dump("BEGin beachmall_cartestarrival.u.getShipQuotes");
			//	var $context = $(_app.u.jqSelector('#','cartStuffList_'+stid));
				var $context = $(_app.u.jqSelector('.productListTemplateCart[data-stid="'+stid+'"]'));
				
				//here, inventory check is done instead of isProductPurchaseable, because is used specifically to determine whether or not to show shipping.
				// the purchaseable function takes into account considerations which have no relevance here (is parent, price, etc).
//				_app.u.dump(_app.data['appProductGet|'+pid]);
				if(_app.ext.store_product.u.getProductInventory(_app.data['appProductGet|'+pid]) <= 0){ dump('---if 0 inventory');
					//no inventory. Item not purchaseable. Don't get shipping info
					$('.cartShippingInformation .cartPutLoadingHere',$context).removeClass('loadingBG').hide();
					$('.timeInTransitMessaging',$context).append("Inventory not available.");
					}
				else if(_app.data['appProductGet|'+pid] && _app.data['appProductGet|'+pid]['%attribs']['is:preorder'])	{ dump('---else if (preorder)');
					_app.ext.beachmall_cartestarrival.u.handlePreorderShipDate($context,pid);
					}
				else if(zip) { dump('----- else if (zip)');
					var thisCartDetail = _app.data['cartDetail|'+_app.model.fetchCartID()];
					dump(" -> zip: "+zip); dump(thisCartDetail.ship.city); dump(thisCartDetail.ship.region);
				//if the city or the state is already available, don't waste a call to get additional info.
				//this block is also executed for zip update, so allow reset.
	//				if(thisCartDetail && thisCartDetail.ship && (!thisCartDetail.ship.city || !thisCartDetail.ship.region))	{
	//					_app.ext.beachmart.u.fetchLocationInfoByZip(zip);
	//				}
					var prodArray = new Array();
					prodArray.push(pid);
						//removed this, at this point there should already be a zip in the cartDetail...
			//		if(thisCartDetail.ship) {
			//			thisCartDetail.ship.postal = zip; //update local object so no request for full cart needs to be made for showTransitTimes to work right.
			//		}
			//		else {
			//			thisCartDetail.ship = {'postal' : zip};
			//		}
			//		_app.ext.cco.calls.cartSet.init({"ship/postal":zip,"_cartid":_app.model.fetchCartID()});
					
					_app.ext.beachmart.calls.time.init({},'passive');
					_app.ext.beachmart.calls.appShippingTransitEstimate.init({"@products":prodArray,"ship_postal":zip,"ship_country":"US"},{'callback':'showTransitTimes','extension':'beachmall_cartestarrival','stid':stid,'pid':pid},'passive');
				//	thisCartDetail['data.ship_zip'] = _app.data[tagObj.datapointer].zip; //need this local for getShipQuotes's callback.

					_app.model.dispatchThis('passive'); //potentially a slow request that should interfere with the rest of the load.
					


					//go get the shipping rates.

				}
				else {
					_app.u.dump("WARNING! no zip passed into getShipQuotes");
				}
				
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
					message = "Will ship on "+_app.ext.beachmart.u.yyyymmdd2Pretty(product['%attribs']['zoovy:prod_salesrank'])

				$('.cartPutLoadingHere',$context).removeClass('loadingBG');
				//$('.loadingText',$container).hide();
				$('.transitContainer',$context).text(message);
			},
			
			
			getTransitInfo : function(tagObj,data,index,ground)	{
				_app.u.dump("BEGIN beachmall_cartestarrival.u.getTransitInfo"); dump(tagObj); dump(data);
				
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
						_app.ext.beachmart.a.showShipGridInModal('appShippingTransitEstimate','appShippingTransitEstimate', 'cart');
						});
						
					var $shipMethodsUL = $('.cartShipMethods', '#modalCart');
					if(_app.data.appShippingTransitEstimate && _app.data.appShippingTransitEstimate['@Services'] && !$shipMethodsUL.data('transitized')) {
						//_app.u.dump('@services: ----------------->'); _app.u.dump(_app.data.appShippingTransitEstimate['@Services']);
						_app.ext.beachmall_cartestarrival.u.addDatesToRadioButtons(_app.data.appShippingTransitEstimate['@Services'], $shipMethodsUL);
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
					$('.estimatedArrivalDate',$r).append(_app.ext.beachmart.u.yyyymmdd2Pretty(futureShipDate)+" to");
				} else {
					$('.estimatedArrivalDate',$r).append(_app.ext.beachmart.u.yyyymmdd2Pretty(data['@Services'][index]['arrival_yyyymmdd'])+" to");
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
							var $container = $('<span class="radioShipTime">(arrival on '+_app.ext.beachmart.u.yyyymmdd2Pretty(services[i]["arrival_yyyymmdd"])+')</span>');
							$(this).append($container);
							$('.cartTemplateShippingContainer').css('width','54%'); //make the shipping section wider to keep it all on one line
							$shipMethodsUL.data('transitized',true); //set data so this doesn't have to get called multiple times
							break; //once a match is found, no need to keep going
						}
					}
				});
			} //addDatesToRadioButtons
			
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