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


var beachmart_dropdown = function() {
	var r = {

	vars : {
		},


					////////////////////////////////////   CALLBACKS    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\



	callbacks : {
//callbacks.init need to return either a true or a false, depending on whether or not the file will execute properly based on store account configuration. Use this for any config or dependencies that need to occur.
//the callback is auto-executed as part of the extensions loading process.
		init : {
			onSuccess : function()	{
				app.ext.beachmart_dropdown.u.loadHoverProducts(); //load function
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
			},
			
			renderHoverProduct : {
				// call function with the data response passed as argument 
				// (dataresponse is returned from the model when the API request returns, 
				// generaly just a repeat of _tag object you passed, but contains error response durring an error)
				onSuccess:function(responseData){		
					// call anycontent (from anyplugins) on class to put content in using the template you want to render with, using a pointr to the data that was returned. 
					$('.hoverproduct-'+app.data[responseData.datapointer].pid).anycontent({"templateID":"hoverProductTemplate","datapointer":responseData.datapointer}); 
					},
				onError:function(responseData){			// error response goes here if needed
					}
				}
		}, //callbacks



////////////////////////////////////   Actions    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\


		a : {
			
		}, //actions

////////////////////////////////////   RENDERFORMATS    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

//renderFormats are what is used to actually output data.
//on a data-bind, format: is equal to a renderformat. extension: tells the rendering engine where to look for the renderFormat.
//that way, two render formats named the same (but in different extensions) don't overwrite each other.
		renderFormats : {
			}, //renderFormats
////////////////////////////////////   UTIL    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\


		u : {
		
			loadHoverProducts : function(){
				//obtain product list
				var prods = [];														// make new array to hold products
				$('.dropdownsContainer *[data-hoverproduct]').each(function(){		// get each hoverproduct in the class dropdownsContainer
					prods.push($(this).data("hoverproduct"));						// push the data into the array we made
					});
					
				//build set of calls
				for(var i=0; i<prods.length; i++){				// itterate through the array we made
					var obj = {									// object to hold product id for each product
						"pid" : prods[i]						
						};
					console.debug(obj);							// see what was returned in console
					var _tag = {								// create holder for call back
						"callback":"renderHoverProduct",		// call back function (in callbacks above)
						"extension":"beachmart_dropdown"		// extension that holds call back (this extension you're in)
						};
					app.calls.appProductGet.init(obj, _tag);	// call appProductGet.init on the product id with the callback and callback location
					}
				
				//execute calls
				app.model.dispatchThis('mutable');				// execute: mutable = as soon as convinient, immutable = now or else, passive = whenevs 
				}
//pass in form as object.  This function will verify that each fieldset has the appropriate attributes.
//will also verify that each filterType has a getElasticFilter function.
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