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
				
				setTimeout(function(){
					_app.u.loadResourceFile(['script',0,'magiczoomplus-commercial/magiczoomplus/magiczoomplus.js',function(){
						MagicZoomPlus.start();
					}]);
				},0);
					
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
						_app.ext.beachmall_product.u.getShipQuotes(data.zip);
					}
					else if (_app.ext.quickstart.vars.hotw && _app.ext.quickstart.vars.hotw[0] && _app.ext.quickstart.vars.hotw[0].pageType == 'product' && !data.zip) {
						var $tryAgain = $("<span class='pointer'>Transit times could not be retrieved at the moment (Try again)</span>");
						$('.transitContainer',$container).empty().append($tryAgain).click(function(){_app.ext.beachmall_begin.a.showZipDialog()});
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
		
		time : {
			init : function(tagObj,Q)	{
//				_app.u.dump("BEGIN beachmall_begin.calls.time.init  [Q: "+Q+"]");
				tagObj = $.isEmptyObject(tagObj) ? {} : tagObj; 
				tagObj.datapointer = "time";
				this.dispatch(tagObj,Q);
				return true;
			},
			dispatch : function(tagObj,Q)	{
				_app.model.addDispatchToQ({"_cmd":"time","_tag":tagObj},Q);	
			}
		}, //time
		
		appShippingTransitEstimate : {
			init : function(cmdObj,tagObj,Q)	{
				//_app.u.dump("BEGIN beachmall.calls.appShippingTransitEstimate.init  [Q: "+Q+"]"); dump(tagObj);
				tagObj = $.isEmptyObject(tagObj) ? {} : tagObj; 
				tagObj.datapointer = "appShippingTransitEstimate";
				this.dispatch(cmdObj,tagObj,Q);
				return true;
			},
			dispatch : function(cmdObj,tagObj,Q)	{
				cmdObj['_tag'] = tagObj;
				cmdObj["_cmd"] = "appShippingTransitEstimate"
				_app.model.addDispatchToQ(cmdObj,Q);	
			}
		},//appShippingTransitEstimate
	
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
				_app.u.dump("BEGIN beachmall_begin.a.updateShipPostal.");
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
//TIME IN TRANSIT ACTIONS
			showZipDialog : function()	{
				
				var $dialog = $('#zipEntryDialog');
				if($dialog.length)	{}//dialog already exists. no mods necessary, just open it.
				else	{
					_app.u.dump("create and show zip dialog");
					$dialog = $("<div>").attr("title","Change Zip for Shipping").dialog({
						modal:true,
						autoOpen:false,
						close: function(event, ui)	{
								$(this).dialog('destroy').empty().remove()
						}
					});
					$dialog.append("<div id='shipDialogMessaging' />");
					$dialog.append("<input type='text' name='data.ship_zip' id='shipDialogZip' required='required' size='10' />");
					var $button = $("<button />").html('Update Zip Code').click(function(){
						var zip = $('#shipDialogZip').val();
						_app.u.dump("BEGIN showZipDialog .click event. zip: '"+zip+"'");

						if(zip && zip.length >= 5 && !isNaN(zip))	{
							_app.model.addDispatchToQ({"_cmd":"whereAmI", 'zip':zip, "_tag" : {'callback':'handleWhereAmI','extension':'beachmall_begin', 'datapointer':'whereAmI'}},'mutable');
							_app.model.dispatchThis('mutable');
							//_app.u.dump('----CART ID:'); _app.u.dump(_app.model.fetchCartID());
							$dialog.dialog('close');
						}
						else	{ $('#shipDialogMessaging').empty().anymessage({"message":"Please enter a valid US zip code"}); }
					});
					$dialog.append($button)
				}
				$dialog.dialog('open');
			}
	
		}, //actions
		
////////////////////////////////////   TLCFORMATS    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

