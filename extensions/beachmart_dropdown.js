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


var beachmart_dropdown = function(_app) {
	var r = {

	vars : {},


					////////////////////////////////////   CALLBACKS    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\



	callbacks : {
//callbacks.init need to return either a true or a false, depending on whether or not the file will execute properly based on store account configuration. Use this for any config or dependencies that need to occur.
//the callback is auto-executed as part of the extensions loading process.
		init : {
			onSuccess : function()	{
				
//				_app.u.dump('BEGIN _app.ext.beachmart_dropdown.init.onSuccess ');	
				//get the json that lists which dropdown search buttons have results and save to var for access later.
				$.getJSON("_dropdownsearches-min.json?_v="+(new Date()).getTime(), function(json) {
					_app.ext.beachmart_dropdown.vars.dropdownsearches = json.dropdownsearches
					setTimeout(function() {_app.ext.beachmart_dropdown.u.makedropdownlinks();},1000); //timeout here to allow data to populate
					//dump('----dropdown search exclusion list:'); dump(_app.ext.beachmart_dropdown.vars.dropdownsearches);
				}).fail(function(){_app.u.throwMessage("DROPDOWN SEARCH LIST FAILED TO LOAD - there is a bug in _dropdownsearches-min.json")});
				
				$.getJSON("_dropdownimages-min.json?_v="+(new Date()).getTime(), function(json) {
					_app.ext.beachmart_dropdown.vars.dropdownImages = json.dropdownImages
					//_app.ext.beachmart_dropdown.u.showDropdownImages();
				}).fail(function(){_app.u.throwMessage("DROPDOWN IMAGES FAILED TO LOAD - there is a bug in _dropdown-image.json")});
			
				var r = true; //return false if extension won't load for some reason (account config, dependencies, etc).
				return r;
				},
			onError : function()	{
//errors will get reported for this callback as part of the extensions loading.  This is here for extra error handling purposes.
				}
			},
			
			startExtension : {
				onSuccess : function() {
					if(_app.ext.powerReviews_reviews && _app.ext.store_filter){
		//				_app.u.dump("beachmart dropdown Extension Started");
						_app.ext.beachmart_dropdown.u.loadHoverProducts(); //load function
						//_app.ext.beachmart_dropdown.u.renderTagsElastic();
						
					} else	{
						setTimeout(function(){_app.ext.beachmart_dropdown.callbacks.startExtension.onSuccess()},250);
					}
				},
				onError : function (){
					_app.u.dump('BEGIN _app.ext.beachmart_dropdowns.callbacks.startExtension.onError');
				}
			},
			
			renderHoverProduct : {
				// call function with the data response passed as argument 
				// (dataresponse is returned from the model when the API request returns, 
				// generaly just a repeat of _tag object you passed, but contains error response durring an error)
				onSuccess:function(responseData){		
					// call anycontent (from anyplugins) on class to put content in ** '.hoverproduct-'+_app.data[responseData.datapointer].pid) **, 
					//using the template you want to render with ** "hoverProductTemplate" **, using a pointr to the data that was returned ** "datapointer":responseData.datapointer **. 
					$('.hoverproduct-'+app.data[responseData.datapointer].pid).anycontent({"templateID":"hoverProductTemplate","datapointer":responseData.datapointer}); 
					},
				onError:function(responseData){			// error response goes here if needed
					}
				},
				
			renderTagsElastic : {
				onSuccess:function(responseData){
					$('.extraElastic-'+app.data[responseData.datapointer].pid).anycontent({"templateID":"extraElasticTemplate","datapointer":responseData.datapointer});
				},
				onError:function(responseData){
				}
			}
			
		}, //callbacks



////////////////////////////////////   Actions    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

		a : {
			
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
			
			
			
			
			
			
			
			
			
			
			
			showHoverProduct : function ($tag) {
				//_app.u.dump('*** '+$tag.attr("data-hoverproduct"));
				var pid = ($tag.attr("data-hoverproduct"));
				$('.hoverproduct-'+pid).removeClass('displayNone').animate(1000);
				$('.hoverProduct-'+pid).onMouseOver().show();
			},
			
			hideHoverProduct : function ($tag) {
				//_app.u.dump('*** '+$tag.attr("data-hoverproduct"));
				var pid = new String($tag.attr("data-hoverproduct"));
				$('.hoverproduct-'+pid).addClass('displayNone');
				$('.hoverProduct-'+pid).onMouseOut().addClass('displayNone');
			},
			
			holdHoverProduct : function ($tag) {
				var $H = $('.H', $tag);
				$H.onMouseOver().show();
			
			/*	var $dropdown = $(".dropdown", $tag);
				var height = ht;
				$dropdown.children().each(function(){
					$(this).outerHeight(true);
				});
				$dropdown.stop().animate({"height":height+"px"}, 1000);*/
			},
			
			releaseHoverProduct : function ($tag) {
				
			}
			
		}, //actions
		
////////////////////////////////////   RENDERFORMATS    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

//renderFormats are what is used to actually output data.
//on a data-bind, format: is equal to a renderformat. extension: tells the rendering engine where to look for the renderFormat.
//that way, two render formats named the same (but in different extensions) don't overwrite each other.
		
		renderFormats : {
		
			headerdropdown : function($tag, data) {
				data.value = data.value;
				dump('-----START headerdropdown'); dump(data.value);
			}
		
			}, //renderFormats
			
			
////////////////////////////////////   TLCFORMATS    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\			
			
		tlcFormats : {
			
			dropdownseoanchor : function(data, thisTLC) {
				var args = thisTLC.args2obj(data.command.args, data.globals);
				data.globals.binds[data.globals.focusBind] = _app.ext.store_routing.u.categorySearchAnchor(data.value.path, (args.seo ? data.value.pretty : ''),args.searchtype);
				return true;
			},
			
			//checks the var copied from _dropdownsearches-min.json for search buttons that have to results and removes them to prevent empty search pages from being made.
			hideifexlcuded : function(data, thisTLC) {
				//var args = thisTLC.args2obj(data.command.args, data.globals);
				//dump('---hideifexlcuded args:'); dump(data.value);
				//dump('---hideifexlcuded data-:'); dump(data.globals.tags[data.globals.focusTag].attr('data-exclude'));
				var rootCat = "."+data.value.split('.')[1]; //dump('---root Cat'); dump(rootCat);
				var searchType = data.globals.tags[data.globals.focusTag].attr('data-exclude');
				var navCat = data.value; //dump(navCat);
				var searchValue = _app.ext.beachmart_dropdown.vars.dropdownsearches[rootCat][navCat][searchType];

				if(searchValue && searchValue == 0) { data.globals.tags[data.globals.focusTag].remove(); } 
				else { /*this element is shown to return a result in beachmart_dropdown.vars.dropdownsearches*/ }
					//dump('---dropdown var:'); dump(_app.ext.beachmart_dropdown.vars.dropdownsearches[navCat][searchType]); 
			}
			
		},
			
////////////////////////////////////   UTIL    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
		
		u : {
		
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
						$('.stockImageContainer',$this).removeClass('loadingBG').append(_app.ext.beachmart_dropdown.u.makeDropdownImage(_app.ext.beachmart_dropdown.vars.dropdownImages[stockNavcat],210,210,"ffffff"));
						$this.append("<div class='dropdownBGRight'></div>");
					},
					"$tag":$(this)
				}
				_app.calls.appNavcatDetail.init({"path":navcat,"deatil":"fast"},_tag);
				});
				_app.model.dispatchThis();
			//?seorequest=1&pageType=product&pid=
				
	/*				var $this = $(this);
					var navcat = $this.attr('data-dropdown-link');
					var stockL = navcat.split('.').length;
					var stockNavcat = "."+navcat.split('.')[stockL-1];
					if($this.attr('data-second-tier')) { var thisClick =  "onClick='myApp.ext.beachmart_dropdown.a.clickDropdown($(this).parent().parent().parent().parent().parent().parent().parent().parent());'"}
					else { var thisClick = "onClick='myApp.ext.beachmart_dropdown.a.clickDropdown($(this).parent().parent().parent().parent().parent());'" }
					
					$this.append(
							"<a href='#!category/"+navcat+"' class='stockImageContainer' data-navcat='"+stockNavcat+"' "+thisClick+"></a>"
						+	"<a href='#!bestsellers/"+navcat+"' class='catSearchHomeDropdown' "+thisClick+">Best Selling Items</a>"	
						+	"<a href='#!featured/"+navcat+"' class='catSearchHomeDropdown' "+thisClick+">Featured Items</a>"
						+	"<a href='#!clearance/"+navcat+"' class='catSearchHomeDropdown' "+thisClick+">Clearance Items</a>"
						+	"<a href='#!category/"+navcat+"' class='catSearchHomeDropdown' "+thisClick+">See All Items</a>"
						+	"<div class='dropdownBGRight'></div>"
					);
					
//					dump('----Link to this dropdown category'); dump($(this).attr('data-dropdown-link'));
				});
	*/		},
	
	
			categorySearchAnchor : function(path,seo,type) {
				if(seo) {
					seo = _app.ext.beachmall_store.u.removeUnwantedChars(seo);
					return "/"+encodeURIComponent(seo).replace(/%20/g, "-")+"/"+type+"/c/"+path; 
				}
				else return "/category/"+type+"/"+path;
			},
		
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
					//console.debug(obj);							// see what was returned in console
					var _tag = {								// create holder for call back
						"callback":"renderHoverProduct",		// call back function (in callbacks above)
						"extension":"beachmart_dropdown"		// extension that holds call back (this extension you're in)
						};
					_app.calls.appProductGet.init(obj, _tag);	// call appProductGet.init on the product id with the callback and callback location
					}
				
				//execute calls
				_app.model.dispatchThis('mutable');				// execute: mutable = as soon as convinient, immutable = now or else, passive = whenevs 
				},
			
			getTagsElastic : function () {
				var prods = [];
				$('.searchResultsProduct').each(function() {
					if($(this).data() && $(this).data("pid")) {
						//_app.u.dump('--> searchResultsProduct');  _app.u.dump($(this).data("pid")); 
						prods.push($(this).data("pid")); //put product info into array for processing later
					}
				});
				
				for(var i=0; i<prods.length; i++) {
					var obj = {
						"pid" : prods[i]
					};
					console.debug(obj);
					var _tag = {
						"callback":"renderTagsElastic",
						"extension":"beachmart_dropdown"
					};
					_app.calls.appProductGet.init(obj, _tag);
				}
				
				_app.model.dispatchThis('mutable');
				
			},
			
			showDropdownImages : function() {
//				_app.u.dump('showing Dropdown Images');
				$(".stockImageContainer[data-navcat]").each(function(){
					var navcat = $(this).attr('data-navcat');
//					_app.u.dump(navcat);
					$(this).removeClass('loadingBG').append(_app.ext.beachmart_dropdown.u.makeDropdownImage(_app.ext.beachmart_dropdown.vars.dropdownImages[navcat],210,210,"ffffff"));
				})
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
	//
	//			showContent('product',{'pid':$(this).data('pid')});
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