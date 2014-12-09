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





var beachmall_product = function(_app) {
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
			
			//renders redirect product on the product page
			renderRedirectProduct : {
				onSuccess:function(responseData){
					responseData.$container.tlc({'datapointer':responseData.datapointer,verb:"transmogrify",templateid:responseData.loadsTemplate}); 
				},
				onError:function(responseData){	
					_app.u.dump('Error in extension: beachmall_product.callbacks.renderRedirectProduct, response data follows: '); dump(responseData);
				}
			},
			
			showTransitTimes : {
				onSuccess : function(tagObj){
					_app.u.dump("BEGIN beachmall_product.callbacks.showTransitTimes");
					_app.u.dump(tagObj);
					//use cutoff from response, not product.
					var $container = $("#mainContentArea :visible:first");
//					_app.u.dump(" -> $container.length: "+$container.length);	dump(_app.data[tagObj.datapointer]);
					var data = _app.data[tagObj.datapointer]; //shortcut.
					if(!$.isEmptyObject(data['@Services']))	{
						_app.u.dump(" -> @Services is not empty");
						var index = _app.ext.beachmall_product.u.getShipMethodByID(data['@Services'],'UGND');
						if(!index) {
							index = _app.ext.beachmall_begin.u.getFastestShipMethod(data['@Services']);
						}
//						_app.u.dump(" -> index: "+index);
						//index could be false if no methods were available. or could be int starting w/ 0
						if(index >= 0)	{
							$('.transitContainer',$container).empty().append(_app.ext.beachmall_product.u.getTransitInfo(SKU,data,index)); //empty first so when reset by zip change, no duplicate info is displayed.
						}
					}
					else {
						var $tryAgain = $("<span class='pointer'>Transit times could not be retrieved at the moment (Try again)</span>");
						$('.transitContainer',$container).empty().append($tryAgain).click(function(){_app.ext.beachmall_begin.a.showZipDialog()}); 
					}
					$('.shippingInformation .loadingBG',$container).removeClass('loadingBG');
					$('.loadingText',$container).hide();	
				},
				onError : function(responseData,uuid)	{
					var $container = $("#mainContentArea :visible:first");
//					alert("got here");
					//error handling is a case where the response is delivered (unlike success where datapointers are used for recycling purposes)
					//_app.u.handleErrors(responseData,uuid); //a default error handling function that will try to put error message in correct spot or into a globalMessaging element, if set. Failing that, goes to modal.
					$('.transitContainer',$container).empty().anymessage(_app.u.youErrObject(""+responseData,uuid));
				}
			}, //showTransitTimes

		}, //callbacks



////////////////////////////////////   ACTION    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

//actions are functions triggered by a user interaction, such as a click/tap.
//these are going the way of the do do, in favor of app events. new extensions should have few (if any) actions.
		a : {

			scrollToRevealTab : function(pid,href) {
				dump('khgckgc');
				var $context = $ele.closest("[data-templateid='productTemplate']");
				$context.css('margin-top','100px');
				var $prodSizing = $(".tabbedProductContent",$context);
				setTimeout(function(){
					$("a[href="+href+"]",$context).mouseenter();
					$('html, body').animate({
						scrollTop: $prodSizing.offset().top
					}, 2000);
				},500);
				return false;
			},
		
		}, //Actions

////////////////////////////////////   RENDERFORMATS    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

//renderFormats are what is used to actually output data.
//on a data-bind, format: is equal to a renderformat. extension: tells the rendering engine where to look for the renderFormat.
//that way, two render formats named the same (but in different extensions) don't overwrite each other.
		renderFormats : {

			}, //renderFormats

			
////////////////////////////////////   TLC FORMATS    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

