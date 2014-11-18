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

var beachmall_banner = function(_app) {
	var theseTemplates = new Array('');
	var r = {

	vars : {},
////////////////////////////////////   CALLBACKS    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\



	callbacks : {
//executed when extension is loaded. should include any validation that needs to occur.
		init : {
			onSuccess : function()	{
				var r = false; //return false if extension won't load for some reason (account config, dependencies, etc).
				$.getJSON("_banners.json?_v="+(new Date()).getTime(), function(json) {
					_app.ext.beachmall_banner.vars.homepageBanners = json.homepageBanners
				}).fail(function(){_app.u.throwMessage("BANNERS FAILED TO LOAD - there is a bug in _banners.json")});
				//if there is any functionality required for this extension to load, put it here. such as a check for async google, the FB object, etc. return false if dependencies are not present. don't check for other extensions.
				r = true;

				return r;
				},
			onError : function()	{
//errors will get reported for this callback as part of the extensions loading.  This is here for extra error handling purposes.
//you may or may not need it.
				_app.u.dump('BEGIN beachmall_banner.callbacks.init.onError');
			}
		},
		
		startExtension : {
			onSuccess : function() {
				_app.templates.homepageTemplate.on('complete.beachmall_banner',function(event,$ele,P) {
					_app.ext.beachmall_banner.u.showHomepageBanners();
				})
			},
			onError : function() {
				_app.u.dump('START beachmall_banner.callbacks.startExtension.onError');
			}
		}
		
		
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
		
			showHomepageBanners : function() {
				var $container = $('#homepageTemplate_ .bannerContainer');
				if(!$container.hasClass('bannersRendered')) {
					if(_app.ext.beachmall_banner.vars.homepageBanners) {
						$container.addClass('bannersRendered');
						var bannerWidth = _app.ext.beachmall_banner.vars.homepageBanners.main.width == "" ? 620 : _app.ext.beachmall_banner.vars.homepageBanners.main.width;
						var bannerHeight = _app.ext.beachmall_banner.vars.homepageBanners.main.height == "" ? 300 : _app.ext.beachmall_banner.vars.homepageBanners.main.height;
						//dump('BANNER WIDTH & HEIGHT'); dump(bannerWidth); dump(bannerHeight);
						$('.main',$container).removeClass('loadingBG').append(_app.ext.beachmall_banner.u.makeBanner(_app.ext.beachmall_banner.vars.homepageBanners.main,bannerWidth,bannerHeight,"ffffff"));
					}
					else {
						setTimeout(this.showHomepageBanners,250);
					}
				}
			},
			
			makeBanner : function(bannerJSON, w, h, b) {
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