//much like a renderFormat but uses tlc... ;p

		tlcFormats : {
		
			dump : function(data,thisTLC) {
				var prod = data.globals.binds.var;
				var $tag = data.globals.tags[data.globals.focusTag];
				dump('=======================dump data: '); dump(prod); 
			},
		
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
			
			renderHeaderDropdown : function(counter) {
				counter = counter || 0;
				var $container = $("[data-header='dropdown']");
				if($container) {
					$container.empty().tlc({verb:"transmogrify", templateid:"dropdownTemplate"});
					_app.ext.beachmall_begin.u.getDropdownJSON();
				}
				else if (counter < 50) { _app.ext.beachmall_begin.u.renderHeaderDropdown(counter+1); } 
				else { dump("HEADER DROPDOWN CONTAINER NOT FOUND. Tried "+counter+" times."); }
			},
	
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
			},
			
			//adds jquery tool tip to show product sibling/variation thumbnails and pop up messages
			startTooltip : function() {
				$( document ).tooltip({
					items : "img[data-big-img], [data-toolTipThumb], [data-cartToolTipThumb], [data-toolTipQuickview], [data-grid-img]",
					position : {
						my : "bottom-5",
						at : "top"
					},
					//track : true,
					content : function(){
						var element = $(this);
						//thumbnail zoom for option image select thumbnails
						if (element.is("img[data-big-img]")) {
							var pid = $(this).closest('[data-pid]').attr('data-pid');
							var product = _app.data['appProductGet|'+pid];
						//	_app.u.dump('>>>>> '); _app.u.dump(pid);
							
							//_app.u.dump('>>>>> '); _app.u.dump(product['@variations']['1']['options']['0'].prompt);
							return '<div class="toolTipWrapper"><span class="optionsZoom">'+$(this).attr('data-tooltip-title')+'</span><img src="'+$(this).attr('data-big-img')+'" width="400" height="400" /></div>';
							}
						//thumbnail zoom for option grid image thumbnails
						if (element.is("[data-grid-img]")) {
							var pid = $(this).closest('[data-pid]').attr('data-pid');
							var product = _app.data['appProductGet|'+pid];
						//	_app.u.dump('>>>>> '); _app.u.dump(product);
							
							//_app.u.dump('>>>>> '); _app.u.dump(product['@variations']['1']['options']['0'].prompt);
							return '<div class="toolTipWrapper"><span class="optionsZoom">'+$(this).attr('data-tooltip-title')+'</span><img src="'+$(this).attr('data-grid-img')+'" width="400" height="400" /></div>';
							}
						//thumbnail zoom for sibling thumbnails
						if (element.is("[data-toolTipThumb]")) {
							//_app.u.dump($(this).closest('[data-pid]').attr('data-pid'));
							var pid = $(this).closest('[data-pid]').attr('data-pid');
							var product = _app.data['appProductGet|'+pid];
							if(product && product['%attribs'] && product['%attribs']['zoovy:prod_name']) {
								var prodName = product['%attribs']['zoovy:prod_name'];
								var productImg = _app.u.makeImage({"w":400,"h":400,"b":"ffffff",tag:0,"name":product['%attribs']['zoovy:prod_image1']});
								return '<div class="toolTipWrapper"><span class="siblingZoom">'+prodName+'</span><img src="'+productImg+'" width="400" height="400" /></div>';
							}
						}
						//thumbnail zoom for accessory in cart line items
						if (element.is("[data-cartToolTipThumb]")) {
							//_app.u.dump($(this).closest('[data-pid]').attr('data-pid'));
							var pid = $(this).closest('[data-pid]').attr('data-pid');
							var product = _app.data['appProductGet|'+pid];
							if(product && product['%attribs']) {
								var prodName = product['%attribs']['zoovy:prod_name'] ? product['%attribs']['zoovy:prod_name'] : "";
								var prodPrice = product['%attribs']['zoovy:base_price'] ? product['%attribs']['zoovy:base_price'] : "";
								prodPrice = _app.u.formatMoney(prodPrice,'$',2,true);
								var productImg = _app.u.makeImage({"w":200,"h":200,"b":"ffffff",tag:0,"name":product['%attribs']['zoovy:prod_image1']});
								return '<div class="cartToolTipWrapper"><span class="cartAccZoom">'+prodName+'</span><span class="cartAccZoom cartAccZoomPrice">'+prodPrice+'</span><img src="'+productImg+'" width="200" height="200" /></div>';
							}
						}
						//thumbnail zoom for thumbs under main prod images in quickview
						if (element.is("[data-toolTipQuickview]")) {
							//_app.u.dump('&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&'); _app.u.dump($(this).closest('[data-toolTipName]').attr('data-toolTipName'));
							var pid = $(this).closest('[data-pid]').attr('data-pid');
							var product = _app.data['appProductGet|'+pid];
							var prodName = product['%attribs']['zoovy:prod_name'];
							var imgName = $(this).closest('[data-toolTipName]').attr('data-toolTipName');
							var productImg = _app.u.makeImage({"w":400,"h":400,"b":"ffffff",tag:0,"name":imgName});
							return '<div class="toolTipWrapper"><span class="quickviewZoom">'+prodName+'</span><img src="'+productImg+'" width="400" height="400" /></div>';
							}
						},
					//	tooltipClass : "toolTipBG",
					//	open : function(event,ui){
					//		_app.u.dump('----It opened');
					//	}
					});
			}, //startTooltip
				
			//will add tabs to the selector in the context passed
			tabify : function($context,selector) {
				var $tabContainer = $(selector,$context);
				if($tabContainer.length)	{
					if($tabContainer.data("widget") == 'anytabs'){} //tabs have already been instantiated. no need to be redundant.
					else	{
						$tabContainer.anytabs(); //_app.u.dump($("ul li",$tabContainer));
	//TO DO: ADD THIS HOVER TO VIDEO TABS TOO
						$("[data-app-role='hoverTab']",$tabContainer).each(function() {
							$(this).mouseenter(function() {
								$(this).trigger('click');
							});
						});
					}
				}
				else	{
					_app.u.dump("WARNING! could not find selector "+selector+" for tab items");
				} //couldn't find the tab to tabificate.
			},
