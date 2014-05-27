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





var beachmall_tracking = function(_app) {
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
				onSuccess : function(){
					dump("START beachmall_tracking.callbacks.startExtension.onSuccess");

					_app.ext.order_create.checkoutCompletes.push(function(infoObj){
						dump("START beachmall_tracking code pushed on order_create.checkoutCompletes");
						if(infoObj && infoObj.datapointer && _app.data[infoObj.datapointer] && _app.data[infoObj.datapointer].order)	{
							//var $context = $(_app.u.jqSelector('#'+infoObj.parentID));
							dump('IN datapointer if for tracking checkoutcompletes');
							var $context = $('.checkoutSuccess');
							//dump('ParentID in conversion tracking extension is:'); dump(infoObj.parentID);
							_app.ext.beachmall_tracking.u.addBing($context,{'bing_domain_id':'248869','bing_cp':'5050'});
						}
						else { dump('AHHHH! Problem w/ infoObj, infoObj.datapointer, _app.data[infoObj.datapointer], or _app.data[infoObj.datapointer].order!'); }
					});
				
					
				},
				onError : function(){ dump('START _app.ext.beachmall_tracking.callbacks.startExtension.onError'); }
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
			
			//loads Bing tracking info to checkoutTemplate
			addBing : function($context,params) {
				dump('LOADING BING TRACKING');
				var $bingAds = $('[data-bingads]',$context);
				
				var frame = document.createElement("iframe");
				$(frame).addClass("displayNone");
				$("body").append(frame);
				
				//frame.contentWindow.microsoft_adcenterconversion_domainid = params.bing_domain_id;
				//frame.contentWindow.microsoft_adcenterconversion_cp = params.bing_cp;
				var data = "microsoft_adcenterconversion_domainid = "+params.bing_domain_id+"; microsoft_adcenterconversion_cp = "+params.bing_cp+";";
				
				setTimeout(function() {
					var paramScript = frame.window.document.createElement("script");
					paramScript.append(data);
					var script = frame.contentWindow.document.createElement("script");
					script.type = "text.javascript"
					//check if script loads and show adcenter/bingads anchor if so
					if (script.readyState){  //IE
						script.onreadystatechange = function(){
							if (script.readyState == "loaded" || script.readyState == "complete"){
								script.onreadystatechange = null;
								$bingAds.removeClass('displayNone');
							}
						};
					}
					else {
						script.onload = function(){ $bingAds.removeClass('displayNone'); }
					}
					script.src = "https://0.r.msn.com/scripts/microsoft_adcenterconversion.js";
					
					//Removed "noscript" content, app runs on js so if it's not enabled nothing works...
					//var noscript = document.createElement("noscript");
					//var $img = $("<img width=1 height=1 src='https://248869.r.msn.com/?type=1&cp=1'\/>");
					
					//var $anchor = $("<a href='http://advertising.msn.com/MSNadCenter/LearningCenter/adtracker.asp' target='_blank'>::adCenter::</a>");
					
					//noscript.append($img);
					frame.contentWindow.document.body.appendChild(paramScript);
					frame.contentWindow.document.body.appendChild(script);
					//frame.contentWindow.document.body.appendChild(noscript);
					
				},250);
			},

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
