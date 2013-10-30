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



var beachmart_cartEstArrival = function() {
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
				app.u.dump('BEGIN admin_orders.callbacks.init.onError');
				}
			},
			
			showTransitTimes : {
				
				onSuccess : function(tagObj) {
					app.u.dump("BEGIN beachmart_cartEstArrival.callbacks.showTransitTimes");
					//use cutoff from response, not product.
					//var $container = $('#cartStuffList_'+app.u.makeSafeHTMLId(SKU));
					var $container = $('#cartStuffList_'+app.u.makeSafeHTMLId(tagObj.stid));
		
					app.u.dump(" -> $container.length: "+$container.length);
					var data = app.data[tagObj.datapointer]; //shortcut.		
					if(!$.isEmptyObject(data['@Services'])) {
						app.u.dump(" -> @Services is not empty");
						var index = app.ext.beachmart.u.getShipMethodByID(data['@Services'],'UGND');
						if(!index) {
							index = app.ext.beachmart.u.getFastestShipMethod(data['@Services']);
						}
						app.u.dump(" -> index: "+index);
//index could be false if no methods were available. or could be int starting w/ 0
						if(index >= 0) {
							$('.transitContainer',$container).empty().append(app.ext.beachmart_cartEstArrival.u.getTransitInfo(tagObj.pid,data,index)); //empty first so when reset by zip change, no duplicate info is displayed.
						}
						
					}
					
					$('.cartShippingInformation .loadingBG',$container).removeClass('loadingBG');
					$('.loadingText',$container).hide();
				},
				onError : function(responseData,uuid) {
//					alert("got here");
//error handling is a case where the response is delivered (unlike success where datapointers are used for recycling purposes)
					app.u.handleErrors(responseData,uuid); //a default error handling function that will try to put error message in correct spot or into a globalMessaging element, if set. Failing that, goes to modal.
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

			}, //renderFormats
////////////////////////////////////   UTIL [u]   \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

//utilities are typically functions that are exected by an event or action.
//any functions that are recycled should be here.
		u : {
		
			initEstArrival : function(infoObj, stid){

				app.u.dump("BEGIN beachmart_cartEstArrival.u.initEstArrival");
				//window.SKU = infoObj.pid; app.u.dump("GLOBAL SKU IS A TEMPORARY SOLUTION!!!",'warn'); //was originally written in a hybrid store. need to get this more app friendly.
				var pid = infoObj.pid;
				var zip;
				if(app.data.cartDetail && app.data.cartDetail.ship && app.data.cartDetail.ship.postal) {
					zip = app.data.cartDetail.ship.postal;
				}
				/*
				navigator.geolocation is crappily supported. appears there's no 'if user hits no' support to execute an alternative. at least in FF.
				look at a pre-20120815 copy of this lib for geocoding
				*/
					//if there is a zip, getShipQuotes, otherwise tell user to enter their zip
				if(zip) {	
					app.u.dump(" -> zip code is cart ["+zip+"]. Use it");
					app.ext.beachmart_cartEstArrival.u.getShipQuotes(zip, pid, stid); //function also gets city/state from googleapi
				}
				else {
					app.u.dump(" -> no zip code entered. Info will be added when zip is entered.");
					$('.cartPutLoadingHere.loadingBG', '#cartStuffList_'+stid).removeClass('loadingBG').append('Enter your zip-code in the field at the bottom of the cart to see shipping estimates.');
				//	app.u.dump(" -> no zip code entered. request via whereAmI");

				//	app.calls.whereAmI.init({'callback':'handleWhereAmI','extension':'beachmart'},'passive');
				//	app.model.dispatchThis('mutable');
				}

			},
			
			getShipQuotes : function(zip, pid, stid)	{
				app.u.dump("BEGin beachmart_cartEstArrival.u.getShipQuotes");
				var $context = $(app.u.jqSelector('#','cartStuffList_'+stid));
				//here, inventory check is done instead of isProductPurchaseable, because is used specifically to determine whether or not to show shipping.
				// the purchaseable function takes into account considerations which have no relevance here (is parent, price, etc).
//				app.u.dump(app.data['appProductGet|'+pid]);
				if(app.ext.store_product.u.getProductInventory(pid) <= 0){
					//no inventory. Item not purchaseable. Don't get shipping info
					$('.cartShippingInformation .cartPutLoadingHere',$context).removeClass('loadingBG').hide();
					$('.timeInTransitMessaging',$context).append("Inventory not available.");
					}
				else if(app.data['appProductGet|'+pid] && app.data['appProductGet|'+pid]['%attribs']['is:preorder'])	{
					this.handlePreorderShipDate();
					}
				else if(zip) {
				//	app.u.dump(" -> zip: "+zip);
				//if the city or the state is already available, don't waste a call to get additional info.
				//this block is also executed for zip update, so allow reset.
					if(app.data.cartDetail && app.data.cartDetail.ship && (!app.data.cartDetail.ship.city && !app.data.cartDetail.ship.region))	{
						app.ext.beachmart.u.fetchLocationInfoByZip(zip);
					}
					var prodArray = new Array();
					prodArray.push(pid);
					if(app.data.cartDetail.ship) {
						app.data.cartDetail.ship.postal = zip; //update local object so no request for full cart needs to be made for showTransitTimes to work right.
					}
					else {
						app.data.cartDetail.ship = {'postal' : zip};
					}
					app.calls.cartSet.init({"ship/postal":zip},{},'passive');
					app.ext.beachmart.calls.time.init({},'passive');
					app.ext.beachmart.calls.appShippingTransitEstimate.init({"@products":prodArray,"ship_postal":zip,"ship_country":"US"},{'callback':'showTransitTimes','extension':'beachmart_cartEstArrival','stid':stid,'pid':pid},'passive');
				//	app.data.cartDetail['data.ship_zip'] = app.data[tagObj.datapointer].zip; //need this local for getShipQuotes's callback.

					app.model.dispatchThis('passive'); //potentially a slow request that should interfere with the rest of the load.
					


					//go get the shipping rates.

				}
				else {
					app.u.dump("WARNING! no zip passed into getShipQuotes");
				}
				
			}, //getShipQuotes
			
			
			getTransitInfo : function(pid,data,index)	{
				app.u.dump("BEGIN beachmart_cartEstArrival.u.getTransitInfo");

				var prodAttribs = app.data['appProductGet|'+pid]['%attribs'];

				var $r = $("<div class='shipSummaryContainer' \/>"); //what is returned. jquery object of shipping info.
				$r.append("<span class='shipMessage'></span><span class='estimatedArrivalDate'></span><span title='Click to change destination zip code' class='deliveryLocation'></span><div class='deliveryMethod'></div><div class='expShipMessage'></div>");

				var hour = Number(data.cutoff_hhmm.substring(0,2)) + 3; //add 3 to convert to EST.
				var minutes = data.cutoff_hhmm.substring(2);

				if(prodAttribs['user:prod_shipping_msg'] == "Ships Today by 12 Noon EST"){
					if(app.data.time && app.data.time.unix)	{
						var date = new Date(app.data.time.unix*1000);
						var hours = date.getHours();
						}
					$('.shipMessage',$r).append("Order "+(hours < 9 ? 'today' : 'tomorrow')+" before "+hour+":"+minutes+"EST for arrival on ");
					}
				else	{
					$('.shipMessage',$r).append("Order today for arrival on ");
					}

				if(prodAttribs['user:prod_ship_expavail'] && prodAttribs['user:prod_ship_expavail'] == 0)	{
				//if expedited shipping is not available, no other methods show up (will ship ground)
					$('.deliveryMethod',$r).append(data['@Services'][index]['method'])
					$('.deliveryMethod',$r).append("<span class='zlink'> (Need it faster?)</span>").addClass('pointer').click(function(){
						app.ext.beachmart.a.showShipGridInModal('appShippingTransitEstimate');
						});
					}
				else	{
					app.u.dump(" -> prodAttribs['user:prod_ship_expavail']: "+prodAttribs['user:prod_ship_expavail']);
					$('.expShipMessage',$r).append("<span class='zhint inconspicuouseZhint'>Expedited shipping not available for this item</span>");
					}

					
				$('.estimatedArrivalDate',$r).append(app.ext.beachmart.u.yyyymmdd2Pretty(data['@Services'][index]['arrival_yyyymmdd'])+" to");

					if(app.data.cartDetail.ship.city)	{
						//$('.deliveryLocation',$r).append(" to "+app.data.cartDetail.ship.city+" "+app.data.cartDetail.ship.city+" (change)");
						$('.deliveryLocation',$r).append(" "+app.data.cartDetail.ship.city+"");
					}
					if(app.data.cartDetail.ship.region)	{
						//$('.deliveryLocation',$r).append(" to "+app.data.cartDetail.ship.city+" "+app.data.cartDetail.ship.region+" (change)");
						$('.deliveryLocation',$r).append(" "+app.data.cartDetail.ship.region+"");
					}
					if(app.data.cartDetail.ship.postal)	{
						//$('.deliveryLocation',$r).append(" to "+app.data.cartDetail.ship.city+" "+app.data.cartDetail.ship.region+" (change)");
						$('.deliveryLocation',$r).append(" "+app.data.cartDetail.ship.postal+"");
					}
				else{
					$('.deliveryLocation',$r).append(" (enter zip) ")
					}
				//$('.deliveryLocation',$r).click(function(){app.ext.beachmart.a.showZipDialog()})
							return $r;
			}, //getTransitInfo
			
		
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