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
An extension for loading the functions required for the header and footer.
Among them are dropdowns, and whereAmI.
*/


var beachmall_begin = function(_app) {
	var r = {

		vars : {	},

////////////////////////////////////   CALLBACKS    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

	callbacks : {
//callbacks.init need to return either a true or a false, depending on whether or not the file will execute properly based on store account configuration. Use this for any config or dependencies that need to occur.
//the callback is auto-executed as part of the extensions loading process.
		init : {
			onSuccess : function()	{
				var r = true; //return false if extension won't load for some reason (account config, dependencies, etc).
				return r;
			},
			onError : function()	{
//errors will get reported for this callback as part of the extensions loading.  This is here for extra error handling purposes.
			}
		},
		
		//if whereAmI was executed, it means zip was not populated in the cart.
		//update the cart shippng fields appropriately.
		handleWhereAmI : {
			
			onSuccess : function(tagObj,attempts){
				attempts = Number(attempts) || 0;
				dump('handleWhereAmI started. #of attempts till cartDetail.ship:'); dump(attempts); 
				dump('----handleWhereAmI'); dump(_app.data[tagObj.datapointer]);
				var cartID = _app.model.fetchCartID();
		dump(cartID);
				var thisCartDetail = _app.data["cartDetail|"+cartID];
				//possible to get here before cartDetail.ship is set, rerun until set if so
				if(thisCartDetail && thisCartDetail.ship) {
					var data = _app.data[tagObj.datapointer]; 
					//_app.u.dump('----handleWhereAmI:'); _app.u.dump(data);
					
					if(data.zip) {
						//all the data is there, send it in one shot
						if(data.city && data.region && data.zip) {
							//update local cart
							thisCartDetail.ship.city = data.city;
							thisCartDetail.ship.region = data.region;
							thisCartDetail.ship.postal = data.zip;
							//update display classes
							$('.shipCity').text(data.city || "");
							$('.shipRegion').text(data.region || "");
							$('.shipPostal').text(data.zip || "");
							_app.ext.beachmall_begin.calls.cartSet.init({"ship/city":data.city,"ship/region":data.region,"ship/postal":data.zip,"_cartid":cartID},{},'passive'); 
							_app.model.dispatchThis('passive');
						}
						//only partial data (for what reason?) send it if it's there
						else {
							if(data.city)	{
								thisCartDetail.ship.city = data.city;
								$('.shipCity').text(data.city || "");
								_app.ext.beachmall_begin.calls.cartSet.init({"ship/city":data.city,"_cartid":cartID},{},'passive');
								}
							if(data.region)	{
								$('.shipRegion').text(data.state || "");
								thisCartDetail.ship.region = data.region;
								_app.ext.beachmall_begin.calls.cartSet.init({"ship/region":data.region,"_cartid":cartID},{},'passive');
								}
							if(data.zip) {
								$('.shipPostal').text(data.zip || "");
								thisCartDetail.ship.postal = data.zip;
								_app.ext.beachmall_begin.calls.cartSet.init({"ship/zip":data.zip,"_cartid":cartID},{},'passive');
							}
							if(data.city || data.region || data.zip)	{
								_app.model.dispatchThis('passive');
								}
						}
					}
					//whereAmI didn't return a zip, set cart and make that obvious to user...
					else {
						thisCartDetail.ship.city = "";
						thisCartDetail.ship.region = "";
						thisCartDetail.ship.postal = "";
						//update display classes
						$('.shipCity').text("Location unavailable");
						$('.shipRegion').text("");
						$('.shipPostal').text("");
						_app.ext.beachmall_begin.calls.cartSet.init({"ship/city":data.city,"ship/region":data.region,"ship/postal":data.zip,"_cartid":cartID},{},'passive'); 
						_app.model.dispatchThis('passive');
						$('#globalMessaging').anymessage({'message':'Postal location could not be determined, you may try again at the top left of the screen'});
					}
						
					//if it's a product page, update the time in transit there. 
					if(_app.ext.quickstart.vars.hotw && _app.ext.quickstart.vars.hotw[0] && _app.ext.quickstart.vars.hotw[0].pageType == 'product' && data.zip)	{				
						var $container = $(_app.u.jqSelector('#',_app.ext.quickstart.vars.hotw[0].parentID));
						$('.timeInTransitMessaging').empty(); //intentionally has no context. once a zip is entered, remove this anywhere it was displayed.
						$('.putLoadingHere',$container).addClass('loadingBG').show();
						$('.loadingText',$container).show();
						$('.shipMessage, .estimatedArrivalDate, .deliveryLocation, .deliveryMethod',$container).empty()				
						_app.ext.beachmart.u.getShipQuotes(data.zip);
					}
					else if (_app.ext.quickstart.vars.hotw && _app.ext.quickstart.vars.hotw[0] && _app.ext.quickstart.vars.hotw[0].pageType == 'product' && !data.zip) {
						var $tryAgain = $("<span class='pointer'>Transit times could not be retrieved at the moment (Try again)</span>");
						$('.transitContainer',$container).empty().append($tryAgain).click(function(){_app.ext.beachmart.a.showZipDialog()});
						$('.shippingInformation .loadingBG',$container).removeClass('loadingBG');
						$('.loadingText',$container).hide()
					}
					else {} //not on a product page. do nothing
					//_app.ext.beachmart.u.getShipQuotes(_app.data[tagObj.datapointer].zip);
				}
				else if (attempts < 8){
					dump('cartDetail.ship null, running again. #of attempts so far:'); dump(attempts);
					attempts++;
					setTimeout(function() { _app.ext.beachmall_begin.callbacks.handleWhereAmI.onSuccess(tagObj,attempts) },250);
				}
				else if (attempts < 9){
					dump('cartDetail.ship null, setting to blank object and running again. #of attempts so far:'); dump(attempts);
					attempts++;
					thisCartDetail.ship = {};
					setTimeout(function() { _app.ext.beachmall_begin.callbacks.handleWhereAmI.onSuccess(tagObj,attempts) },250);
				}
				else { dump('In _app.ext.beachmall_begin.callbacks.handleWhereAmI.onSuccess and cartDetail.ship is not loading, a problem has occured.','error') }
			},
			onError : function(responseData)	{
	dump('-----> handleWhereAmI error reached'); dump(responseData);
				var $container = $(_app.u.jqSelector('#',_app.ext.quickstart.vars.hotw[0].parentID));
				//reset all the spans
				$('.putLoadingHere',$container).removeClass('loadingBG');
				$('.loadingText',$container).hide();
				$('.shipMessage, .estimatedArrivalDate, .deliveryLocation, .deliveryMethod',$container).empty()
				$('.timeInTransitMessaging',$container).empty().append("Unable to determine your zip code for estimated arrival date. <span class='pointer zipLink' onClick='myApp.ext.beachmart.a.showZipDialog(); return false;'>click here</span> to enter zip.").show();
				}
			}, //handleWhereAmI

			
	}, //callbacks
	
	
	
	calls : {
	
		//returns: areacode, city, country, region, region_name, zip (among other data i didn't think was relevant)
		whereAmI : {
			init : function(_tag,Q)	{
				dump('----START whereAmI'); dump(_tag); 
				_tag = $.isEmptyObject(_tag) ? {} : _tag; 
				_tag.datapointer = "whereAmI"
				r = 1;
				this.dispatch(_tag,Q);
				return r;
			},
			dispatch : function(_tag,Q)	{
				dump('got into whereAmI dispatch');
				_app.model.addDispatchToQ({"_cmd":"whereAmI","_tag" : _tag},'mutable');
			} 
		}, //whereAmI
		
		cartSet : {
			init : function(obj,_tag,Q)	{
//				if(obj._cartid && _app.u.thisNestedExists('ext.cart_message.vars.carts.'+obj._cartid,_app))	{
//					_app.model.addDispatchToQ({'_cmd':'cartMessagePush','what':'cart.update','_cartid':obj._cartid},'immutable');
//					}
				obj["_cmd"] = "cartSet";
				obj._tag = _tag || {};
				_app.model.addDispatchToQ(obj,Q || 'immutable');
				return 1;
			}
		}, //cartSet
	
	},



////////////////////////////////////   Actions    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

		a : {
		
/* DROPDOWN ACTIONS */		
			//SHOW MAIN CATEGORY DROPDOWN MENU
			showDropdown : function ($tag, ht) {
				var $dropdown = $(".dropdown", $tag);
				var height = ht;
				$dropdown.children().each(function(){
					$(this).outerHeight(true);
				});
				$dropdown.stop().animate({"height":height+"px"}, 500);
			},
            
			//ANIMATE RETRACTION OF MAIN CATEGORY DROPDOWN MENU
			hideDropdown : function ($tag) {
				$(".dropdown", $tag).stop().animate({"height":"0px"}, 500);
			},
			
			//IMEDIATE RETRACTION OF MAIN CATEGORY DROPDOWN MENU WHEN HEADER IS CLICKED
			clickDropdown : function ($tag) {
				$(".dropdown", $tag).stop().animate({"height":"0px"}, 0);
			},
			
			//SHOW MAIN CATEGORY 2ND LEVEL DROPOUT MENU
			showDropout : function ($tag, $parentparent, $parent, wd) {
				var $dropout = $(".dropout", $tag);
				var width = wd;
				$dropout.children().each(function(){
					$(this).outerWidth(true);
				});
				$('.defaultDDImage',$parentparent).css({"right":"-300px"});	//hide default image so sub-cat image can display
				$parentparent.css({"width":720+"px"},1000);
				$parent.stop().animate({"width":700+"px"},0);
				$dropout.stop().animate({"width":width+"px"});
			},
			
			//ANIMATE RETRACTION OF MAIN CATEGORY 2ND LEVEL DROPOUT MENU
			hideDropout : function ($tag, $parentparent, $parent) {
				$(".dropout", $tag).stop().animate({"width":"0px"}, 1000);
				$parent.stop().animate({"width":460+"px"}, 1000);
				$parentparent.css({"width":480+"px"}, 1000);
				$('.defaultDDImage',$parentparent).css({"right":"-4px"});
			},
			
			//IMEDIATE RETRACTION OF MAIN CATEGORY DROPDOWN MENU WHEN 2ND LEVEL LINK IS CLICKED
			clickDropdown : function ($tag) {
				$(".dropdown", $tag).stop().animate({"height":"0px"}, 0);
			},
			
			//SHOW HOVERPRODUCT DROPOUT MENU
			showHoverout : function ($tag) {
				var $hoverout = $(".hoverout", $tag);
				var width = 240;
				$hoverout.children().each(function(){
					$(this).outerWidth(true);
				});
				$('.defaultDDImage',$tag.parent().parent().parent()).animate({"opacity":"0"},0);
				$hoverout.stop().animate({"width":width+"px",opacity:1}, 0);
			},
			
			//ANIMATE RETRACTION OF HOVERPRODUCT DROPOUT MENU
			hideHoverout : function ($tag) {
				$(".hoverout", $tag).stop().animate({"width":"0px",opacity:0}, 0);
				$('.defaultDDImage',$tag.parent().parent().parent()).animate({"opacity":"1"},0);
			},
			
			//SHOW HOVERPRODUCT DROPOUT MENU
			showHoverout2 : function ($tag, $parent) {
				var $hoverout = $(".hoverout", $tag);
				var width = 240;
				$hoverout.children().each(function(){
					$(this).outerWidth(true);
				});
				$('.defaultDOImage',$tag.parent()).animate({"opacity":"0"},0);
				$hoverout.stop().animate({"width":width+"px",opacity:1},0);
				//$parent.css({"width":680+"px"}, 000);
			},
			
			//ANIMATE RETRACTION OF HOVERPRODUCT DROPOUT MENU
			hideHoverout2 : function ($tag, $parent) {
				$(".hoverout", $tag).stop().animate({"width":"0px",opacity:0},0);
			//	$parent.css({"width":485+"px"}, 000);
				$('.defaultDOImage',$tag.parent()).animate({"opacity":"1"},0);
			},
			
			//SHOW GEO DROPDOWN MENU WITH CHECK FOR A TIMEOUT TO PREVENT RE-HOVER AFTER CLOSE BUTTON CLICK FROM KEEPING IT OPEN
			showGeoDropdown : function ($tag, ht) {
				//dump('-----showdropdown data:'); dump($(".dropdown", $tag).data('timeout'));
				if(!$(".dropdown", $tag).data('timeout') || $(".dropdown", $tag).data('timeout') === 'false') {
					var $dropdown = $(".dropdown", $tag);
					var height = ht || 0;
			//		$dropdown.children().each(function(){ THIS WAS IN PLACE OF IF/ELSE BELOW WHEN ONLY USED A PASSED ARGUMENT FOR HEIGHT.
			//			$(this).outerHeight(true);
			//		});
					if(height != 0){
						$dropdown.children().each(function(){
							$(this).outerHeight(true);
						});
					} else{
						$dropdown.children().each(function(){
								height += $(this).outerHeight();
								$(this).outerHeight(true);
						});
					}
					$dropdown.stop().animate({"height":height+"px"}, 500);
				}
			},
            
			//ANIMATE RETRACTION OF HEADER GEO DROPDOWN MENU WITH TIMEOUT TO PREVENT ACCIDENTAL RE-HOVER FROM KEEPING IT OPEN
			hideGeoDropdown : function ($tag) {
				$(".dropdown", $tag).data('timeout','true');
				$(".dropdown", $tag).stop().animate({"height":"0px"}, 500);
				setTimeout(function(){$(".dropdown", $tag).data('timeout','false')}, 505);
				//dump('----hidedropdown data:'); dump($(".dropdown", $tag).data('timeout'));
			},
			
/* GEOLOCATION ACTIONS */
			updateShipPostal : function($form)	{
				_app.u.dump("BEGIN beachmall.a.updateShipPostal.");
				var postal = $("[name='ship/postal']",$form).val();
				if(postal)	{
					_app.u.dump(" -> postal set: "+postal);
					//local cart object will be updated in fetchLocationInfoByZip, cartSet is also run there so that city, region, and zip are all updated
					_app.model.addDispatchToQ({"_cmd":"whereAmI", 'zip':postal, "_tag" : {'callback':'handleWhereAmI','extension':'beachmall_begin', 'datapointer':'whereAmI'}},'mutable');
					_app.model.dispatchThis('mutable');
				}
				else	{
					$('#globalMessaging').anymessage({'message':'In beachmall_begin.u.updateShipPostal, no postal code passed.','gMessage':true})
				}
			},
	
		}, //actions
		
////////////////////////////////////   TLCFORMATS    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

//much like a renderFormat but uses tlc... ;p

		tlcFormats : {
		
/* DROPDOWN TLC */		
			//checks the var copied from _dropdownsearches-min.json for search buttons that have to results and removes them to prevent empty search pages from being made.
			hideifexlcuded : function(data, thisTLC) {
				//var args = thisTLC.args2obj(data.command.args, data.globals);
				//dump('---hideifexlcuded args:'); dump(data.value);
				//dump('---hideifexlcuded data-:'); dump(data.globals.tags[data.globals.focusTag].attr('data-exclude'));
				var rootCat = "."+data.value.split('.')[1]; //dump('---root Cat'); dump(rootCat);
				var searchType = data.globals.tags[data.globals.focusTag].attr('data-exclude');
				var navCat = data.value; //dump(navCat);
				var searchValue = _app.ext.beachmall_begin.vars.dropdownsearches[rootCat][navCat][searchType];

				if(searchValue && searchValue == 0) { data.globals.tags[data.globals.focusTag].remove(); } 
				else { /*this element is shown to return a result in beachmall_begin.vars.dropdownsearches*/ }
					//dump('---dropdown var:'); dump(_app.ext.beachmall_begin.vars.dropdownsearches[navCat][searchType]); 
			},
			
			dropdownseoanchor : function(data, thisTLC) {
				var args = thisTLC.args2obj(data.command.args, data.globals);
				data.globals.binds[data.globals.focusBind] = _app.ext.store_routing.u.categorySearchAnchor(data.value.path, (args.seo ? data.value.pretty : ''),args.searchtype);
				return true;
			},
			
		}, //tlcFormats

////////////////////////////////////   RENDERFORMATS    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

//renderFormats are what is used to actually output data.
//on a data-bind, format: is equal to a renderformat. extension: tells the rendering engine where to look for the renderFormat.
//that way, two render formats named the same (but in different extensions) don't overwrite each other.
		
		renderFormats : {
		
		}, //renderFormats
			
////////////////////////////////////   UTIL    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
		
//pass in form as object.  This function will verify that each fieldset has the appropriate attributes.
//will also verify that each filterType has a getElasticFilter function.
		
		u : {

/* DROPDOWN UTILS */		
			getDropdownJSON : function() {
//				dump('BEGIN _app.ext.beachmall_begin.u.getDropdownJSON');	
				//get the json that lists which dropdown search buttons have results and save to var for access later.
				$.getJSON("_dropdownsearches-min.json?_v="+(new Date()).getTime(), function(json) {
					_app.ext.beachmall_begin.vars.dropdownsearches = json.dropdownsearches
					setTimeout(function() {_app.ext.beachmall_begin.u.makedropdownlinks();},1000); //timeout here to allow data to populate
					//dump('----dropdown search exclusion list:'); dump(_app.ext.beachmall_begin.vars.dropdownsearches);
				}).fail(function(){_app.u.throwMessage("DROPDOWN SEARCH LIST FAILED TO LOAD - there is a bug in _dropdownsearches-min.json")});
				
				$.getJSON("_dropdownimages-min.json?_v="+(new Date()).getTime(), function(json) {
					_app.ext.beachmall_begin.vars.dropdownImages = json.dropdownImages
					//_app.ext.beachmall_begin.u.showDropdownImages();
				}).fail(function(){_app.u.throwMessage("DROPDOWN IMAGES FAILED TO LOAD - there is a bug in _dropdown-image.json")});
			},
			
			//checks ul's in header for an assigned category name, then builds the image and search links that belong in each list item.
			//TODO: support for hiding links that have no results.
			makedropdownlinks : function() {
//				dump('START beachmall_store.u.makedropdownlinks');
				$('[data-dropdown-link]','.dropdownsContainer').each(function(){
				var navcat = $(this).attr('data-dropdown-link');
				var $this = $(this);
				var _tag = { 
					"callback": function(rd){
						//rd.$tag.tlc({'datapointer':rd.datapointer, verb:"translate"}); //this way doesn't use a template
						rd.$tag.tlc({'datapointer':rd.datapointer, verb:"transmogrify", templateid:"dropdownAnchorListTemplate"});
						var stockL = navcat.split('.').length;
						var stockNavcat = "."+navcat.split('.')[stockL-1];
						//$('[data-stock-image]',$(this)).attr('data-navcat',stockNavcat);
						$('.stockImageContainer',$this).removeClass('loadingBG').append(_app.ext.beachmall_begin.u.makeDropdownImage(_app.ext.beachmall_begin.vars.dropdownImages[stockNavcat],210,210,"ffffff"));
						$this.append("<div class='dropdownBGRight'></div>");
					},
					"$tag":$(this)
				}
				_app.calls.appNavcatDetail.init({"path":navcat,"deatil":"fast"},_tag);
				});
				_app.model.dispatchThis();
			},
			
			makeDropdownImage : function(JSON, w, h, b) {
//				_app.u.dump(JSON);
				var $img = $(_app.u.makeImage({
					tag : true,
					w   	: w,
					h		: h,
					b		: b,
					name	: JSON.src,
					alt		: JSON.alt,
					title	: JSON.title
				}));
	//			can be used to add links later if desired
	//			if(bannerJSON.prodLink) {
	//				$img.addClass('pointer').data('pid', bannerJSON.prodLink).click(function() {
	//					showContent('product',{'pid':$(this).data('pid')});
	//				});
	//			}
	//			else if(bannerJSON.catLink) {
	//				$img.addClass('pointer').data('navcat', bannerJSON.catLink).click(function() {
	//					showContent('category',{'navcat':$(this).data('navcat')});
	//				});
	//			}
	//			else {
	//				//just a banner!
	//			}
				return $img;
			},

/* HASH UTIL */			
			//takes the seo name and removes certain characters/spaces/patterns and returns the seo name
			removeUnwantedChars : function(seo) {
				seo = seo.replace('"','-inches'); //doesn't want any " (signifying "inches") in seo hash
				seo = seo.replace('_',' '); //doesn't want any "_" in seo hash
				seo = seo.replace(' / ',' '); //doesn't want any " / " in seo hash
				seo = seo.replace('/',' '); //doesn't want any "/" in seo hash
				seo = seo.replace('+',' '); //doesn't want any "+" in seo hash
				seo = seo.replace(' & ',' '); //doesn't want any " & " in seo hash
				seo = seo.replace('&',' '); //doesn't want any "/" in seo hash
				seo = seo.replace(' - ',' '); //wants all " " converted to "-", but " - " comes out as "---", no bueno.
				seo = seo.replace('--',' '); //just in case, some prod_names have two consecutive "-"
				seo = seo.replace('---',' '); //just in case, some prod_names have three consecutive "-"
				seo = seo.replace('  ',' '); //kill two consecutive spaces
				seo = seo.replace('   ',' '); //kill three consecutive spaces
				seo = seo.toLowerCase();
				return seo;
			}
		
		}, //u

////////////////////////////////////   EVENTS    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

//app-events are added to an element through data-app-event="extensionName|functionName"
//right now, these are not fully supported, but they will be going forward. 
//they're used heavily in the admin.html file.
//while no naming convention is stricly forced, 
//when adding an event, be sure to do off('click.appEventName') and then on('click.appEventName') to ensure the same event is not double-added if app events were to get run again over the same template.
		e : {
		
			//action for newsletter signup in footer
			newsletterSignup : function($ele, p) {
				p.preventDefault();
				var sfo = $ele.serializeJSON();
				sfo._cmd = "appBuyerCreate";
				sfo._tag = {
					datapointer :"appBuyerCreate",
					callback : function(rd){
						if(_app.model.responseHasErrors(rd)){
							$ele.anymessage({message:rd});
						}
						else {
							$ele.anymessage(_app.u.successMsgObject("Thank you, you are now subscribed"));
						}
					}
				}
				_app.model.addDispatchToQ(sfo, 'immutable');
				_app.model.dispatchThis('immutable');
			},
		
		} //e [app Events]
		
	} //r object.
	
	return r;
}