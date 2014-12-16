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



// An extension for loading the functions required for the homepage

var beachmall_homepage = function(_app) {
	var theseTemplates = new Array('');
	var r = {
	
		vars : { },


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
		
		renderProductsAsList : {
			onSuccess : function(rd) {
//				dump('renderProductsAsList datapointer:'); _app.u.dump(_app.data[rd.datapointer]); dump(rd.container); dump(rd.template);
				rd.container.tlc({"templateid":rd.template,"dataset":_app.data[rd.datapointer],verb:"transmogrify"});
				setTimeout(function(){
					_app.ext.beachmall_homepage.u.pickCarousel(rd.carousel, rd.context);
					rd.container.parent().removeClass('loadingBG');
				},1000);
			},
			onError : function(responseData) {
				_app.u.dump('Error in extension: store_bmo_ renderProductsAsList');
				_app.u.dump(responseData);
			}
		},
		
	}, //callbacks



////////////////////////////////////   ACTION    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

//actions are functions triggered by a user interaction, such as a click/tap.
//these are going the way of the do do, in favor of app events. new extensions should have few (if any) actions.
		a : { }, //Actions

////////////////////////////////////   RENDERFORMATS    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

//renderFormats are what is used to actually output data.
//on a data-bind, format: is equal to a renderformat. extension: tells the rendering engine where to look for the renderFormat.
//that way, two render formats named the same (but in different extensions) don't overwrite each other.
		renderFormats : { }, //renderFormats
		
////////////////////////////////////   UTIL [u]   \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

//utilities are typically functions that are exected by an event or action.
//any functions that are recycled should be here.
		u : { 
		
/* BANNER UTILS */		
			//retrieves the data for the main banner on the homepage and calls the function to display it.
			getMainBanner : function() {
				$.getJSON("_banners.json?_v="+(new Date()).getTime(), function(json) {
					_app.ext.beachmall_homepage.vars.homepageBanners = json.homepageBanners;
					_app.ext.beachmall_homepage.u.showHomepageBanners();
				}).fail(function(){_app.u.throwMessage("BANNERS FAILED TO LOAD - there is a bug in _banners.json")});
			},
			
			showHomepageBanners : function() {
			//dump('--> START showHomepageBanners');
				var $container = $('.bannerContainer, .homeTemplate');
				if(!$container.hasClass('bannersRendered')) {
					if(_app.ext.beachmall_homepage.vars.homepageBanners) {
						$container.addClass('bannersRendered');
						var bannerWidth = _app.ext.beachmall_homepage.vars.homepageBanners.main.width == "" ? 620 : _app.ext.beachmall_homepage.vars.homepageBanners.main.width;
						var bannerHeight = _app.ext.beachmall_homepage.vars.homepageBanners.main.height == "" ? 300 : _app.ext.beachmall_homepage.vars.homepageBanners.main.height;
						//dump('BANNER WIDTH & HEIGHT'); dump(bannerWidth); dump(bannerHeight);
						$('.main',$container).removeClass('loadingBG').append(_app.ext.beachmall_homepage.u.makeBanner(_app.ext.beachmall_homepage.vars.homepageBanners.main,bannerWidth,bannerHeight,"ffffff"));
					}
					else {
						setTimeout(this.showHomepageBanners,250);
					}
				}
			},
			
			makeBanner : function(bannerJSON, w, h, b) {
				//dump('--> START makeBanner');
				var $img = $(_app.u.makeImage({
					tag : true,
					w   	: w,
					h		: h,
					b		: b,
					name	: bannerJSON.src,
					alt		: bannerJSON.alt,
					title	: bannerJSON.title
				}));
				if(bannerJSON.href) {
					var $banner = $("<a></a>");
					$banner.append($img);
					$banner.attr('href',bannerJSON.href);
					return $banner;
				}
				else if(bannerJSON.prodLink) {
					$img.addClass('pointer').data('pid', bannerJSON.prodLink).click(function() {
						showContent('product',{'pid':$(this).data('pid')});
					});
				}
				else if(bannerJSON.catLink) {
					$img.addClass('pointer').data('navcat', bannerJSON.catLink).click(function() {
					dump('beachmall_banner needs showContent fix in makeBanner');
						showContent('category',{'navcat':$(this).data('navcat')});
					});
				}
				else {
					//just a banner!
				}
				return $img;
			},
			
/* CAROUSEL UTILS */
			//loads product lists in hompage carousels. Carousel & Template are loaded in callback according to what is passed in the data-attrib. 	
			//context and loading container are also passed in data-attribs. 
			loadProductsAsList :function($context, $container) {
				var carousel = $container.attr('data-carousel'); dump('carousel name:'); dump(carousel); 
				if(!$container.attr('data-beach-rendered')) {
					var path = $container.attr('data-list'); //dump('list name:'); dump(path); 
					var template = $container.attr('data-templateid'); //dump('template name:'); dump(template); 
					$container.attr('data-beach-rendered',true); 
//					_app.u.dump('data added?'); _app.u.dump($container.attr('data-beach-rendered'));
			//TODO: set up hide/show/placeholder for carousel elements until loaded		
					var _tag = {
						"callback"		: "renderProductsAsList",
						"extension"	: "beachmall_homepage",
						"carousel"		: carousel,
						"template"		: template, 
						"container"	: $container,
						"context"		: $context
					}
					
					_app.calls.appNavcatDetail.init({"path":path,"detail":"more"},_tag,"immutable");
					_app.model.dispatchThis('immutable');
				}
				else { /* already rendered, don't render again.*/ _app.ext.beachmall_homepage.u.pickCarousel(carousel, $context); }
			}, //loadProductsAsList
			
			pickCarousel : function(carousel, $context) {
				dump('START pickCarousel');
				switch(carousel) {
					case "runHomeSmallCarousel" :
						_app.ext.beachmall_homepage.u.runHomeSmallCarousel($context);
						break;
					case "runHomeBestCarousel" :
						_app.ext.beachmall_homepage.u.runHomeBestCarousel($context);
						break;
					case "runHomeFeaturedCarousel" :	
						_app.ext.beachmall_homepage.u.runHomeFeaturedCarousel($context);
						break;
				}
			},
			
			runHomeSmallCarousel : function($context) {
//				_app.u.dump('----Running homepage carousels');
				//HOMEPAGE NEW ARRIVAL CAROUSEL	
				var $target = $('.homeProdSearchNewArrivals2',$context);
				if($target.data('isCarousel'))	{$target.trigger('play');} //only make it a carousel once, but make sure it always scrolls
				else {
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
					},2000); 
				} //HOMEPAGE SMALLCAROUSEL	(new arrival)
			},
			
			runHomeBestCarousel : function($context) {
				//HOMEPAGE BESTSELLERS PRODCUTS CAROUSEL
				var $target = $('.homeProdSearchBestSellers');
				if($target.data('isCarousel'))	{$target.trigger('play');} //only make it a carousel once, but make sure it always scrolls
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
							height: 485,
							width: 960,
							pagination: '.bestCarPagenation',
							scroll: 4,
					//		mousewheel: true, //this is mobile, so mousewheel isn't necessary (plugin is not loaded)
							swipe: {
								onMouse: true,
								onTouch: true
							}
						});
					},2000);
				}			
