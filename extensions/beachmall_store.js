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
			
				_app.ext.beachmall_store.u.hardImgSrc();
				_app.ext.beachmall_store.u.addHover();
			
				_app.templates.homepageTemplate.on('complete.beachmall_store',function(event,$ele,P) {
					$('.floatingBar',$ele).show(); //shows floating bar upon return to hompage if it's been closed.
				});
				
				_app.templates.categoryTemplate.on('complete.beachmall_store',function(event,$ele,P) {
					_app.ext.beachmall_store.u.backToTop($ele);
				});
				
				_app.templates.categoryTemplateBrands.on('complete.beachmall_store',function(event,$ele,P) {
					_app.ext.beachmall_store.u.tabify($ele,".brandsTabs");
					_app.ext.beachmall_store.u.countBrandsItems($ele,"#viewAllProductsTab");
					_app.ext.beachmall_store.u.countBrandsItems($ele,"#featuredProdsTab");
					_app.ext.beachmall_store.u.countBrandsItems($ele,"#bestSellersTab");
				});
				
				_app.templates.searchTemplate.on('complete.beachmall_store',function(event,$ele,P) {
					_app.ext.beachmall_store.u.backToTop($ele);
				});
				
				_app.templates.productTemplate.on('complete.beachmall_store',function(event,$ele,P) {
					_app.ext.beachmall_store.u.backToTop($ele);
					_app.ext.beachmall_store.u.tabify($ele,"[data-app-role='xsellTabContainer']");
					_app.ext.beachmall_store.u.tabify($ele,".tabbedProductContent");
					_app.ext.beachmall_store.u.handleToolTip();
				});
				
				_app.templates.companyTemplate.on('complete.beachmall_store',function(event,$ele,P) {
					_app.ext.beachmall_store.u.backToTop($ele);
				});
				
				_app.templates.checkoutTemplate.on('complete.beachmall_store',function(event,$ele,P) {
					_app.ext.beachmall_store.u.backToTop($ele);
				});
				
				$.extend(handlePogs.prototype,_app.ext.beachmall_store.variations);				
				
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
						},
					//	tooltipClass : "toolTipBG",
					//	open : function(event,ui){
					//		_app.u.dump('----It opened');
					//	}
					});
			},
			onError : function() {
				_app.u.dump('START beachmall_store.callbacks.startExtension.onError');
			}
		},
		
		//renders redirect product on the product page
		renderRedirectProduct : {
			onSuccess:function(responseData){	
				_app.u.dump(' -> renderRedirectProduct');
				responseData.$container.anycontent({"templateID":responseData.loadsTemplate,"datapointer":responseData.datapointer}); 
			},
			onError:function(responseData){	
				_app.u.dump('Error in extension: store_filter renderRedirectProduct');
			}
		},
			
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
			//will change a class on the parent container of the brands product list tab to switch view to show all/featured/bestselling items. 
			//works in conjunction with beachmall_store.renderFormats.brandslistfilter & countBrandsItems
			brandTabSwitch : function($tag) {
//				dump('brandTabSwitch attribute: '); dump($('a',$tag).attr('href'));
				var $context = $('#categoryTemplateBrands_'+_app.u.makeSafeHTMLId($tag.parent().attr('data-brand-path')));
				var thisHref = $('a',$tag).attr('href');
				switch (thisHref) {
					case "#viewAllProductsTab" :
						$tag.parent().parent().removeClass('brandTabsF');
						$tag.parent().parent().removeClass('brandTabsB');
						$tag.parent().parent().addClass('brandTabsA');
			//			_app.ext.beachmall_store.u.countBrandsItems($context,thisHref);
						break;
					case "#featuredProdsTab" :
						$tag.parent().parent().removeClass('brandTabsA');
						$tag.parent().parent().removeClass('brandTabsB');
						$tag.parent().parent().addClass('brandTabsF');
			//			_app.ext.beachmall_store.u.countBrandsItems($context,thisHref);
						break;
					case "#bestSellersTab" :
						$tag.parent().parent().removeClass('brandTabsA');
						$tag.parent().parent().removeClass('brandTabsF');
						$tag.parent().parent().addClass('brandTabsB');
			//			_app.ext.beachmall_store.u.countBrandsItems($context,thisHref);
						break;
					default :
						//if we got here, something isn't right... there are only three tabs.
						$tag.parent().parent().removeClass('brandTabsA');
						$tag.parent().parent().removeClass('brandTabsF');
						$tag.parent().parent().removeClass('brandTabsB');
				}
			},

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
			
/**PRODUCT PAGE FUNCTIONS */			
			scrollToRevealTab : function(pid, href) {
				var $context = $(_app.u.jqSelector("#","productTemplate_"+pid));
				var $prodSizing = $(".tabbedProductContent",$context);
				setTimeout(function(){
					$("a[href="+href+"]",$context).mouseenter();
					$('html, body').animate({
						scrollTop: $prodSizing.offset().top
					}, 2000);
				},500);
			},
			
				//Q&A link on product page will populate the order/prod id field on contact form w/ pid
			showContactPID : function (pid) {
				//app.u.dump('the pid is: '); app.u.dump(pid);
				setTimeout(function(){$('#contactFormOID','#mainContentArea_company').val('SKU: '+pid)},1000);
			},

