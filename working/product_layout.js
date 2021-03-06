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




var beachmart_custom = function() {
	var r = {
		vars : { 
			"templates" : ["productListTemplateBundle","shipGridTemplate","productListTemplateThumb"]},
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
					app.u.dump('BEGIN app.ext.beachmart_custom.callbacks.init.onError');
					}
				},
//this is the callback defined to run after extension loads.
			startMyProgram : {
				onSuccess : function()	{
//					app.u.dump("BEGIN beachmart_custom.callbacks.startMyProgram"); // will write to console, if console is enabled.

/*
					if(app.u.isSet(SKU))	{
						var parentID = 'productContainer';
						
						$.extend(handlePogs.prototype,app.ext.beachmart_custom.variations); //extends variations object to include custom formats
						
						$('#mainContentArea').append(app.renderFunctions.createTemplateInstance('productTemplate',parentID));
	
						app.ext.store_product.calls.appProductGet.init(SKU,{'callback':'translateAndGetCrossSell','parentID':parentID,'extension':'beachmart_custom'});
						app.calls.refreshCart.init({'callback':'checkForOrGetShipZip','extension':'beachmart_custom'}); //callback starts chain reaction for displaying est. arrival date.
						app.model.dispatchThis();
	
						showContent = app.ext.beachmart_custom.action.showContent;
						if(typeof myAppIsLoaded == 'function')	{
							myAppIsLoaded();
							}
							
					
// load the google map api lib
var script = document.createElement("script");
script.type = "text/javascript";
script.src = ((document.location.protocol == 'https:') ? 'https:' : 'http:') + "//maps.googleapis.com/maps/api/js?key=AIzaSyAW4uPPdoxArUsCy2SvCchNQmhX328T2oY&sensor=false&callback=app.ext.beachmart_custom.util.instantiateGeoCoder";
document.body.appendChild(script);

							
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
app.u.dump("BEGIN beachmart_custom.callbacks.checkForOrGetShipZip");
var zip = app.data[tagObj.datapointer].cart['data.ship_zip'];
//app.u.dump(" -> zip from cart: "+zip);
/*
navigator.geolocation is crappily supported. appears there's no 'if user hits no' support to execute an alternative. at least in FF.
look at a pre-20120815 copy of this lib for geocoding
*/

if(app.u.isSet(zip))	{
	app.u.dump(" -> zip code is present ["+zip+"]. Use it");
	app.ext.beachmart_custom.util.getShipQuotes(zip); //function also gets city/state from googleapi
	}
else	{
	app.u.dump(" -> no zip code entered. request via whereAmI");
	app.ext.store_crm.calls.whereAmI.init({'callback':'handleWhereAmI','extension':'beachmart_custom'},'passive');
	app.model.dispatchThis('passive');
	}

					},
				onError : function(responseData,uuid)	{
//error handling is a case where the response is delivered (unlike success where datapointers are used for recycling purposes)
					app.u.handleErrors(responseData,uuid); //a default error handling function that will try to put error message in correct spot or into a globalMessaging element, if set. Failing that, goes to modal.
					}
				
				
				}, //checkForOrGetShipZip




			showTransitTimes : {
				
				onSuccess : function(tagObj){
//					app.u.dump("BEGIN beachmart_custom.callbacks.showTransitTimes");
					//use cutoff from response, not product.
					var $container = $("#productContainer");
					var data = app.data[tagObj.datapointer]; //shortcut.
					
					if(!$.isEmptyObject(data['@Services']))	{
						app.u.dump(" -> @Services is not empty");
						var index = app.ext.beachmart_custom.util.getShipMethodByID(data['@Services'],'UGND');
						if(!index)	{
							index = app.ext.beachmart_custom.util.getFastestShipMethod(data['@Services']);
							}
						app.u.dump(" -> index: "+index);
//index could be false if no methods were available. or could be int starting w/ 0
						if(index >= 0)	{
							$('.transitContainer',$container).empty().append(app.ext.beachmart_custom.util.getTransitInfo(SKU,data,index)); //empty first so when reset by zip change, no duplicate info is displayed.
							}
						
						}
					
					$('.shippingInformation .loadingBG',$container).removeClass('loadingBG');
					$('.loadingText',$container).hide();
					},
				onError : function(responseData,uuid)	{
//					alert("got here");
//error handling is a case where the response is delivered (unlike success where datapointers are used for recycling purposes)
					app.u.handleErrors(responseData,uuid); //a default error handling function that will try to put error message in correct spot or into a globalMessaging element, if set. Failing that, goes to modal.
					}
				
				
				}, //showTransitTimes


