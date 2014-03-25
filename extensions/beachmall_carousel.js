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




var beachmall_carousel = function(_app) {
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
				_app.u.dump('BEGIN beachmall_carousel.callbacks.init.onError');
				}
			},
			
		startExtension : {
			onSuccess : function() {
				_app.templates.homepageTemplate.on('complete.beachmall_carousel',function(event,$ele,P) {
					_app.ext.beachmall_carousel.u.runHomeCarousels($ele);
				})
			},
			onError : function() {
				_app.u.dump('START beachmall_carousel.callbacks.startExtension.onError');
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
		
			runHomeCarousels : function($context) {
				_app.u.dump('----Running homepage carousels');
				//HOMEPAGE FEATURED CAROUSEL	
				var $target = $('.homeProdSearchNewArrivals2',$context);
				if($target.data('isCarousel'))	{} //only make it a carousel once.
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
				} //HOMEPAGE FEATURED CAROUSEL	
				_app.u.dump('----Done running homepage carousels');
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