//TIME IN TRANSIT UTILS
			getSlowestShipMethod : function(servicesObj) {
				var r = false; //what is returned, index of ground shipping service, or false
				if(typeof servicesObj == 'object')	{
					var L = servicesObj.length;
					for(var i = 0; i < L; i += 1)	{
						if(servicesObj[i].method == 'UPS Ground')	{
							r = i;	break; //no need to continue in loop.
						}
					}
				}
				return r;
			},

			//pass in the @services object in a appShippingTransitEstimate and the index in that object of the fastest shipping method will be returned.
			getFastestShipMethod : function(servicesObj)	{
				dump('START beachmall_begin.u.getFastestShipMethod');
				var r = false; //what is returned. will be index of data object
				if(typeof servicesObj == 'object')	{
					var L = servicesObj.length;
					for(var i = 0; i < L; i += 1)	{
						if(servicesObj[i]['is_fastest'])	{
							r = i;	break; //no need to continue in loop.
						}
					}
				}
				else	{
					_app.u.dump("WARNING! servicesObj passed into getFastestShipMethod is empty or not an object. servicesObj:");
					_app.u.dump(servicesObj);
				}
//				_app.u.dump(" -> fastest index: "+r);
				return r;
			},
			
			//adds static button w/ scrollTop event to page 
			backToTop : function($context) {
				$context.append('<div class="appBackToTop pointer" data-app-click="beachmall_begin|scrollToTop"><span class="sprite"></span>Back to Top</div>')
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
			
			//clears the order/prod id field in contact form to be sure it doesn't still 
			//have showContactPID value still displayed (if form did not get submitted). 
			//does not preventDefault or return false because is used on anchors.
			resetcontactpid : function($ele, p) {
				var $field = $('input[name="OID"]','.contactForm');
				$field.val('');
				//$field.attr('placeholder', 'Order Number (if applicable)');
			},
			
			//returns view to top of page
			scrollToTop : function($ele, p) {
				p.preventDefault();
				$('html,body').animate({ scrollTop: 0 }, 'slow');
				return false;
			},
			
//Account login/create/recover events
			togglerecover : function($ele, p) {
				p.preventDefault();
				dump('START togglerecover');
				$("[data-slide='toggle']",$ele.parent()).slideToggle();
				return false;
			},
			
			//will call logBuyerOut, show homepage so my account isn't accessable any longer, 
			//scroll to top (in case already on homepage), and remove logged in class
			logBuyerOut : function($ele,p) {
				p.preventDefault();
				_app.u.logBuyerOut();
				_app.router.handleURIChange("/");
				_app.ext.beachmall_begin.e.scrollToTop($ele,p);
				$('body').removeClass('buyerLoggedIn'); 
				return false;
			}			
		
		}, //e [app Events]
		
		
		////////////////////////////////////   VARIATIONS    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\			
			
		variations : {
				//adds similar functionality as custom image select render option to image grid options
			renderOptionCUSTOMIMGGRID : function(pog) {
				var pogid = pog.id;
//				dump('-----renderOptionCUSTOMIMGGRID pog.id'); dump(pog.id); dump(pog);
				var $parentDiv = $("<div class='imgGridVariationWrapper floatLeft' \/>");
				var skus = _app.data['appProductGet|'+pog.pid]['%SKU']; dump('-----SKUs?'); dump(skus[0][1]); dump(skus[0][1].length);
				var skuLevel = false; //set to true if sku level image is found, will lead to sku render otherwise will lead to image render
				var $radioInput; //used to create the radio button element.
				var radioLabel; //used to create the radio button label.
				var $optionDiv; //holds the individual radio/label/img pack for each sku
				var $imgDiv; //holds the group of images for each iteration/variation
				var thumbnail; //holds nails shaped like thumbs
				var thumbnailTag; //tag created manually to add jquery tool tip attribs
				
				for(var index in skus[0][1]) {
					if(index.indexOf('zoovy:prod_image') > -1) {
					dump('0------There was an image!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
					skuLevel = true;
					}
				}
				
				//render sku level image group if zoovy:prod_image was found in %SKU
				if(skuLevel) {
					dump('0------in skuLevel if');
					if(pog['ghint']) {$parentDiv.append(pogs.showHintIcon(pogid,pog['ghint']))}
					
					var j = 0;
					
					//var skus = _app.data['appProductGet|PLY39AWTEST2']['%SKU'];
					//var skus = _app.data['appProductGet|PL4S31']['%SKU'];
					var skuLen = skus.length;
					var options = pog['@options'];
					var optLen = pog['@options'].length;
	//				dump('The lengths, o then s'); dump(optLen); dump(skuLen);
					
					for (var i=0; i < optLen; i++) {
						$optionDiv = $("<div class='imgGridOptionWrapper'></div>");
						$imgDiv = $("<div class='imgGridImgWrapper' data-pogval="+pog['@options'][i]['v']+"></div>");
						$radioInput = $('<input>').attr({type: "radio", name: pogid, value: pog['@options'][i]['v'],"data-pogval":pog['@options'][i]['v']});
						radioLabel = "<label>"+pog['@options'][i]['prompt']+"<\/label>";
						$optionDiv.append($radioInput).append(radioLabel);
						while (j < skuLen) {
	//						dump('----while i is '+i+' option value is: '+pog.id+options[i].v+', while j is '+j+' sku id is '+skus[j][0]);
							if(skus[j][0].indexOf(pog.id+options[i].v) > -1) {
								var images = skus[j][1];
								for (var index in images) {
	//								dump('---image attrib = '+index+' and image path = '+images[index]);
									if(index.indexOf('zoovy:prod_image') > -1 && images[index].length > 0) {
	//									dump('---image attrib = '+index+' and image path = '+images[index]);
										thumbnail = _app.u.makeImage({"w":400,"h":400,"name":images[index],"b":"FFFFFF","lib":_app.username});
										thumbnailTag = "<img src='"+thumbnail+"' width='40' height='40' name='"+pog['@options'][i]['img']+"' data-grid-img='"+thumbnail+"' data-tooltip-title='"+pog['@options'][i]['prompt']+"'>";
										$imgDiv.append(thumbnailTag);
									}
								}
								j++
	//							dump('----Meanwhile...'); dump(images); 
								break;
							} //k for
							else {j++}
						} //while
						
						//make clicking one of the images check the radio button and add a red border to further indicate selection
						$imgDiv.click(function(){
							var pogval = $(this).attr('data-pogval');	//value of image clicked
	//						dump('you clicked');
							$('.imgGridImgWrapper',$(this).parent().parent()).each(function(){
								if($(this).hasClass('selected')){ 
									$(this).removeClass('selected'); 
								}	//add selected indicator to clicked image
								if($(this).attr('data-pogval') == pogval){ 
									$(this).addClass('selected'); 
								}
							});
							$('input[type=radio]',$(this).parent().parent()).prop('checked',false);
							$('input[type=radio]',$(this).parent().parent()).each(function() {
								if($(this).attr('data-pogval') == pogval) {
									$(this).prop('checked',true);
								}
							});
						}); 
						
						//make clicking the radio change the border like clicking the image does above
						$radioInput.change(function() {
							var selected = $(this).val();	//the option selected in select list
						dump('---the radio'); dump(selected); 
								//remove selected indicator from all images
							$('.imgGridImgWrapper',$(this).parent().parent()).each(function(){
								if($(this).hasClass('selected')){ 
									$(this).removeClass('selected'); 
								}	//add it back to the value of select list option if one matches
								if($(this).attr('data-pogval') == selected){ 
									$(this).addClass('selected'); 
								}
							});
						});
						
						$optionDiv.append($imgDiv);
						$parentDiv.append($optionDiv);
					} //i for
				} //sku level render
				
				//do the regular custom thing w/out the sku level images
				else {
					var i = 0;
					var len = pog['@options'].length;
					while (i < len) {
						$optionDiv = $("<div class='imgGridOptionWrapper'></div>");
						$imgDiv = $("<div class='imgGridImgWrapper' data-pogval="+pog['@options'][i]['v']+"></div>");
						$radioInput = $('<input>').attr({type: "radio", name: pogid, value: pog['@options'][i]['v'],"data-pogval":pog['@options'][i]['v']});
						radioLabel = "<label>"+pog['@options'][i]['prompt']+"<\/label>";
						thumbnail = _app.u.makeImage({"w":400,"h":400,"name":pog['@options'][i]['img'],"b":"FFFFFF","lib":_app.username});
						thumbnailTag = "<img src='"+thumbnail+"' width='"+40+"' height='"+40+"' name='"+pog['@options'][i]['img']+"' data-grid-img='"+thumbnail+"' data-tooltip-title='"+pog['@options'][i]['prompt']+"'>";
						$imgDiv.append(thumbnailTag);
						$optionDiv.append($radioInput).append(radioLabel).append($imgDiv);
						$parentDiv.append($optionDiv);
						i++
						
						//make clicking one of the images check the radio button and add a red border to further indicate selection
						$imgDiv.click(function(){
							var pogval = $(this).attr('data-pogval');	//value of image clicked
	//						dump('you clicked');
							$('.imgGridImgWrapper',$(this).parent().parent()).each(function(){
								if($(this).hasClass('selected')){ 
									$(this).removeClass('selected'); 
								}	//add selected indicator to clicked image
								if($(this).attr('data-pogval') == pogval){ 
									$(this).addClass('selected'); 
								}
							});
							$('input[type=radio]',$(this).parent().parent()).prop('checked',false);
							$('input[type=radio]',$(this).parent().parent()).each(function() {
								if($(this).attr('data-pogval') == pogval) {
									$(this).prop('checked',true);
								}
							});
						}); 
						
						//make clicking the radio change the border like clicking the image does above
						$radioInput.change(function() {
							var selected = $(this).val();	//the option selected in select list
						dump('---the radio'); dump(selected); 
								//remove selected indicator from all images
							$('.imgGridImgWrapper',$(this).parent().parent()).each(function(){
								if($(this).hasClass('selected')){ 
									$(this).removeClass('selected'); 
								}	//add it back to the value of select list option if one matches
								if($(this).attr('data-pogval') == selected){ 
									$(this).addClass('selected'); 
								}
							});
						});
					}

				} //regular custom render
				return $parentDiv;
			},
			
			//puts color options on product page as image selectable select list. Also adds jquery tool tip pop up of image for zoom
			renderOptionCUSTOMIMGSELECT: function(pog) {

//				_app.u.dump('POG -> '); _app.u.dump(pog);
				
				var $parent = $('<div class="optionsParent" />');
				var $select = $("<select class='optionsSelect floatLeft' name="+pog.id+" />");
				var $modContainer = $("<div class='modContainer floatLeft fontRed'></div>"); //holds price modifier next to select list
				var $hint = $('<div class="zhint">mouse over thumbnail to see larger swatches</div>');
				var $hint = $('<div class="zhint">mouse over thumbnail to see larger swatches</div>');
				$parent.append($hint);

				var len = pog['@options'].length;				
				if(len > 0) {
					optionTxt = (pog['optional'] == 1) ? "" : "Please choose (required)";
					selOption = "<option value='' disabled='disabled' selected='selected'>"+optionTxt+"<\/option>";
					$select.append(selOption);
				}
				
				var $option;
				for (var index in pog['@options']) {
					var option = pog['@options'][index];
//					_app.u.dump('IMG: '); _app.u.dump(option.img);
					$option = $("<option data-price-modifier='"+option.p+"' value="+option.v+">"+option.prompt+"</option>");
					$select.append($option);
					var thumbImg = _app.u.makeImage({"w":pog.width,"h":pog.height,"name":option.img,"b":"FFFFFF","tag":false,"lib":_app.username});
					var bigImg = _app.u.makeImage({"w":400,"h":400,"name":option.img,"b":"FFFFFF","tag":false,"lib":_app.username});																									//need to try moving these to be appended
					
					var $imgContainer = $('<div class="floatLeft optionImagesCont" data-price-modifier="'+option.p+'" data-pogval="'+option.v+'" />');
					/*var $mzpLink = $('<a id="imgGridHref_'+pog.id+'_'+option.v+'" alt="'+option.prompt+'" class="MagicZoom" title="'+option.prompt+'" rel="hint:false; show-title:top; title-source=#id;" href="'+mzBigImg+'" />');
					
					$mzpLink.click(function(){
						var pogval = $(this).parent().attr('data-pogval');
						
						$select.val(pogval);
						app.u.dump(pogval);
						app.u.dump(pogval);
						app.u.dump(pogval);
						app.u.dump(pogval);
						$('.optionImagesCont', $parent).each(function(){
							if($(this).hasClass('selected')){ 
								$(this).removeClass('selected'); 
								}
							if($(this).attr('data-pogval') == pogval){ 
								$(this).addClass('selected'); 
								}
							});	
						});
						
					$mzpLink.append($('<img src='+thumbImg+' title="'+pog.prompt+'" data-pogval="'+option.v+'"/>'));
					$imgContainer.append($mzpLink);*/

						//add selected indicator to image, and change select list option to match
					$imgContainer.click(function(){
						var pogval = $(this).attr('data-pogval');	//value of image clicked
						
						$select.val(pogval); 	//change select list to clicked image value
							//remove the selected indicator from all images
						$('.optionImagesCont', $parent).each(function(){
							if($(this).hasClass('selected')){ 
								$(this).removeClass('selected'); 
								}	//add selected indicator to clicked image
							if($(this).attr('data-pogval') == pogval){ 
								$(this).addClass('selected'); 
								$modContainer.empty();
								//if there is a price modifier, display it next to the select list of options
								if($(this).attr("data-price-modifier") != "" && $(this).attr("data-price-modifier") != "undefined") {
									var thisPriceMod = $(this).attr("data-price-modifier").substring(1); //get rid of the "+" symbol 
									$modContainer.empty().text("+ $"+thisPriceMod); 
									}
								}
							});	
						});
					
					$img = $('<img src="'+thumbImg+'" data-big-img="'+bigImg+'" data-tooltip-title="'+option.prompt+'"/>')
					
					//Tooltip called in init
					
					$imgContainer.append($img);
					$parent.append($imgContainer);
					
	//				to add description info to label for
	//				$mzpLink.mouseover(function() {
	//					$('.optionImagesCont', $parent).each(function(){
	//						$('label[value="Fabric"]').empty().text('Fabric: '+option.prompt+'');
	//						app.u.dump(option.prompt);
	//					});		
	//				});
	
				} // END for
				
					//add selected indicator on image when variation is selected w/ select list
				$select.change(function() {
					var selected = $(this).val();	//the option selected in select list
				
						//remove selected indicator from all images
					$('.optionImagesCont', $parent).each(function(){
						if($(this).hasClass('selected')){ 
							$(this).removeClass('selected'); 
						}	//add it back to the value of select list option if one matches
						if($(this).attr('data-pogval') == selected){ 
							$(this).addClass('selected'); 
							$modContainer.empty(); //remove old value in case there is no new one.
							//if there is a price modifier, display it next to the select list of options
							if($(this).attr("data-price-modifier") != "" && $(this).attr("data-price-modifier") != "undefined") {
								var thisPriceMod = $(this).attr("data-price-modifier").substring(1); //get rid of the "+" symbol 
								$modContainer.empty().text("+ $"+thisPriceMod); 
							}
						}
					});
				});

				$parent.append($select);
				$parent.append($modContainer); //add the price modifier
				return $parent;
			}, // END renderOptionCUSTOMIMGSELECT
			
			xinit : function(){
				this.addHandler("type","imggrid","renderOptionCUSTOMIMGGRID");
				this.addHandler("type","imgselect","renderOptionCUSTOMIMGSELECT");
				_app.u.dump("--- RUNNING XINIT");
			}
			
		} //variations
		
		
	} //r object.
	
	return r;
}