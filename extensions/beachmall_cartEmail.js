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





var beachmall_cartemail = function(_app) {
	var theseTemplates = new Array('');
	var r = {

	vars : {},
////////////////////////////////////   CALLS    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\	
	
	calls : {	
		
	}, //calls
	
////////////////////////////////////   CALLBACKS    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\



	callbacks : {
//executed when extension is loaded. should include any validation that needs to occur.
		init : {
			onSuccess : function()	{
				var r = false; //return false if extension won't load for some reason (account config, dependencies, etc).
				dump('------Start beachmall_cartemail.js...');
				//_app.u.dump('--> Extension beachmall_cartemail started');
				
				//if there is any functionality required for this extension to load, put it here. such as a check for async google, the FB object, etc. return false if dependencies are not present. don't check for other extensions.
				r = true;

				return r;
				},
			onError : function()	{
//errors will get reported for this callback as part of the extensions loading.  This is here for extra error handling purposes.
//you may or may not need it.
				_app.u.dump('BEGIN beachmall_cartEmail.callbacks.init.onError');
				}
			}
		}, //callbacks



////////////////////////////////////   ACTION    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

//actions are functions triggered by a user interaction, such as a click/tap.
//these are going the way of the do do, in favor of app events. new extensions should have few (if any) actions.
		a : {
		
				//processes cart e-mail form and calls appMashUpRedis for it
			emailcart : function($form) {
//			dump('-----start email cart...');
				var uName = $('input[type="text"]',$form).val();
				var eAddress = $('input[type="email"]',$form).val();
				var newsletter = $('input[type="checkbox"]',$form).is(':checked');
				var params = {
					'_cartid' 	: _app.model.fetchCartID(),
					'platform' 	: 'appMashUpRedis-EMAILCART.json',
					'%vars' 	: {
								  'email':eAddress,
								  'fullname':uName
					},
					'_cmd'		: 'appMashUpRedis',
					'_tag'		: {
						'callback':function(rd){
							if(_app.model.responseHasErrors(rd)) {
								$form.anymessage({'message':rd});
							}
							else {
								$form.anymessage(_app.u.successMsgObject('Your message has been sent.'));
								setTimeout(function(){_app.ext.beachmall_cartemail.a.hideCartEmail($('span',$form),$form);},10000);
//								_gaq.push(['_trackEvent','Cart','User Event','Cart e-mailed']);
								window[_app.vars.analyticsPointer]('send', 'event','Checkout','User Event','Cart e-mailed');
							}
						}
					}
				};

				_app.model.addDispatchToQ(params,'immutable');
				_app.model.dispatchThis('immutable');

			}, //emailcart
		
				//animates cart e-mail form into view, shows close button in form
			showCartEmail : function($this, $form) {
				$form.animate({'height':'150px','width':'220px'},500).addClass('noHover');
				$this.css({'cursor':'auto'});
				$('span',$form).css('display','inline');
			}, //showCartEmail
			
				//animates cart e-mail form out of view, hides close button in form
			hideCartEmail : function($this, $form) {
				$form.animate({'height':'21px','width':'80px'},500);
				setTimeout(function() {
					$form.removeClass('noHover');
					$this.css('display','none');
					$('h2',$form).css({'cursor':'pointer'});
				},550);
			}, //hideCartEmail
			
				//animates scroll from top e-mail cart button to lower e-mail cart form, and opens form. 
			scrolltoemailcart : function() {
				var $context = $(".cartSummaryTotalsContainer","#modalCart");
				var $emailCart = $(".cartBar",$context);
				setTimeout(function(){
					$('#modalCart').animate({scrollTop: $emailCart.offset().top}, 2000);
				},500);
				setTimeout(function(){$("h2",$context).click();},1000);
			},

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