/**CUSTOMER ARTICLE FUNCTIONS */
				//clears the order/prod id field in contact form to be sure it doesn't still 
				//have showContactPID value still displayed (if form did not get submitted). 
			resetContactPID : function() {
				var $field = $('#contactFormOID','#mainContentArea_company');
				$field.val('');
				//$field.attr('placeholder', 'Order Number (if applicable)');
			},
			
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

			//sets the overhang tag and hides discontinued products in a product list.
			showprodmodifier : function($tag, data) {
				//_app.u.dump('-----showprodmodifier'); _app.u.dump(data.value); //_app.u.dump(data.globals.tags[data.globals.focusTag]);
				var zoovyIsTags = (data.bindData.iselastic) ? data.value.tags : data.value['%attribs']['zoovy:prod_is_tags'];
				
				if (zoovyIsTags.indexOf('IS_DISCONTINUED') >= 0 || !_app.ext.store_product.u.productIsPurchaseable(data.value.pid)) {
					$tag.parent().parent().parent().parent().hide().attr('data-discontinued',1);
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
					$tag.append('Commercial Quality').addClass('mediumTagBkgrnd').show();
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
			//also used on product and quickview pages
			showshiplatency : function ($tag, data) {
				//_app.u.dump('***TEST '); _app.u.dump(data.value);
				setTimeout(function(){
						//set the vars needed to determine message
					if($tag.attr('data-cart')) {	//if is for cart prod list
						if((data.value.stid && data.value.stid[0] == '%') || data.value.asm_master) {
							return; //if this is an assembly product in the cart, skip the time in trans altogether
						}
						else if(data.value.product) {
							var prod = _app.data['appProductGet|'+_app.u.makeSafeHTMLId(data.value.product)];
							//possible for this user:prod_shipping_msg to be present but not set, make it a blank string to prevent undefined. 
							var userProdShipMsg = prod['%attribs']['user:prod_shipping_msg'] ? prod['%attribs']['user:prod_shipping_msg'] : "" ;
							var us1ts = prod['%attribs']['us1:ts'];
							var zoovyProdSalesRank = prod['%attribs']['zoovy:prod_salesrank'];
							var zoovyIsPreOrder = prod['%attribs']['zoovy:prod_is_tags'];
							var zoovyPreOrder = prod['%attribs']['is:preorder'];
							var zoovyIsUser1 = prod['%attribs']['is:user1'];
						} else {_app.u.dump('Problem w/ data.value in beachmall_store.js: renderformats.showShipLatency. Data follows:'); _app.u.dump(data.value);}
						
						if(data.value.product) {
							var prod = _app.data['appProductGet|'+_app.u.makeSafeHTMLId(data.value.product)];
							if(prod['%attribs'] && prod['%attribs']['user:is_dropship'] && prod['%attribs']['user:is_dropship'] == 1) {
									//don't start time in transit, hide loadingBG and insert message
								$('.cartPutLoadingHere',$tag.parent()).removeClass('loadingBG').text('Expedited shipping not available for this item');
							} else {
									//pass stid so each item can be found in cart later when time in transit info gets added
								var stid = _app.u.makeSafeHTMLId($tag.parent().parent().parent().attr('data-stid'));
								_app.ext.beachmall_cartestarrival.u.initEstArrival(prod, stid);
							}
						} else {_app.u.dump('Problem w/ data.value in beachmart.js: renderformats.showShipLatency. Data follows:'); _app.u.dump(data.value);}
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
						//_app.u.dump('*** '+outputDate);
						$tag.empty().append('Backorder: Will ship on '+_app.ext.beachmart.u.yyyymmdd2Pretty(zoovyProdSalesRank));
						$tag.attr('data-cart') ? $tag.css('color','#e0463a') : $tag.css('color','blue');
/*should be for cart only?*/$tag.parent().parent().attr('data-backorder',zoovyProdSalesRank); //used to mod time in transit arrival date for backorder items 
							//set groundonall to indicate for all cart shipping items to be ground in beachmall_cartEstArrival showTransitTimes.
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
//				_app.u.dump("BEGIN beachmall_store.renderFormats.siblingProductList");
//				_app.u.dump(" -> data.bindData: "); _app.u.dump(data.bindData); _app.u.dump(data.value); 
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
					$tag.show();
					$tag.attr('data-purchasable',true);
//					_app.u.dump('Product is purchasable....');
					//yay, you get to stay in the list!!
				}
				else {
					$tag.hide();
//					_app.u.dump('TAG HIDDEN!!');
				}
			}, //hideIfNotPurchaseable
			
			//will add classes to brand product list items for showing/hiding based on presence of all/featured/bestselling tags or attributes.
			//works in conjunction with beachmall_store.a.brandTabSwitch
			brandslistfilter : function($tag,data) {
				if($tag.parent().parent().attr('data-brand-filter')) {
			//		var filterType = $tag.parent().parent().attr('data-brand-filter');
//					dump('The brand filter was found.'); dump(filterType);//data-brand-filter="bestseller
					$tag.parent().addClass('brandListItem');
			//		switch (filterType) {
			//			case 'featured' :
							if(data.value && data.value['%attribs']) {
//								dump('in brandslistfilter featured');
								if(data.value['%attribs']['zoovy:prod_is_tags'] && (data.value['%attribs']['zoovy:prod_is_tags'].indexOf('IS_USER2') != -1 || data.value['%attribs']['zoovy:prod_is_tags'].indexOf('IS_USER3') != -1 || data.value['%attribs']['zoovy:prod_is_tags'].indexOf('IS_USER6') != -1)) {
									 /*this is a featured item, it should be in the list*/
									 $tag.parent().addClass('brandFeatured');
								}
								else if(data.value['%attribs']['user:prod_promo'] && data.value['%attribs']['user:prod_promo'].indexOf('IS_USER4') != -1) { 
									/*same as above*/ 
									$tag.parent().addClass('brandFeatured');
								}
								else { 
			//						$tag.parent().hide(); /*this product isn't a featured item, don't show it.*/
								}
							}
			//				else { $tag.parent().hide(); dump('featured hidden...'); dump(data.value.pid) /*no tags or prod_promo attrib means it's definitely not a featured item*/ }
			//				break;
			//			case 'bestseller' :
							if(data.value && data.value['%attribs'] && data.value['%attribs']['zoovy:prod_is_tags']) {
//								dump('in brandslistfilter bestseller');
								if(data.value['%attribs']['zoovy:prod_is_tags'].indexOf('IS_BESTSELLER') != -1) {
									/*this is a best seller, it should be in the list*/
									$tag.parent().addClass('brandBestSeller');
								}
								else { 
			//						$tag.parent().hide(); //this product isn't a best seller, don't show it.
								}
							}
			//				break;
			//			default :
//							dump('in brandslistfilter default');
			//		}
				}
				else { /*this isn't a brands category product list no need for this rubbish.*/ }
			}, //brandslistfilter
			
/**PRODUCT PAGE FORMATS */	

			//appends an anchor tag with a keyword search for data.value to the calling tag
			searchlink : function($tag,data) {
//				dump('START beachmall_store searchlink'); dump(data.value);
				//check if schema attrib is needed and add if so.
				if($tag.attr('data-schema') == 1) {
					$tag.append("<a href=#!search/keywords/"+data.value+" itemprop='manufacturer' class='underline'>"+data.value+"</a>");
				}
				else {
					$tag.append("<a href=#!search/keywords/"+data.value+" class='underline'>"+data.value+"</a>");
				}
			},
			
			//hides geo location/time in transit and add to cart button if product is discontinued or not purchasable
			hidegeoelements : function($tag, data) {
				//_app.u.dump('*********************'); _app.u.dump(data.value.pid); 
				if(data.value['%attribs']['zoovy:prod_is_tags']
					&& data.value['%attribs']['zoovy:prod_is_tags'].indexOf('IS_DISCONTINUED') > 0) {
					$tag.hide();
					if($('.addToCartButton',$tag.parent())) {
						$('.addToCartButton',$tag.parent()).hide();
					}
				}
				else if (!_app.ext.store_product.u.productIsPurchaseable(data.value.pid)){
					$tag.hide();	
					if($('.addToCartButton',$tag.parent())) {
						$('.addToCartButton',$tag.parent()).hide();
					}
				}
			},
			
			//if a product is discontinued, will add minimal info about the replacement and provide a link to it.
			addredirectproduct : function($tag, data) {
				if(data.value) {
					var obj = {
						pid : _app.u.makeSafeHTMLId(data.value),
						"withVariations":1,
						"withInventory":1
					};
					
					var _tag = {								
						"callback":"renderRedirectProduct",		
						"extension":"beachmall_store",			
						"$container" : $tag,
						"loadsTemplate" : data.bindData.loadsTemplate
					};
					_app.calls.appProductGet.init(obj, _tag, 'immutable');
				
					//execute calls
					_app.model.dispatchThis('immutable');
				}
			},
			
			//Will add a message that current product is discontinued, and provide a link to a replacement
			addRedirectURL : function($tag, data) {
				//app.u.dump('Replacement Product: '); app.u.dump(data.value['%attribs']['user:replacement_product']);
				if(data.value['%attribs']['user:replacement_product']) {
					//$tag.append('THIS PRODUCT IS DISCONTINUED,<br><a class="pointer" title="new product" data-onclick="#!product?pid='+data.value['%attribs']['user:replacement_product']+'">CLICK HERE TO SEE</a><BR>THE NEW VERSION!');
					//$tag.append('THIS PRODUCT IS DISCONTINUED,<br><a class="pointer" title="new product" onClick="return showContent(\'product\',{\'pid\':\''+data.value['%attribs']['user:replacement_product']+'\'});">CLICK HERE TO SEE</a><BR>THE NEW VERSION!');
					$tag.append('THIS PRODUCT IS DISCONTINUED,<br><a class="pointer" title="new product" href="#!/product/'+data.value['%attribs']['user:replacement_product']+'">CLICK HERE TO SEE</a><BR>THE NEW VERSION!');
				}																						 //onClick="return showContent('product',{'pid':'wridt'});"
			},
			
			//hides time in transit/geo location section if item is a drop-shipped item
			//time in transit code checks this attrib also, and doesn't run if it's set.
			hideifdropship : function($tag, data) {
				if(data.value) {
					$tag.before('<div>Expedited shipping not available for this item</div>');
					$tag.hide().css('display','none');
				}
			},
			
			//hides ships on/in message on product page if product isn't purchaseable
			hideshiplatency : function($tag, data) {
				var pid = data.value.pid;
//					app.u.dump('***PID'); app.u.dump(pid);
				if(!_app.ext.store_product.u.productIsPurchaseable(pid)) {
					$tag.addClass('displayNone');
				}
			},
			
			//showshiplatency listed in LIST FORMATS SECTION
			
			//opens e-mail in default mail provider (new window if web-based)
			//if info is available will populate subject and body w/ prod name, mfg, & price
			//if only name, subject will have name, body will be empty. If no content, no subject or body
			bindmailto : function($tag, data){
	//			_app.u.dump('data.value:'); _app.u.dump(data.value);
				if(data.value['%attribs'] && data.value['%attribs']['zoovy:prod_name']) {
					
					var name = data.value['%attribs']['zoovy:prod_name'];
					
						//if all the info is present, add it all to the message
					if(data.value['%attribs']['zoovy:prod_mfg'] && data.value['%attribs']['zoovy:prod_msrp']) {
						var MFG = data.value['%attribs']['zoovy:prod_mfg'];
						var price = data.value['%attribs']['zoovy:prod_msrp'];
						$tag.on("click", function() {
							var eWindow = window.open("mailto:?subject="+name+"%20I%20found%20on%20beachmall.com&body="+name+",%20by%20"+MFG+",%20for%20only%20"+price+"%20"+window.location+""); //+window.location
						
								//window object has an array of content if something loaded in it.
								//the timeout was necessary to access the data to determine whether or not to close.
								//test thoroughly to determine the reliability of this method!!
								
								//the window is set, check if it's filled, and kill it if not
							setTimeout(function(){
								//_app.u.dump('WindowObjectReference'); _app.u.dump(eWindow.WindowObjectReference); //Security issues? check for later possibility of cleaner implementation 
								if(eWindow[0]) {//app.u.dump('Webmail, window has content don't close');
								}
								else {
									//_app.u.dump('Outlook-esq, window has no content'); 
									eWindow.close();
								}
							},5000);
						});
					}
					else {
						$tag.on("click", function() {
							var eWindow = window.open("mailto:?subject="+name+"%20I%20found%20on%20beachmall.com&body=%20"+window.location+"");
							setTimeout(function(){if(eWindow[0]) {} else {eWindow.close();}	},5000);
						});
					}
				}
				else {
					$tag.on("click", function() {
						var eWindow = window.open("mailto:?body="+window.location+"");
						setTimeout(function(){if(eWindow[0]) {} else {eWindow.close();}	},5000);
					});
				}
			}, //bindMailto
			
			//shows container w/ accessories/similar tabbed content if one of them has values set
			showtabsifset : function($tag, data) {
				setTimeout(function(){ //timeout here to allow time for data to get added to dom before this is run
					var attribs = data.value['%attribs'] ? data.value['%attribs'] : false; 
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
			
			//will hide the add to cart button on product page if item has IS_DISCONTINUED tag
			discontinuedatc : function($tag,data) {
				dump('START hideatc'); dump(data.value);
				if(data.value.indexOf('IS_DISCONTINUED') != -1) {
					$tag.before("<div>Sorry! This item is not available for purchase.</div>");
					$tag.addClass('displayNone');
				} 
			},
			
		/*	TO DO: SET UP WAY TO SELECT TAB AND HIDE IF NOT RESULTS, AND, MAKE SEQUENTIAL SO THAT ALL TABS ARE CHECKED ON AFTER THE OTHER TO PREVENT NO CONTENT SHOWING.
			brandstabhider : function($tag, data) { 
				setTimeout(function(){
					dump('-----brandstabhider'); dump($('.productListSmall',$tag).text());
					if($('.productListSmall',$tag).text().indexOf('Your query returned zero results') != -1) {
						$tag.css('display','none');
					}
				},1000);
			},
		*/	
/**QUICKVIEW FORMATS */ 
			//grabs additional product images and sets them under the main in the quickview template
			productimages : function($tag,data)	{
//				app.u.dump("BEGIN myRIA.renderFormats.productImages ["+data.value+"]");
				var pdata = _app.data['appProductGet|'+data.value]['%attribs']; //short cut to product object in memory.
				var imgs = ''; //all the html for all the images. appended to $tag after loop.
				var imgName; //recycled in loop.
				for(i = 1; i < 30; i += 1)	{
					imgName = pdata['zoovy:prod_image'+i];
//					app.u.dump(" -> "+i+": "+imgName);
					if(_app.u.isSet(imgName)) {
						imgs += "<li><a data-pid="+data.value+" data-toolTipQuickview='data-toolTipQuickview' data-toolTipName='"+imgName+"'class='MagicThumb-swap' rel='zoom-id: prodBigImage_href_"+data.value+"; hint: false;' rev='"+_app.u.makeImage({'tag':0,'w':380,'h':380,'name':imgName,'b':'ffffff'})+"' href='"+_app.u.makeImage({'tag':0,'w':'','h':'','name':imgName,'b':'ffffff'})+"'><img src='"+_app.u.makeImage({'tag':0,'w':50,'h':50,'name':imgName,'b':'ffffff'})+"' \/><\/a><\/li>";
						}
					}
				$tag.append(imgs);
			}, //productImages	

			//changes price description based on tag
			pricefrom : function($tag, data) {
				var priceModifier = data.value['%attribs']['user:prod_has_price_modifiers'];
				//app.u.dump('*** '+priceModifier);
				
				if(priceModifier < 1) {
					$tag.append('Our Price: ');
				} else {
					$tag.append('Our Price From: ');
				}
			},

		}, //renderFormats
////////////////////////////////////   UTIL [u]   \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

//utilities are typically functions that are exected by an event or action.
//any functions that are recycled should be here.
		u : {

/**GENERAL UTILS */	
			//added as a alternate to css hover. Technically does the same thing differently.
			addHover : function() { dump('---START beachmall_store addHover');
				setTimeout(function() {
				//	$('[data-beachmall-hoverClass]').css('border','5px solid green');
					$('body').on('touchstart', '[data-beachmall-hoverClass]', function(e){
							$(this).addClass($(this).attr('data-beachmall-hoverClass')); 
					}).on('touchmove', '[data-beachmall-hoverClass]', function(e){
						$(this).removeClass($(this).attr('data-beachmall-hoverClass'));
					}).on('mouseenter', '[data-beachmall-hoverClass]', function(e){
						//dump('---addHover add class this:'); dump($(this).attr('data-beachmall-hoverClass'));
						$(this).addClass($(this).attr('data-beachmall-hoverClass'));
					}).on('mouseleave', '[data-beachmall-hoverClass]', function(e){
						$(this).removeClass($(this).attr('data-beachmall-hoverClass'));
					}).on('click',  '[data-beachmall-hoverClass]',(function(e){
						$(this).removeClass($(this).attr('data-beachmall-hoverClass'));
					}));
				},2000);
			}, //addHover

				//will add tabs to the selector in the context passed
			tabify : function($context,selector) {
				var $tabContainer = $(selector,$context);
				if($tabContainer.length)	{
					if($tabContainer.data("widget") == 'anytabs'){} //tabs have already been instantiated. no need to be redundant.
					else	{
						$tabContainer.anytabs(); //_app.u.dump($("ul li",$tabContainer));
	//TO DO: ADD THIS HOVER TO VIDEO TABS TOO
						$("[data-app-role='hoverTab']",$tabContainer).each(function() {
							$(this).mouseenter(function() {
								$(this).trigger('click');
							});
						});
					}
				}
				else	{
					_app.u.dump("WARNING! could not find selector "+selector+" for tab items");
				} //couldn't find the tab to tabificate.
			},
			
				//adds static button w/ scrollTop function to page 
			backToTop : function($context) {
				$($context).append('<div class="appBackToTop pointer" onClick="myApp.ext.beachmall_store.u.scrollToTop()"><span class="sprite"></span>Back to Top</div>')
			},
			
				//returns view to top of page
			scrollToTop : function() {
				$('html,body').animate({ scrollTop: 0 }, 'slow');
			},
			
/**PRODUCT LIST UTILS*/
			//takes a count of items with the class that corresponds to the tab passed in the brands category template ($context) and shows a message if count is zero.
			countBrandsItems : function($context, listType) {
				var count = 0;
				setTimeout(function(){
					$('.products',$context).each(function(){
//						dump('In .each function');
						if(listType == "#viewAllProductsTab") { count++;	}
						else if(listType == "#featuredProdsTab") {
//							dump('In featured tab condition');
							if($(this).hasClass('brandFeatured')) { count++; }
						}
						else if(listType == "#bestSellersTab") {
							if($(this).hasClass('brandBestSeller')) { count++; }
						}
					});
					//if something was counted, there must be an item to show for this list type, 
					//otherwise let the user know there isn't anything to see
//					dump('COUNT AND LIST TYPE'); dump(listType); dump(count);
					if (listType == "#viewAllProductsTab" && count > 0) { $('.noBrandsItems',$context).hide(); }
					if (listType == "#viewAllProductsTab" && count == 0) { $('.noBrandsItems',$context).show(); }
					if (listType == "#featuredProdsTab" && count > 0) {
						$('.tabFeatured',$context).show();
					}
					if (listType == "#bestSellersTab" && count > 0) {
						$('.tabBest',$context).show();
					}
				},500);
			},
			
/**PRODUCT PAGE UTILS */
				//checks for product youtube video and adds tab for it to main prod image
			videotabify : function($context, infoObj) {
				if(_app.data[infoObj.datapointer] &&  _app.data[infoObj.datapointer]['%attribs'])	{
					if(_app.data[P.datapointer]['%attribs']['youtube:videoid'])	{
						tabify($context,".imageAndVideoTabs");
					}
					else {
						app.u.dump("youtube:videoid NOT set. no video.");
					}
				}
				else {
					//video ID not set for this product.
					app.u.dump("Issue w/ the product data. can't reach attribs.");
				}
			}, //videotabify
			
			//shows tool tip on product page. Uses fade out to allow for click on link in tool tip pop up
			handleToolTip : function()	{
			_app.u.dump("BEGIN beachmart.u.handleToolTip.");
				$('.tipify',$('#appView')).each(function(){
					var $this = $(this);
					$this.parent().css('position','relative'); //this is what makes the tooltip appear next to the link instead of off in space.
					$this.mouseover(function(){	$('.toolTip',$this.parent()).show();}).mouseout(function(){	$('.toolTip',$this.parent()).fadeOut(3000);});
				});
			},
/**HASH UTILS */

			//takes the seo name and removes certain characters/spaces/patterns and returns the seo name
			removeUnwantedChars : function(seo) {
				seo = seo.replace('"','-inches'); //doesn't want any " (signifying "inches") in seo hash
				seo = seo.replace('_',' '); //doesn't want any "_" in seo hash
				seo = seo.replace(' / ',' '); //doesn't want any " / " in seo hash
				seo = seo.replace('/',' '); //doesn't want any "/" in seo hash
				seo = seo.replace('+',' '); //doesn't want any "+" in seo hash
				seo = seo.replace(' & ',' '); //doesn't want any " & " in seo hash
				seo = seo.replace('&',' '); //doesn't want any "/" in seo hash
				seo = seo.replace(' - ',' '); //wants all " " converted to "-", but " - " comes out as "---", no bueno.
				seo = seo.replace('--',' '); //just in case, some prod_names have two consecutive "-"
				seo = seo.replace('---',' '); //just in case, some prod_names have three consecutive "-"
				seo = seo.replace('  ',' '); //kill two consecutive spaces
				seo = seo.replace('   ',' '); //kill three consecutive spaces
				seo = seo.toLowerCase();
				return seo;
			},
/**Header UTILS */

			//decides whether or not to use http or https for hardcoded img src
			hardImgSrc : function() {
			//dump('--------Got into hardImgSource');
				$('[data-hard-source]','#mainDropdown').each(function() {
					var post = $(this).attr('data-hard-source'); dump('----The post that was passed'); dump(post);
					if(document.location.protocol == "http:") {
						$(this).attr('src',"http:"+post); dump('----Should NOT be secure'); dump($(this).attr('src'));
					}
					else {
						$(this).attr('src','https:'+post); dump('----Should be secure'); dump($(this).attr('src'));
					}
				});
			}
		
		}, //u [utilities]

//app-events are added to an element through data-app-event="extensionName|functionName"
//right now, these are not fully supported, but they will be going forward. 
//they're used heavily in the admin.html file.
//while no naming convention is stricly forced, 
//when adding an event, be sure to do off('click.appEventName') and then on('click.appEventName') to ensure the same event is not double-added if app events were to get run again over the same template.
		e : {
		
			toggleNav : function($ele, e) {
				e.preventDefault();
				dump('**toggleNav Ran');
				$('#mastHead').toggleClass('expand');
			}
			
		}, //e [app Events]
			
			
////////////////////////////////////   VARIATIONS    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\			
			
		variations : {
				//adds similar functionality as custom image select render option to image grid options
			renderOptionCUSTOMIMGGRID : function(pog) {
				var pogid = pog.id;
//				dump('-----renderOptionCUSTOMIMGGRID pog.id'); dump(pog.id); dump(pog);
				var $parentDiv = $("<div class='imgGridVariationWrapper floatLeft' \/>");
				var skus = _app.data['appProductGet|'+pog.pid]['%SKU']; dump('-----SKUs?'); dump(skus[0][1]); dump(skus[0][1].length);
				var skuLevel = false; //set to true if sku level image is found, will lead to sku render otherwise will lead to image render
				var $radioInput; //used to create the radio button element.
				var radioLabel; //used to create the radio button label.
				var $optionDiv; //holds the individual radio/label/img pack for each sku
				var $imgDiv; //holds the group of images for each iteration/variation
				var thumbnail; //holds nails shaped like thumbs
				var thumbnailTag; //tag created manually to add jquery tool tip attribs
				
				for(var index in skus[0][1]) {
					if(index.indexOf('zoovy:prod_image') > -1) {
					dump('0------There was an image!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
					skuLevel = true;
					}
				}
				
				//render sku level image group if zoovy:prod_image was found in %SKU
				if(skuLevel) {
					dump('0------in skuLevel if');
					if(pog['ghint']) {$parentDiv.append(pogs.showHintIcon(pogid,pog['ghint']))}
					
					var j = 0;
					
					//var skus = _app.data['appProductGet|PLY39AWTEST2']['%SKU'];
					//var skus = _app.data['appProductGet|PL4S31']['%SKU'];
					var skuLen = skus.length;
					var options = pog['@options'];
					var optLen = pog['@options'].length;
	//				dump('The lengths, o then s'); dump(optLen); dump(skuLen);
					
					for (var i=0; i < optLen; i++) {
						$optionDiv = $("<div class='imgGridOptionWrapper'></div>");
						$imgDiv = $("<div class='imgGridImgWrapper' data-pogval="+pog['@options'][i]['v']+"></div>");
						$radioInput = $('<input>').attr({type: "radio", name: pogid, value: pog['@options'][i]['v'],"data-pogval":pog['@options'][i]['v']});
						radioLabel = "<label>"+pog['@options'][i]['prompt']+"<\/label>";
						$optionDiv.append($radioInput).append(radioLabel);
						while (j < skuLen) {
	//						dump('----while i is '+i+' option value is: '+pog.id+options[i].v+', while j is '+j+' sku id is '+skus[j][0]);
							if(skus[j][0].indexOf(pog.id+options[i].v) > -1) {
								var images = skus[j][1];
								for (var index in images) {
	//								dump('---image attrib = '+index+' and image path = '+images[index]);
									if(index.indexOf('zoovy:prod_image') > -1 && images[index].length > 0) {
	//									dump('---image attrib = '+index+' and image path = '+images[index]);
										thumbnail = _app.u.makeImage({"w":400,"h":400,"name":images[index],"b":"FFFFFF","lib":_app.username});
										thumbnailTag = "<img src='"+thumbnail+"' width='40' height='40' name='"+pog['@options'][i]['img']+"' data-grid-img='"+thumbnail+"' data-tooltip-title='"+pog['@options'][i]['prompt']+"'>";
										$imgDiv.append(thumbnailTag);
									}
								}
								j++
	//							dump('----Meanwhile...'); dump(images); 
								break;
							} //k for
							else {j++}
						} //while
						
						//make clicking one of the images check the radio button and add a red border to further indicate selection
						$imgDiv.click(function(){
							var pogval = $(this).attr('data-pogval');	//value of image clicked
	//						dump('you clicked');
							$('.imgGridImgWrapper',$(this).parent().parent()).each(function(){
								if($(this).hasClass('selected')){ 
									$(this).removeClass('selected'); 
								}	//add selected indicator to clicked image
								if($(this).attr('data-pogval') == pogval){ 
									$(this).addClass('selected'); 
								}
							});
							$('input[type=radio]',$(this).parent().parent()).prop('checked',false);
							$('input[type=radio]',$(this).parent().parent()).each(function() {
								if($(this).attr('data-pogval') == pogval) {
									$(this).prop('checked',true);
								}
							});
						}); 
						
						//make clicking the radio change the border like clicking the image does above
						$radioInput.change(function() {
							var selected = $(this).val();	//the option selected in select list
						dump('---the radio'); dump(selected); 
								//remove selected indicator from all images
							$('.imgGridImgWrapper',$(this).parent().parent()).each(function(){
								if($(this).hasClass('selected')){ 
									$(this).removeClass('selected'); 
								}	//add it back to the value of select list option if one matches
								if($(this).attr('data-pogval') == selected){ 
									$(this).addClass('selected'); 
								}
							});
						});
						
						$optionDiv.append($imgDiv);
						$parentDiv.append($optionDiv);
					} //i for
				} //sku level render
				
				//do the regular custom thing w/out the sku level images
				else {
					var i = 0;
					var len = pog['@options'].length;
					while (i < len) {
						$optionDiv = $("<div class='imgGridOptionWrapper'></div>");
						$imgDiv = $("<div class='imgGridImgWrapper' data-pogval="+pog['@options'][i]['v']+"></div>");
						$radioInput = $('<input>').attr({type: "radio", name: pogid, value: pog['@options'][i]['v'],"data-pogval":pog['@options'][i]['v']});
						radioLabel = "<label>"+pog['@options'][i]['prompt']+"<\/label>";
						thumbnail = _app.u.makeImage({"w":400,"h":400,"name":pog['@options'][i]['img'],"b":"FFFFFF","lib":_app.username});
						thumbnailTag = "<img src='"+thumbnail+"' width='"+40+"' height='"+40+"' name='"+pog['@options'][i]['img']+"' data-grid-img='"+thumbnail+"' data-tooltip-title='"+pog['@options'][i]['prompt']+"'>";
						$imgDiv.append(thumbnailTag);
						$optionDiv.append($radioInput).append(radioLabel).append($imgDiv);
						$parentDiv.append($optionDiv);
						i++
						
						//make clicking one of the images check the radio button and add a red border to further indicate selection
						$imgDiv.click(function(){
							var pogval = $(this).attr('data-pogval');	//value of image clicked
	//						dump('you clicked');
							$('.imgGridImgWrapper',$(this).parent().parent()).each(function(){
								if($(this).hasClass('selected')){ 
									$(this).removeClass('selected'); 
								}	//add selected indicator to clicked image
								if($(this).attr('data-pogval') == pogval){ 
									$(this).addClass('selected'); 
								}
							});
							$('input[type=radio]',$(this).parent().parent()).prop('checked',false);
							$('input[type=radio]',$(this).parent().parent()).each(function() {
								if($(this).attr('data-pogval') == pogval) {
									$(this).prop('checked',true);
								}
							});
						}); 
						
						//make clicking the radio change the border like clicking the image does above
						$radioInput.change(function() {
							var selected = $(this).val();	//the option selected in select list
						dump('---the radio'); dump(selected); 
								//remove selected indicator from all images
							$('.imgGridImgWrapper',$(this).parent().parent()).each(function(){
								if($(this).hasClass('selected')){ 
									$(this).removeClass('selected'); 
								}	//add it back to the value of select list option if one matches
								if($(this).attr('data-pogval') == selected){ 
									$(this).addClass('selected'); 
								}
							});
						});
					}

				} //regular custom render
				return $parentDiv;
			},
			
			//puts color options on product page as image selectable select list. Also adds jquery tool tip pop up of image for zoom
			renderOptionCUSTOMIMGSELECT: function(pog) {

//				_app.u.dump('POG -> '); _app.u.dump(pog);
				
				var $parent = $('<div class="optionsParent" />');
				var $select = $("<select class='optionsSelect' name="+pog.id+" />");
				var $hint = $('<div class="zhint">mouse over thumbnail to see larger swatches</div>');
				var $hint = $('<div class="zhint">mouse over thumbnail to see larger swatches</div>');
				$parent.append($hint);

				var len = pog['@options'].length;				
				if(len > 0) {
					optionTxt = (pog['optional'] == 1) ? "" : "Please choose (required)";
					selOption = "<option value='' disabled='disabled' selected='selected'>"+optionTxt+"<\/option>";
					$select.append(selOption);
				}
				
				var $option;
				for (var index in pog['@options']) {
					var option = pog['@options'][index];
//					_app.u.dump('IMG: '); _app.u.dump(option.img);
					$option = $("<option value="+option.v+">"+option.prompt+"</option>");
					$select.append($option);
					var thumbImg = _app.u.makeImage({"w":pog.width,"h":pog.height,"name":option.img,"b":"FFFFFF","tag":false,"lib":_app.username});
					var bigImg = _app.u.makeImage({"w":400,"h":400,"name":option.img,"b":"FFFFFF","tag":false,"lib":_app.username});																									//need to try moving these to be appended
					
					var $imgContainer = $('<div class="floatLeft optionImagesCont" data-pogval="'+option.v+'" />');
					/*var $mzpLink = $('<a id="imgGridHref_'+pog.id+'_'+option.v+'" alt="'+option.prompt+'" class="MagicZoom" title="'+option.prompt+'" rel="hint:false; show-title:top; title-source=#id;" href="'+mzBigImg+'" />');
					
					$mzpLink.click(function(){
						var pogval = $(this).parent().attr('data-pogval');
						
						$select.val(pogval);
						app.u.dump(pogval);
						app.u.dump(pogval);
						app.u.dump(pogval);
						app.u.dump(pogval);
						$('.optionImagesCont', $parent).each(function(){
							if($(this).hasClass('selected')){ 
								$(this).removeClass('selected'); 
								}
							if($(this).attr('data-pogval') == pogval){ 
								$(this).addClass('selected'); 
								}
							});	
						});
						
					$mzpLink.append($('<img src='+thumbImg+' title="'+pog.prompt+'" data-pogval="'+option.v+'"/>'));
					$imgContainer.append($mzpLink);*/

						//add selected indicator to image, and change select list option to match
					$imgContainer.click(function(){
						var pogval = $(this).attr('data-pogval');	//value of image clicked
						
						$select.val(pogval); 	//change select list to clicked image value
							//remove the selected indicator from all images
						$('.optionImagesCont', $parent).each(function(){
							if($(this).hasClass('selected')){ 
								$(this).removeClass('selected'); 
								}	//add selected indicator to clicked image
							if($(this).attr('data-pogval') == pogval){ 
								$(this).addClass('selected'); 
								}
							});	
						});
					
					$img = $('<img src="'+thumbImg+'" data-big-img="'+bigImg+'" data-tooltip-title="'+option.prompt+'"/>')
					
					//Tooltip called in init
					
					$imgContainer.append($img);
					$parent.append($imgContainer);
					
	//				to add description info to label for
	//				$mzpLink.mouseover(function() {
	//					$('.optionImagesCont', $parent).each(function(){
	//						$('label[value="Fabric"]').empty().text('Fabric: '+option.prompt+'');
	//						app.u.dump(option.prompt);
	//					});		
	//				});
	
				} // END for
				
					//add selected indicator on image when variation is selected w/ select list
				$select.change(function() {
					var selected = $(this).val();	//the option selected in select list
				
						//remove selected indicator from all images
					$('.optionImagesCont', $parent).each(function(){
						if($(this).hasClass('selected')){ 
							$(this).removeClass('selected'); 
						}	//add it back to the value of select list option if one matches
						if($(this).attr('data-pogval') == selected){ 
							$(this).addClass('selected'); 
						}
					});
				});

				$parent.append($select);
				return $parent;
			}, // END renderOptionCUSTOMIMGSELECT
			
			xinit : function(){
				this.addHandler("type","imggrid","renderOptionCUSTOMIMGGRID");
				this.addHandler("type","imgselect","renderOptionCUSTOMIMGSELECT");
				_app.u.dump("--- RUNNING XINIT");
			}
			
		} //variations
			
			
	} //r object.
	return r;
}
