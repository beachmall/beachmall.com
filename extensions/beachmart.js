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

/*
An extension for acquiring and displaying 'lists' of categories.
The functions here are designed to work with 'reasonable' size lists of categories.
*/


var store_filter = function() {
	var r = {

	vars : {
		'templates' : []
		},

					////////////////////////////////////   CALLS    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\		


//store_search contains the maintained elastic query search. use that.
	calls : {}, //calls
//key is safe id. value is name of the filter form.
	filterMap : {

		".beach-umbrellas-shelter.beach-umbrella":{
			"filter": "UmbrellasForm",
			"exec" : function($form,infoObj){app.ext.store_filter.u.renderSlider($form, infoObj, {MIN:0,MAX:500});}
		},
		".beach-umbrellas-shelter.patio-umbrella":{
			"filter": "UmbrellasForm",
			"exec" : function($form,infoObj){app.ext.store_filter.u.renderSlider($form, infoObj, {MIN:0,MAX:500});}
		},
/* ACCESSORIES FORMS */
		".beach-accessories.beach-bags-totes":{
			"filter": "AccessoriesForm",
			"exec" : function($form,infoObj){app.ext.store_filter.u.renderSlider($form, infoObj, {MIN:0,MAX:500});}
		},	
		".beach-accessories.picnic-backpack":{
			"filter": "AccessoriesForm",
			"exec" : function($form,infoObj){app.ext.store_filter.u.renderSlider($form, infoObj, {MIN:0,MAX:500});}
		},	
		".beach-accessories.picnic-baskets":{
			"filter": "AccessoriesForm",
			"exec" : function($form,infoObj){app.ext.store_filter.u.renderSlider($form, infoObj, {MIN:0,MAX:500});}
		}, 
/* BEACH CHAIR FORMS */
		".beach-chair.beach-chairs":{
			"filter": "BeachChairsForm",
			"exec" : function($form,infoObj){app.ext.store_filter.u.renderSlider($form, infoObj, {MIN:0,MAX:500});}
		},
		".beach-chair.canopy-beach-chair":{
			"filter": "BeachChairsForm",
			"exec" : function($form,infoObj){app.ext.store_filter.u.renderSlider($form, infoObj, {MIN:0,MAX:500});}
		},
		".beach-chair.folding-beach-chairs":{
			"filter": "BeachChairsForm",
			"exec" : function($form,infoObj){app.ext.store_filter.u.renderSlider($form, infoObj, {MIN:0,MAX:500});}
		},
		".beach-chair.heavy-beach-chairs":{
			"filter": "BeachChairsForm",
			"exec" : function($form,infoObj){app.ext.store_filter.u.renderSlider($form, infoObj, {MIN:0,MAX:500});}
		},
		".beach-chair.high-beach-chair":{
			"filter": "BeachChairsForm",
			"exec" : function($form,infoObj){app.ext.store_filter.u.renderSlider($form, infoObj, {MIN:0,MAX:500});}
		},
		".beach-chair.sand-chair":{
			"filter": "BeachChairsForm",
			"exec" : function($form,infoObj){app.ext.store_filter.u.renderSlider($form, infoObj, {MIN:0,MAX:500});}
		},
		".beach-chair.sand-chairs":{
			"filter": "BeachChairsForm",
			"exec" : function($form,infoObj){app.ext.store_filter.u.renderSlider($form, infoObj, {MIN:0,MAX:500});}
		},
		".beach-chair.wooden-beach-chairs":{
			"filter": "BeachChairsForm",
			"exec" : function($form,infoObj){app.ext.store_filter.u.renderSlider($form, infoObj, {MIN:0,MAX:500});}
		},
/* WOMENS COVER UP FORM */
		".beachwear.swimwear-women.cover-ups":{
			"filter": "WomensCoverUpsForm",
			"exec" : function($form,infoObj){app.ext.store_filter.u.renderSlider($form, infoObj, {MIN:0,MAX:500});}
		},
/* WOMENS SWIMWEAR FORMS */
		".beachwear.swimwear-women.bathing-suits":{
			"filter": "WomensSwimwearForm",
			"exec" : function($form,infoObj){app.ext.store_filter.u.renderSlider($form, infoObj, {MIN:0,MAX:500});}
		},
		".beachwear.swimwear-women.bikini-two-piece":{
			"filter": "WomensSwimwearForm",
			"exec" : function($form,infoObj){app.ext.store_filter.u.renderSlider($form, infoObj, {MIN:0,MAX:500});}
		},
		".beachwear.swimwear-women.monokinis-tankinis":{
			"filter": "WomensSwimwearForm",
			"exec" : function($form,infoObj){app.ext.store_filter.u.renderSlider($form, infoObj, {MIN:0,MAX:500});}
		},
		".beachwear.swimwear-women.one-piece-swimsuits":{
			"filter": "WomensSwimwearForm",
			"exec" : function($form,infoObj){app.ext.store_filter.u.renderSlider($form, infoObj, {MIN:0,MAX:500});}
		},
		".beachwear.swimwear-women.plus-size-swimsuits":{
			"filter": "WomensSwimwearForm",
			"exec" : function($form,infoObj){app.ext.store_filter.u.renderSlider($form, infoObj, {MIN:0,MAX:500});}
		}

	},

					////////////////////////////////////   CALLBACKS    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\



	callbacks : {
//callbacks.init need to return either a true or a false, depending on whether or not the file will execute properly based on store account configuration. Use this for any config or dependencies that need to occur.
//the callback is auto-executed as part of the extensions loading process.
		init : {
			onSuccess : function()	{
			
				app.ext.store_filter.u.bindOnclick();
			
				app.ext.store_filter.u.runCarousels();
				
				//app.rq.push(['script',0,'http://path.to.script.js/', function(){
					//This function is called when the script has finished loading
					//for provide support- add stuff to the DOM here
				//	}]);
				
			//	app.rq.push(['templateFunction','homepageTemplate','onCompletes',function(infoObj) {
					//app.ext.store_filter.u.runPhoneChatLive();
				
					//var $context = $(app.u.jqSelector('#'+infoObj.parentID));
					//app.ext.store_filter.u.hidePreviouslyViewed($context);
			//	}]);
				
				app.rq.push(['templateFunction','productTemplate','onCompletes',function(infoObj) {
					var $context = $(app.u.jqSelector('#'+infoObj.parentID)); //grabs the currently loaded product page (to ignore previously loaded / invisible ones)
					app.ext.store_filter.u.runProductCarousel($context);
					app.ext.store_filter.u.runProductVerticalCarousel($context);
					app.ext.store_filter.u.runProductVerticalCarousel2($context);
					app.ext.store_filter.u.runProductRecentCarousel($context);
					//app.u.dump('Product fredsel ran');
					app.ext.store_filter.u.handleToolTip();
				}]);
				
				app.rq.push(['templateFunction','cartTemplate','onCompletes',function(infoObj) {
					var $context = $(app.u.jqSelector('#'+infoObj.parentID));
					app.ext.store_filter.u.handleCartToolTip($context);
				}]);
				
				//creates tool tip for variations and product sibling thumbnails
				$( document ).tooltip({
					items : "img[data-big-img], [data-toolTipThumb], [data-toolTipQuickview]",
					position : {
						my : "bottom-5",
						at : "top"
					},
					//track : true,
					content : function(){
						var element = $(this);
						//thumbnail zoom for option thumbnails
						if (element.is("img[data-big-img]")) {
							var pid = $(this).closest('[data-pid]').attr('data-pid');
							var product = app.data['appProductGet|'+pid];
							//app.u.dump('>>>>> '); app.u.dump(product);
							//app.u.dump('>>>>> '); app.u.dump(product['@variations']['1']['options']['0'].prompt);
							return '<span class="optionsZoom">'+$(this).attr('data-tooltip-title')+'</span><img src="'+$(this).attr('data-big-img')+'" width="400" height="400" />';
							}
						//thumbnail zoom for sibling thumbnails
						if (element.is("[data-toolTipThumb]")) {
							//app.u.dump($(this).closest('[data-pid]').attr('data-pid'));
							var pid = $(this).closest('[data-pid]').attr('data-pid');
							var product = app.data['appProductGet|'+pid];
							var prodName = product['%attribs']['zoovy:prod_name'];
							var productImg = app.u.makeImage({"w":400,"h":400,"b":"ffffff",tag:0,"name":product['%attribs']['zoovy:prod_image1']});
							return '<span class="siblingZoom">'+prodName+'</span><img src="'+productImg+'" width="400" height="400" />';
							}
						//thumbnail zoom for thumbs under main prod images in quickview
						if (element.is("[data-toolTipQuickview]")) {
							app.u.dump('&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&'); app.u.dump($(this).closest('[data-toolTipName]').attr('data-toolTipName'));
							var pid = $(this).closest('[data-pid]').attr('data-pid');
							var product = app.data['appProductGet|'+pid];
							var prodName = product['%attribs']['zoovy:prod_name'];
							var imgName = $(this).closest('[data-toolTipName]').attr('data-toolTipName');
							var productImg = app.u.makeImage({"w":400,"h":400,"b":"ffffff",tag:0,"name":imgName});
							return '<span class="quickviewZoom">'+prodName+'</span><img src="'+productImg+'" width="400" height="400" />';
							}
						}
					});
					
					
		//			for(i = 1; i < 30; i += 1)	{
		//			imgName = pdata['zoovy:prod_image'+i];
//					app.u.dump(" -> "+i+": "+imgName);
		//			if(app.u.isSet(imgName)) {
		//				imgs += "<li><a class='MagicThumb-swap' rel='zoom-id: prodBigImage_href_"+data.value+"; hint: false;' rev='"+app.u.makeImage({'tag':0,'w':380,'h':380,'name':imgName,'b':'ffffff'})+"' href='"+app.u.makeImage({'tag':0,'w':'','h':'','name':imgName,'b':'ffffff'})+"'><img src='"+app.u.makeImage({'tag':0,'w':50,'h':50,'name':imgName,'b':'ffffff'})+"' \/><\/a><\/li>";
		//				}
		//			}
					
					
					
				
//				app.u.dump('BEGIN app.ext.store_navcats.init.onSuccess ');
				var r = true; //return false if extension won't load for some reason (account config, dependencies, etc).
				return r;
				},
			onError : function()	{
//errors will get reported for this callback as part of the extensions loading.  This is here for extra error handling purposes.
				}
			},
			
			startExtension : {
				onSuccess : function() {
					if(app.ext.myRIA && app.ext.myRIA.template && app.ext.powerReviews_reviews && handlePogs){
		/*				app.u.dump('*** Power Reviews is Loaded');
						app.rq.push(['templateFunction','homepageTemplate','onDeparts',function(infoObj) {
							var $context = $(app.u.jqSelector('#'+infoObj.parentID));
							app.ext.store_filter.u.noReviews($context);
						}]);
		*/				
						app.u.dump("beachmart Extension Started");
						$.extend(handlePogs.prototype,app.ext.store_filter.variations);
						//app.u.dump('*** Extending Pogs');
		
					} else	{
						setTimeout(function(){app.ext.beachmart.callbacks.startExtension.onSuccess()},250);
					}
				},
				onError : function (){
					app.u.dump('BEGIN app.ext.store_filter.callbacks.startExtension.onError');
				}
			}
		}, //callbacks


////////////////////////////////////   getFilterObj    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\


		getElasticFilter : {

			slider : function($fieldset){
				var r = false; //what is returned. Will be set to an object if valid.
				var $slider = $('.slider-range',$fieldset);
				if($slider.length > 0)	{
					r = {"range":{}}
//if data-min and/or data-max are not set, use the sliders min/max value, respectively.
					r.range[$fieldset.attr('data-elastic-key')] = {
						"from" : $slider.slider('values', 0 ) * 100,
						"to" : $slider.slider("values",1) * 100
						}
					}
				else	{
					app.u.dump("WARNING! could not detect .ui-slider class within fieldset for slider filter.");
					}
				return r;
				}, //slider

			hidden : function($fieldset){
				return app.ext.store_filter.u.buildElasticTerms($("input:hidden",$fieldset),$fieldset.attr('data-elastic-key'));
				},
			checkboxes : function($fieldset)	{
				return app.ext.store_filter.u.buildElasticTerms($(':checked',$fieldset),$fieldset.attr('data-elastic-key'));
				} //checkboxes

			}, //getFilterObj




////////////////////////////////////   Actions    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\


		a : {

			execFilter : function($form,$page){

				app.u.dump("BEGIN store_filter.a.filter");
				var $prodlist = $("[data-app-role='productList']",$page).first().empty();


				$('.categoryList',$page).hide(); //hide any subcategory lists in the main area so customer can focus on results
				$('.categoryText',$page).hide(); //hide any text blocks.

				if(app.ext.store_filter.u.validateFilterProperties($form))	{
				//	app.u.dump(" -> validated Filter Properties.")
					var query = {
						"mode":"elastic-native",
						"size":50,
						"filter" : app.ext.store_filter.u.buildElasticFilters($form)
						}//query
				//	app.u.dump(" -> Query: "); app.u.dump(query);
					if(query.filter.and.length > 0)	{
						$prodlist.addClass('loadingBG');
						app.ext.store_search.calls.appPublicProductSearch.init(query,{'callback':function(rd){

							if(app.model.responseHasErrors(rd)){
								$page.anymessage({'message':rd});
								}
							else	{
								var L = app.data[rd.datapointer]['_count'];
								$prodlist.removeClass('loadingBG')
								if(L == 0)	{
									$page.anymessage({"message":"Your query returned zero results."});
									}
								else	{
									$prodlist.append(app.ext.store_search.u.getElasticResultsAsJQObject(rd));
									}
								}

							},'datapointer':'appPublicSearch|elasticFiltering','templateID':'productListTemplateResultsNoPreview'});
						app.model.dispatchThis();
						}
					else	{
						$page.anymessage({'message':"Please make some selections from the list of filters"});
						}
					}
				else	{
					$page.anymessage({"message":"Uh Oh! It seems an error occured. Please try again or contact the site administator if error persists."});
					}
				$('html, body').animate({scrollTop : 0},200); //new page content loading. scroll to top.


			},//filter
			
			scrollToRevealTab : function(pid, href) {
				var $context = $(app.u.jqSelector("#","productTemplate_"+pid));
				var $prodSizing = $(".tabbedProductContent",$context);
				$("a[href="+href+"]",$context).click();
				$('html, body').animate({
					scrollTop: $prodSizing.offset().top
				}, 2000);
			},
			
		}, //actions

////////////////////////////////////   RENDERFORMATS    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

//renderFormats are what is used to actually output data.
//on a data-bind, format: is equal to a renderformat. extension: tells the rendering engine where to look for the renderFormat.
//that way, two render formats named the same (but in different extensions) don't overwrite each other.
		renderFormats : {
		
				//hides geo location/time in transit and add to cart button if product is discontinued or not purchasable
				hideGeoElements : function($tag, data) {
					//app.u.dump('*********************'); app.u.dump(data.value.pid); 
					if(data.value['%attribs']['zoovy:prod_is_tags']
						&& data.value['%attribs']['zoovy:prod_is_tags'].indexOf('IS_DISCONTINUED') > 0) {
						$tag.hide();
						if($('.addToCartButton',$tag.parent())) {
							$('.addToCartButton',$tag.parent()).hide();
						}
					}
					else if (!app.ext.store_product.u.productIsPurchaseable(data.value.pid)){
						$tag.hide();	
						if($('.addToCartButton',$tag.parent())) {
							$('.addToCartButton',$tag.parent()).hide();
						}
					}
				},
				
				addRedirectURL : function($tag, data) {
					//app.u.dump('Replacement Product: '); app.u.dump(data.value['%attribs']['user:replacement_product']);
					if(data.value['%attribs']['user:replacement_product']) {
						//$tag.append('THIS PRODUCT IS DISCONTINUED,<br><a class="pointer" title="new product" data-onclick="#!product?pid='+data.value['%attribs']['user:replacement_product']+'">CLICK HERE TO SEE</a><BR>THE NEW VERSION!');
						$tag.append('THIS PRODUCT IS DISCONTINUED,<br><a class="pointer" title="new product" onClick="return showContent(\'product\',{\'pid\':\''+data.value['%attribs']['user:replacement_product']+'\'});">CLICK HERE TO SEE</a><BR>THE NEW VERSION!');
					}																						 onClick="return showContent('product',{'pid':'wridt'});"
				},
		
				showShipRegion : function($tag, data) {
					//app.u.dump('--------->'); app.u.dump(data.value);
					$tag.append(data.value); 
				},
		
				//Puts message indicating expedited shipping isn't available in cart if applicable to any items there
				expShipMessage : function($tag, data) {
					var products = [];
					for(var index in data.value){
						products.push(data.value[index].product);
						}
//					app.u.dump('---------->'); app.u.dump(data.value);
					var numRequests = 0;
					for(var index in products){
						var _tag = {
							'callback':function(rd){
								if(app.model.responseHasErrors(rd)){
									//If an item in your cart gets an error, you're gonna have a bad time...
									app.u.throwMessage(rd);
									}
								else{
									if(app.data[rd.datapointer]['%attribs']['user:prod_ship_expavail'] == 1){
										$tag.text('Expedited shipping not available');
									}
						//			if(app.data[rd.datapointer]['%attribs']['zoovy:base_price'] > 200){
						//				$tag.text('The rent is too damn high!');
						//				}
									}
								}
							};	
						numRequests += app.ext.store_prodlist.calls.appProductGet.init({'pid':products[index]},_tag, 'immutable');
						}
					if(numRequests > 0){app.model.dispatchThis('immutable');}
				},
				
				//Puts shipping surcharge text (which will have a tool tip on it) in cart if applicable to any items there
				shipSurMessage : function($tag, data) {
					var products = [];
					for(var index in data.value) {
						products.push(data.value[index].product);
					}
					//app.u.dump(products);
					var numRequests = 0;
					for(var index in products) {
						var _tag = {
							'callback':function(rd) {
								if(app.model.responseHasErrors(rd)) {
									app.u.throwMessage(rd);
								}
								else {
									if(app.data[rd.datapointer]['%attribs']['user:prod_shipping']) {
										$tag.text('Shipping Surcharge');
									}
								}
							}
						};
						numRequests += app.ext.store_prodlist.calls.appProductGet.init({'pid':products[index]},_tag,'immutable');
					}
					if(numRequests > 0){app.model.dispatchThis('immutable');}
				},
				
				//shows container w/ accessories/similar tabbed content if one of them has values set
				showTabsIfSet : function($tag, data) {
					if(data.value['%attribs']['zoovy:related_products'] ||
						data.value['%attribs']['zoovy:accessory_products']){
							$tag.show();
						}
					if(data.value['%attribs']['zoovy:accessory_products'] && 
						!data.value['%attribs']['zoovy:related_products']) {
						$('.accTab',$tag).addClass('ui-state-active').addClass('ui-tabs-active');
						setTimeout(function(){
							$('.accAnch','.accTab',$tag).click();},500);
						app.u.dump('got past trigger');
					}
					},
					
				//set accessories to active if it is the only one
		//		showIfLonely : function($tag, data) {
		//			
		//		},
		
				//shows free shipping statement in product list if value is set
				showFreeShippingTag: function($tag, data) {
					//var isShipFree = data.value['%attribs']['zoovy:prod_is_tags'];
					var isShipFree = (data.bindData.isElastic) ? data.value.tags : data.value['%attribs']['zoovy:prod_is_tags'];
					if(isShipFree) {
						if(isShipFree.indexOf('IS_SHIPFREE') >= 0) {
							$tag.show();
						}
					}
				}, //End showFreeShippingTag
				
				//hides ships on/in message on product page if product isn't purchaseable
				hideShipLatency : function($tag, data) {
					var pid = data.value.pid;
//					app.u.dump('***PID'); app.u.dump(pid);
					if(!app.ext.store_product.u.productIsPurchaseable(pid)) {
						$tag.addClass('displayNone');
					}
				},
				
				//shows ships on/in message if data is set, takes into account when the message is displayed
				showShipLatency : function ($tag, data) {
					//app.u.dump('***TEST '+data.value);
					
					var userProdShipMsg = data.value['%attribs']['user:prod_shipping_msg'];
					var us1ts = data.value['%attribs']['us1:ts'];
					var zoovyProdSalesRank = data.value['%attribs']['zoovy:prod_salesrank'];
					var zoovyPreOrder = data.value['%attribs']['zoovy:prod_is_tags'];
					var d = new Date();
					var month = d.getMonth()+1;
					var day = d.getDate();
					var year = d.getFullYear();
					if (month < 10){month = '0'+month};
					if (day < 10){day = '0'+day};
					var date = year + '' + month + '' + day;
					//app.u.dump(userProdShipMsg);
					var pid = data.value.pid;
					
					//Item is preorder, get back to the future Marty! (when it will be shipped)
					if (zoovyPreOrder.indexOf('IS_PREORDER') > -1 && ([zoovyProdSalesRank > -1 || zoovyProdSalesRank != undefined] && zoovyProdSalesRank > date) ) {
						//var outputDate =  zoovyProdSalesRank.substring(5,6) + '/' + zoovyProdSalesRank.substring(7,8) + '/' + zoovyProdSalesRank.substring(0,4);
						//app.u.dump('*** '+outputDate);
						$tag.empty().append('Will ship on '+app.ext.beachmart.u.yyyymmdd2Pretty(zoovyProdSalesRank));
					}
					//Not a pre-order, show present-day ship info.
					else if (zoovyProdSalesRank == undefined || zoovyProdSalesRank <= date) {
						$tag.children('.shipTime').show();
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
				},
				
				//sets a description on the price of a product (usually in a product list)
				prodPriceDesc : function($tag, data) {
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

				//sets the overhang tag and hides discontinued products in a product list.
				showProdModifier : function($tag, data) {
				//	if(data.bindData.isElastic){
				//		app.u.dump(data.value);
				//		}
						
					var zoovyIsTags = (data.bindData.isElastic) ? data.value.tags : data.value['%attribs']['zoovy:prod_is_tags'];
					
					//app.u.dump('*** IS_USER2 = '+newLowPrice);
					if (zoovyIsTags.indexOf('IS_DISCONTINUED') >= 0) {
						$tag.parent().parent().parent().hide();
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
				
				//changes price description based on tag
				priceFrom : function($tag, data) {
					var priceModifier = data.value['%attribs']['user:prod_has_price_modifiers'];
					//app.u.dump('*** '+priceModifier);
					
					if(priceModifier < 1) {
						$tag.append('Our Price: ');
					} else {
						$tag.append('Our Price From: ');
					}
				},
				
				//was intended to hide reviews based on text, but text wasn't accessable at the time, may need to be deleted.
				noReviews : function($context) {
		/*			var $blah = "";
					$blah = $('.reviewsStarsCount', $context);
					app.u.dump('*** '+$blah.text());
					if($blah.text().indexOf() > -1) {
						$blah.hide();
					}
		*/		},
				
				//shows a message that an item has the is_colorful tag set, usually in a product list
				moreColors : function($tag, data) {
					var pid = data.value.pid,
						//isColorful = (data.bindData.isElastic) ? data.value.tags : data.value['%attribs']['zoovy:prod_is_tags'];
						isColorful = data.value.tags;
						
						//app.u.dump('*** '+pid);
		//			if (app.ext.store_product.u.productIsPurchaseable(pid) == true) {
						if (isColorful.indexOf('IS_COLORFUL') > -1) {
							$tag.show();
						}
		//			}
				},
				
				//counts the variations on a product if present and displays a button w/ count text on it (button destination set in app)
				//the count currently includes all variations (including layered POGs) and needs to be adjusted to only include 
				//color or siblin variations. It is a temp fix for the display of color option graphics in product lists.
				optionsCount : function($tag, data) {
				//app.u.dump(data.value.length);
					if(data.value.length) {
						$tag.text(data.value.length + ' VARIATIONS AVAILABLE!');
						$tag.show();
					}
				},
				
				//if inventory is 0, don't show in product list (not used w/ elastic because of pagination)
				inventoryHide : function($tag, data) {
					var pid = data.value.pid;
					if(data.value['@inventory'] && data.value['@inventory'][pid]) {
						var inventory = data.value['@inventory'][pid]['inv'];
						if(inventory == 0) {
							$tag.addClass('displayNone');
						}
					}	
				},
				
				productImages : function($tag,data)	{
					app.u.dump('data.value:::'); app.u.dump(data.value);
	//				app.u.dump("BEGIN myRIA.renderFormats.productImages ["+data.value+"]");
					var pdata = app.data['appProductGet|'+data.value]['%attribs']; //short cut to product object in memory.
					var imgs = ''; //all the html for all the images. appended to $tag after loop.
					var imgName; //recycled in loop.
					for(i = 1; i < 30; i += 1)	{
						imgName = pdata['zoovy:prod_image'+i];
	//					app.u.dump(" -> "+i+": "+imgName);
						if(app.u.isSet(imgName)) {
							imgs += "<li><a data-pid="+data.value+" data-toolTipQuickview='data-toolTipQuickview' data-toolTipName='"+imgName+"'class='MagicThumb-swap' rel='zoom-id: prodBigImage_href_"+data.value+"; hint: false;' rev='"+app.u.makeImage({'tag':0,'w':380,'h':380,'name':imgName,'b':'ffffff'})+"' href='"+app.u.makeImage({'tag':0,'w':'','h':'','name':imgName,'b':'ffffff'})+"'><img src='"+app.u.makeImage({'tag':0,'w':50,'h':50,'name':imgName,'b':'ffffff'})+"' \/><\/a><\/li>";
							}
						}
					$tag.append(imgs);
				}, //productImages
				
				productListThumbnails : function($tag,data)	{
					var pdata = app.data['appProductGet|'+data.value]['%attribs']; //short cut to product object in memory.
					var imgs = ''; //all the html for all the images. appended to <ul> "list" after loop.
					var imgName; //recycled in loop.
					var $list = $('<ul>'); //append to $tag after loop
					var imgCount = 0;
					for(i = 1; i < 5; i += 1)	{
						imgName = pdata['zoovy:prod_image'+i];
	//					app.u.dump(" -> "+i+": "+imgName);
						if(app.u.isSet(imgName)) {
							imgs += "<li class='miniThumbLi'><a data-pid="+data.value+" data-toolTipQuickview='data-toolTipQuickview' data-toolTipName='"+imgName+"'class='' rel='zoom-id: prodBigImage_href_"+data.value+"; hint: false;' rev='"+app.u.makeImage({'tag':0,'w':380,'h':380,'name':imgName,'b':'ffffff'})+"' href='"+app.u.makeImage({'tag':0,'w':'','h':'','name':imgName,'b':'ffffff'})+"'><img src='"+app.u.makeImage({'tag':0,'w':30,'h':30,'name':imgName,'b':'ffffff'})+"' \/><\/a><\/li>";
							imgCount++;
							}
						}
					if(imgCount > 3) {
						imgs += "<li class='miniThumbLi miniThumbText' onClick='quickView('product',{'templateID':'productTemplateQuickView','pid':$(this).closest('[data-pid]').attr('data-pid')});'>SEE MORE!<\/li>";
						$list.append(imgs);
						$tag.append($list);
						$('.reviewsStarsCount', $tag.parent()).hide();
					}
				} //productImages
				
			}, //renderFormats
////////////////////////////////////   UTIL    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\


		u : {
//pass in form as object.  This function will verify that each fieldset has the appropriate attributes.
//will also verify that each filterType has a getElasticFilter function.
			validateFilterProperties : function($form)	{
				var r = true, //what is returned. false if form doesn't validate.
				$fieldset, filterType; //recycled.

				$('fieldset',$form).each(function(index){
					$fieldset = $(this);
					filterType = $fieldset.attr('data-filtertype');
					if(!filterType)	{
						r = false;
						$form.anymessage({"message":"In store_filters.u.validateFilterProperties,  no data-filtertype set on fieldset. can't include as part of query. [index: "+index+"]",gMessage:true});
						}
					else if(typeof app.ext.store_filter.getElasticFilter[filterType] != 'function')	{
						r = false;
						$form.anymessage({"message":"WARNING! type ["+filterType+"] has no matching getElasticFilter function. [typoof: "+typeof app.ext.store_filter.getElasticFilter[filterType]+"]",gMessage:true});
						}
					else if(!$fieldset.attr('data-elastic-key'))	{
						r = false;
						$form.anymessage({"message":"WARNING! data-elastic-key not set for filter. [index: "+index+"]",gMessage:true});
						}
					else	{
						//catch.
						}
					});
				return r;
				},


			buildElasticFilters : function($form)	{

var filters = {
	"and" : [] //push on to this the values from each fieldset.
	}//query


$('fieldset',$form).each(function(){
	var $fieldset = $(this),
	filter = app.ext.store_filter.getElasticFilter[$fieldset.attr('data-filtertype')]($fieldset);
	if(filter)	{
		filters.and.push(filter);
		}
	});
// 20120701 -> do not want discontinued items in the layered search results. JT.
	filters.and.push({"not" : {"term" : {"tags":"IS_DISCONTINUED"}}});
	
//and requires at least 2 inputs, so add a match_all.
//if there are no filters, don't add it. the return is also used to determine if any filters are present
	if(filters.and.length == 1)	{
		filters.and.push({match_all:{}})
		}
return filters;				

				},

//pass in a jquery object or series of objects for form inputs (ex: $('input:hidden')) and a single term or a terms object will be returned.
//false is returned in nothing is checked/selected.
//can be used on a series of inputs, such as hidden or checkbox 
			buildElasticTerms : function($obj,attr)	{

				var r = false; //what is returned. will be term or terms object if valid.
				if($obj.length == 1)	{
					r = {term:{}};
					r.term[attr] = (attr == 'pogs') ? $obj.val() : $obj.val().toLowerCase(); //pog searching is case sensitive.
					}
				else if($obj.length > 1)	{
					r = {terms:{}};
					r.terms[attr] = new Array();
					$obj.each(function(){
						r.terms[attr].push((attr == pogs) ? $(this).val() : $(this).val().toLowerCase());
						});
					}
				else	{
					//nothing is checked.
					}
				return r;
				},


			renderSlider : function($form, infoObj, props){
				$( ".slider-range" ).slider({
					range: true,
					min: props.MIN,
					max: props.MAX,
					values: [ props.MIN, props.MAX ],
					stop : function(){
						$form.submit();
						},
					slide: function( event, ui ) {
						$( ".sliderValue",$form ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
						}
					});
				$( ".sliderValue",$form ).val( "$" + $( ".slider-range" ).slider( "values", 0 ) + " - $" + $( ".slider-range" ).slider( "values", 1 ) );
				}, //renderSlider
				

			//CAROUSEL FUNCTIONS
				runCarousels : function() {
					
					//THIS CAROUSEL MAY BE REMOVED ENTIRELY, WAS REPLACED W/ CHANGEABLE BANNER
					//HOMEPAGE FEATURED PRODUCTS TALL CAROUSEL					
	/*				app.rq.push(['templateFunction','homepageTemplate','onCompletes',function(P) {
						var $target = $('#homeProdSearchNewArrivals');
						if($target.data('isCarousel'))	{} //only make it a carousel once.
						else	{
							$target.data('isCarousel',true);
					//for whatever reason, caroufredsel needs to be executed after a moment.
							setTimeout(function(){
								$target.carouFredSel({
									auto: { 
										/*items			: 6,
										duration		: 5000,
										easing			: "linear",
										timeoutDuration	: 0,*/
	/*									pauseOnHover	: "immediate"
									},
									prev: '.newCarouselPrev',
									next: '.newCarouselNext',
									width: '100%',
									pagination: '#featuredCarouselPagination',
									scroll: 5,
							//		mousewheel: true, //this is mobile, so mousewheel isn't necessary (plugin is not loaded)
									swipe: {
										onMouse: true,
										onTouch: true
										}
									});
								},1000); 
							}
					}]);						*/
						
					//HOMEPAGE FEATURED CAROUSEL	
					app.rq.push(['templateFunction','homepageTemplate','onCompletes',function(P) {
						var $target = $('#homeProdSearchNewArrivals2');
						if($target.data('isCarousel'))	{} //only make it a carousel once.
						else	{
							$target.data('isCarousel',true);
					//for whatever reason, caroufredsel needs to be executed after a moment.
							setTimeout(function(){
								$target.carouFredSel({
									auto: {
										pauseOnHover: "immediate"
									},
									prev: '.new2CarouselPrev',
									next: '.new2CarouselNext',
									width: '100%',
									scroll: 1,
							//		mousewheel: true, //this is mobile, so mousewheel isn't necessary (plugin is not loaded)
									swipe: {
										onMouse: true,
										onTouch: true
										}
									});
								},1000); 
							}
					}]);
					
					//HOMEPAGE FEATURED PRODUCTS CAROUSEL
					app.rq.push(['templateFunction','homepageTemplate','onCompletes',function(P) {
						var $target = $('#homeProdSearchFeatured');
						if($target.data('isCarousel'))	{} //only make it a carousel once.
						else	{
							$target.data('isCarousel',true);
					//for whatever reason, caroufredsel needs to be executed after a moment.
							setTimeout(function(){
								$target.carouFredSel({
									items: {
										start: 8,
									},
									auto: false, /*{
										pauseOnHover: "immediate"
									},*/
									prev: '.featCarouselPrev',
									next: '.featCarouselNext',
									height: 405,
									width: 960,
									pagination: '#featCarPagenation',
									scroll: 4,
							//		mousewheel: true, //this is mobile, so mousewheel isn't necessary (plugin is not loaded)
									swipe: {
										onMouse: true,
										onTouch: true
										}
									});
								},1000); 
							}
					}]);

					//HOMEPAGE BESTSELLERS PRODCUTS CAROUSEL
					app.rq.push(['templateFunction','homepageTemplate','onCompletes',function(P) {
						var $target = $('#homeProdSearchBestSellers');
						if($target.data('isCarousel'))	{} //only make it a carousel once.
						else	{
							$target.data('isCarousel',true);
					//for whatever reason, caroufredsel needs to be executed after a moment.
							setTimeout(function(){
								$target.carouFredSel({
									auto: {
										pauseOnHover: "immediate"
									},
									prev: '.bestCarouselPrev',
									next: '.bestCarouselNext',
									height: 405,
									width: 960,
									pagination: '#bestCarPagenation',
									scroll: 4,
							//		mousewheel: true, //this is mobile, so mousewheel isn't necessary (plugin is not loaded)
									swipe: {
										onMouse: true,
										onTouch: true
										}
									});
								},1000); 
							}
						}]);
					
				},//END  HOMEPAGE CAROUSEL FUNCTIONS
				
				//PRODUCT CAROUSELS
				runProductCarousel : function($context) {
					//CAROUSEL UNDER MAIN PRODUCT IMAGE
					var $target = $('.prodPageCarousel', $context);
					if($target.data('isCarousel'))	{} //only make it a carousel once.
					else	{
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
							},1000); 
						} //end prodPageCarousel
					},
					
					//YOU MAY LIKE THIS VERTICAL CAROUSEL
					runProductVerticalCarousel : function($context) {
						var $target = $('.testUL', $context);
						if($target.data('isCarousel'))	{} //only make it a carousel once.
						else	{
							$target.data('isCarousel',true);
							app.u.dump('*** Carousel is true');
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
								},100); 
							}//END VERTICAL CAROUSEL1 
						},						
						
						//ACCESSORIES VERTICAL CAROUSEL
					runProductVerticalCarousel2 : function($context) {
						var $target = $('.testUL2', $context);
						if($target.data('isCarousel'))	{} //only make it a carousel once.
						else	{
							$target.data('isCarousel',true);
							//app.u.dump('*** Carousel is true');
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
								},1000); 
						}//END VERTICAL CAROUSEL2  
						
					},//END PRODUCT PAGE CAROUSELS
					
					runProductRecentCarousel : function($context) {
						var $target = $('.productPreviousViewed', $context);
						if($target.data('isCarousel'))	{} //only make it a carousel once.
						else	{
							$target.data('isCarousel',true);
							//app.u.dump('*** Carousel is true');
					//for whatever reason, caroufredsel needs to be executed after a moment.
							setTimeout(function(){
								$target.carouFredSel({
									circular: true,
									auto: false,
									prev: '.productPreviousViewedPrev',
									next: '.productPreviousViewedNext',
									/*items:{
										height: 468,
										width: 240
									},*/
									height: 405,
									width: 960,
									//items: 1,
									pagination: '.productPreviousViewedPagenation',
									scroll: 4,
							//		mousewheel: true, //this is mobile, so mousewheel isn't necessary (plugin is not loaded)
									swipe: {
										onMouse: true,
										onTouch: true
									}
								});
							},1000); 
						}
					},//END PRODCUT RECENT CAROUSEL
						
				//PREVIOUSLY VIEWED ITEMS CAROUSEL
/*					app.rq.push(['templateFunction','categoryTemplateBrands','onCompletes',function(P) {
						var $target = $('.brandCatsPreviousViewed');
//						if($target.data('isCarousel'))	{} //only make it a carousel once.

						var execCarousel = function(){ setTimeout(function(){
								$target.carouFredSel({
									auto: false,
									prev: '.brandsCatPrevViewedCarouselPrev',
									next: '.brandsCatPrevViewedCarouselNext',
									height: 405,
									width: 'variable',
									items : {
										visible : null
									},
									pagination: '.brandCatsPreviousViewedCarPagenation',
									scroll: 4,
							//		mousewheel: true, //this is mobile, so mousewheel isn't necessary (plugin is not loaded)
									swipe: {
										onMouse: true,
										onTouch: true
										}
									});
								},1000);}

						if($target.children().length === 0)	{} //no kids, do nothing.
						else if($target.data('isCarousel') == true)	{
							$target.carouFredSel('destroy');
							execCarousel();
							}
						else	{
							$target.data('isCarousel',true);
							execCarousel();
							app.u.dump(" -> !!! children: "+$target.children().length);
					//for whatever reason, caroufredsel needs to be executed after a moment.
 
							}
						}]);		*/

	/*			hidePreviouslyViewed : function($context) {
					$('#recentlyViewedItemsContainer').hide();
				},
				
				showPreviouslyViewed : function($context) {
					$('#recentlyViewedItemsContainer').show();
				}*/
				
				//shows tool tip on product page. Uses fade out to allow for click on link in tool tip pop up
				handleToolTip : function()	{
				app.u.dump("BEGIN beachmart.u.handleToolTip.");
					$('.tipify',$('#appView')).each(function(){
						var $this = $(this);
						$this.parent().css('position','relative'); //this is what makes the tooltip appear next to the link instead of off in space.
						$this.mouseover(function(){	$('.toolTip',$this.parent()).show();}).mouseout(function(){	$('.toolTip',$this.parent()).fadeOut(3000);});
						});
				},
					
				//shows tool tip in cart	
				handleCartToolTip : function($context) {	
					$('.tipifyCart', $context).each(function(){
						var $this = $(this);
						$this.parent().css('position','relative'); //this is what makes the tooltip appear next to the link instead of off in space.
						$this.mouseover(function(){	$('.toolTip',$this.parent()).show();}).mouseout(function(){	$('.toolTip',$this.parent()).hide();});
						});
				},
				
				
				//replacement for bindByAnchor href to make crawlable links. Currently used mainly on sitemap
				bindOnclick : function() {
					$('body').off('click', 'a[data-onclick]').on('click', 'a[data-onclick]', function(event){
						 var $this = $(this);
						 var P = app.ext.myRIA.u.parseAnchor($this.data('onclick'));
						 return app.ext.myRIA.a.showContent('',P);
					});
				},
							
	/*			showShipRegion : function($context) {
					$('.cartRegion', $context).each(function() {
						var $this = $(this);
						app.u.dump('--------->'); app.u.dump($context);					
					});
				},
	*/			
		//		runPhoneChatLive : function() {
		//			var $container = $('.phoneChatScript','#homepageTemplate_');
		//			//app.u.dump('--------->'); app.u.dump($container);
		//			var $script =  $('<script type="text/javascript">var seyXFh=document.createElement("script"); seyXFh.type="text/javascript"; var seyXFhs=(location.protocol.indexOf("https")==0?"https":"http")+"://image.providesupport.com/js/1qaxuqjnvcj4w1csevb7u0l3tc/safe-textlink.js?ps_h=yXFh&ps_t="+new Date().getTime()+"&online-link-html=Live%20Chat%20Online&offline-link-html=Live%20Chat%20Offline"; setTimeout("seyXFh.src=seyXFhs;document.getElementById("sdyXFh").appendChild(seyXFh)",1);</script>')
		//			$container.append($script);
		//		}
			
			}, //u


//app-events are added to an element through data-app-event="extensionName|functionName"
//right now, these are not fully supported, but they will be going forward. 
//they're used heavily in the admin.html file.
//while no naming convention is stricly forced, 
//when adding an event, be sure to do off('click.appEventName') and then on('click.appEventName') to ensure the same event is not double-added if app events were to get run again over the same template.
		e : {	
			}, //e [app Events]
			
		variations : {
			
			//puts color options on product page as image selectable select list. Also adds jquery tool tip pop up of image for zoom
			renderOptionCUSTOMIMGSELECT: function(pog) {

//				app.u.dump('POG -> '); app.u.dump(pog);
				
				var $parent = $('<div class="optionsParent" />');
				var $select = $("<select class='optionsSelect' name="+pog.id+" />");
				var $hint = $('<div class="zhint">mouse over thumbnail to see larger swatches</div>');
				$parent.append($hint);

				var len = pog.options.length;				
				if(len > 0) {
					optionTxt = (pog['optional'] == 1) ? "" : "Please choose (required)";
					selOption = "<option value='' disabled='disabled' selected='selected'>"+optionTxt+"<\/option>";
					$select.append(selOption);
				}
				
				var $option;
				for (var index in pog.options) {
					var option = pog.options[index];
//					app.u.dump('IMG: '); app.u.dump(option.img);
					$option = $("<option value="+option.v+">"+option.prompt+"</option>");
					$select.append($option);
					var thumbImg = app.u.makeImage({"w":pog.width,"h":pog.height,"name":option.img,"b":"FFFFFF","tag":false,"lib":app.username});
					var bigImg = app.u.makeImage({"w":400,"h":400,"name":option.img,"b":"FFFFFF","tag":false,"lib":app.username});																									//need to try moving these to be appended
					
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
					
					$imgContainer.click(function(){
						var pogval = $(this).attr('data-pogval');
						
						$select.val(pogval);
						$('.optionImagesCont', $parent).each(function(){
							if($(this).hasClass('selected')){ 
								$(this).removeClass('selected'); 
								}
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

				$parent.append($select);
				return $parent;
			}, // END renderOptionCUSTOMIMGSELECT
			
			xinit : function(){
				this.addHandler("type","imgselect","renderOptionCUSTOMIMGSELECT");
				app.u.dump("--- RUNNING XINIT");
			}
			
		} //variations	
			
		} //r object.
	return r;
	}