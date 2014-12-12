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
//					dump("START beachmall_tracking.callbacks.startExtension.onSuccess");

	
	// FOR TESTING SCRIPT ADDITION
	//				_app.templates.categoryTemplate.on('complete.beachmall_tracking',function(event,$ele,P) {
	//				var $context = $('.trackingTestDiv');
	//					_app.ext.beachmall_tracking.u.addBing($context,{'bing_domain_id':'248869','bing_cp':'5150'});
	//				});
				
					
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
				dump('START addBing TRACKING');
				var $bingAds = $('[data-bingads]',$context);
				
				var frame = document.createElement("iframe");
				$(frame).addClass("displayNone");
				$("body").append(frame);
				
				//frame.contentWindow.microsoft_adcenterconversion_domainid = params.bing_domain_id;
				//frame.contentWindow.microsoft_adcenterconversion_cp = params.bing_cp;
				
				setTimeout(function() {
					var paramScript = frame.contentWindow.document.createElement("script");
					paramScript.type = "text/javascript";
					paramScript.text = "microsoft_adcenterconversion_domainid = "+params.bing_domain_id+"; microsoft_adcenterconversion_cp = "+params.bing_cp+";";
//					dump(paramScript.text);
					var script = frame.contentWindow.document.createElement("script");
					script.type = "text/javascript"
					script.src = "https://0.r.msn.com/scripts/microsoft_adcenterconversion.js";
					
					//Removed "noscript" content, app runs on js so if it's not enabled nothing works...
					//var noscript = document.createElement("noscript");
					//var $img = $("<img width=1 height=1 src='https://248869.r.msn.com/?type=1&cp=1'\/>");
					//noscript.append($img);
					
					//anchor is in checkoutSuccess container and will be shown if script is found to load
					//var $anchor = $("<a href='http://advertising.msn.com/MSNadCenter/LearningCenter/adtracker.asp' target='_blank'>::adCenter::</a>");
					
					frame.contentWindow.document.body.appendChild(paramScript);
					frame.contentWindow.document.body.appendChild(script);
					//frame.contentWindow.document.body.appendChild(noscript);
					
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
				},250);
			},
			
			
			addShopping : function(merchantID, orderID, orderTotal) {
				dump('START addShopping TRACKING');
				var frame = document.createElement("iframe");
				$(frame).addClass("displayNone");
				$("body").append(frame);
				
				setTimeout(function() {
					var paramScript = frame.contentWindow.document.createElement("script");
					paramScript.type = 	"text/javascript";
					paramScript.text = 	"var merchant_id 	= '"+merchantID+"';"
									+	"var order_id 		= '"+orderID+"';"
									+	"var order_amt 		= '"+orderTotal+"';";
//					dump(paramScript.text);
					var script = frame.contentWindow.document.createElement("script");
					script.type = "text/javascript";
					script.src = "https://stat.DealTime.com/ROI/ROI.js?mid="+merchantID;
					
					frame.contentWindow.document.body.appendChild(paramScript);
					frame.contentWindow.document.body.appendChild(script);
				},250);
			},
			
			
			addShopzilla : function(merchantID, orderID, orderTotal) {
				dump('START addShopzilla TRACKING');
				var frame = document.createElement("iframe");
				$(frame).addClass("displayNone");
				$("body").append(frame);
				
				setTimeout(function() {
					var paramScript = frame.contentWindow.document.createElement("script");
					paramScript.type = 	"text/javascript";
					paramScript.text = 	"var mid 			= '"+merchantID+"';"
									+	"var cust_type 		= '';"
									+	"var order_value 	= '"+orderTotal+"';"
									+	"var order_id 		= '"+orderID+"';"
									+	"var units_ordered	= '';";
//					dump(paramScript.text);
					var script = frame.contentWindow.document.createElement("script");
					script.type = "text/javascript";
					script.src = "https://www.shopzilla.com/css/roi_tracker.js";
					
					frame.contentWindow.document.body.appendChild(paramScript);
					frame.contentWindow.document.body.appendChild(script);
				},250);
			},
			
			
			addPronto : function(merchantID, orderID, orderTotal) {
				dump('START addPronto TRACKING');
				var frame = document.createElement("iframe");
				$(frame).addClass("displayNone");
				$("body").append(frame);
				
				setTimeout(function() {
					var paramScript = frame.contentWindow.document.createElement("script");
					paramScript.type = 	"text/javascript";
					paramScript.text = 	"var merchant_account_id	= '"+merchantID+"';"
									+	"var order_id 				= '"+orderID+"';"
									+	"var order_value 			= '"+orderTotal+"';";
//					dump(paramScript.text);
					var script = frame.contentWindow.document.createElement("script");
					script.type = "text/javascript";
					script.src = "https://merchant.pronto.com/js/roi.js";
					
					frame.contentWindow.document.body.appendChild(paramScript);
					frame.contentWindow.document.body.appendChild(script);
				},250);
			},
			
			
			addNextag : function(merchantID, orderID, orderTotal) {
				dump('START addNextag TRACKING');
				var frame = document.createElement("iframe");
				$(frame).addClass("displayNone");
				$("body").append(frame);
				
				setTimeout(function() {
					var paramScript = frame.contentWindow.document.createElement("script");
					paramScript.type = 	"text/javascript";
					paramScript.text = 	"var id		= '"+merchantID+"';"
									+	"var rev	= '"+orderTotal+"';"
									+	"var order	= '"+orderID+"';";
//					dump(paramScript.text);
					var script = frame.contentWindow.document.createElement("script");
					script.type = "text/javascript";
					script.src = "https://imgsrv.nextag.com/imagefiles/includes/roitrack.js";
					
					frame.contentWindow.document.body.appendChild(paramScript);
					frame.contentWindow.document.body.appendChild(script);
				},250);
			},
			
			
			addPriceGrabber : function($context, merchantID) {
				dump('START addPriceGrabber TRACKING');
				$("[data-pricegrabber]", $context).append("<img src='https://www.pricegrabber.com/conversion.php?retid="+merchantID+"'>").removeClass('displayNone');
			},
			
			
			addBecome : function(merchantID, orderID, orderTotal) {
				dump('START addBecome TRACKING');
				var frame = document.createElement("iframe");
				$(frame).addClass("displayNone");
				$("body").append(frame);
				
				setTimeout(function() {
					var paramScript = frame.contentWindow.document.createElement("script");
					paramScript.type = 	"text/javascript";
					paramScript.text = 	"var become_merchant_id	= '"+merchantID+"';"
									+	"var become_order_num	= '"+orderID+"';"
									+	"var become_order_id	= '"+orderTotal+"';";
//					dump(paramScript.text);
					var script = frame.contentWindow.document.createElement("script");
					script.type = "text/javascript";
					script.src = "https://partner.become.com/roi-tracker2/conversion.js";
					//<noscript><img src="https://partner.become.com/roi-tracker2/t.gif?merchantid=EC32A6A4ED7F110E&order_id=%ORDERID%&order_value=%grandtotal%" style="display:none;border:0;"/></noscript>
					
					frame.contentWindow.document.body.appendChild(paramScript);
					frame.contentWindow.document.body.appendChild(script);
				},250);
			},
			
			
			addAddThis : function($context) {
				dump('START addAddThis TRACKING');
				var frame = document.createElement("iframe");
				$(frame).addClass("displayNone");
				$("body").append(frame);
				
				setTimeout(function() {
					var $addThisButton = $("[data-addthisbutton]",$context);
				
					//anchor and img are in checkoutSuccess container and will be shown if script is found to load
					//var $anchor = $("<a href='http://www.addthis.com/bookmark.php?v=250&amp;pub=beachmart' onmouseover='return addthis_open(this, &quot;&quot;, &quot;http://www.beachmall.com&quot;, &quot;beachmall.com&quot;)' onmouseout='addthis_close()' onclick='return addthis_sendto()'></a>");
					//var $img = $("<img src='//s7.addthis.com/static/btn/lg-share-en.gif' width='125' height='16' alt='Bookmark and Share' style='border:0' />");
					
					var script = frame.contentWindow.document.createElement("script");
					script.type = "text/javascript";
					//script.src = "//s7.addthis.com/js/250/addthis_widget.js?pub=beachmart";
					script.src = "https://s7.addthis.com/js/250/addthis_widget.js?pub=beachmart";

					//$anchor.append($img);
					
					frame.contentWindow.document.body.appendChild(script);
					
					//check if script loads and show addThis anchor & img if so
					if (script.readyState){  //IE
						script.onreadystatechange = function(){
							if (script.readyState == "loaded" || script.readyState == "complete"){
								script.onreadystatechange = null;
								$addThisButton.removeClass('displayNone');
							}
						};
					}
					else {
						script.onload = function(){ $addThisButton.removeClass('displayNone'); }
					}
				},250);
			},
			
			
			addFacebook : function(pixelID) {
				dump('START addFacebook TRACKING');
				var frame = document.createElement("iframe");
				$(frame).addClass("displayNone");
				$("body").append(frame);
				
				setTimeout(function() {
					var script = frame.contentWindow.document.createElement("script");
					script.type = 	"text/javascript";
					script.text = 	"var fb_param 		= {};"
								+	"fb_param.pixel_id 	= '"+pixelID+"';"
								+	"fb_param.value 	= '0.00';"
								+	"fb_param.currency 	= 'USD';"
								+	"(function(){"
									+	"var fpw 	= document.createElement('script');"
									+	"fpw.asyn 	= true;"
									//+	"fpw.src	= '//connect.facebook.net/en_US/fp.js';"
									+	"fpw.src	= 'https://connect.facebook.net/en_US/fp.js';"
									+	"var ref 	= document.getElementsByTagName('script')[0];"
									+	"ref.parentNode.insertBefore(fpw, ref);"
								+	"})();";
					//<noscript><img height="1" width="1" alt="" style="display:none" src="https://www.facebook.com/offsite_event.php?id=6009135221658&amp;value=0&amp;currency=USD" /></noscript>
					
					frame.contentWindow.document.body.appendChild(script);
				},250);
			},
			
			addAdwords : function(sumOrderTotal) {
				dump('START addAdwords TRACKING');
				
				var frame = document.createElement("iframe");
				$(frame).addClass("displayNone");
				$("body").append(frame);
				
				setTimeout(function() {
					var paramScript = '<script type="text/javascript">'
						+ 'var google_conversion_id = 1056650724;'
						+	'var google_conversion_language = "en";'
						+	'var google_conversion_format = "2";'
						+	'var google_conversion_color = "ffffff";'
						+	'var google_conversion_label = "0dneCJ6-wwEQ5Ovs9wM";'
						+	'var google_conversion_value = '+sumOrderTotal+';'
					//	+	'var google_conversion_value = 1.000000;'
						+	'var google_remarketing_only = false;'
						+ '</script>';
					var script = '<script type="text/javascript" src="//www.googleadservices.com/pagead/conversion.js"></script>';
					frame.contentWindow.document.open();
					frame.contentWindow.document.write('<html><head>'+paramScript+''+script+'</head><body></body></html>');
					frame.contentWindow.document.close();
				},250);
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
