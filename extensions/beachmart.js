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
			}/*,
			".00027-metal-chess-pieces":{
			"filter": "chessPiecesForm",
			"exec" : function($form,infoObj){app.ext.store_filter.u.renderSlider($form, infoObj, {MIN:0,MAX:500});}
			},
			".00024-marble-onyx-chess-sets.marble-onyx-chess-pieces":{
			"filter": "chessPiecesForm",
			"exec" : function($form,infoObj){app.ext.store_filter.u.renderSlider($form, infoObj, {MIN:0,MAX:500});}
			},
			".00020-plastic-chess-sets":{
			"filter": "chessPiecesForm",
			"exec" : function($form,infoObj){app.ext.store_filter.u.renderSlider($form, infoObj, {MIN:0,MAX:500});}
			},
			".00029-theme-chess-pieces":{
			"filter": "chessPiecesForm",
			"exec" : function($form,infoObj){app.ext.store_filter.u.renderSlider($form, infoObj, {MIN:0,MAX:500});}
			},
			".00055-unfinished-chess-sets":{
			"filter": "chessPiecesForm",
			"exec" : function($form,infoObj){app.ext.store_filter.u.renderSlider($form, infoObj, {MIN:0,MAX:500});}
			},
			".00022-jaques-london-chess-sets":{
			"filter": "chessPiecesForm",
			"exec" : function($form,infoObj){app.ext.store_filter.u.renderSlider($form, infoObj, {MIN:0,MAX:500});}
			},
			".00033-artisan-hand-carved-chess-sets":{
			"filter": "chessPiecesForm",
			"exec" : function($form,infoObj){app.ext.store_filter.u.renderSlider($form, infoObj, {MIN:0,MAX:500});}
			},
			".000295-most-unique-chess-pieces":{
			"filter": "chessPiecesForm",
			"exec" : function($form,infoObj){app.ext.store_filter.u.renderSlider($form, infoObj, {MIN:0,MAX:500});}
			},*/
		},

					////////////////////////////////////   CALLBACKS    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\



	callbacks : {
//callbacks.init need to return either a true or a false, depending on whether or not the file will execute properly based on store account configuration. Use this for any config or dependencies that need to occur.
//the callback is auto-executed as part of the extensions loading process.
		init : {
			onSuccess : function()	{
				
				app.ext.store_filter.u.runCarousels();
				app.rq.push(['templateFunction','productTemplate','onCompletes',function(P) {
					app.ext.store_filter.u.runProductCarousel();
					app.u.dump('Product fredsel ran');
				}]);
				
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
					if(app.ext.myRIA && app.ext.myRIA.template){
						app.u.dump("beachmart Extension Started");
						
					} else	{
						setTimeout(function(){app.ext.beachmart.callbacks.startExtension.onSuccess()},250);
					}
				},
				onError : function (){
					app.u.dump('BEGIN app.ext._2bhip.callbacks.startExtension.onError');
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
			
			//SHOW MAIN CATEGORY DROPDOWN MENU
			showDropdown : function ($tag, ht) {
				var $dropdown = $(".dropdown", $tag);
				var height = ht;
				$dropdown.children().each(function(){
					$(this).outerHeight(true);
				});
				$dropdown.stop().animate({"height":height+"px"}, 1000);
			},
            
			//ANIMATE RETRACTION OF MAIN CATEGORY DROPDOWN MENU
			hideDropdown : function ($tag) {
				$(".dropdown", $tag).stop().animate({"height":"0px"}, 1000);
			},
			
			//IMEDIATE RETRACTION OF MAIN CATEGORY DROPDOWN MENU WHEN HEADER IS CLICKED
			clickDropdown : function ($tag) {
				$(".dropdown", $tag).stop().animate({"height":"0px"}, 0);
			},
			
			//SHOW MAIN CATEGORY 2ND LEVEL DROPOUT MENU
			showDropout : function ($tag, wd) {
				var $dropout = $(".dropout", $tag);
				var width = wd;
				$dropout.children().each(function(){
					$(this).outerWidth(true);
				});
				$dropout.stop().animate({"width":width+"px"}, 1000);
			},
			
			//ANIMATE RETRACTION OF MAIN CATEGORY 2ND LEVEL DROPOUT MENU
			hideDropout : function ($tag) {
				$(".dropout", $tag).stop().animate({"width":"0px"}, 1000);
			},
			
			//IMEDIATE RETRACTION OF MAIN CATEGORY DROPDOWN MENU WHEN 2ND LEVEL LINK IS CLICKED
			clickDropdown : function ($tag) {
				$(".dropdown", $tag).stop().animate({"height":"0px"}, 0);
			},
			
		}, //actions

////////////////////////////////////   RENDERFORMATS    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

//renderFormats are what is used to actually output data.
//on a data-bind, format: is equal to a renderformat. extension: tells the rendering engine where to look for the renderFormat.
//that way, two render formats named the same (but in different extensions) don't overwrite each other.
		renderFormats : {
				showFreeShippingTag: function($tag, data) {
					//app.u.dump(data.value);
					var us1ts = data.value['%attribs']['us1:ts'];
					var zoovyProdSalesRank = data.value['%attribs']['zoovy:prodsalesrank'];
					var d = new Date();
					var month = d.getMonth()+1;
					var day = d.getDate();
					var year = d.getFullYear();
					var date = month + '-' + day + '-' + year;
					
					//app.u.dump('us1ts= '+us1ts);
					//app.u.dump(us1ts['zoovy:prod_salesrank']);
					if (us1ts != 1 || date > zoovyProdSalesRank) {
						$tag.show();
					}
					else {
						//do nothing tag is hidden by default
					}
				}, //End showFreeShippingTag
				
				showPriceModifier : function($tag, data) {
					var priceFrom = data.value['%attribs']['user:prod_has_price_modifiers'];
					var sale = data.value['%attribs']['is:sale'];
					var zoovyIsTags = data.value['%attribs']['zoovy:prod_is_tags'];
					
					//app.u.dump('*** IS_USER2 = '+newLowPrice);
					//app.u.dump('***Price Modifier = '+priceFrom);
					if (zoovyIsTags.indexOf('IS_CLEARANCE') >= 0) {
						$tag.append('CLEARANCE PRICE!');
					}
					else if (zoovyIsTags.indexOf('IS_SALE') >= 0) {
						$tag.append('SALE PRICE!');
					}
					else {
						//don't add anything
					}
					
				}, //End showPriceModifier	

				showProdModifier : function($tag, data) {
					var zoovyIsTags = data.value['%attribs']['zoovy:prod_is_tags'];
					
					//app.u.dump('*** IS_USER2 = '+newLowPrice);
					if (zoovyIsTags.indexOf('IS_USER3') >= 0) {
						$tag.append('Closeout!');
						$tag.show();
					}
					else if (zoovyIsTags.indexOf('IS_CLEARANCE') >= 0) {
						$tag.append('Clearance');
						$tag.show();
					}
					else if (zoovyIsTags.indexOf('IS_USER6') >= 0) {
						$tag.append('Customer Favorite');
						$tag.show();
					}
					else if (zoovyIsTags.indexOf('IS_USER4') >= 0) {
						$tag.append('Exclusive');
						$tag.show();
					}
					else if (zoovyIsTags.indexOf('IS_USER5') >= 0) {
						$tag.append('Exclusive');
						$tag.show();
					}
					else if (zoovyIsTags.indexOf('IS_BESTSELLER') >= 0) {
						$tag.append('Best Seller');
						$tag.show();
					}
					else if (zoovyIsTags.indexOf('IS_USER2') >= 0) {
						$tag.append('New Low Price!');
						$tag.show();
					}
					else if (zoovyIsTags.indexOf('IS_NEWARRIVAL') >= 0) {
						$tag.append('New Arrival');
						$tag.show();
					}
					else if (zoovyIsTags.indexOf('IS_USER7') >= 0) {
						$tag.append('Overstock Sale');
						$tag.show();
					}
					else if (zoovyIsTags.indexOf('IS_DISCONTINUED') >= 0) {
						$tag.append('Discontinued');
						$tag.show();
					}
					else if (zoovyIsTags.indexOf('IS_PREORDER') >= 0) {
						$tag.append('Back Order');
						$tag.show();
					}
					else if (zoovyIsTags.indexOf('IS_SALE') >= 0) {
						$tag.append('SALE!');
					}
					else {
						//add no tags
					}
				}
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
					
					//HOMEPAGE FEATURED PRODUCTS TALL CAROUSEL					
					app.rq.push(['templateFunction','homepageTemplate','onCompletes',function(P) {
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
										pauseOnHover	: "immediate"
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
					}]);
						
					//HOMEPAGE FEATURED CAROUSEL	
					app.rq.push(['templateFunction','homepageTemplate','onCompletes',function(P) {
						var $target = $('#homeProdSearchNewArrivals2');
						if($target.data('isCarousel'))	{} //only make it a carousel once.
						else	{
							$target.data('isCarousel',true);
					//for whatever reason, caroufredsel needs to be executed after a moment.
							setTimeout(function(){
								$target.carouFredSel({
									auto: false,
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
									auto: false,
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
									auto: false,
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
						

					//PREVIOUSLY VIEWED ITEMS CAROUSEL
		/*			app.rq.push(['templateFunction','categoryTemplateBrands','onCompletes',function(P) {
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
					
				},//END CAROUSEL FUNCTIONS
				
				//PRODUCT CAROUSELS
				runProductCarousel : function() {
					//CAROUSEL UNDER MAIN PRODUCT IMAGE
					var $target = $('.prodPageCarousel');
					if($target.data('isCarousel'))	{} //only make it a carousel once.
					else	{
						$target.data('isCarousel',true);
				//for whatever reason, caroufredsel needs to be executed after a moment.
						setTimeout(function(){
							$target.carouFredSel({
								auto: false,
								prev: '.prodPageCarPrev',
								next: '.prodPageCarNext',
								height: 70,
								width: 300,
								//items: 4,
								//pagination: '#bestCarPagenation',
								scroll: 1,
						//		mousewheel: true, //this is mobile, so mousewheel isn't necessary (plugin is not loaded)
								swipe: {
									onMouse: true,
									onTouch: true
									}
								});
							},1000); 
						} //end prodPageCarousel
					
					//YOU MAY LIKE THIS VERTICAL CAROUSEL
					var $target = $('.slideshowContainerVertical1');
					if($target.data('isCarousel'))	{} //only make it a carousel once.
					else	{
						$target.data('isCarousel',true);
						app.u.dump('*** Carousel is true');
				//for whatever reason, caroufredsel needs to be executed after a moment.
						setTimeout(function(){
							$target.carouFredSel({
								circular: true,
								auto: false,
								direction: 'up',
								prev: '.prev1',
								next: '.next1',
								items:{
									height: 440,
									width: 240
								},
								height: 450,
								width: 250,
								//items: 1,
								//pagination: '#bestCarPagenation',
								scroll: 1,
						//		mousewheel: true, //this is mobile, so mousewheel isn't necessary (plugin is not loaded)
								swipe: {
									onMouse: true,
									onTouch: true
									}
								});
							},1000); 
						}//END VERTICAL CAROUSEL1
					}//END PRODUCT PAGE CAROUSELS
				
			}, //u



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