//			_app.u.dump('----Done running homepage carousels');
			},
			
			runHomeFeaturedCarousel : function($context) {		
				//HOMEPAGE FEATURED PRODUCTS CAROUSEL
				var $target = $('.homeProdSearchFeatured',$context);
				if($target.data('isCarousel'))	{$target.trigger('play');} //only make it a carousel once, but make sure it always scrolls
				else {
					$target.data('isCarousel',true);
					//for whatever reason, caroufredsel needs to be executed after a moment.
					setTimeout(function(){
						$target.carouFredSel({
							items: {
								start: 8,
							},
							auto: {
								pauseOnHover: "immediate"
							},
							prev: '.featCarouselPrev',
							next: '.featCarouselNext',
							height: 485,
							width: 960,
							pagination: '.featCarPagenation',
							scroll: 4,
					//		mousewheel: true, //this is mobile, so mousewheel isn't necessary (plugin is not loaded)
							swipe: {
								onMouse: true,
								onTouch: true
							}
						});
					},2000); 
				} //HOMEPAGE FEATURED PRODUCTS CAROUSEL
			},
			
			//Norton kept appending the seal that goes in the floating bar to the body instead. 
			//This will locate both, figure out which belongs in the floating bar, and move it there. 
			moveNorton : function($context) {
				var counter = 0; //used to make sure both seals are loaded so they can be differentiated.
				var $norton; //will hold the correct norton seal anchor.
				$("a[href='javascript:vrsn_splash()']").each(function(){ counter++ });
				//if more than one was counted, we have both (since there are only two at present).
				if(counter > 1) {
					$("a[href='javascript:vrsn_splash()']").each(function(){
						if($(this).parent().attr('data-noton') === "nomove") { /*this one is the other seal we don't want to mess with.*/ }
						else { $norton = $(this); }
					});
				$norton.css('margin','0 0 0 3px'); //some css to make it look prettier
				$norton.insertAfter($("[data-noton='ins']",$context)); //add it where we want it.
				}	
				else { setTimeout(function(){ _app.ext.beachmall_homepage.u.moveNorton($context)},250); } //if two werent found, wait and try again.
			}
		
		}, //u [utilities]
			
			
////////////////////////////////////   EVENTS [e]   \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\			

//app-events are added to an element through data-app-event="extensionName|functionName"
//right now, these are not fully supported, but they will be going forward. 
//they're used heavily in the admin.html file.
//while no naming convention is stricly forced, 
//when adding an event, be sure to do off('click.appEventName') and then on('click.appEventName') to ensure the same event is not double-added if app events were to get run again over the same template.
		e : { } //e [app Events]
		
	} //r object.
	return r;
}
