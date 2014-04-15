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
	
		cartemailmashup: {
			init : function(params,_tag,Q)	{
				this.dispatch(params,_tag,Q);
			},
			dispatch : function(params,_tag,Q)	{
				_app.model.addDispatchToQ( $.extend(true,{
				    '_cmd':'appMashUpRedis',
					'_tag':_tag,
				    }, params) , 'immutable');
				
			dump('---Q'); dump(Q);
			}			
		}, //cartemailmashup
	
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
		
				//processes cart e-mail form and calls appMashUpSMTP for it
			emailcart : function($form) {
			dump('-----start email cart...');
				var uName = $('input[type="text"]',$form).val();
				var eAddress = $('input[type="email"]',$form).val();
				var newsletter = $('input[type="checkbox"]',$form).is(':checked');
				var cartID = _app.model.fetchCartID();
				var products = _app.data['cartDetail|'+cartID]['@ITEMS'];
				var body = "This is the contents of your Beachmall.com cart. It was e-mailed to you at your request. "
					+		"Please come see us again soon!"; 
				
				var params = {
					'_cartid' 	: _app.model.fetchCartID(),
					'platform' 	: 'appMashUpRedis-EMAILCART.json',
					'%vars' : {
						'email':eAddress,
						'fullname':uName
					    }
				//	"permission"	: "_mashups/cartEmailPermissions",
				//	"sender"		: "help@beachmall.com",
				//	"recipient"		: eAddress,
				//	"subject"		: "Your Beachmall.com cart contents",
				//	"products"		: products,
				//	"body"			: body
				};

				params._cmd = 'appMashUpRedis';
				_app.model.addDispatchToQ(params,'immutable');
				_app.model.dispatchThis('immutable');
				
				 //_app.ext.beachmall_cartemail.calls.cartemailmashup.init(params,{"callback":function(rd){				
				//	if(_app.model.responseHasErrors(rd)){
				//		$form.anymessage({'message':rd});
				//	}
				//	else	{
				//		$form.anymessage(_app.u.successMsgObject('Your message has been sent.'));
//				//			_gaq.push(['_trackEvent','Cart','User Event','Cart e-mailed']);
				//	}
				//}});
			
		
		//		_app.u.dump('--> All that stuff from the e-mail form:'); 
		//		_app.u.dump(uName); 
		//		_app.u.dump(eAddress); 
		//		_app.u.dump(newsletter);
		//		_app.u.dump(products);
		//		_app.u.dump(params);
		//		_app.u.dump(body);
	
			//HIDDEN FOR EASE OF TESTING, UNCOMMENT WHEN DONE
			//	if(newsletter) {
			//		_app.ext.store_crm.u.handleSubscribe($form);
			//	}
			//	setTimeout(function() {
			//		_app.ext.beachmall_cartEmail.a.hideCartEmail($('span',$form),$form);
			//	},5000);
			},
		
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
		
				//text function to call from console. Call w/:
				// _app.ext.beachmall_cartEmail.u.runMashupTest($('form.noHover','#modalCart'));
			runMashupTest : function($form) {
				var uName = $('input[type="text"]',$form).val();
				var eAddress = $('input[type="email"]',$form).val();
				var newsletter = $('input[type="checkbox"]',$form).is(':checked');
				var cartID = _app.model.fetchCartID();
				var products = _app.data['cartDetail|'+cartID]['@ITEMS'];
				var body = "Something to see as the e-mail body";
		/*		var products = [
				{
					"sku": "BCHCDY",
					"%attribs": {
						"zoovy:profile": "DEFAULT",
						"zoovy:pkg_width": "15",
						"zoovy:prod_mfg": "Bcaddy",
						"zoovy:pkg_height": "38",
						"zoovy:prod_mfgid": "GENERIC:BHCADY",
						"zoovy:ship_cost1": "0.0",
						"zoovy:virtual": "GENERIC:BHCADY",
						"zoovy:prod_image1": "beach_caddy/haulincart2_4.jpg",
						"zoovy:prod_supplier": "BHCADY",
						"zoovy:pkg_depth": "22",
						"is:shipfree": "1",
						"zoovy:prod_is": "1073153",
						"zoovy:prod_promoclass": "FREE SHIP",
						"zoovy:ship_latency": "1",
						"zoovy:pkg_exclusive": "1"
					},
					"uuid": "FD8C6214578611E3982BA3A338230745",
					"shipdsn": "",
					"weight": "528",
					"base_price": "349.00",
					"assembly": "",
					"prod_name": "Wide Wheels Utility Cart with Tote(included), and Surf Board Option",
					"pog_sequence": "",
					"taxable": "1",
					"qty": "1",
					"description": "Wide Wheels Utility Cart with Tote(included), and Surf Board Option",
					"base_weight": "528",
					"virtual": "GENERIC:BHCADY",
					"full_product": {
						
					},
					"added_gmt": "1385572304",
					"product": "BCHCDY",
					"price": "349.00",
					"stid": "BCHCDY",
					"extended": "349.00"
				}
				]
		*/		
				var params = {
					"permission"	: "_mashups/cartEmailPermissions",
					"sender"		: "help@beachmall.com",
					"recipient"		: "ryanm@zoovy.com",
					"subject"		: "Your Beachmall.com cart contents",
					"products"		: products,
					"body"			: "Something to see as the e-mail body"
				};
				
				//_app.u.dump('--> PARAMS'); _app.u.dump(params);
				
		/*		_app.ext.beachmall_cartemail.calls.cartemailmashup.init(params,{"callback":function(rd){
					if(_app.model.responseHasErrors(rd)){
						$form.anymessage({'message':rd});
					}
					else	{
						$form.anymessage(_app.u.successMsgObject('Your message has been sent.'));
//							_gaq.push(['_trackEvent','Cart','User Event','Cart e-mailed']);
					}
				}});
		*/	},
		
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