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

var beachmall_lists = function(_app) {
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
			}
		}, //callbacks



////////////////////////////////////   ACTION    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

//actions are functions triggered by a user interaction, such as a click/tap.
//these are going the way of the do do, in favor of app events. new extensions should have few (if any) actions.
		a : {
			
			//add a class (first arg) to an element (third arg) and toggles the text on the 
			//calling element (second arg) between the last two args. 
			toggleMyClass : function(arg,$tag,$tagParent,primary,secondary) {
				var which = $tag.text();
				switch(which) {
					case primary:
						$tagParent.addClass(arg);
						$tag.text(secondary);
						break;
					case secondary:
						$tagParent.removeClass(arg);
						$tag.text(primary);
						break;
				}
			}
			
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

			//if inventory is less than 1, don't show in product list (not used w/ elastic because that is handled w/ universal filter)
			inventoryhide : function(data,thisTLC) {
				var prod = data.globals.binds.var;
				var pid = prod.pid;
				var $tag = data.globals.tags[data.globals.focusTag];
				if(prod['@inventory'] && prod['@inventory'][pid]) {
					var qty = prod['@inventory'][pid].AVAILABLE;
//					dump('inventory hide qty:'); dump(qty);
					if(qty < 1) $tag.addClass('displayNone');
				}
			},
			
			//will add classes to brand product list items for showing/hiding based on presence of all/featured/bestselling tags or attributes.
			//works in conjunction with beachmall_store.a.brandTabSwitch
			brandslistfilter : function(data,thisTLC) {
				var $tag = data.globals.tags[data.globals.focusTag];
				var prod = data.globals.binds.var;
				if($tag.parent().parent().attr('data-brand-filter')) {
			//		var filterType = $tag.parent().parent().attr('data-brand-filter');
//					dump('The brand filter was found.'); dump(filterType);//data-brand-filter="bestseller
					$tag.parent().addClass('brandListItem');
			//		switch (filterType) {
			//			case 'featured' :
							if(prod && prod['%attribs']) {
//								dump('in brandslistfilter featured');
								if(prod['%attribs']['zoovy:prod_is_tags'] && (prod['%attribs']['zoovy:prod_is_tags'].indexOf('IS_USER2') != -1 || prod['%attribs']['zoovy:prod_is_tags'].indexOf('IS_USER3') != -1 || prod['%attribs']['zoovy:prod_is_tags'].indexOf('IS_USER6') != -1)) {
									 /*this is a featured item, it should be in the list*/
									 $tag.parent().addClass('brandFeatured');
								}
								else if(prod['%attribs']['user:prod_promo'] && prod['%attribs']['user:prod_promo'].indexOf('IS_USER4') != -1) { 
									/*same as above*/ 
									$tag.parent().addClass('brandFeatured');
								}
								else { 
			//						$tag.parent().hide(); /*this product isn't a featured item, don't show it.*/
								}
							}
			//				else { $tag.parent().hide(); dump('featured hidden...'); dump(prod.pid) /*no tags or prod_promo attrib means it's definitely not a featured item*/ }
			//				break;
			//			case 'bestseller' :
							if(prod && prod['%attribs'] && prod['%attribs']['zoovy:prod_is_tags']) {
//								dump('in brandslistfilter bestseller');
								if(prod['%attribs']['zoovy:prod_is_tags'].indexOf('IS_BESTSELLER') != -1) {
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
			
			//sets the overhang tag and hides discontinued products in a product list.
			showprodmodifier : function(data,thisTLC) {
				var prod = data.globals.binds.var;
				var $tag = data.globals.tags[data.globals.focusTag];
				//_app.u.dump('-----showprodmodifier'); _app.u.dump(data.value); //_app.u.dump(data.globals.tags[data.globals.focusTag]);
				var zoovyIsTags = (data.globals.binds.iselastic) ? prod.tags : prod['%attribs']['zoovy:prod_is_tags'];
				
				if (zoovyIsTags.indexOf('IS_DISCONTINUED') >= 0 || !_app.ext.store_product.u.productIsPurchaseable(data.value.pid)) {
					$tag.parent().parent().parent().parent().hide().attr('data-discontinued',1);
				} else if (zoovyIsTags.indexOf('IS_USER3') >= 0) {
					$tag.append('Closeout!').addClass('smallRed').show();
				} else if (zoovyIsTags.indexOf('IS_CLEARANCE') >= 0) {
					$tag.append('Clearance').addClass('smallRed').show();
				} else if (zoovyIsTags.indexOf('IS_USER6') >= 0) {
					$tag.append('Customer Favorite').show();
				} else if (zoovyIsTags.indexOf('IS_USER4') >= 0) {
					$tag.append('Commercial Quality').addClass('mediumTagBkgrnd').show();
				} else if (zoovyIsTags.indexOf('IS_USER5') >= 0) {
					$tag.append('Exclusive').addClass('smallTagBkgrnd').show();
				} else if (zoovyIsTags.indexOf('IS_BESTSELLER') >= 0) {
					$tag.append('Best Seller').addClass('smallBlue').show();
				} else if (zoovyIsTags.indexOf('IS_USER2') >= 0) {
					$tag.append('New Low Price!').addClass('mediumTagBkgrnd').show();
				} else if (zoovyIsTags.indexOf('IS_NEWARRIVAL') >= 0) {
					$tag.append('New Arrival').addClass('smallTagBkgrnd').show();
				} else if (zoovyIsTags.indexOf('IS_USER7') >= 0) {
					$tag.append('Overstock Sale').addClass('mediumRed').show();
				} else if (zoovyIsTags.indexOf('IS_PREORDER') >= 0) {
					$tag.append('Back Order').addClass('smallTagBkgrnd').show();
				} else {	/*add no tags*/	}
			}, //showprodmodifier
			
			//sets a description on the price of a product (usually in a product list)
			prodpricedesc : function(data, thisTLC) {
				var prod = data.globals.binds.var;
				var $tag = data.globals.tags[data.globals.focusTag];
				//var priceFrom = (data.bindData.isElastic) ? data.value.tags : data.value['%attribs']['zoovy:prod_is_tags'];
				var priceFrom = prod['%attribs']['user:prod_has_price_modifiers'];
				//var sale = (data.bindData.isElastic) ? data.value.tags : data.value['%attribs']['zoovy:prod_is_tags'];
				var sale = prod['%attribs']['is:sale'];
				//var zoovyIsTags = (data.bindData.isElastic) ? data.value.tags : data.value['%attribs']['zoovy:prod_is_tags'];
				var zoovyIsTags = prod['%attribs']['zoovy:prod_is_tags'];
				
				//app.u.dump('*** zoovyIsTags = '+zoovyIsTags);	//app.u.dump('***Price Modifier = '+priceFrom);
				if (zoovyIsTags.indexOf('IS_USER3') >= 0) {
					$tag.append('Clearance Price!');
				} else if (zoovyIsTags.indexOf('IS_SALE') >= 0) {
					$tag.append('Sale Price!');
				} else if (sale != 0) {
					$tag.append('Sale Price!');
				} else if(priceFrom == 1) {
					$tag.append('From');
				} else {
					$tag.append('Our Price');
				}
			}, //End prodPriceDesc
			
			//shows free shipping statement in product list if value is set
			showfreeshippingtag : function(data, thisTLC) {
				var prod = data.globals.binds.var;
				var $tag = data.globals.tags[data.globals.focusTag];
				var search = thisTLC.args2obj(data.command.args,data.globals); //this creates an object of the args
				var isShipFree = (search.iselastic) ? prod.tags : prod['%attribs']['zoovy:prod_is_tags'];
				if(isShipFree) {
					if(isShipFree.indexOf('IS_SHIPFREE') >= 0) {
						$tag.show();
					}
				}
			}, //End showFreeShippingTag
			
			//shows ships on/in message if data is set, takes into account when the message is displayed
			//also used on product and quickview pages
			showshiplatency : function (data, thisTLC) {
				var prod = data.globals.binds.var;
				var $tag = data.globals.tags[data.globals.focusTag];
				//_app.u.dump('***TEST '); _app.u.dump(prod);
				setTimeout(function(){
						//set the vars needed to determine message
					if($tag.attr('data-cart')) {	//if is for cart prod list
						if((prod.stid && prod.stid[0] == '%') || prod.asm_master) {
							return; //if this is an assembly product in the cart, skip the time in trans altogether
						}
						else if(prod.product) {
							var cartProd = _app.data['appProductGet|'+_app.u.makeSafeHTMLId(data.value.product)];
							//possible for this user:prod_shipping_msg to be present but not set, make it a blank string to prevent undefined. 
							var userProdShipMsg = cartProd['%attribs']['user:prod_shipping_msg'] ? cartProd['%attribs']['user:prod_shipping_msg'] : "" ;
							var us1ts = cartProd['%attribs']['us1:ts'];
							var zoovyProdSalesRank = cartProd['%attribs']['zoovy:prod_salesrank'];
							var zoovyIsPreOrder = cartProd['%attribs']['zoovy:prod_is_tags'];
							var zoovyPreOrder = cartProd['%attribs']['is:preorder'];
							var zoovyIsUser1 = cartProd['%attribs']['is:user1'];
						} else {_app.u.dump('Problem w/ data.value in _beachmall_store.js: renderformats.showShipLatency. Data follows:'); _app.u.dump(data.value);}
						
						if(prod.product) {
							var cartProd = _app.data['appProductGet|'+_app.u.makeSafeHTMLId(data.value.product)];
							if(cartProd['%attribs'] && cartProd['%attribs']['user:is_dropship'] && cartProd['%attribs']['user:is_dropship'] == 1) {
									//don't start time in transit, hide loadingBG and insert message
								$('.cartPutLoadingHere',$tag.parent()).removeClass('loadingBG').text('Expedited shipping not available for this item');
							} else {
									//pass stid so each item can be found in cart later when time in transit info gets added
								var stid = _app.u.makeSafeHTMLId($tag.parent().parent().parent().attr('data-stid'));
								_app.ext.beachmall_cartestarrival.u.initEstArrival(cartProd, stid);
							}
						} else {_app.u.dump('Problem w/ data.value in _beachmall_store.js: renderformats.showShipLatency. Data follows:'); _app.u.dump(data.value);}
					}
					else {	//else is for not cart prod list
						//possible for this user:prod_shipping_msg to be present but not set, make it a blank string to prevent undefined.
						var userProdShipMsg = prod['%attribs']['user:prod_shipping_msg'] ? prod['%attribs']['user:prod_shipping_msg'] : "";
						var us1ts = prod['%attribs']['us1:ts'];
						var zoovyProdSalesRank = prod['%attribs']['zoovy:prod_salesrank'];
						var zoovyIsPreOrder = prod['%attribs']['zoovy:prod_is_tags'];
						var zoovyPreOrder = prod['%attribs']['is:preorder'];
						var zoovyIsUser1 = prod['%attribs']['is:user1'];
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
						if(date < 20141102) {
							t = t - 4;
						}
						else if (date > '20141101' && date < '20140308') {
							t = t - 5;
						}
						else {
							// posibly need further years calculated here
						}
						if(userProdShipMsg) { //dump('USER PRODUCT SHIPPING MESSAGE IS:'); dump(userProdShipMsg); dump(prod);
							if(userProdShipMsg.indexOf('Ships Today by 12 Noon EST') > -1){ //4th of July, Labor Day, Christmas, New Year Eve/Day, Memorial Day, 4th of July. 
								if ( (t >= 12 && (n > 0 && n < 5)) || date == 20140704 || date == 20140901 || date == 20141225 || date == 20141231 || date == 20150101 || date == 20150526 || date == 20150704) {
									//Time is after noon, day is Mon-Thurs, OR is a UPS holiday weekday
									$tag.empty().append('Ships Next Business Day');
								}
								else if (((t >= 12 && n == 5) || (n > 5 && n < 1)) || date == 20141127 || date == 20141128) {
									//Time is after noon, day is Fri (FUN FUN FUN FUN)
									//OR it is the Weekend, OR is UPS Thanksgiving weekend
									//$tag.empty().append('Ships Monday by 12 Noon EST'); old message (will use again?)
									$tag.empty().append('Ships Next Business Day');
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
			
			//gets list of siblings from product (if present) and puts first two on product list
			//the one that doesn't match the product is set first
			siblingproductlist : function(data, thisTLC)	{
				var sibs = data.globals.binds.var;
				var $tag = data.globals.tags[data.globals.focusTag];
				var pid = _app.u.makeSafeHTMLId($tag.parent().attr('data-pid'));
				var _tag = data.globals.binds;
				_tag.loadsTemplate = 'productListTemplateToolTipThumb';
//				_app.u.dump("BEGIN beachmall_store.renderFormats.siblingProductList");
//				_app.u.dump(" -> data.globals: "); _app.u.dump(data.globals.binds); _app.u.dump(sibs); 
		
				if(_app.u.isSet(sibs))	{
						//data is comma separated list, make into array for processing
					var listOfProducts = sibs.split(",");
						//if at least two sib images exist,
						//check if first sib is prod image, if not send as is, if so put second image first
					if(listOfProducts[0] && listOfProducts[1]) {
						if(listOfProducts[0].indexOf(''+pid) < 0) {
							_tag.csv = sibs;
						}
						else {  //flip values
							var tmp = listOfProducts[1];
							listOfProducts[1] = listOfProducts[0];
							listOfProducts[0] = tmp;
 							_tag.csv = listOfProducts;
						}
						_app.ext.store_prodlist.u.buildProductList(_tag,$tag);	
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
			hideifnotpurchaseable : function(data, thisTLC) {
				var pid = data.globals.binds.var;
				var $tag = data.globals.tags[data.globals.focusTag];
				if(_app.ext.store_product.u.productIsPurchaseable(pid)) {
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
			
			//creates image for search results lists from user:app_thumb (a copy of image1) to prevent
			//banner/icon images that had been getting indexed from being used for the list image.
			appthumb : function(data, thisTLC) {
				var prod = data.globals.binds.var;
				var $tag = data.globals.tags[data.globals.focusTag];
				var args = thisTLC.args2obj(data.command.args,data.globals);
				var _tag = {}
				//_app.u.dump('--> store_filter: appThumb started'); _app.u.dump(data.value.images[0]);
				_tag.b = args.bgcolor || 'ffffff'; //default to white.
				
				if(prod) {
					_tag.name = prod.app_thumb;
					_tag.w = $tag.attr('width');
					_tag.h = $tag.attr('height');
					_tag.tag = 0;
					$tag.attr('src',_app.u.makeImage(_tag));
				}
			}, //appThumb
			
			test : function(data, thisTLC) {
				dump('-------------> test var:');
				dump(data.globals.binds.var);
			}

		}, //tlcFormats
			
			
////////////////////////////////////   UTIL [u]   \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

//utilities are typically functions that are exected by an event or action.
//any functions that are recycled should be here.
		u : {
		
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
			
			//called on depart from prod page to add item to recently viewed items list
			//changed this from newinit's addition at page load to prevent items from showing in list on first page visit
			addRecentlyViewedItems : function($context, pid) {
					//pid is infoObj.pid passed from onDeparts
				if($.inArray(pid,_app.ext.quickstart.vars.session.recentlyViewedItems) < 0) {
					_app.ext.quickstart.vars.session.recentlyViewedItems.unshift(pid);
					$('.numRecentlyViewed','#appView').text(_app.ext.quickstart.vars.session.recentlyViewedItems.length);
				}
				else {
					//the item is already in the list. move it to the front.
					_app.ext.quickstart.vars.session.recentlyViewedItems.splice(0, 0, _app.ext.quickstart.vars.session.recentlyViewedItems.splice(_app.ext.quickstart.vars.session.recentlyViewedItems.indexOf(pid), 1)[0]);
				}
			}, //addRecentlyViewedItems
			
			//populates carousel if items in recently viewed list, shows place holder text if list empty
			//show = true will show container w/ place holder text if empty. show = false will hide container until not empty
			//used on product page and for recently viewed items product list page
			showRecentlyViewedItems : function($context,show) {
				var $container = $('.recentlyViewedItemsContainer', $context);
				
					//if no recently viewed items && show is set, tell them the sky is blue
				if(_app.ext.quickstart.vars.session.recentlyViewedItems.length == 0 && show) {
					$container.show();
					$('.recentEmpty',$container).show(); //contains place holder text
					//_app.u.dump('There aint nuthin in there ma!');
					$context.removeClass('loadingBG');
				}
					//if no recent items && show is not set, container is already hidden do nada
				else if (_app.ext.quickstart.vars.session.recentlyViewedItems.length == 0 && !show) {}
					//otherwise, show them what they've seen
				else {
					$container.show();
					$('.recentEmpty',$container).hide();
					$('ul',$container).empty(); //empty product list;
//					_app.u.dump('recently viewed call to qs.vars.session');	_app.u.dump(_app.ext.quickstart.vars.session.recentlyViewedItems);
					$container.tlc({dataset:_app.ext.quickstart.vars.session.recentlyViewedItems,verb:"translate"}); //build product list
					_app.u.dump('SESSION VAR:'); _app.u.dump(_app.ext.quickstart.vars.session.recentlyViewedItems);
					$context.removeClass('loadingBG');
				}
			},//showRecentlyViewedItems
		
		}, //u [utilities]

//app-events are added to an element through data-app-event="extensionName|functionName"
//right now, these are not fully supported, but they will be going forward. 
//they're used heavily in the admin.html file.
//while no naming convention is stricly forced, 
//when adding an event, be sure to do off('click.appEventName') and then on('click.appEventName') to ensure the same event is not double-added if app events were to get run again over the same template.
		e : {
		
			//will change a class on the parent container of the brands product list tab to switch view to show all/featured/bestselling items. 
			//works in conjunction with beachmall_lists.tlcFormats.brandslistfilter & countBrandsItems
			brandTabSwitch : function($ele,p) {
				p.preventDefault();
//				dump('brandTabSwitch attribute: '); dump($('a',$ele).attr('href'));
				//var $context = $('#categoryTemplateBrands_'+_app.u.makeSafeHTMLId($ele.parent().attr('data-brand-path')));
				var $context = $("#mainContentArea :visible:first");
				var thisHref = $('a',$ele).attr('href');
				switch (thisHref) {
					case "#viewAllProductsTab" :
						$ele.parent().parent().removeClass('brandTabsF');
						$ele.parent().parent().removeClass('brandTabsB');
						$ele.parent().parent().addClass('brandTabsA');
			//			_app.ext.beachmall_store.u.countBrandsItems($context,thisHref);
						break;
					case "#featuredProdsTab" :
						$ele.parent().parent().removeClass('brandTabsA');
						$ele.parent().parent().removeClass('brandTabsB');
						$ele.parent().parent().addClass('brandTabsF');
			//			_app.ext.beachmall_store.u.countBrandsItems($context,thisHref);
						break;
					case "#bestSellersTab" :
						$ele.parent().parent().removeClass('brandTabsA');
						$ele.parent().parent().removeClass('brandTabsF');
						$ele.parent().parent().addClass('brandTabsB');
			//			_app.ext.beachmall_store.u.countBrandsItems($context,thisHref);
						break;
					default :
						//if we got here, something isn't right... there are only three tabs.
						$ele.parent().parent().removeClass('brandTabsA');
						$ele.parent().parent().removeClass('brandTabsF');
						$ele.parent().parent().removeClass('brandTabsB');
				}
				return false;
			},
		
		} //e [app Events]
	} //r object.
	return r;
}
