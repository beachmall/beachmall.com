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



//    !!! ->   TODO: replace 'username' in the line below with the merchants username.     <- !!!

var beachmall_store = function(_app) {
	var theseTemplates = new Array('');
	var r = {


////////////////////////////////////   CALLBACKS    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\



	callbacks : {
//executed when extension is loaded. should include any validation that needs to occur.
		init : {
			onSuccess : function()	{
				var r = false; //return false if extension won't load for some reason (account config, dependencies, etc).

				//if there is any functionality required for this extension to load, put it here. such as a check for async google, the FB object, etc. return false if dependencies are not present. don't check for other extensions.
				
				_app.ext.store_filter.u.bindOnclick();
				
				r = true;

				return r;
				},
			onError : function()	{
//errors will get reported for this callback as part of the extensions loading.  This is here for extra error handling purposes.
//you may or may not need it.
				_app.u.dump('BEGIN admin_orders.callbacks.init.onError');
				}
			},
			
		startExtension : {
			onSuccess : function() {
				_app.templates.homepageTemplate.on('complete.beachmall_store',function(event,$ele,P) {
					$('.floatingBar',$ele).show(); //shows floating bar upon return to hompage if it's been closed.
				});
				
				_app.templates.categoryTemplate.on('complete.beachmall_store',function(event,$ele,P) {
					_app.ext.beachmall_store.u.backToTop($ele);
				});
				
				_app.templates.categoryTemplateBrands.on('complete.beachmall_store',function(event,$ele,P) {
					_app.ext.beachmall_store.u.tabify($ele,".brandsTabs");
				});
				
				_app.templates.searchTemplate.on('complete.beachmall_store',function(event,$ele,P) {
					_app.ext.beachmall_store.u.backToTop($ele);
				});
				
				_app.templates.productTemplate.on('complete.beachmall_store',function(event,$ele,P) {
					_app.ext.beachmall_store.u.backToTop($ele);
				});
				
				_app.templates.companyTemplate.on('complete.beachmall_store',function(event,$ele,P) {
					_app.ext.beachmall_store.u.backToTop($ele);
				});
				
				_app.templates.checkoutTemplate.on('complete.beachmall_store',function(event,$ele,P) {
					_app.ext.beachmall_store.u.backToTop($ele);
				});
				
				
				//creates tool tip for variations and product sibling thumbnails
				$( document ).tooltip({
					items : "img[data-big-img], [data-toolTipThumb], [data-cartToolTipThumb], [data-toolTipQuickview], [data-grid-img]",
					position : {
						my : "bottom-5",
						at : "top"
					},
					//track : true,
					content : function(){
						var element = $(this);
						//thumbnail zoom for option image select thumbnails
						if (element.is("img[data-big-img]")) {
							var pid = $(this).closest('[data-pid]').attr('data-pid');
							var product = _app.data['appProductGet|'+pid];
						//	_app.u.dump('>>>>> '); _app.u.dump(pid);
							
							//_app.u.dump('>>>>> '); _app.u.dump(product['@variations']['1']['options']['0'].prompt);
							return '<div class="toolTipWrapper"><span class="optionsZoom">'+$(this).attr('data-tooltip-title')+'</span><img src="'+$(this).attr('data-big-img')+'" width="400" height="400" /></div>';
							}
						//thumbnail zoom for option grid image thumbnails
						if (element.is("[data-grid-img]")) {
							var pid = $(this).closest('[data-pid]').attr('data-pid');
							var product = _app.data['appProductGet|'+pid];
						//	_app.u.dump('>>>>> '); _app.u.dump(product);
							
							//_app.u.dump('>>>>> '); _app.u.dump(product['@variations']['1']['options']['0'].prompt);
							return '<div class="toolTipWrapper"><span class="optionsZoom">'+$(this).attr('data-tooltip-title')+'</span><img src="'+$(this).attr('data-grid-img')+'" width="400" height="400" /></div>';
							}
						//thumbnail zoom for sibling thumbnails
						if (element.is("[data-toolTipThumb]")) {
							//_app.u.dump($(this).closest('[data-pid]').attr('data-pid'));
							var pid = $(this).closest('[data-pid]').attr('data-pid');
							var product = _app.data['appProductGet|'+pid];
							if(product && product['%attribs'] && product['%attribs']['zoovy:prod_name']) {
								var prodName = product['%attribs']['zoovy:prod_name'];
								var productImg = _app.u.makeImage({"w":400,"h":400,"b":"ffffff",tag:0,"name":product['%attribs']['zoovy:prod_image1']});
								return '<div class="toolTipWrapper"><span class="siblingZoom">'+prodName+'</span><img src="'+productImg+'" width="400" height="400" /></div>';
							}
						}
						//thumbnail zoom for accessory in cart line items
						if (element.is("[data-cartToolTipThumb]")) {
							//_app.u.dump($(this).closest('[data-pid]').attr('data-pid'));
							var pid = $(this).closest('[data-pid]').attr('data-pid');
							var product = _app.data['appProductGet|'+pid];
							if(product && product['%attribs']) {
								var prodName = product['%attribs']['zoovy:prod_name'] ? product['%attribs']['zoovy:prod_name'] : "";
								var prodPrice = product['%attribs']['zoovy:base_price'] ? product['%attribs']['zoovy:base_price'] : "";
								prodPrice = _app.u.formatMoney(prodPrice,'$',2,true);
								var productImg = _app.u.makeImage({"w":200,"h":200,"b":"ffffff",tag:0,"name":product['%attribs']['zoovy:prod_image1']});
								return '<div class="cartToolTipWrapper"><span class="cartAccZoom">'+prodName+'</span><span class="cartAccZoom cartAccZoomPrice">'+prodPrice+'</span><img src="'+productImg+'" width="200" height="200" /></div>';
							}
						}
						//thumbnail zoom for thumbs under main prod images in quickview
						if (element.is("[data-toolTipQuickview]")) {
							//_app.u.dump('&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&'); _app.u.dump($(this).closest('[data-toolTipName]').attr('data-toolTipName'));
							var pid = $(this).closest('[data-pid]').attr('data-pid');
							var product = _app.data['appProductGet|'+pid];
							var prodName = product['%attribs']['zoovy:prod_name'];
							var imgName = $(this).closest('[data-toolTipName]').attr('data-toolTipName');
							var productImg = _app.u.makeImage({"w":400,"h":400,"b":"ffffff",tag:0,"name":imgName});
							return '<div class="toolTipWrapper"><span class="quickviewZoom">'+prodName+'</span><img src="'+productImg+'" width="400" height="400" /></div>';
							}
						}
					});
			},
			onError : function() {
				_app.u.dump('START beachmall_store.callbacks.startExtension.onError');
			}
		}
			
	}, //callbacks



////////////////////////////////////   ACTION    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

//actions are functions triggered by a user interaction, such as a click/tap.
//these are going the way of the do do, in favor of app events. new extensions should have few (if any) actions.
		a : {
		/**CATEGORY FUNCTIONS */
				//add a class (first arg) to an element (third arg) and toggles the text on the 
				//calling element (second arg) between the last two args. 
			toggleMyClass : function(arg,$tag,$tagParent,primary,secondary) {
				var which = $tag.text();
				switch(which) {
					case 'OFF':
						$tagParent.addClass(arg);
						$tag.text(secondary);
						break;
					case 'ON':
						$tagParent.removeClass(arg);
						$tag.text(primary);
						break;
				}
			},
			
		/**PRODUCT LIST FUNCTIONS */
				//sets prod image frame and view detail button to hover red on mouseenter of the other
			resultsredmousein : function($this) {
				$('.myProdThumbSmall',$this.parent()).css('border','5px solid #e0463a');
				$('.moreDetailsSmall',$this.parent()).css('background-color','#e0463a');
			},
			
				//sets prod image frame and view detail button to default state on mouseleave of the other
			resultsredmouseout : function($this) {
				$('.myProdThumbSmall',$this.parent()).css('border','5px solid #ffffff');
				$('.moreDetailsSmall',$this.parent()).css('background-color','#3bb3c3');
			},
			
		/**CUSTOMER ARTICLE FUNCTIONS */
				//clears the order/prod id field in contact form to be sure it doesn't still 
				//have showContactPID value still displayed (if form did not get submitted). 
			resetContactPID : function() {
				var $field = $('#contactFormOID','#mainContentArea_company');
				$field.val('');
				//$field.attr('placeholder', 'Order Number (if applicable)');
			}

		}, //Actions

////////////////////////////////////   RENDERFORMATS    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

//renderFormats are what is used to actually output data.
//on a data-bind, format: is equal to a renderformat. extension: tells the rendering engine where to look for the renderFormat.
//that way, two render formats named the same (but in different extensions) don't overwrite each other.
		renderFormats : {
		/**LIST FORMATS */
				//creates image for search results lists from user:app_thumb (a copy of image1) to prevent
				//banner/icon images that had been getting indexed from being used for the list image.
			appthumb : function($tag, data) {
				//_app.u.dump('--> store_filter: appThumb started'); _app.u.dump(data.value.images[0]);
				data.bindData.b = data.bindData.bgcolor || 'ffffff'; //default to white.
				
				if(data.value) {
					data.bindData.name = data.value.app_thumb;
					data.bindData.w = $tag.attr('width');
					data.bindData.h = $tag.attr('height');
					data.bindData.tag = 0;
					$tag.attr('src',_app.u.makeImage(data.bindData));
				}
			}, //appThumb
			
		/**LIST FORMATS */
			//sets the overhang tag and hides discontinued products in a product list.
			showprodmodifier : function($tag, data) {
				//_app.u.dump('-----showprodmodifier'); _app.u.dump(data.value); //_app.u.dump(data.globals.tags[data.globals.focusTag]);
				var zoovyIsTags = (data.bindData.iselastic) ? data.value.tags : data.value['%attribs']['zoovy:prod_is_tags'];

				if (zoovyIsTags.indexOf('IS_DISCONTINUED') >= 0) {
/*MARK: uncomment*/				//$tag.parent().parent().parent().hide().attr('data-discontinued',1);
				}
				else if (zoovyIsTags.indexOf('IS_USER3') >= 0) {
					$tag.append('Closeout!').addClass('smallRed').show();
				}
				else if (zoovyIsTags.indexOf('IS_CLEARANCE') >= 0) {
					$tag.append('Clearance').addClass('smallRed').show();
				}
				else if (zoovyIsTags.indexOf('IS_USER6') >= 0) {
					$tag.append('Customer Favorite').show();
				}
				else if (zoovyIsTags.indexOf('IS_USER4') >= 0) {
					$tag.append('Exclusive').addClass('smallTagBkgrnd').show();
				}
				else if (zoovyIsTags.indexOf('IS_USER5') >= 0) {
					$tag.append('Exclusive').addClass('smallTagBkgrnd').show();
				}
				else if (zoovyIsTags.indexOf('IS_BESTSELLER') >= 0) {
					$tag.append('Best Seller').addClass('smallBlue').show();
				}
				else if (zoovyIsTags.indexOf('IS_USER2') >= 0) {
					$tag.append('New Low Price!').addClass('mediumTagBkgrnd').show();
				}
				else if (zoovyIsTags.indexOf('IS_NEWARRIVAL') >= 0) {
					$tag.append('New Arrival').addClass('smallTagBkgrnd').show();
				}
				else if (zoovyIsTags.indexOf('IS_USER7') >= 0) {
					$tag.append('Overstock Sale').addClass('mediumRed').show();
				}
	/*			else if (zoovyIsTags.indexOf('IS_DISCONTINUED') >= 0) {
					$tag.append('Discontinued').addClass('mediumTagBkgrnd').show();
				}
	*/			else if (zoovyIsTags.indexOf('IS_PREORDER') >= 0) {
					$tag.append('Back Order').addClass('smallTagBkgrnd').show();
				}
				/*else if (zoovyIsTags.indexOf('IS_SALE') >= 0) {
					$tag.append('SALE!').addClass('smallTagBkgrnd').show();
				}*/
				else {
					//add no tags
				}
			},
			
			//if inventory is 0, don't show in product list (not used w/ elastic because of pagination & absence of inventory data)
			inventoryhide : function($tag, data) {
				var pid = data.value.pid;
				if(data.value['@inventory'] && data.value['@inventory'][pid]) {
					var inventory = data.value['@inventory'][pid]['inv'];
					if(inventory == 0) {
						$tag.addClass('displayNone');
					}
				}	
			},
			
			//sets a description on the price of a product (usually in a product list)
			prodpricedesc : function($tag, data) {
				//var priceFrom = (data.bindData.isElastic) ? data.value.tags : data.value['%attribs']['zoovy:prod_is_tags'];
				var priceFrom = data.value['%attribs']['user:prod_has_price_modifiers'];
				//var sale = (data.bindData.isElastic) ? data.value.tags : data.value['%attribs']['zoovy:prod_is_tags'];
				var sale = data.value['%attribs']['is:sale'];
				//var zoovyIsTags = (data.bindData.isElastic) ? data.value.tags : data.value['%attribs']['zoovy:prod_is_tags'];
				var zoovyIsTags = data.value['%attribs']['zoovy:prod_is_tags'];
				
				//app.u.dump('*** zoovyIsTags = '+zoovyIsTags);
				//app.u.dump('***Price Modifier = '+priceFrom);
				if (zoovyIsTags.indexOf('IS_USER3') >= 0) {
					$tag.append('Clearance Price!');
				}
				else if (zoovyIsTags.indexOf('IS_SALE') >= 0) {
					$tag.append('Sale Price!');
				}
				else if (sale != 0) {
					$tag.append('Sale Price!');
				}
				else if(priceFrom == 1) {
					$tag.append('From');
				} 
				else {
					$tag.append('Our Price');
				}
				
			}, //End prodPriceDesc
			
			//shows free shipping statement in product list if value is set
			showfreeshippingtag : function($tag, data) {
				var isShipFree = (data.bindData.iselastic) ? data.value.tags : data.value['%attribs']['zoovy:prod_is_tags'];
				if(isShipFree) {
					if(isShipFree.indexOf('IS_SHIPFREE') >= 0) {
						$tag.show();
					}
				}
			}, //End showFreeShippingTag
			
			//shows ships on/in message if data is set, takes into account when the message is displayed
			showshiplatency : function ($tag, data) {
				//app.u.dump('***TEST '); app.u.dump(data.value);
				setTimeout(function(){
						//set the vars needed to determine message
					if($tag.attr('data-cart')) {	//if is for cart prod list
						if((data.value.stid && data.value.stid[0] == '%') || data.value.asm_master) {
							return; //if this is an assembly product in the cart, skip the time in trans altogether
						}
						else if(data.value.product) {
							var prod = app.data['appProductGet|'+app.u.makeSafeHTMLId(data.value.product)];
							//possible for this user:prod_shipping_msg to be present but not set, make it a blank string to prevent undefined. 
							var userProdShipMsg = prod['%attribs']['user:prod_shipping_msg'] ? prod['%attribs']['user:prod_shipping_msg'] : "" ;
							var us1ts = prod['%attribs']['us1:ts'];
							var zoovyProdSalesRank = prod['%attribs']['zoovy:prod_salesrank'];
							var zoovyIsPreOrder = prod['%attribs']['zoovy:prod_is_tags'];
							var zoovyPreOrder = prod['%attribs']['is:preorder'];
							var zoovyIsUser1 = prod['%attribs']['is:user1'];
						} else {app.u.dump('Problem w/ data.value in beachmart.js: renderformats.showShipLatency. Data follows:'); app.u.dump(data.value);}
						
						if(data.value.product) {
							var prod = app.data['appProductGet|'+app.u.makeSafeHTMLId(data.value.product)];
							if(prod['%attribs'] && prod['%attribs']['user:is_dropship'] && prod['%attribs']['user:is_dropship'] == 1) {
									//don't start time in transit, hide loadingBG and insert message
								$('.cartPutLoadingHere',$tag.parent()).removeClass('loadingBG').text('Expedited shipping not available for this item');
							} else {
									//pass stid so each item can be found in cart later when time in transit info gets added
								var stid = app.u.makeSafeHTMLId($tag.parent().parent().parent().attr('data-stid'));
								app.ext.beachmart_cartEstArrival.u.initEstArrival(prod, stid);
							}
						} else {app.u.dump('Problem w/ data.value in beachmart.js: renderformats.showShipLatency. Data follows:'); app.u.dump(data.value);}
					}
					else {	//else is for not cart prod list
						//possible for this user:prod_shipping_msg to be present but not set, make it a blank string to prevent undefined.
						var userProdShipMsg = data.value['%attribs']['user:prod_shipping_msg'] ? data.value['%attribs']['user:prod_shipping_msg'] : "";
						var us1ts = data.value['%attribs']['us1:ts'];
						var zoovyProdSalesRank = data.value['%attribs']['zoovy:prod_salesrank'];
						var zoovyIsPreOrder = data.value['%attribs']['zoovy:prod_is_tags'];
						var zoovyPreOrder = data.value['%attribs']['is:preorder'];
						var zoovyIsUser1 = data.value['%attribs']['is:user1'];
					}
					var d = new Date();
					var month = d.getMonth()+1;
					var day = d.getDate();
					var year = d.getFullYear();
					if (month < 10){month = '0'+month};
					if (day < 10){day = '0'+day};
					var date = year + '' + month + '' + day;

					//Item is preorder, get back to the future Marty! (when it will be shipped)
					if ((zoovyPreOrder || zoovyIsUser1 || zoovyIsPreOrder || zoovyIsPreOrder.indexOf('IS_PREORDER') > -1) && ([zoovyProdSalesRank > -1 || zoovyProdSalesRank != undefined] && zoovyProdSalesRank > date) ) {
						//var outputDate =  zoovyProdSalesRank.substring(5,6) + '/' + zoovyProdSalesRank.substring(7,8) + '/' + zoovyProdSalesRank.substring(0,4);
						//app.u.dump('*** '+outputDate);
						$tag.empty().append('Backorder: Will ship on '+app.ext.beachmart.u.yyyymmdd2Pretty(zoovyProdSalesRank));
						$tag.attr('data-cart') ? $tag.css('color','#e0463a') : $tag.css('color','blue');
/*should be for cart only?*/$tag.parent().parent().attr('data-backorder',zoovyProdSalesRank); //used to mod time in transit arrival date for backorder items 
							//set groundonall to indicate for all cart shipping items to be ground in beachmart_cartEstArrival showTransitTimes.
							//will also ensure expedited shipping not available message will be shown for this item. 
/*should be for cart only?*/$('#cartTemplateShippingContainer').attr('groundonall',1); 
					}
					//Not a pre-order, show present-day ship info.
					else if (zoovyProdSalesRank == undefined || zoovyProdSalesRank <= date) {
						//$tag.children('.shipTime').show();
						$tag.children('.shipTime').empty().text(userProdShipMsg).show();
						var n = d.getDay();
						var t = d.getUTCHours();
						if(date < 20131103) {
							t = t - 4;
						}
						else if (date > '20131102' && date < '20140309') {
							t = t - 5;
						}
						else {
							// posibly need further years calculated here
						}
						if(userProdShipMsg) {
							if(userProdShipMsg.indexOf('Ships Today by 12 Noon EST') > -1){
								if ( (t >= 12 && (n > 0 && n < 5)) || date == 20130704 || date == 20130902 || date == 20131225 || date == 20131231 || date == 20140101 || date == 20140526 || date == 20140704) {
									//Time is after noon, day is Mon-Thurs, OR is a UPS holiday weekday
									$tag.empty().append('Ships Next Business Day');
								}
								else if (((t >= 12 && n == 5) || (n > 5 && n < 1)) || date == 20131128 || date == 20131129) {
									//Time is after noon, day is Fri (FUN FUN FUN FUN)
									//OR it is the Weekend, OR is UPS Thanksgiving weekend
									$tag.empty().append('Ships Monday by 12 Noon EST');
								}
								else {
									//It is before noon on a Weekday, shipping message is perfectly fine
								}
							}
						}
						else { //userProdShipMsg is not set, skip it
						}
					}
					else { 
						//do nada*/
					}
				},1000); //setTimeout
			}, //showShipLatency
			
/*MARK - This may not be usable any longer, and may need to be killed altogether*/			
			siblingcount : function($tag, data) {
				var count = 0;
				$('ul.fluidList li',$tag.parent().parent()).each(function(){
					if($(this).attr('data-purchasable')) {
						count += 1;
					}
				});
				
				if(count > 5) {
					$tag.show();
				}
			},
			
				//gets list of siblings from product (if present) and puts first two on product list
				//the one that doesn't match the product is set first
			siblingproductlist : function($tag,data)	{
			//	_app.u.dump("BEGIN beachmall_store.renderFormats.siblingProductList");
			//	_app.u.dump(" -> data.bindData: "); _app.u.dump(data.bindData); _app.u.dump(data.value); 
				var pid = _app.u.makeSafeHTMLId($tag.parent().attr('data-pid'));
		
				if(_app.u.isSet(data.value))	{
						//data is comma separated list, make into array for processing
					var listOfProducts = data.value.split(",");
						//if at least two sib images exist,
						//check if first sib is prod image, if not send as is, if so put second image first
					if(listOfProducts[0] && listOfProducts[1]) {
						if(listOfProducts[0].indexOf(''+pid) < 0) {
							data.bindData.csv = data.value;
						}
						else {  //flip values
							var tmp = listOfProducts[1];
							listOfProducts[1] = listOfProducts[0];
							listOfProducts[0] = tmp;
 							data.bindData.csv = listOfProducts;
						}
						data.bindData.loadsTemplate = data.bindData.templateid;
						_app.ext.store_prodlist.u.buildProductList(data.bindData,$tag);	
					}
					
						//check to see if any of the siblings came back un-purchasable. 
						//If none purchasable, hide ul.
					var count = 0;
					$tag.children().each(function() {
						if($(this).data('purchasable')) {count += 1;}
					}); 
					if(count == 0) {$tag.hide();}
				}
			}, //siblingProductList	
			
				//looks at siblings added with siblingProductList and hides if not purchasable.
				//adds an attribute used for counting number of purchasable siblings if is purchasable
			hideifnotpurchaseable : function($tag, data) {
				if(_app.ext.store_product.u.productIsPurchaseable(data.value)) {
					$tag.attr('data-purchasable',true);
//					_app.u.dump('Product is purchasable....');
					//yay, you get to stay in the list!!
				}
				else {
					$tag.hide();
//					_app.u.dump('TAG HIDDEN!!');
				}
			}, //hideIfNotPurchaseable

		}, //renderFormats
////////////////////////////////////   UTIL [u]   \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

//utilities are typically functions that are exected by an event or action.
//any functions that are recycled should be here.
		u : {
		/**GENERAL UTILS */
				//will add tabs to the selector in the context passed
			tabify : function($context,selector) {
				var $tabContainer = $(selector,$context);
				if($tabContainer.length)	{
					if($tabContainer.data("widget") == 'anytabs'){} //tabs have already been instantiated. no need to be redundant.
					else	{
						$tabContainer.anytabs();
					}
				}
				else	{
					_app.u.dump("WARNING! could not find selector for brand tab items");
				} //couldn't find the tab to tabificate.
			},
		
			backToTop : function($context) {
				$($context).append('<div class="appBackToTop pointer" onClick="myApp.ext.beachmall_store.u.scrollToTop()"><span class="sprite"></span>Back to Top</div>')
			},
			
			scrollToTop : function() {
				$('html,body').animate({ scrollTop: 0 }, 'slow');
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
