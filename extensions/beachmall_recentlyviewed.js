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





var beachmall_recentlyviewed = function(_app) {
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
			
		startExtension : {
			onSuccess : function() {
				
				_app.templates.productTemplate.on('complete.beachmall_recentlyviewed',function(event,$ele,P) {
					_app.ext.beachmall_recentlyviewed.u.showRecentlyViewedItems($ele,false);
				});
				
				_app.templates.productTemplate.on('depart.beachmall_recentlyviewed',function(event,$ele,infoObj) {
					_app.ext.beachmall_recentlyviewed.u.addRecentlyViewedItems($ele, infoObj.pid);
				});
				
				_app.templates.companyTemplate.on('complete.beachmall_recentlyviewed',function(event,$ele,infoObj) {
					_app.ext.beachmall_recentlyviewed.u.showRecentlyViewedItems($ele,true);
					var $sideline = $('.sideline', $ele);
					if (infoObj.show == 'recent') {
						$('.mainColumn',$ele).css({'width':'960px','margin':'0 auto'});
						$sideline.hide();
					}
					else {
						$sideline.show();
						$('.mainColumn',$ele).css({'width':'75%','margin':'0'});
					}
				});
				
			},
			onError : function() {
				_app.u.dump('BEGIN beachmall_recentlyviewed.callbacks.startExtension.onError');
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
		
				//populates carousel if items in recently viewed list, shows place holder text if list empty
				//show = true will show container w/ place holder text if empty. show = false will hide container until not empty
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
	//_app.u.dump('recently viewed call to qs.vars.session');	_app.u.dump(_app.ext.quickstart.vars.session.recentlyViewedItems);
					$container.tlc({dataset:_app.ext.quickstart.vars.session.recentlyViewedItems,verb:"translate"}); //build product list
					_app.u.dump('SESSION VAR:'); _app.u.dump(_app.ext.quickstart.vars.session.recentlyViewedItems);
					$context.removeClass('loadingBG');
				}
			},//showRecentlyViewedItems
			
			
				//called on depart from prod page to add item to recently viewed items list
				//changed this from quickstart's addition at page load to prevent items from showing in list on first page visit
			addRecentlyViewedItems : function($context, pid) {
					//pid is infoObj.pid passed from onDeparts
				if($.inArray(pid,_app.ext.quickstart.vars.session.recentlyViewedItems) < 0) {
					_app.ext.quickstart.vars.session.recentlyViewedItems.unshift(pid);
					$('.numRecentlyViewed','#appView').text(_app.ext.quickstart.vars.session.recentlyViewedItems.length);
				}
				else {
					//the item is already in the list. move it to the front.
					_app.ext.quickstart.vars.session.recentlyViewedItems.splice(0, 0, _app.ext.quickstart.vars.session.recentlyViewedItems.splice(app.ext.myRIA.vars.session.recentlyViewedItems.indexOf(pid), 1)[0]);
				}
			}, //addRecentlyViewedItems
		
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