//if whereAmI was executed, it means zip was not populated in the cart.
//update the cart shippng fields appropriately.
			handleWhereAmI : {
				
				onSuccess : function(tagObj){
var data = app.data[tagObj.datapointer];
if(data.city)	{
	app.data.cartItemsList.cart['data.ship_city'] = data.city;
	app.calls.cartSet.init({"data.ship_city":data.city},{},'passive');
	}
if(data.state)	{
	app.data.cartItemsList.cart['data.ship_state'] = data.state;
	app.calls.cartSet.init({"data.ship_state":data.state},{},'passive');
	}
if(data.city || data.state)	{
	app.model.dispatchThis('passive');
	}
app.ext.beachmart_custom.util.getShipQuotes(app.data[tagObj.datapointer].zip);

					},
				onError : function(responseData,uuid)	{
//error handling is a case where the response is delivered (unlike success where datapointers are used for recycling purposes)
					app.u.handleErrors(responseData,uuid); //a default error handling function that will try to put error message in correct spot or into a globalMessaging element, if set. Failing that, goes to modal.
					}
				
				
				}, //checkForOrGetShipZip
			
			magicRefresh : {
				
				onSuccess: function(){
					MagicZoomPlus.refresh();
					}
				
				},
			
			translateAndGetCrossSell : {
				onSuccess : function(tagObj)	{
					app.renderFunctions.translateTemplate(app.data[tagObj.datapointer],"productContainer");
					if(app.ext.beachmart_custom.util.getCrossSellers({'pageType':'product','pid':SKU,'templateID':'productTemplate'}))	{
						app.calls.ping.init({'callback':'magicRefresh','extension':'beachmart_custom'})
						app.model.dispatchThis();
						
						}
					else	{
						MagicZoomPlus.refresh();
						}
					
					window.$prodInfotabs = $( "#tabbedProductContent" ).tabs();
					$( "#prodImageVideoTabs" ).tabs()
					$( "#tabbedProductLists" ).tabs()
					app.ext.beachmart_custom.util.handleToolTip();

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
//						app.u.dump(" -> SHOW ACCESSORIES CAROUSEL");
						$('#accessoriesProdlistSlideshow').parent().find('.carouselNav').show();

	$('#accessoriesProdlistSlideshow').jCarouselLite(vertCarouselOptions); //jCarouselList

						}
//slideshow is only activated when necessary (more than two product)
					if($('#relatedProdlistSlideshow	 ul').children().length > 2)	{
//						app.u.dump(" -> SHOW RELATED ITEMS CAROUSEL");
						$('#relatedProdlistSlideshow .carouselNav').show();
	$('#relatedProdlistSlideshow').jCarouselLite(vertCarouselOptions); //jCarouselList
						}
				

					
					},
				onError : function(responseData,uuid)	{
//error handling is a case where the response is delivered (unlike success where datapointers are used for recycling purposes)
					app.u.handleErrors(responseData,uuid); //a default error handling function that will try to put error message in correct spot or into a globalMessaging element, if set. Failing that, goes to modal.
					}
				},//getCrossSellers
				
//used in init.
			updateMCLineItems : 	{
				onSuccess : function(tagObj)	{
	//				app.u.dump("BEGIN beachmart_custom.callbacks.updateMCLineItems");
					app.ext.beachmart_custom.util.handleMinicartUpdate(tagObj);
					$('.atcButton').removeClass('disabled').removeAttr('disabled');
					},
				onError : function(responseData,uuid)	{
					app.u.handleErrors(responseData,uuid)
					}
				}, //updateMCLineItems				
//used for callback on showCartInModal function
//
			handleCart : 	{
				onSuccess : function(tagObj)	{
//					app.u.dump("BEGIN beachmart_custom.callbacks.onSuccess.handleCart");
					app.ext.beachmart_custom.util.handleMinicartUpdate(tagObj);
					app.renderFunctions.translateTemplate(app.data[tagObj.datapointer].cart,tagObj.parentID);				
					app.ext.beachmart_custom.util.handleCartUpSell(tagObj.datapointer);
					$('.atcButton').removeClass('disabled').removeAttr('disabled');
					MagicZoomPlus.refresh();
					$('#cartTemplateCostSummary').removeClass('loadingBG');
					},
				onError : function(responseData,uuid)	{
					app.u.handleErrors(responseData,uuid)
					}
				} //handleCart
				
	
				
			}, //callbacks

		calls : {
			
			appShippingTransitEstimate : {
				init : function(cmdObj,tagObj,Q)	{
//					app.u.dump("BEGIN beachmart_custom.calls.appShippingTransitEstimate.  [Q: "+Q+"]");
					tagObj = $.isEmptyObject(tagObj) ? {} : tagObj; 
					tagObj.datapointer = "appShippingTransitEstimate";
					this.dispatch(cmdObj,tagObj,Q);
					return true;
					},
				dispatch : function(cmdObj,tagObj,Q)	{
					cmdObj['_tag'] = tagObj;
					cmdObj["_cmd"] = "appShippingTransitEstimate"
					app.model.addDispatchToQ(cmdObj,Q);	
					}
				},//appShippingTransitEstimate
			time : {
				init : function(tagObj,Q)	{
//					app.u.dump("BEGIN beachmart_custom.calls.appShippingTransitEstimate.  [Q: "+Q+"]");
					tagObj = $.isEmptyObject(tagObj) ? {} : tagObj; 
					tagObj.datapointer = "time";
					this.dispatch(tagObj,Q);
					return true;
					},
				dispatch : function(tagObj,Q)	{
					app.model.addDispatchToQ({"_cmd":"time","_tag":tagObj},Q);	
					}
				}//appShippingTransitEstimate
			}, //calls




