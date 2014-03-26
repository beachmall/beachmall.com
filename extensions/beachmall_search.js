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





var beachmall_search = function(_app) {
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

			}, //Actions
			
////////////////////////////////////   TLCFORMATS   \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
			
		tlcFormats : {
		
			searchbytag : function(data,thisTLC) {
				var argObj = thisTLC.args2obj(data.command.args,data.globals); //this creates an object of the args
				//_app.u.dump(argObj.filter);
				var query = JSON.parse(argObj.filter);
				//_app.u.dump(query);
				_app.ext.store_search.calls.appPublicProductSearch.init(query,$.extend({'datapointer':'appPublicSearch|tag|'+argObj.tag,'templateID':argObj.templateid,'extension':'store_search','callback':'handleElasticResults','list':data.globals.tags[data.globals.focusTag]},argObj));
				_app.model.dispatchThis('mutable');
				return false; //in this case, we're off to do an ajax request. so we don't continue the statement.
			}

		},
			
////////////////////////////////////   RENDERFORMATS    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

//renderFormats are what is used to actually output data.
//on a data-bind, format: is equal to a renderformat. extension: tells the rendering engine where to look for the renderFormat.
//that way, two render formats named the same (but in different extensions) don't overwrite each other.
		renderFormats : {
		
			searchbytag : function(data,thisTLC)	{
				_app.u.dump('----This got called');
				//var filterObj = thisTLC.attr('filter'); 
				_app.u.dump(data.value); _app.u.dump(argObj);
				var argObj = thisTLC.args2obj(data.command.args,data.globals); //this creates an object of the args
				var query = {"size":(argObj.size || 4),"mode":"elastic-native","filter":{"term":{"tags":argObj.tag}}};
				_app.ext.store_search.calls.appPublicProductSearch.init(query,$.extend({'datapointer':'appPublicSearch|tag|'+argObj.tag,'templateID':argObj.templateid,'extension':'store_search','callback':'handleElasticResults','list':data.globals.tags[data.globals.focusTag]},argObj));
				_app.model.dispatchThis('mutable');
				return false; //in this case, we're off to do an ajax request. so we don't continue the statement.
			}		

		}, //renderFormats
////////////////////////////////////   UTIL [u]   \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

//utilities are typically functions that are exected by an event or action.
//any functions that are recycled should be here.
		u : {
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
