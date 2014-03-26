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

var beachmall_store = function(_app) {
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
				_app.templates.homepageTemplate.on('complete.beachmall_store',function(event,$ele,P) {
					$('.floatingBar',$ele).show(); //shows floating bar upon return to hompage if it's been closed.
				});
				
				_app.templates.categoryTemplate.on('complete.beachmall_store',function(event,$ele,P) {
					_app.ext.beachmall_store.u.backToTop($ele);
				});
				
				_app.templates.searchTemplate.on('complete.beachmall_store',function(event,$ele,P) {
					_app.ext.beachmall_store.u.backToTop($ele);
				});
				
				_app.templates.productTemplate.on('complete.beachmall_store',function(event,$ele,P) {
					_app.ext.beachmall_store.u.backToTop($ele);
				});
				
				_app.templates.companyTemplate.on('complete.beachmall_store',function(event,$ele,P) {
					_app.ext.beachmall_store.u.backToTop($ele);
				});
				
				_app.templates.checkoutTemplate.on('complete.beachmall_store',function(event,$ele,P) {
					_app.ext.beachmall_store.u.backToTop($ele);
				});
			},
			onError : function() {
				_app.u.dump('START beachmall_store.callbacks.startExtension.onError');
			}
		}
			
	}, //callbacks



////////////////////////////////////   ACTION    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

//actions are functions triggered by a user interaction, such as a click/tap.
//these are going the way of the do do, in favor of app events. new extensions should have few (if any) actions.
		a : {
				//clears the order/prod id field in contact form to be sure it doesn't still 
				//have showContactPID value still displayed (if form did not get submitted). 
			resetContactPID : function() {
				var $field = $('#contactFormOID','#mainContentArea_company');
				$field.val('');
				//$field.attr('placeholder', 'Order Number (if applicable)');
			}

		}, //Actions

////////////////////////////////////   RENDERFORMATS    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

//renderFormats are what is used to actually output data.
//on a data-bind, format: is equal to a renderformat. extension: tells the rendering engine where to look for the renderFormat.
//that way, two render formats named the same (but in different extensions) don't overwrite each other.
		renderFormats : {
		
				//creates image for search results lists from user:app_thumb (a copy of image1) to prevent
				//banner/icon images that had been getting indexed from being used for the list image.
			appthumb : function($tag, data) {
				//_app.u.dump('--> store_filter: appThumb started'); _app.u.dump(data.value.images[0]);
				data.bindData.b = data.bindData.bgcolor || 'ffffff'; //default to white.
				
				if(data.value) {
					data.bindData.name = data.value.app_thumb;
					data.bindData.w = $tag.attr('width');
					data.bindData.h = $tag.attr('height');
					data.bindData.tag = 0;
					$tag.attr('src',_app.u.makeImage(data.bindData));
				}
			}, //appThumb
			
			//sets the overhang tag and hides discontinued products in a product list.
			showprodmodifier : function($tag, data) {
				//_app.u.dump('-----showprodmodifier'); _app.u.dump(data.value.tags);
/*MARK: needed?*/				//var zoovyIsTags = ($tag.data('prodmodifier') == 1) ? data.value.tags : data.value['%attribs']['zoovy:prod_is_tags'];
				var zoovyIsTags = data.value.tags;

				if (zoovyIsTags.indexOf('IS_DISCONTINUED') >= 0) {
/*MARK: uncomment*/				//$tag.parent().parent().parent().hide().attr('data-discontinued',1);
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

		}, //renderFormats
////////////////////////////////////   UTIL [u]   \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

//utilities are typically functions that are exected by an event or action.
//any functions that are recycled should be here.
		u : {
		
			backToTop : function($context) {
				$($context).append('<div class="appBackToTop pointer" onClick="myApp.ext.beachmall_store.u.scrollToTop()"><span class="sprite"></span>Back to Top</div>')
			},
			
			scrollToTop : function() {
				$('html,body').animate({ scrollTop: 0 }, 'slow');
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