/*
#######################

Action

#######################
*/



		action: {
			
//Data must already be in memory to execute this action.
//added as a .click to the shipping method
			showShipGridInModal : function(datapointer){
				var $parent = $('#modalShipGrid').empty();
//the modal opens as quick as possible so users know something is happening.
//open if it's been opened before so old data is not displayed. placeholder content (including a loading graphic, if set) will be populated pretty quick.
				if($parent.length == 0)	{
					$parent = $("<div \/>").attr({"id":"modalShipGrid","title":"Estimated Shipping Times and Methods"}).appendTo('body');
					$parent.dialog({modal: true,width:600,height:300,autoOpen:false});  //browser doesn't like percentage for height
					}
//empty the existing cart and add a loadingBG so that the user sees something is happening.
				$parent.dialog('open').addClass('loadingBG');
					
				if(datapointer && !$.isEmptyObject(app.data[datapointer]))	{
					var $table = $("<table />").addClass('center');
					$table.append("<tr class='ztable_row_head'><td></td><td>Method</td><td>Est. Arrival</td></tr>");
					var services = app.data[datapointer]['@Services']
					var L = services.length;
//					app.u.dump(" -> @Services.length: "+L);
					for(var i = 0; i < L; i += 1)	{
//						app.u.dump(" -> "+i+") id: "+services[i].id);
						$table.append(app.renderFunctions.transmogrify({'id':'service_'+services[i].id},"shipGridTemplate",services[i]));
						}
					$parent.removeClass('loadingBG').append($table);

					}
				else	{
					app.u.dump("WARNING! showShipGridInModal either had no datapointer passed ["+datapointer+"] or data.datapointer is empty");
					//uh oh. how'd this happen.
					$parent.removeClass('loadingBG').append(app.u.formatMessage("Uh oh! It seems something went wrong. We apologize for the inconveniece but the data can not be retrieved right now."));
					}
//				app.u.dump($content);
				}, //showShipGridInModal
			
			

			
//this is a dumbed down version of this for the product page app.
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
						document.location = app.vars.secureURL+"c="+app.sessionId+"/checkout.cgis"
						break;
	
					case 'company':
						document.location = domain+infoObj.show+".cgis";
						break;
	
	
					case 'cart':
						document.location = domain+"cart.cgis";
						break;

					default:
						app.u.dump("WARNING: unknown page type encountered in showContent");
						alert("We apologize, an unexpected error occured.");
					}
				
				}, //showContent
		
			printByElementID : function(id)	{
//				app.u.dump("BEGIN beachmart_custom.action.printByElementID");
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
					app.u.dump("WARNING! - beachmart_custom.action.printByElementID executed but not ID was passed ["+id+"] or was not found on DOM [$('#'+"+id+").length"+$('#'+id).length+"].");
					}
				}, //printByElementID 
				
				



			showProdAttInDialog : function(pid,attr){
				if(pid && attr)	{
					var content = app.data['appProductGet|'+pid]['%attribs'][attr];
					if(content)	{
						var $div = $('<div />');
						$div.attr('title','').text(content).dialog({width:550,buttons: {'close': function() {$( this ).dialog( "close" );}}});
						$div.dialog('option', 'title',"|||"); 
						}
					else	{app.u.dump("WARNING! showProdInDialog tried to load a blank field: app.data['appProductGet|"+pid+"]['%attribs']["+attr+"]");}
					}
				else	{
					app.u.dump("WARNING! showProdAttInDialog requires both pid ["+pid+"] and attr  ["+attr+"]  to be set");
					}
				}, //showProdAttInDialog
				
			showZipDialog : function()	{
				
				var $dialog = $('#zipEntryDialog');
				if($dialog.length)	{}//dialog already exists. no mods necessary, just open it.
				else	{
					app.u.dump("create and show zip dialog");
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
						app.u.dump("BEGIN showZipDialog .click event. zip: '"+zip+"'");
//reset these vars so getShipQuotes doesn't use them.
						app.data.cartItemsList.cart['data.ship_city'] = null; 
						app.data.cartItemsList.cart['data.ship_zip'] = null; 
						app.data.cartItemsList.cart['data.ship_state'] = null;
						app.calls.cartSet.init({"data.ship_zip":null},{},'passive');
						app.calls.cartSet.init({"data.ship_city":null},{},'passive');
						app.calls.cartSet.init({"data.ship_state":null},{},'passive');

						if(zip && zip.length >= 5 && !isNaN(zip))	{
							var $container = $("#productContainer"); //using $container as second param in $ below targets better (lighter and leaves door open for multiple instances later)
							app.ext.beachmart_custom.util.getShipQuotes(zip);
							//reset all the spans
							$('.putLoadingHere',$container).addClass('loadingBG');
							$('.loadingText',$container).hide();
							$('.shipMessage, .estimatedArrivalDate, .deliveryLocation, .deliveryMethod',$container).empty()
							$dialog.dialog('close');
							}
						else	{
							$('#shipDialogMessaging').empty().append(app.u.formatMessage("Please enter a valid US zip code"));
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
				$tag.append(app.ext.beachmart_custom.util.yyyymmdd2Pretty(data.value));
				},

			setHrefToImageUrl : function($tag,data){
				var imgSrc = app.u.makeImage({'tag':0,'w':'','h':'','name':data.value,'b':'ffffff'});
				var pid = $tag.closest('[data-pid]').attr('data-pid');
//				app.u.dump('IMGSRC => '+imgSrc);
				$tag.attr({'href':imgSrc,'rel':'caption-source:#caption_'+pid});
				},


			searchLink : function($tag,data){
				var keywords = data.value.replace(/ /g,"+");
				var domain = document.location.protocol == 'https:' ? zGlobals.appSettings.https_app_url : zGlobals.appSettings.http_app_url;
				$tag.append("<a href='"+domain+"results.cgis?KEYWORDS="+keywords+"&amp;CATALOG=MFG'>"+data.value+"<\/a>");
				}, //searchLink


			addPicSlider : function($tag,data)	{
//				app.u.dump("BEGIN beachmart_custom.renderFormats.addPicSlider: "+data.value);
				if(app.data['appProductGet|'+data.value])	{
					var pdata = app.data['appProductGet|'+data.value]['%attribs'];
//if image 1 or 2 isn't set, likely there are no secondary images. stop.
					if(app.u.isSet(pdata['zoovy:prod_image1']) && app.u.isSet(pdata['zoovy:prod_image2']))	{
//						app.u.dump(" -> image1 ["+pdata['zoovy:prod_image1']+"] and image2 ["+pdata['zoovy:prod_image2']+"] both are set.");
//adding this as part of mouseenter means pics won't be downloaded till/unless needed.
// no anonymous function in mouseenter. We'll need this fixed to ensure no double add (most likely) if template re-rendered.
//							$tag.unbind('mouseenter.myslider'); // ensure event is only binded once.
							$tag.bind('mouseenter.myslider',app.ext.beachmart_custom.util.addPicSlider2UL).bind('mouseleave',function(){window.slider.kill()})
						}
					}
				},


//pass in the sku for the bindata.value so that the original data object can be referenced for additional fields.
// will show price, then if the msrp is MORE than the price, it'll show that and the savings/percentage.
			priceRetailSavingsDifference : function($tag,data)	{
				var o; //output generated.
				var pData = app.data['appProductGet|'+data.value]['%attribs'];
	//use original pdata vars for display of price/msrp. use parseInts for savings computation only.
				var price = Number(pData['zoovy:base_price']);
				var msrp = Number(pData['zoovy:prod_msrp']);
				if(price > 0 && (msrp - price > 0))	{
					o = app.u.formatMoney(msrp-price,'$',2,true)
					$tag.append(o);
					}
				else	{
					$tag.hide(); //if msrp > price, don't show savings because it'll be negative.
					}
				}, //priceRetailSavings		


//pass in the sku for the bindata.value so that the original data object can be referenced for additional fields.
// will show price, then if the msrp is MORE than the price, it'll show that and the savings/percentage.
			priceRetailSavingsPercentage : function($tag,data)	{
				var o; //output generated.
				var pData = app.data['appProductGet|'+data.value]['%attribs'];
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
			priceRetailSavings : function($tag,data)	{
//				app.u.dump("BEGIN beachmart_custom.s.priceRetailsSavings ["+data.value+"]");
				var o = ''; //output generated.
				var pData = app.data['appProductGet|'+data.value]['%attribs'];
	//use original pdata vars for display of price/msrp. use parseInts for savings computation only.
				var price = Number(pData['zoovy:base_price']);
				var msrp = Number(pData['zoovy:prod_msrp']);
//				app.u.dump(" -> price: "+price);
//				app.u.dump(" -> msrp: "+msrp);
				if(price > .01)	{
					o += "<div class='basePrice'><span class='prompt pricePrompt'>Our Price: <\/span><span class='value'>";
					o += app.u.formatMoney(pData['zoovy:base_price'],'$',2,true)
					o += "<\/span><\/div>";
	//only show the msrp if it is greater than the price.
					if(msrp > price)	{
	//don't bother with savings of less than a buck.
						if(msrp-price > 1)	{
							o += " <span class='savings'>(";
	//						o += app.u.formatMoney(msrp-price,'$',2,true)
							var savings = (( msrp - price ) / msrp) * 100;
							o += savings.toFixed(0);
							o += "% savings)<\/span>";
							}
					
						o += "<div class='retailPrice'><span class='prompt retailPricePrompt'>List Price: <\/span><span class='value'>";
						o += app.u.formatMoney(pData['zoovy:prod_msrp'],'$',2,true);
						o += "<\/span><\/div>";
						}
					}
				$tag.append(o);
				}, //priceRetailSavings


//will remove the add to cart button if the item is not purchaseable.
			addToCartButton : function($tag,data)	{
//				app.u.dump("BEGIN store_product.renderFunctions.addToCartButton");
//				app.u.dump(" -> ID before any manipulation: "+$tag.attr('id'));
				var pid = data.value;
// add _pid to end of atc button to make sure it has a unique id.
// add a success message div to be output before the button so that messaging can be added to it.
// atcButton class is added as well, so that the addToCart call can disable and re-enable the buttons.
				$tag.attr('id',$tag.attr('id')+'_'+pid).before("<div class='atcSuccessMessage' id='atcMessaging_"+pid+"'><\/div>");
				var pData = app.data['appProductGet|'+data.value]
				if(pData && pData['%attribs'] && pData['%attribs']['is:user1']){
					$tag.addClass('addToCartButton backorderButton');
					}
				else if(pData && pData['%attribs'] && pData['%attribs']['is:preorder']){
					$tag.addClass('preorderButton');
					}
				else	{
					$tag.addClass('atcButton')
					}
				
				if(app.ext.store_product.util.productIsPurchaseable(pid))	{
//product is purchaseable. make sure button is visible and enabled.
					$tag.show().removeClass('displayNone').removeAttr('disabled');
					}
				else	{
					$tag.hide().addClass('displayNone').before("<span class='notAvailableForPurchase'>This item is not available for purchase<\/span>"); //hide button, item is not purchaseable.
					}

//				app.u.dump(" -> ID at end: "+$tag.attr('id'));
				}, //addToCartButton


// used to display product image 1 thru X where X is the last image. checks spot 1 - 50
// product id should be used as var
			productImages : function($tag,data)	{
//				app.u.dump("BEGIN beachmart_custom.renderFormats.productImages ["+data.value+"]");
				var pdata = app.data['appProductGet|'+data.value]['%attribs']; //short cut to product object in memory.
				var imgs = ''; //all the html for all the images. appended to $tag after loop.
				var imgName; //recycled in loop.
				for(i = 1; i < 30; i += 1)	{
					imgName = pdata['zoovy:prod_image'+i];
//					app.u.dump(" -> "+i+": "+imgName);
					if(app.u.isSet(imgName))	{
						imgs += "<li><a class='MagicThumb' rel='zoom-id: prodBigImage_href;' rev='"+app.u.makeImage({'tag':0,'w':380,'h':380,'name':imgName,'b':'ffffff'})+"' href='"+app.u.makeImage({'tag':0,'w':'','h':'','name':imgName,'b':'ffffff'})+"'><img src='"+app.u.makeImage({'tag':0,'w':50,'h':50,'name':imgName,'b':'ffffff'})+"' \/><\/a><\/li>";
						}
					}
				$tag.append(imgs);
				} //productImages
		
			}, //renderFormats


/*
#######################

Variations

#######################
*/

		variations: {
			renderOptionIMGGRID_ALT:function(pog) {
			app.u.dump("BEGIN beachmart_custom.variations.renderOptionIMGGRID_ALT");

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
		title += " "+app.u.formatMoney((Number(app.data['appProductGet|'+SKU]['%attribs']['zoovy:base_price']) + Number(pog['options'][i]['p'])),'$', 2,false); //display total price. multiply modifier by 1 to treat as js number
	if(pog['options'][i]['html'])	{
		title += ' '+pog['options'][i]['html'].replace(/%20/g,' ') ;
		}
//	else
//		title += ' '+defaultShipTime;

// create a div and put the thumbnail into it.  These'll all get added next to each other and floats will be used to get their appearance right
	var $pogImage = $("<div />").addClass('floatLeft sogImgThumbnail');
//The onclick changes the select list.  selectedIndex is used instead of by id because by id doesn't work in IE.



	$pogImage.append("<a id='imgGridHref_"+pogid+"_"+sogValue+"' href='"+app.u.makeImage({"w":200,"h":200,"name":pog['options'][i]['img'],"b":"FFFFFF","tag":false})+"' class='MagicZoom' onMouseOver='$(&quot;#pog_"+pogid+"_id&quot).innerHTML = &quot;"+title+"&quot;' onclick=\"$('#pog_"+pogid+"').val('"+sogValue+"'); return false;\" title='"+title+"'><img src='"+app.u.makeImage({"w":pog.width,"h":pog.height,"name":pog['options'][i]['img'],"b":"FFFFFF","tag":false})+"' alt='"+title+"' border='0' height='"+pog.height+"' width='"+pog.width+"' name='imgGrid_"+pogid+"_"+sogValue+"' id='imgGrid_"+pogid+"_"+sogValue+"'></a>")

	$imagesDiv.append($pogImage); //this'll put the images at the top.

	optionText = pog['options'][i]['prompt'];
//display total price. multiply modifier by 1 to treat as js number
	if(pog['options'][i]['p'])
		optionText += " $"+(( Number(app.data['appProductGet|'+SKU]['%attribs']['zoovy:base_price'])) + ( pog['options'][i]['p'] * 1 )).toFixed(2); 
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

Utilities

#######################
*/


		util: {

//obj is going to be the container around the img. probably a div.
//the internal img tag gets nuked in favor of an ordered list.
			addPicSlider2UL : function(){
//				app.u.dump("BEGIN beachmart_custom.util.addPicSlider2UL");
				
				var $obj = $(this);
				if($obj.data('slider') == 'rendered')	{
					//do nothing. list has aready been generated.
//					app.u.dump("the slideshow has already been rendered. re-init");
					window.slider.kill(); //make sure it was nuked.
					window.slider = new imgSlider($('ul',$obj));
					}
				else	{
					$obj.data('slider','rendered'); //used to determine if the ul contents have already been added.
					var pid = $obj.closest('[data-pid]').attr('data-pid');
//					app.u.dump(" -> pid: "+pid);
					var data = app.data['appProductGet|'+pid]['%attribs'];
					var $img = $obj.find('img')
					var width = $img.attr('width'); //using width() and height() here caused unusual results in the makeImage function below.
					var height = $img.attr('height');
					$obj.width(width).height(height).css({'overflow':'hidden','position':'relative'});
					var $ul = $('<ul>').addClass('slideMe').css({'height':height+'px','width':'20000px'}); //width hard coded to avoid inheretancy.
					
					var $li; //recycled.
					for(var i = 2; i <= 10; i += 1)	{
						if(data['zoovy:prod_image'+i])	{
							$li = $('<li>').append(app.u.makeImage({"name":data['zoovy:prod_image'+i],"w":width,"h":height,"b":"FFFFFF","tag":1}));
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
app.u.dump("BEGin beachmart_custom.util.getShipQuotes");
//here, inventory check is done instead of isProductPurchaseable, because is used specifically to determine whether or not to show shipping.
// the purchaseable function takes into account considerations which have no relevance here (is parent, price, etc).
if(app.ext.store_product.util.getProductInventory(SKU) <= 0){
	//no inventory. Item not purchaseable. Don't get shipping info
	$('.shippingInformation .putLoadingHere').removeClass('loadingBG').hide();
	app.u.dump("SANITY! ship times not displayed because inventory unavailable.");
	}
else if(app.data['appProductGet|'+SKU] && app.data['appProductGet|'+SKU]['%attribs']['is:preorder'])	{
	this.handlePreorderShipDate();
	}
else if(zip)	{
//	app.u.dump(" -> zip: "+zip);
//if the city or the state is already available, don't waste a call to get additional info.
//this block is also executed for zip update, so allow reset.
	if(app.data.cartItemsList.cart['data.ship_city'] || app.data.cartItemsList.cart['data.ship_state'])	{
		app.ext.beachmart_custom.util.fetchLocationInfoByZip(zip);
		}
	var prodArray = new Array();
	prodArray.push(SKU);
	app.data['cartItemsList'].cart['data.ship_zip'] = zip; //update local object so no request for full cart needs to be made for showTransitTimes to work right.
	app.calls.cartSet.init({"data.ship_zip":zip},{},'passive');
	app.ext.beachmart_custom.calls.time.init({},'passive');
	app.ext.beachmart_custom.calls.appShippingTransitEstimate.init({"@products":prodArray,"ship_postal":zip,"ship_country":"US"},{'callback':'showTransitTimes','extension':'beachmart_custom'},'passive');
//	app.data.cartItemsList.cart['data.ship_zip'] = app.data[tagObj.datapointer].zip; //need this local for getShipQuotes's callback.

	app.model.dispatchThis('passive'); //potentially a slow request that should interfere with the rest of the load.
	


	//go get the shipping rates.

	}
else	{
	app.u.dump("WARNING! no zip passed into getShipQuotes");
	}

				
				
				}, //getShipQuotes


			instantiateGeoCoder : function(){
				geocoder = new google.maps.Geocoder();
				},

			fetchLocationInfoByZip : function(zip,attempts)	{
				attempts = Number(attempts) || 0;
//				app.u.dump("BEGIN beachmart_custom.util.app.ext.beachmart_custom.util.fetchLocationInfoByZip("+zip+")");
				if(zip && geocoder && typeof geocoder.geocode == 'function')	{
					geocoder.geocode({ 'address': zip}, function(results, status) {
						if(results.length > 0)	{
//							app.u.dump(results[0].address_components);
							var city = app.ext.beachmart_custom.util.getCityFromAddressComponents(results[0].address_components);
							var state = app.ext.beachmart_custom.util.getStateFromAddressComponents(results[0].address_components);
//update the local cart object right away, in addition to the server side cart, so that vars are available globally right away.
							app.data.cartItemsList.cart['data.ship_city'] = city;
							app.data.cartItemsList.cart['data.ship_state'] = state;
							app.calls.cartSet.init({"data.ship_city":city,"data.ship_state":state},{},'passive');
							app.model.dispatchThis('passive');
							}
						else	{
							app.u.dump("NOTICE! google API response had no results.");
							}
						});
					}
				else if(!zip)	{
					app.u.dump("ERROR! zip not passed into beachmart_custom.util.fetchLocationInfoByZip");
					}
				else if(geocoder && typeof geocoder.geocode != 'function' && attempts < 30)	{
					app.ext.beachmart_custom.util.fetchLocationInfoByZip(zip,attempts+1); //perhaps the maps api hasn't loaded yet. try again.
					}
				else	{
					app.u.dump("WARNING! beachmart_custom.util.fetchLocationInfoByZip could not execute. zip set, but geocoder not. attempts to load googleapi: "+attempts);
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
				app.u.dump("BEGIN beachmart_custom.util.handlePreorderShipDate");
				app.u.dump("SANITY! this item is a preorder.");
				var message;
//if no date is set in salesrank, don't show any shipping info.
				if(app.data['appProductGet|'+SKU]['%attribs']['zoovy:prod_salesrank'])
					message = "Will ship on "+this.yyyymmdd2Pretty(app.data['appProductGet|'+SKU]['%attribs']['zoovy:prod_salesrank'])

				var $container = $("#productContainer")

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
//app.u.dump("BEGIN beachmart_custom.util.buildQueriesFromTemplate");
//app.u.dump(P);

var numRequests = 0; //will be incremented for # of requests needed. if zero, execute showPageContent directly instead of as part of ping. returned.
var elementID; //used as a shortcut for the tag ID, which is requied on a search element. recycled var.

//goes through template.  Put together a list of all the data needed. Add appropriate calls to Q.
app.templates[P.templateID].find('[data-bind]').each(function()	{

	var $focusTag = $(this);
	var eleid = $focusTag.attr('id') ? $focusTag.attr('id') : ''; //element id. default to blank. used in prodlists.
		
//proceed if data-bind has a value (not empty).
	if(app.u.isSet($focusTag.attr('data-bind'))){
		
		var bindData = app.renderFunctions.parseDataBind($focusTag.attr('data-bind')) ;
//		app.u.dump(bindData);
		var namespace = bindData['var'].split('(')[0];
		var attribute = app.renderFunctions.parseDataVar(bindData['var']);
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
//				app.u.dump(" -> "+attribute+": "+app.data['appProductGet|'+P.pid]['%attribs'][attribute]);
				if(app.u.isSet(app.data['appProductGet|'+P.pid]['%attribs'][attribute]))	{ 
//bindData is passed into buildProdlist so that any supported prodlistvar can be set within the data-bind. (ex: withInventory = 1)
					bindData.csv = app.ext.store_prodlist.util.handleAttributeProductList(app.data['appProductGet|'+P.pid]['%attribs'][attribute]);
//					app.u.dump("bindData: "); app.u.dump(bindData);
					numRequests += app.ext.store_prodlist.util.buildProductList(bindData);
					}
				}

			else if(namespace == 'product')	{
				//do nothing here, but make sure the 'else' for unrecognized namespace isn't reached.
				}
			else	{
				$('#globalMessaging').append(app.u.formatMessage("Uh oh! unrecognized namespace ["+namespace+"] used on attribute "+attribute+" for pid "+P.pid));
				}
			}// /p.pid
		else	{
			app.u.dump("Uh oh! Product ID not passed into beachmart_custom.util.getCrossSellers");
			}


		} //ends isset(databind).
	}); //ends each
				return numRequests;
				}, //buildQueriesFromTemplate
		




				
//app.ext.beachmart_custom.util.handleMinicartUpdate();			
			handleMinicartUpdate : function(tagObj)	{

				var itemCount = app.u.isSet(app.data[tagObj.datapointer].cart['data.item_count']) ? app.data[tagObj.datapointer].cart['data.item_count'] : app.data[tagObj.datapointer].cart['data.add_item_count']
//				app.u.dump(" -> itemCount: "+itemCount);
//used for updating minicarts.
				$('.cartItemCount').text(itemCount);
				var subtotal = app.u.isSet(app.data[tagObj.datapointer].cart['data.order_subtotal']) ? app.data[tagObj.datapointer].cart['data.order_subtotal'] : 0;
				var total = app.u.isSet(app.data[tagObj.datapointer].cart['data.order_total']) ? app.data[tagObj.datapointer].cart['data.order_total'] : 0;
				$('.cartSubtotal').text(app.u.formatMoney(subtotal,'$',2,false));
				$('.cartTotal').text(app.u.formatMoney(total,'$',2,false));

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
				app.u.dump("BEGIN beachmart_custom.util.handleCartUpSell");
				var stuff = app.data.cartItemsList.cart.stuff;
				var L = stuff.length;

				app.u.dump(" -> L: "+L);
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
					safeID = 'cartViewer_'+app.u.makeSafeHTMLId(stid);
					app.u.dump(" -> "+i+": "+stid+" and safeID: "+safeID);
					$li = $('#'+safeID);
					if(app.u.isSet(stuff[i].full_product['zoovy:accessory_products']))	{
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
				app.u.dump(" -> useIndex: "+useIndex);
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
				app.u.dump("BEGIN beachmart_custom.util.showUpsellItemsInCart");
				app.u.dump(" -> stid: "+stid);
				app.u.dump(P);
				var prodArray = new Array(); //product array

				$('.upsellTD').show().removeClass('loadingBG'); //make sure upsell panel is visible. could get turned off by user. prodlisttemplate will have individual loading graphics.
				if(stid || P)	{
					if(typeof P == 'object')	{
						prodArray = P;
						}
					else if(typeof P == 'undefined')	{
						//stid was passed, not the csv. go get csv.
						var stuffIndex = Number(app.ext.store_cart.util.getStuffIndexBySTID(stid));
//						app.u.dump(" -> stuffIndex: "+stuffIndex);
//						app.u.dump(" -> accessories: ");
//						app.u.dump(app.data.cartItemsList.cart.stuff[stuffIndex].full_product['zoovy:accessory_products']);
						if(stuffIndex >= 0)	{
//							app.u.dump("GOT HERE");
							prodArray = app.data.cartItemsList.cart.stuff[stuffIndex].full_product['zoovy:accessory_products'].split(',');
//							app.u.dump(" -> prodArray:"); app.u.dump(prodArray);

							}
						}
					else	{
						app.u.dump("WARNING! unknown or empty parameter passed into beachmart_custom.util.showUpsellItemsInCart. P follows:");
						app.u.dump(P);
						}
						
					if(prodArray.length > 0)	{
						safeID = 'cartViewer_'+app.u.makeSafeHTMLId(stid);
						this.handleAccessoryButtons();
	
						app.ext.store_prodlist.util.buildProductList({'csv':prodArray,'parentID':'upsellList','templateID':'productListTemplateBundle','hide_multipage':true});
						$('#'+safeID+' .hideAccessoriesBtn').show();
						$('#'+safeID+' .showAccessoriesBtn').hide();
						}
					else	{
						app.u.dump("WARNING! beachmart_custom.util.showUpsellItemsInCart received input stid AND/OR p but could not generate a prodlist");
						app.u.dump(" -> stid: "+stid);
						app.u.dump(P);
						}
					}
				else	{
					app.u.dump("WARNING! CSV not defined in beachmart_custom.util.showUpsellItemsInCart.");
					}

				},





//This will set all 'show' buttons to off. It will also set the 'hide' button hidden if the item has no accessories.
//this is only for handling state changes.  The click events are added in handleCartUpSell. If the events are handled here, they'll get applied multiple times
//because this function gets executed with each click.
			handleAccessoryButtons : function()	{
				var $stuffList = $('#cartStuffList');
		
				$('.hideAccessoriesBtn',$stuffList).hide(); //hide all the 'hide accessories' buttons
				$stuffList.children().each(function(index){
//					app.u.dump(" -> index: "+index);
//					app.u.dump($(this).attr('id'));
//					app.u.dump(" -> $(this).attr('data-hasaccessories'): "+$(this).attr('data-hasaccessories'));
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
				app.calls.refreshCart.init({'callback':'handleCart','parentID':'modalCartContents','extension':'beachmart_custom','templateID':'cartTemplate'},'immutable');
//don't set this up with a getShipping because we don't always need it.  Add it to parent functions when needed.
				},




			updateCartQty : function($input,tagObj)	{
				
				var stid = $input.attr('data-stid');
				var qty = $input.val();
				
				if(stid && qty && !$input.hasClass('disabled'))	{
					$input.attr('disabled','disabled').addClass('disabled').addClass('loadingBG');
					app.u.dump('got stid: '+stid);
//some defaulting. a bare minimum callback needs to occur. if there's a business case for doing absolutely nothing
//then create a callback that does nothing. IMHO, you should always let the user know the item was modified.
//you can do something more elaborate as well, just by passing a different callback.
					tagObj = $.isEmptyObject(tagObj) ? {} : tagObj;
					tagObj.callback = tagObj.callback ? tagObj.callback : 'updateCartLineItem';
					tagObj.extension = tagObj.extension ? tagObj.extension : 'store_cart';
					tagObj.parentID = 'cartViewer_'+app.u.makeSafeHTMLId(stid);
/*
the request for quantity change needs to go first so that the request for the cart reflects the changes.
the dom update for the lineitem needs to happen last so that the cart changes are reflected, so a ping is used.
*/
					app.ext.store_cart.calls.cartItemUpdate.init(stid,qty);
					this.updateCartSummary();
//lineitem template only gets updated if qty > 1 (less than 1 would be a 'remove').
					if(qty >= 1)	{
						app.calls.ping.init(tagObj,'immutable');
						}
					else	{
						$('#cartViewer_'+app.u.makeSafeHTMLId(stid)).empty().remove();
						}
					app.model.dispatchThis('immutable');
					}
				else	{
					app.u.dump(" -> a stid ["+stid+"] and a quantity ["+qty+"] are required to do an update cart.");
					}
				},




//obj currently supports one param w/ two values:  action: modal|message
			handleAddToCart : function(formID,obj)	{


if(typeof obj != 'object')	{
	obj = {'action':'message'}
	}

//app.u.dump("BEGIN store_product.calls.cartItemsAdd.init")
$('#'+formID+' .atcButton').addClass('disabled').attr('disabled','disabled');
if(!formID)	{
	//app error
	}
else	{
	var pid = $('#'+formID+'_product_id').val();
	if(app.ext.store_product.validate.addToCart(pid))	{
//this product call displays the messaging regardless, but the modal opens over it, so that's fine.
		app.ext.store_product.calls.cartItemsAdd.init(formID,{'callback':'itemAddedToCart','extension':'beachmart_custom'});
		if(obj.action == 'modal')	{
			app.ext.store_cart.util.showCartInModal('cartTemplate');
			app.calls.refreshCart.init({'callback':'handleCart','extension':'beachmart_custom','parentID':'modalCartContents','templateID':'cartTemplate'},'immutable');
			}
		else	{
			app.calls.refreshCart.init({'callback':'updateMCLineItems','extension':'beachmart_custom'},'immutable');
			}
		app.model.dispatchThis('immutable');
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
			app.u.dump("BEGIN beachmart_custom.util.getTransitInfo");

var prodAttribs = app.data['appProductGet|'+pid]['%attribs'];

var $r = $("<div class='shipSummaryContainer' \/>"); //what is returned. jquery object of shipping info.
$r.append("<span class='shipMessage'></span><span class='estimatedArrivalDate'></span><span title='Click to change destination zip code' class='deliveryLocation zlink pointer'></span><div class='deliveryMethod'></div><div class='expShipMessage'></div>");

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

if(prodAttribs['user:prod_ship_expavail'] == 1)	{
//if expedited shipping is not available, no other methods show up (will ship ground)
	$('.deliveryMethod',$r).append(data['@Services'][index]['method'])
	$('.deliveryMethod',$r).append(" (<span class='zlink'> Need it faster?</span>)").addClass('pointer').click(function(){
		app.ext.beachmart_custom.action.showShipGridInModal('appShippingTransitEstimate');
		});
	}
else	{
	app.u.dump(" -> prodAttribs['user:prod_ship_expavail']: "+prodAttribs['user:prod_ship_expavail']);
	$('.expShipMessage',$r).append("<span class='zhint'>Expedited shipping not available for this item</span>");
	}


$('.estimatedArrivalDate',$r).append(app.ext.beachmart_custom.util.yyyymmdd2Pretty(data['@Services'][index]['arrival_yyyymmdd']));

if(app.data.cartItemsList.cart['data.ship_state'] || app.data.cartItemsList.cart['data.ship_city'])	{
	$('.deliveryLocation',$r).append(" to "+app.data.cartItemsList.cart['data.ship_city']+" "+app.data.cartItemsList.cart['data.ship_state']+" (change)");
	}
else if	(app.data.cartItemsList.cart['data.ship_zip'])	{
	$('.deliveryLocation',$r).append(" to "+app.data.cartItemsList.cart['data.ship_zip']+" (change)")
	}
else{
	$('.deliveryLocation',$r).append(" (enter zip) ")
	}
$('.deliveryLocation',$r).click(function(){app.ext.beachmart_custom.action.showZipDialog()})
			return $r;
			}, //getTransitInfo
			
			handleToolTip : function()	{
//				app.u.dump("BEGIN beachmart_custom.util.handleToolTip.");
				$('.tipify',$('#appView')).each(function(){
					var $this = $(this);
					$this.parent().css('position','relative'); //this is what makes the tooltip appear next to the link instead of off in space.
					$this.mouseover(function(){	$('.toolTip',$this.parent()).show();}).mouseout(function(){	$('.toolTip',$this.parent()).hide();});
					});
				},
			

//pass in the @services object in a appShippingTransitEstimate and the index in that object of the fastest shipping method will be returned.
			getShipMethodByID : function(servicesObj,ID)	{
				var r = false; //what is returned. will be index of data object
				if(typeof servicesObj == 'object')	{
					var L = servicesObj.length;
					for(var i = 0; i < L; i += 1)	{
						if(servicesObj[i].id == ID)	{
							r = i;
							break; //no need to continue in loop.
							}
						}
					}
				else	{
					app.u.dump("WARNING! servicesObj passed into getFastestShipMethod is empty or not an object. servicesObj:");
					app.u.dump(servicesObj);
					}
//				app.u.dump(" -> fastest index: "+r);
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
					app.u.dump("WARNING! servicesObj passed into getFastestShipMethod is empty or not an object. servicesObj:");
					app.u.dump(servicesObj);
					}
//				app.u.dump(" -> fastest index: "+r);
				return r;
				},
			getDOWFromDay : function(X)	{
//				app.u.dump("BEGIN beachmart_custom.util.getDOWFromDay ["+X+"]");
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
//					app.u.dump(" date obj: "); app.u.dump(d);
//					app.u.dump(" -> YYYYMMDD2Pretty ["+str+"]: Y["+year+"]  Y["+month+"]  Y["+day+"] ");
					r = this.getDOWFromDay(d.getDay())+" "+month+"/"+day
					}
				else	{
					app.u.dump("WARNING! the parameter passed into YYYYMMDD2Pretty is not a numder ["+str+"]");
					}
				return r;
				} //yyyymmdd2Pretty 
		
			} //util

		} //r object.
	return r;
	}