//renderFormats are what is used to actually output data.
//on a data-bind, format: is equal to a renderformat. extension: tells the rendering engine where to look for the renderFormat.
//that way, two render formats named the same (but in different extensions) don't overwrite each other.
		tlcFormats : {

			//pass in the sku for the bindata.value so that the original data object can be referenced for additional fields.
			// will show price, then if the msrp is MORE than the price, it'll show that and the savings/percentage.
			priceretailsavings : function(data,thisTLC)	{
				var o = ''; //output generated.
				var pData = data.globals.binds.var['%attribs'];
				var $tag = data.globals.tags[data.globals.focusTag];
//				dump("BEGIN beachmall_product.tlcFormats.priceRetailsSavings"); dump(pData);
	//use original pdata vars for display of price/msrp. use parseInts for savings computation only.
				var price = Number(pData['zoovy:base_price']);
				var msrp = Number(pData['zoovy:prod_msrp']);
				var priceModifier = Number(pData['user:prod_has_price_modifiers']);
//				_app.u.dump(" ->: priceMod: "+priceModifier); _app.u.dump(" -> price: "+price); 	_app.u.dump(" -> msrp: "+msrp);
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
						var variations = data.globals.binds.var['@variations'];
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
//							o += _app.u.formatMoney(msrp-price,'$',2,true)
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
				
				//if a product is discontinued, will add minimal info about the replacement and provide a link to it.
			addredirectproduct : function(data, thisTLC) {
				dump('REPLACEMENT PRODUCT: '); dump(data);
				var argObj = thisTLC.args2obj(data.command.args,data.globals); //this creates an object of the args
				var pid = data.globals.binds.var;
				if(pid) {
					var $tag = data.globals.tags[data.globals.focusTag];
					var obj = {
						pid : _app.u.makeSafeHTMLId(pid),
						"withVariations":1,
						"withInventory":1
					};
					
					var _tag = {								
						"callback":"renderRedirectProduct",		
						"extension":"beachmall_product",			
						"$container" : $tag,
						"loadsTemplate" : argObj.templateid
					};
					_app.calls.appProductGet.init(obj, _tag, 'immutable');
					_app.model.dispatchThis('immutable');
				}
			},
			
			//get product inventory and display in tag (called in redirect product template)
			showinv :function(data,thisTLC) {
				var prod = data.globals.binds.var;
				var $tag = data.globals.tags[data.globals.focusTag];
				var pid = _app.u.makeSafeHTMLId(prod.pid);
				if(prod['@inventory'] && prod['@inventory'][pid] && prod['@inventory'][pid].AVAILABLE) {
					dump(prod['@inventory'][pid].AVAILABLE);
					$tag.text("(" + prod['@inventory'][pid].AVAILABLE+ ") In Stock");
				}
			}, //showInv
			
			//hides geo location/time in transit and add to cart button if product is discontinued or not purchasable
			hidegeoelements : function(data, thisTLC) {
				//_app.u.dump('*********************'); _app.u.dump(data.value.pid); 
				var prod = data.globals.binds.var;
				var $tag = data.globals.tags[data.globals.focusTag];
				if(prod['%attribs'] && prod['%attribs']['zoovy:prod_is_tags']
					&& prod['%attribs']['zoovy:prod_is_tags'].indexOf('IS_DISCONTINUED') > 0) {
					$tag.hide();
					if($('.addToCartButton',$tag.parent())) {
						$('.addToCartButton',$tag.parent()).hide();
					}
				}
				else if (!_app.ext.store_product.u.productIsPurchaseable(prod.pid)){
					$tag.hide();	
					if($('.addToCartButton',$tag.parent())) {
						$('.addToCartButton',$tag.parent()).hide();
					}
				}
			},
			
			//will hide the add to cart button on product page if item has IS_DISCONTINUED tag
			discontinuedatc : function(data,thisTLC) {
				var discontinued = data.globals.binds.var;
				var $tag = data.globals.tags[data.globals.focusTag];
				var $context = $tag.closest('form');
				dump('START hideatc'); dump(data.value);
				if(discontinued.indexOf('IS_DISCONTINUED') != -1) {
					$tag.before("<div>Sorry! This item is not available for purchase.</div>");
					$tag.addClass('displayNone');
					$('[data-hide-discontinued]',$context).each(function(){
						$(this).addClass('displayNone');
					});
				} 
			},
			
			//hides time in transit/geo location section if item is a drop-shipped item
			//time in transit code checks this attrib also, and doesn't run if it's set.
			hideifdropship : function(data, thisTLC) {
				var dropship = data.globals.binds.var;
				var $tag = data.globals.tags[data.globals.focusTag];
				if(dropship) {
					$tag.before('<div>Expedited shipping not available for this item</div>');
					$tag.hide().css('display','none');
				}
			},
			
			//discontinuedatc might need to go here. 
			
			//will remove the add to cart button if the item is not purchaseable. Also sets button for backorder/preorder if those attribs present.
			addtocartbutton : function(data, thisTLC)	{
				var prod = data.globals.binds.var;
				var $tag = data.globals.tags[data.globals.focusTag];
//				_app.u.dump("BEGIN store_product.renderFunctions.addToCartButton");
				// add a success message div to be output before the button so that messaging can be added to it.
				// atcButton class is added as well, so that the addToCart call can disable and re-enable the buttons.
				$tag.before("<div class='atcSuccessMessage'><\/div>");
				var hasPreOrderPassed = prod['%attribs']['zoovy:prod_salesrank'] ? _app.ext.beachmall_dates.u.dateAfterToday(prod['%attribs']['zoovy:prod_salesrank']) : true;
				
				if(prod && prod['%attribs'] && prod['%attribs']['is:user1']){
					$tag.val("Back-Order Now").text("Back-Order Now").addClass('addToCartButton backorderButton');
					}
				else if(prod && prod['%attribs'] && prod['%attribs']['is:preorder'] && hasPreOrderPassed){
					$tag.addClass('preorderButton');
					}
				else	{
					$tag.addClass('atcButton')
					}
				
				if(_app.ext.store_product.u.productIsPurchaseable(prod.pid))	{
					//product is purchaseable. make sure button is visible and enabled.
					$tag.show().removeClass('displayNone').removeAttr('disabled');
					}
				else	{
					$tag.hide().addClass('displayNone').before("<span class='notAvailableForPurchase'>This item is not available for purchase<\/span>"); //hide button, item is not purchaseable.
					}
				}, //addToCartButton
				
			//hides ships on/in message on product page if product isn't purchaseable
			hideshiplatency : function(data,thisTLC) {
				var pid = data.globals.binds.var;
				var $tag = data.globals.tags[data.globals.focusTag];
//				app.u.dump('***PID'); app.u.dump(pid);
				if(!_app.ext.store_product.u.productIsPurchaseable(pid)) {
					$tag.addClass('displayNone');
				}
			},
			
			//shows container w/ accessories/similar tabbed content if one of them has values set
			showtabsifset : function(data,thisTLC) {
				var prod = data.globals.binds.var;
				var $tag = data.globals.tags[data.globals.focusTag];
				dump('----> showtabsifset'); dump(prod);
				setTimeout(function(){ //timeout here to allow time for data to get added to dom before this is run
					var attribs = prod['%attribs'] ? prod['%attribs'] : false; 
					if(!attribs) return; //if no attribs, run for it Marty!
					var relatedProds = attribs['zoovy:related_products'] ? attribs['zoovy:related_products'] : false;
					var accessoryProds = attribs['zoovy:accessory_products'] ? attribs['zoovy:accessory_products'] : false;
					var L, relatedIsDiscontinued, accessoryIsDiscontinued; //used for length of attrib lists and to hold whether list is discontinued or not
					var listList = [];
					listList.push(relatedProds,accessoryProds);
				//	_app.u.dump('--> List of lists'); _app.u.dump(listList); 
					
					for(j=0;j<listList.length;j++) {
						if(listList[j]) {
							var count = 0; //used to compare # discontinued items to list lengths
							prodAttribList = listList[j].split(',');
							L = prodAttribList.length;
						
								//check for any empty strings in array. Remove and adjust length if found
							var p = L;
							for(k=0;k<p;k++) {
								if(prodAttribList[k] == "" || prodAttribList[k] == " ") {
									L -= 1;
									prodAttribList.splice(k,1);
								}
							}

								//check for discontinued and adjust count if found
							var tempProd; //used in loop
				//			_app.u.dump('--> prodAttribList'+j+'---'); _app.u.dump(prodAttribList);
							for(i=0;i<L;i++) {
								tempProd = _app.data['appProductGet|'+_app.u.makeSafeHTMLId(prodAttribList[i])];
								if(tempProd && tempProd['%attribs'] && tempProd['%attribs']['zoovy:prod_is_tags']) {
									tempProd['%attribs']['zoovy:prod_is_tags'].indexOf('IS_DISCONTINUED') == -1 ? count = count : count += 1;
								}
							}
							L == count ? listList[j] = false : listList[j] = true; //if length is same as count, all prods in list are not show-able
						}
					}
						//check the findings for each list and set discontinued accordingly
					listList[0] == true ? relatedIsDiscontinued = false : relatedIsDiscontinued = true;
					listList[1] == true ? accessoryIsDiscontinued = false : accessoryIsDiscontinued = true;
					 
		//			_app.u.dump('--> Lots to look at'); _app.u.dump(relatedProds); _app.u.dump(relatedIsDiscontinued); _app.u.dump(accessoryProds); _app.u.dump(accessoryIsDiscontinued);
				
					if( (relatedProds && !relatedIsDiscontinued) || (accessoryProds && !accessoryIsDiscontinued) ) {
						$tag.show();
					}
					
					if( (accessoryProds && !accessoryIsDiscontinued) && ( (!relatedProds) || (relatedProds && relatedIsDiscontinued) ) ) {
						$('.accTab',$tag).addClass('ui-state-active').addClass('ui-tabs-active');
						setTimeout(function(){
							$('.accAnch','.accTab',$tag).mouseenter();},500);
		//				_app.u.dump('got past trigger');
					}
				},1000);	
			},

		}, //tlcFormats
			
			
////////////////////////////////////   UTIL [u]   \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

//utilities are typically functions that are exected by an event or action.
//any functions that are recycled should be here.
		u : {

//CAROUSEL UTILS		
			runProductCarousel : function($context) {
				//CAROUSEL UNDER MAIN PRODUCT IMAGE
				var $target = $('.prodPageCarousel', $context);
				if($target.data('isCarousel'))	{} //only make it a carousel once.
				else {
					$target.data('isCarousel',true);
			//for whatever reason, caroufredsel needs to be executed after a moment.
					setTimeout(function(){
						$target.carouFredSel({
							auto: {
								pauseOnHover: "immediate"
							},
							minimum: 1,
							prev: '.prodPageCarPrev',
							next: '.prodPageCarNext',
							height: 70,
							width: 300,
							//items: 4,
							//pagination: '#bestCarPagenation',
							scroll: 4,
					//		mousewheel: true, //this is mobile, so mousewheel isn't necessary (plugin is not loaded)
							swipe: {
								onMouse: true,
								onTouch: true
							}
						});
					},2000); 
				}
			}, //runProductCarousel
				
			//YOU MAY LIKE THIS VERTICAL CAROUSEL
			runProductVerticalCarousel : function($context) {
				var $target = $('.testUL', $context);
				if($target.data('isCarousel'))	{} //only make it a carousel once.
				else	{
					$target.data('isCarousel',true);
					//for whatever reason, caroufredsel needs to be executed after a moment.
					setTimeout(function(){
						$target.carouFredSel({
							circular: true,
							auto: {
								delay : -1,
								pauseOnHover: "immediate"
							},
							direction: 'down',
							prev: '.testPrev',
							next: '.testNext',
							items:{
								height: 468,
								width: 240
							},
							minimum: 1,
							height: 490,
							width: 250,
							align: 'false',
							scroll:	{
								items: 1,
								duration: 500
							},
					//		mousewheel: true, //this is mobile, so mousewheel isn't necessary (plugin is not loaded)
							swipe: {
								onMouse: true,
								onTouch: true
							}
						});
					},2000); 
				}
			}, //runProductVerticalCarousel
			
			//ACCESSORIES VERTICAL CAROUSEL
			runProductVerticalCarousel2 : function($context) {
				var $target = $('.testUL2', $context);
				if($target.data('isCarousel'))	{} //only make it a carousel once.
				else {
					$target.data('isCarousel',true);
					//for whatever reason, caroufredsel needs to be executed after a moment.
					setTimeout(function(){
						$target.carouFredSel({
							circular: true,
							auto: {
								delay :-1,
								pauseOnHover: "immediate"
							},
							direction: 'down',
							prev: '.testPrev2',
							next: '.testNext2',
							items:{
								height: 468,
								width: 240
							},
							minimum: 1,
							height: 490,
							width: 250,
							align: 'false',
							scroll: {
								items: 1,
								duration: 500
							},
					//		mousewheel: true, //this is mobile, so mousewheel isn't necessary (plugin is not loaded)
							swipe: {
								onMouse: true,
								onTouch: true
							}
						});
					},2000); 
				}
			}, //runProductVerticalCarousel2
			
			runProductRecentCarousel : function($context) {
				var $target = $('.productPreviousViewed', $context);
				if($target.data('isCarousel'))	{} //only make it a carousel once.
				else {
					$target.data('isCarousel',true);
					//for whatever reason, caroufredsel needs to be executed after a moment.
					setTimeout(function(){
						$target.carouFredSel({
				//			circular: true,
							auto: false,
							align: false,
							prev: '.productPreviousViewedPrev',
							next: '.productPreviousViewedNext',
							items:{
								height: 500,
								width: 240
							},
							height: 500,
							width: 960,
							//items: 4,
							pagination: '.productPreviousViewedPagenation',
							scroll: 4,
					//		mousewheel: true, //this is mobile, so mousewheel isn't necessary (plugin is not loaded)
							swipe: {
								onMouse: true,
								onTouch: true
							}
						});
					},2000); 
				}
			}, //runProductRecentCarousel

//MAGICZOOM UTILS
			doMagicStuff : function() {
				_app.u.dump("Refreshing MZP."); 
				setTimeout(function(){MagicZoomPlus.refresh();},2000);
				MagicZoomPlus.options = { 'hint' : 'false' }
			},
			
//TIME IN TRANSIT UTILS
			initEstArrival : function(infoObj,attempts){
				_app.u.dump("BEGIN beachmall_product.u.initEstArrival");
				attempts = Number(attempts) || 0;
				dump(attempts);
				window.SKU = infoObj.pid; //_app.u.dump("GLOBAL SKU IS A TEMPORARY SOLUTION!!!",'warn'); //was originally written in a hybrid store. need to get this more app friendly.
				var zip;
				var thisCartDetail = _app.data["cartDetail|"+_app.model.fetchCartID()];
				if(thisCartDetail && thisCartDetail.ship && thisCartDetail.ship.postal)	{
					zip = thisCartDetail.ship.postal;
				}

				if(zip) {
					_app.u.dump(" -> zip code is cart ["+zip+"]. Use it");
					_app.ext.beachmall_product.u.getShipQuotes(zip); //function also gets city/state from googleapi
				}
				//whereAmI may still be loading if page was loaded to product directly
				else if(attempts < 35) {
					setTimeout(function(){ _app.ext.beachmall_product.u.initEstArrival(infoObj,attempts + 1 ); },200);
				}
				else	{
					_app.u.dump(" -> no zip code entered. request via whereAmI");
					_app.ext.beachmall_begin.calls.whereAmI.init({'callback':'handleWhereAmI','extension':'beachmart'},'mutable');
					_app.model.dispatchThis('mutable');
				}
			},
				
			getShipQuotes : function(zip)	{
//				_app.u.dump("BEGin beachmall_product.u.getShipQuotes");
				var $context = $("#mainContentArea :visible:first");

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
					var prodArray = new Array();
					prodArray.push(SKU);
					dump('SKU -->'); dump(SKU);

					_app.ext.beachmall_begin.calls.time.init({},'mutable');
					dump('-0--ProdArray & zip:'); dump(prodArray); dump(zip);
					_app.ext.beachmall_begin.calls.appShippingTransitEstimate.init({"@products":prodArray,"ship_postal":zip,"ship_country":"US"},{'callback':'showTransitTimes','extension':'beachmall_product'},'mutable');
				//	_app.data.cartDetail['data.ship_zip'] = _app.data[tagObj.datapointer].zip; //need this local for getShipQuotes's callback.

					_app.model.dispatchThis('mutable'); //potentially a slow request that should interfere with the rest of the load.

					//go get the shipping rates.
					}
				else	{
					_app.u.dump("WARNING! no zip passed into getShipQuotes");
					}
				
			}, //getShipQuotes
				
			handlePreorderShipDate : function(){
				_app.u.dump("BEGIN beachmall_product.u.handlePreorderShipDate");
				_app.u.dump("SANITY! this item is (or was) a preorder.");
				var message;
				var product = _app.data['appProductGet|'+SKU];
				
				//if no date is set in salesrank, don't show any shipping info.
				if(product['%attribs']['zoovy:prod_salesrank']) {
					if(_app.ext.beachmart_dates.u.dateAfterToday(product['%attribs']['zoovy:prod_salesrank']))
						message = "Will ship on "+_app.ext.beachmart_dates.u.yyyymmddNoSeconds2Pretty(_app.data['appProductGet|'+SKU]['%attribs']['zoovy:prod_salesrank'])
				}
					else { message = "" }
				var $container = $("#mainContentArea :visible:first");
				
				$('.putLoadingHere',$container).removeClass('loadingBG');
				$('.loadingText',$container).hide();
				$('.transitContainer',$container).text(message);
			}, //handlePreorderShipDate
				
				//pass in the @services object in a appShippingTransitEstimate and the index in that object of the fastest shipping method will be returned.
			getShipMethodByID : function(servicesObj,ID) {
				dump('START beachmall_product.u.getShipMethodByID');
				var r = false; //what is returned. will be index of data object
				if(typeof servicesObj == 'object')        {
					var L = servicesObj.length;
					for(var i = 0; i < L; i += 1)        {
						if(servicesObj[i].id == ID)        {
							r = i;	break; //no need to continue in loop.
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
				
			//this function should handle all the display logic for Time in Transit. everything that gets enabled or disabled.
			//if(prodAttribs['user:prod_shipping_msg'] == 'Ships Today by 12 Noon EST')
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
//
				//if item is backorder item, indicate w/ attr data-backorderdate on container for estimate date
				if(prodAttribs['is:user1'] == 1 || prodAttribs['is:preorder'] == 1 || prodAttribs['zoovy:prod_is_tags'].indexOf('IS_DISCONTINUED') != -1) {
					if(_app.ext.beachmart_dates.u.appTimeNow()) { //set backorderdate value according to whether or not salesrank date can be determined
						//appTimeNow function broken because no _app.data.time.unix if( (prodAttribs['zoovy:prod_salesrank'] != undefined || prodAttribs['zoovy:prod_salesrank'] > -1)  && prodAttribs['zoovy:prod_salesrank'] > _app.ext.beachmart_dates.u.millisecondsToYYYYMMDD(_app.ext.beachmart_dates.u.appTimeNow())) {
						if( (prodAttribs['zoovy:prod_salesrank'] != undefined || prodAttribs['zoovy:prod_salesrank'] > -1)  && prodAttribs['zoovy:prod_salesrank'] > _app.ext.beachmart_dates.u.millisecondsToYYYYMMDD(new Date(new Date().getTime()))) {
							$('.shipMessage',$r).append("Order today for arrival on ");
							backorder = 1; //if date, then = 1
						} 
						else { backorder = 2; } //if not date, then = 2 
					} 
					else { backorder = 2; } //if app date cannot be determined, then = 2
				}
				else if(prodAttribs['user:prod_shipping_msg'] == "Ships Today by 12 Noon EST"){
					if(_app.data.time && _app.data.time.unix)	{
						var date = new Date(_app.data.time.unix*1000);
						var hours = date.getHours();
					}
					$('.shipMessage',$r).append("Order "+(hours < 9 ? 'today' : 'tomorrow')+" before "+hour+":"+minutes+"EST for arrival on ");
				}
				else	{ $('.shipMessage',$r).append("Order today for arrival on "); }

	
				if(prodAttribs['user:prod_ship_expavail'] && prodAttribs['user:prod_ship_expavail'] == 1 && backorder == 0)	{
					//if expedited shipping is not available, no other methods show up (will ship ground)
					$('.deliveryMethod',$r).append(data['@Services'][index]['method'])
					//MARK wants only available shipping methods for product to show, but they aren't listed in the product record, will need another call to grab this info.
			//		$('.deliveryMethod',$r).append(" <span class='zlink'>(Need it faster?)</span>").addClass('pointer').click(function(){
			//			_app.ext.beachmart.a.showShipGridInModal('appShippingTransitEstimate');
			//			_app.ext.beachmart.a.showShipGridInModal('cartShippingMethods');
			//		});
				}
				else	{
					_app.u.dump(" -> prodAttribs['user:prod_ship_expavail']: "+prodAttribs['user:prod_ship_expavail']);
					$('.expShipMessage',$r).append("<span class='zhint inconspicuouseZhint'>Expedited shipping not available for this item</span>");
				}

				//check backorder status to determine which date to use for arrival date
				if(backorder == 1) {
					var futureShipDate = _app.ext.beachmall_dates.u.getFutureDate(prodAttribs['zoovy:prod_salesrank'], data['@Services'][index]['arrival_yyyymmdd'].slice(0,8));
					$('.estimatedArrivalDate',$r).append(_app.ext.beachmall_dates.u.yyyymmddNoSeconds2Pretty(futureShipDate)+" to");
				} else if (backorder == 2) {
					_app.u.dump('The shipping time could not be determined due to a problem obtaining the date or salesrank value')
				} else {
					$('.estimatedArrivalDate',$r).append(_app.ext.beachmall_dates.u.yyyymmddNoSeconds2Pretty(data['@Services'][index]['arrival_yyyymmdd'])+" to");
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
				$('.deliveryLocation',$r).click(function(){_app.ext.beachmall_begin.a.showZipDialog()});
				
				return $r;
			}, //getTransitInfo
			
			//shows tool tip on product page. Uses fade out to allow for click on link in tool tip pop up
			handleProdPageToolTip : function()	{
//			_app.u.dump("BEGIN beachmall_product.u.handleToolTip.");
				$('.tipify',$('#appView')).each(function(){
					var $this = $(this);
					$this.parent().css('position','relative'); //this is what makes the tooltip appear next to the link instead of off in space.
					$this.mouseover(function(){	$('.toolTip',$this.parent()).show();}).mouseout(function(){	$('.toolTip',$this.parent()).fadeOut(3000);});
				});
			},
			
			//power reviews insisted on having a link for "read reviews", find it, dupe its contents,
			//add an element before it to scroll to the tab reviews are in, then kill the default anchor. 
			replaceReadReviewLink : function($context,pid,attempts) {
//				dump('START beachmall_product.u.replaceReadReviewLink'); 
				attempts = attempts || 0; //dump(attempts);
				if($('#pr-snippet-read-link-'+pid,$context).length) {
					var $anchor = $('#pr-snippet-read-link-'+pid,$context);
					var contents = $anchor.html();
					var $a = $('<a href="#prodReviews" data-app-click="beachmall_product|scrollToRevealTab" class="pr-snippet-link"></a>');
					$a.html(contents);
					$anchor.before($a);
					$anchor.remove();
				}
				else if (attempts < 50) { 
					attempts += 1; //dump(attempts); 
					setTimeout(function(){_app.ext.beachmall_product.u.replaceReadReviewLink($context,pid,attempts);},250); }
				else { dump('In beachmall_product.u.replaceReadReviewLink and could not find link to replace (may not be one on this page).','warn'); }
			},
			
			replaceWriteReviewLink : function($context,pid,selector,thisclass,attempts) {
//				dump('START beachmall_product.u.replaceWriteReviewLink'); 
				attempts = attempts || 0; //dump(selector);
				if($('[data-pr-event="'+selector+'"]',$context).length) {
					var $anchor = $('[data-pr-event="'+selector+'"]',$context);
					var contents = $anchor.html();
					var $div = $('<div data-app-click="powerreviews_reviews|writeReview" data-pid="'+pid+'" data-pr-event="'+selector+'" class="'+thisclass+' pointer"></div>');
					$div.html(contents);
					$anchor.before($div);
					$anchor.remove();
				}
				else if (attempts < 10) {
					attempts += 1; //dump(attempts); 
					setTimeout(function(){_app.ext.beachmall_product.u.replaceWriteReviewLink($context,pid,selector,thisclass,attempts);},250); 
				}
				else { dump('In beachmall_product.u.replaceWriteReviewLink and could not find link to replace (may not be one on this page).','warn'); }
			}
		
		}, //u [utilities]

//app-events are added to an element through data-app-event="extensionName|functionName"
//right now, these are not fully supported, but they will be going forward. 
//they're used heavily in the admin.html file.
//while no naming convention is stricly forced, 
//when adding an event, be sure to do off('click.appEventName') and then on('click.appEventName') to ensure the same event is not double-added if app events were to get run again over the same template.
		e : {
		
			//shows modal which contains form to e-mail current page to someone (see emailfriend)
			showemailfriend : function($ele,p) {
				p.preventDefault();
				var $parent = $('#emailAFriendTemplate');
				var pid = $ele.attr('data-pid');
//				dump('--start showemailfriend'); dump(pid); dump($parent);
				$parent.dialog({
					'modal':'true', 'title':'Sizing Guide','width':'60%', 'max-height':300,'dialogClass':'emailDialog',
					'open' : function(event, ui) { 
						$("span",$parent).attr("data-pid",pid);
						$('[data-close="email"]','.emailDialog').on('click.closeModal', function(){$parent.dialog('close')});
						$('.ui-widget-overlay').on('click.closeModal', function(){$parent.dialog('close')});
					},
					'close': function(event, ui){ 
						$('.ui-widget-overlay').off('click.closeModal');
						$("span",$parent).attr("data-pid","");
					}
				});
				$(".ui-dialog-titlebar").hide();
			},
			
			//sends e-mail to recipient. TODO : Test output / Make a link of the pid to show in the e-mail. 
			emailfriend : function($form, p) {
				p.preventDefault();
				dump('-----start emailfriend...');
				var sender = $('input[name="youremail"]',$form).val();
				var recipient = $('input[name="theiremail"]',$form).val();
				var pid = $("span",$form).attr("data-pid");
				dump('emailfriend sender, & pid:'); dump(recipient);  dump(pid);
				var params = {
					'product' 	: pid,
					'recipient'	: recipient,
					'sender'		: sender,
					'method'	: 'tellafriend',
					'_cmd'		: 'appEmailSend',
					'_tag'		: {
						'callback':function(rd){
							if(_app.model.responseHasErrors(rd)) {
								$form.anymessage({'message':rd});
							}
							else {
								dump('emailfriend callback...'); dump(rd); 
								$form.anymessage(_app.u.successMsgObject("You've sent an e-mail to "+recipient+" successfully!"));
							}
						}
					}
				};
				_app.model.addDispatchToQ(params,'immutable');
				_app.model.dispatchThis('immutable');
			},
			
			//will scroll window to tab section, and reveal the tab w/ href
			scrollToRevealTab : function($ele,p) {
//				dump('START evnts.scrollToRevealTab');
				var $context = $ele.closest("[data-templateid='productTemplate']");
				var $prodTabs = $(".tabbedProductContent",$context);
				var href = $ele.attr('href');

				$('html, body').animate({
					scrollTop: $prodTabs.offset().top
				}, 1000,function(){$("a[href="+href+"]",$context).mouseenter();});
			},
			
			//Q&A link on product page will populate the order/prod id field on contact form w/ pid
			showContactPID : function ($ele,p) {
				var pid = $ele.attr('data-pid');
				dump('the pid is: '); (pid);
				setTimeout(function(){$('input[name="OID"]','.contactForm').val('SKU: '+pid)},1000);
			},

			
		}, //e [app Events]
		
		
		
	} //r object.
	return r;
}
