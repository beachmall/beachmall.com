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

/*
An extension for acquiring and displaying 'lists' of categories.
The functions here are designed to work with 'reasonable' size lists of categories.
*/


var store_filter = function(_app) {
	var r = {

	vars : {
		'templates' : []
		},

					////////////////////////////////////   CALLS    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\		


//store_search contains the maintained elastic query search. use that.
	calls : {}, //calls
//key is safe id. value is name of the filter form.
	filterMap : {

/* UMBRELLA FORMS */
		".beach-umbrellas-shelter.beach-umbrella":{
			"filter": "UmbrellasForm",
			"exec" : function($form,infoObj){
				_app.ext.store_filter.u.renderSlider($form, infoObj, {MIN:0,MAX:500});
				_app.ext.store_filter.u.renderHiddenField($form, infoObj);
			}
		},
		".beach-umbrellas-shelter.patio-umbrella":{
			"filter": "UmbrellasForm",
			"exec" : function($form,infoObj){
				_app.ext.store_filter.u.renderSlider($form, infoObj, {MIN:0,MAX:500});
				_app.ext.store_filter.u.renderHiddenField($form, infoObj);
			}
		},
/* ACCESSORIES FORMS */
		".beach-accessories.beach-bags-totes":{
			"filter": "AccessoriesForm",
			"exec" : function($form,infoObj){_app.ext.store_filter.u.renderSlider($form, infoObj, {MIN:0,MAX:500});}
		},	
		".beach-accessories.picnic-backpack":{
			"filter": "AccessoriesForm",
			"exec" : function($form,infoObj){_app.ext.store_filter.u.renderSlider($form, infoObj, {MIN:0,MAX:500});}
		},	
		".beach-accessories.picnic-baskets":{
			"filter": "AccessoriesForm",
			"exec" : function($form,infoObj){_app.ext.store_filter.u.renderSlider($form, infoObj, {MIN:0,MAX:500});}
		}, 
/* BEACH CHAIR FORMS */
		".beach-chair.beach-chairs":{
			"filter": "BeachChairsForm",
			"exec" : function($form,infoObj){_app.ext.store_filter.u.renderSlider($form, infoObj, {MIN:0,MAX:500});}
		},
		".beach-chair.canopy-beach-chair":{
			"filter": "BeachChairsForm",
			"exec" : function($form,infoObj){_app.ext.store_filter.u.renderSlider($form, infoObj, {MIN:0,MAX:500});}
		},
		".beach-chair.folding-beach-chairs":{
			"filter": "BeachChairsForm",
			"exec" : function($form,infoObj){_app.ext.store_filter.u.renderSlider($form, infoObj, {MIN:0,MAX:500});}
		},
		".beach-chair.heavy-beach-chairs":{
			"filter": "BeachChairsForm",
			"exec" : function($form,infoObj){_app.ext.store_filter.u.renderSlider($form, infoObj, {MIN:0,MAX:500});}
		},
		".beach-chair.high-beach-chair":{
			"filter": "BeachChairsForm",
			"exec" : function($form,infoObj){_app.ext.store_filter.u.renderSlider($form, infoObj, {MIN:0,MAX:500});}
		},
		".beach-chair.sand-chair":{
			"filter": "BeachChairsForm",
			"exec" : function($form,infoObj){_app.ext.store_filter.u.renderSlider($form, infoObj, {MIN:0,MAX:500});}
		},
		".beach-chair.sand-chairs":{
			"filter": "BeachChairsForm",
			"exec" : function($form,infoObj){_app.ext.store_filter.u.renderSlider($form, infoObj, {MIN:0,MAX:500});}
		},
		".beach-chair.wooden-beach-chairs":{
			"filter": "BeachChairsForm",
			"exec" : function($form,infoObj){_app.ext.store_filter.u.renderSlider($form, infoObj, {MIN:0,MAX:500});}
		},
/* WOMENS COVER UP FORM */
		".beachwear.swimwear-women.cover-ups":{
			"filter": "WomensCoverUpsForm",
			"exec" : function($form,infoObj){
				_app.ext.store_filter.u.renderSlider($form, infoObj, {MIN:0,MAX:500});
				_app.ext.store_filter.u.renderHiddenField($form, infoObj);
			}
		},
/* WOMENS SWIMWEAR FORMS */
		".beachwear.swimwear-women.bathing-suits":{
			"filter": "WomensSwimwearForm",
			"exec" : function($form,infoObj){_app.ext.store_filter.u.renderSlider($form, infoObj, {MIN:0,MAX:500});}
		},
		".beachwear.swimwear-women.bikini-two-piece":{
			"filter": "WomensSwimwearForm",
			"exec" : function($form,infoObj){_app.ext.store_filter.u.renderSlider($form, infoObj, {MIN:0,MAX:500});}
		},
		".beachwear.swimwear-women.monokinis-tankinis":{
			"filter": "WomensSwimwearForm",
			"exec" : function($form,infoObj){_app.ext.store_filter.u.renderSlider($form, infoObj, {MIN:0,MAX:500});}
		},
		".beachwear.swimwear-women.one-piece-swimsuits":{
			"filter": "WomensSwimwearForm",
			"exec" : function($form,infoObj){_app.ext.store_filter.u.renderSlider($form, infoObj, {MIN:0,MAX:500});}
		},
		".beachwear.swimwear-women.plus-size-swimsuits":{
			"filter": "WomensSwimwearForm",
			"exec" : function($form,infoObj){_app.ext.store_filter.u.renderSlider($form, infoObj, {MIN:0,MAX:500});}
		}

	},

					////////////////////////////////////   CALLBACKS    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\



	callbacks : {
//callbacks.init need to return either a true or a false, depending on whether or not the file will execute properly based on store account configuration. Use this for any config or dependencies that need to occur.
//the callback is auto-executed as part of the extensions loading process.
		init : {
			onSuccess : function()	{

				//_app.rq.push(['script',0,'http://path.to.script.js/', function(){
					//This function is called when the script has finished loading
					//for provide support- add stuff to the DOM here
				//	}]);

		//			for(i = 1; i < 30; i += 1)	{
		//			imgName = pdata['zoovy:prod_image'+i];
//					app.u.dump(" -> "+i+": "+imgName);
		//			if(app.u.isSet(imgName)) {
		//				imgs += "<li><a class='MagicThumb-swap' rel='zoom-id: prodBigImage_href_"+data.value+"; hint: false;' rev='"+app.u.makeImage({'tag':0,'w':380,'h':380,'name':imgName,'b':'ffffff'})+"' href='"+app.u.makeImage({'tag':0,'w':'','h':'','name':imgName,'b':'ffffff'})+"'><img src='"+app.u.makeImage({'tag':0,'w':50,'h':50,'name':imgName,'b':'ffffff'})+"' \/><\/a><\/li>";
		//				}
		//			}
					
					
					
				
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
					if(_app.ext.quickstart && handlePogs){ //used to be check for '_app.ext.quickstart.template' here, find out for sure if not needed anymore. 
			//			_app.u.dump("beachmart Extension Started");
						$.extend(handlePogs.prototype,_app.ext.store_filter.variations);
			//			_app.u.dump('*** Extending Pogs');
						
						_app.templates.categoryTemplate.on('complete.beachmall_store',function(event,$ele,P) {
							_app.ext.store_filter.u.startFilterSearch($ele,P);
						});
		
					} else	{
						setTimeout(function(){_app.ext.store_filter.callbacks.startExtension.onSuccess()},250);
					}
				},
				onError : function (){
					_app.u.dump('BEGIN _app.ext.store_filter.callbacks.startExtension.onError');
				}
			},
			
		}, //callbacks


////////////////////////////////////   getFilterObj    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\


		getElasticFilter : {

			slider : function($fieldset){
				var r = false; //what is returned. Will be set to an object if valid.
				var $slider = $('.slider-range',$fieldset);
				if($slider.length > 0)	{
					r = {"range":{}}
//if data-min and/or data-max are not set, use the sliders min/max value, respectively.
					r.range[$fieldset.attr('data-elastic-key')] = {
						"from" : $slider.slider('values', 0 ) * 100,
						"to" : $slider.slider("values",1) * 100
						}
					}
				else	{
					_app.u.dump("WARNING! could not detect .ui-slider class within fieldset for slider filter.");
					}
				return r;
				}, //slider

			hidden : function($fieldset){
				return _app.ext.store_filter.u.buildElasticTerms($("input:hidden",$fieldset),$fieldset.attr('data-elastic-key'));
				},
			hiddenOr : function($fieldset){
				var r = {"or":[]};
				$("input:hidden",$fieldset).each(function(){
					r.or.push(_app.ext.store_filter.u.buildElasticTerms($(this),$fieldset.attr('data-elastic-key')));
					});
				return r;
				},
			checkboxes : function($fieldset)	{
				return _app.ext.store_filter.u.buildElasticTerms($(':checked',$fieldset),$fieldset.attr('data-elastic-key'));
				} //checkboxes

			}, //getFilterObj




////////////////////////////////////   Actions    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\


		a : {
			
			execFilter : function($form,$page){

				_app.u.dump("BEGIN store_filter.a.execfilter");
				var $prodlist = $("[data-app-role='productList']",$page).first().empty();


				$('.categoryList',$page).hide(); //hide any subcategory lists in the main area so customer can focus on results
				$('.categoryText',$page).hide(); //hide any text blocks.

				if(_app.ext.store_filter.u.validateFilterProperties($form))	{
				//	_app.u.dump(" -> validated Filter Properties.")
					var query = {
						"mode":"elastic-search",
						"size":50,
						"filter" : _app.ext.store_filter.u.buildElasticFilters($form)
						}//query
					_app.u.dump(" -> Query: "); _app.u.dump(query);
					if(query.filter.and.length > 0)	{
						$prodlist.addClass('loadingBG');
						_app.ext.store_search.calls.appPublicProductSearch.init(query,{'callback':function(rd){

							if(_app.model.responseHasErrors(rd)){
								$page.anymessage({'message':rd});
								}
							else	{
								var L = _app.data[rd.datapointer]['_count'];
								$prodlist.removeClass('loadingBG')
								if(L == 0)	{
									$page.anymessage({"message":"Your query returned zero results."});
									}
								else	{
									$prodlist.append(_app.ext.store_search.u.getElasticResultsAsJQObject(rd));
									}
								}

							},'datapointer':'appPublicSearch|elasticFiltering','templateID':'productListTemplateResultsNoPreview'});
						_app.model.dispatchThis();
						}
					else	{
						$page.anymessage({'message':"Please make some selections from the list of filters"});
						}
					}
				else	{
					$page.anymessage({"message":"Uh Oh! It seems an error occured. Please try again or contact the site administator if error persists."});
					}
				$('html, body').animate({scrollTop : 0},200); //new page content loading. scroll to top.


			},//filter

		}, //actions

////////////////////////////////////   RENDERFORMATS    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

//renderFormats are what is used to actually output data.
//on a data-bind, format: is equal to a renderformat. extension: tells the rendering engine where to look for the renderFormat.
//that way, two render formats named the same (but in different extensions) don't overwrite each other.
		renderFormats : {
		
			//pre-checks the entire form before filters are built to indicate whether or not to use OR query 
				//returns true if OR structure is needed, false if not.
			checkElasticForm : function($form) {
			
					//check each fieldset in the form to see if it's elastic key has more than one attribute
				var count = 0;
				$('fieldset',$form).each(function() {
					var $fieldset = $(this);
					var multipleKey = $fieldset.attr('data-elastic-key').split(" ").length;
						//if a multiple elastic key is found increment the count for later examination under oath
//					_app.u.dump('checkElasticForm var multipleKey'); _app.u.dump(multipleKey);					
					if($("input[type='checkbox']",$fieldset).is(":checked") && multipleKey > 1) {
						count++;
					}	
					else if ($("input[type='hidden']",$fieldset) && multipleKey > 1) {
						count++
					}
				});
				
//				_app.u.dump('checkElasticForm var count'); _app.u.dump(count);
					//if the count has been incremented, there is a multiple key and the filter will be constructed accordingly
				if(count != 0) { 
//				_app.u.dump('returned true');
					return true;
				}
				else {
//				_app.u.dump('returned false');
					return false;
				}
			},
		
			testers : function($tag,data) {
				dump('--> test'); dump(data.value);
				//<div data-bind='useParentData:true; format:testers; extension:store_filter;'></div>
			},

				showShipRegion : function($tag, data) {
					//app.u.dump('--------->'); app.u.dump(data.value);
					$tag.append(data.value); 
				},

				//shows a message that an item has the is_colorful tag set, usually in a product list
				moreColors : function($tag, data) {
					var pid = data.value.pid,
						//isColorful = (data.bindData.isElastic) ? data.value.tags : data.value['%attribs']['zoovy:prod_is_tags'];
						isColorful = data.value.tags;
						
						//app.u.dump('*** '+pid);
		//			if (app.ext.store_product.u.productIsPurchaseable(pid) == true) {
						if (isColorful.indexOf('IS_COLORFUL') > -1) {
							$tag.show();
						}
		//			}
				},
				
				//counts the variations on a product if present and displays a button w/ count text on it (button destination set in app)
				//the count currently includes all variations (including layered POGs) and needs to be adjusted to only include 
				//color or sibling variations. It is a temp fix for the display of color option graphics in product lists.
				optionsCount : function($tag, data) {
				//app.u.dump(data.value.length);
					if(data.value.length) {
						$tag.text(data.value.length + ' VARIATIONS AVAILABLE!');
						$tag.show();
					}
				},

				productListThumbnails : function($tag,data)	{
					var pdata = app.data['appProductGet|'+data.value]['%attribs']; //short cut to product object in memory.
					var imgs = ''; //all the html for all the images. appended to <ul> "list" after loop.
					var imgName; //recycled in loop.
					var $list = $('<ul>'); //append to $tag after loop
					var imgCount = 0;
					for(i = 1; i < 5; i += 1)	{
						imgName = pdata['zoovy:prod_image'+i];
	//					app.u.dump(" -> "+i+": "+imgName);
						if(app.u.isSet(imgName)) {
							imgs += "<li class='miniThumbLi'><a data-pid="+data.value+" data-toolTipQuickview='data-toolTipQuickview' data-toolTipName='"+imgName+"'class='' rel='zoom-id: prodBigImage_href_"+data.value+"; hint: false;' rev='"+app.u.makeImage({'tag':0,'w':380,'h':380,'name':imgName,'b':'ffffff'})+"' href='"+app.u.makeImage({'tag':0,'w':'','h':'','name':imgName,'b':'ffffff'})+"'><img src='"+app.u.makeImage({'tag':0,'w':30,'h':30,'name':imgName,'b':'ffffff'})+"' \/><\/a><\/li>";
							imgCount++;
							}
						}
					if(imgCount > 3) {
						imgs += "<li class='miniThumbLi miniThumbText'>SEE MORE!<\/li>";
						$list.append(imgs);
						$tag.append($list);
						$('.reviewsStarsCount', $tag.parent()).hide();
					}
				} //productImages
				
			}, //renderFormats
////////////////////////////////////   UTIL    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\


		u : {
		
			startFilterSearch : function($context,infoObj) {
				_app.u.dump("BEGIN categoryTemplate onCompletes for filtering");
				if(_app.ext.store_filter.filterMap[infoObj.navcat])	{
					_app.u.dump(" -> safe id DOES have a filter.");
dump(infoObj);
		//			var $page = $(_app.u.jqSelector('#',infoObj.parentID));
					_app.u.dump(" -> $context.length: "+$context.length);
					if($context.data('filterAdded'))	{_app.u.dump("filter exists skipping form add");} //filter is already added, don't add again.
					else {
						$context.data('filterAdded',true)
		// TODO : GET FILTERS OUT OF INDEX.HTML AND INTO TEMPLATES.HTML
						var $form = $("[name='"+_app.ext.store_filter.filterMap[infoObj.navcat].filter+"']",'#appFilters').clone().appendTo($('.filterContainer',$context));
						$form.on('submit.filterSearch',function(event){
							event.preventDefault()
							_app.u.dump(" -> Filter form submitted.");
							_app.ext.store_filter.a.execFilter($form,$context);
								//put a hold on infinite product list and hide loadingBG for it
							$context.find("[data-app-role='productList']").data('filtered',true);
							$context.find("[data-app-role='infiniteProdlistLoadIndicator']").hide();
						});

						if(typeof _app.ext.store_filter.filterMap[infoObj.navcat].exec == 'function') {
							_app.ext.store_filter.filterMap[infoObj.navcat].exec($form,infoObj)
						}

						//make all the checkboxes auto-submit the form.
						$(":checkbox",$form).off('click.formSubmit').on('click.formSubmit',function() {
							$form.submit();      
						});
					}
				}
					
				//selector for reset button to reload page
				$('.resetButton', $context).click(function(){
				var path = $("#mainContentArea :visible:first").data('app-uri');
					$("#mainContentArea :visible:first").empty().remove();
					_app.router.handleURIChange(path);
				});
			},
		
			//pass in form as object.  This function will verify that each fieldset has the appropriate attributes.
			//will also verify that each filterType has a getElasticFilter function.
			validateFilterProperties : function($form)	{
				var r = true, //what is returned. false if form doesn't validate.
				$fieldset, filterType; //recycled.

				$('fieldset',$form).each(function(index){
					$fieldset = $(this);
					filterType = $fieldset.attr('data-filtertype');
					if(!filterType)	{
						r = false;
						$form.anymessage({"message":"In store_filters.u.validateFilterProperties,  no data-filtertype set on fieldset. can't include as part of query. [index: "+index+"]",gMessage:true});
						}
					else if(typeof _app.ext.store_filter.getElasticFilter[filterType] != 'function')	{
						r = false;
						$form.anymessage({"message":"WARNING! type ["+filterType+"] has no matching getElasticFilter function. [typoof: "+typeof _app.ext.store_filter.getElasticFilter[filterType]+"]",gMessage:true});
						}
					else if(!$fieldset.attr('data-elastic-key'))	{
						r = false;
						$form.anymessage({"message":"WARNING! data-elastic-key not set for filter. [index: "+index+"]",gMessage:true});
						}
					else	{
						//catch.
						}
					});
				return r;
				},


			buildElasticFilters : function($form)	{

				var filters = {
					"and" : [] //push on to this the values from each fieldset.
				}//query

				$('fieldset',$form).each(function(){
					var $fieldset = $(this),
					filter = _app.ext.store_filter.getElasticFilter[$fieldset.attr('data-filtertype')]($fieldset);
					if(filter) {
						filters.and.push(filter);
					}
				});
				// 20120701 -> do not want discontinued items in the layered search results. JT.
				filters.and.push({"not" : {"term" : {"tags":"IS_DISCONTINUED"}}});
				filters.and.push({"has_child":{"type":"sku","query": {"range":{"available":{"gte":1}}}}});
					
				//and requires at least 2 inputs, so add a match_all.
				//if there are no filters, don't add it. the return is also used to determine if any filters are present
				if(filters.and.length == 1)	{
					filters.and.push({match_all:{}})
				}
				
				return filters;				
			}, //buildElasticFilters

//pass in a jquery object or series of objects for form inputs (ex: $('input:hidden')) and a single term or a terms object will be returned.
//false is returned in nothing is checked/selected.
//can be used on a series of inputs, such as hidden or checkbox 
			buildElasticTerms : function($obj,attr)	{

				var r = false; //what is returned. will be term or terms object if valid.
				if($obj.length == 1)	{
					r = {term:{}};
					r.term[attr] = (attr == 'pogs') ? $obj.val() : $obj.val().toLowerCase(); //pog searching is case sensitive.
					}
				else if($obj.length > 1)	{
					r = {terms:{}};
					r.terms[attr] = new Array();
					$obj.each(function(){
						r.terms[attr].push((attr == 'pogs') ? $(this).val() : $(this).val().toLowerCase());
						});
					}
				else	{
					//nothing is checked.
					}
				return r;
				},


			renderSlider : function($form, infoObj, props){
				$( ".slider-range" ).slider({
					range: true,
					min: props.MIN,
					max: props.MAX,
					values: [ props.MIN, props.MAX ],
					stop : function(){
						$form.submit();
						},
					slide: function( event, ui ) {
						$( ".sliderValue",$form ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
						}
					});
				$( ".sliderValue",$form ).val( "$" + $( ".slider-range" ).slider( "values", 0 ) + " - $" + $( ".slider-range" ).slider( "values", 1 ) );
				}, //renderSlider
				
				//adds hidden field to limit filter results to category filter is in
			renderHiddenField : function($form, infoObj) {
				if(infoObj && infoObj.navcat) {
					_app.u.dump('--> Hidden field navcat'); _app.u.dump(infoObj.navcat);	
					var thisNavCat = infoObj.navcat;
					var $fieldset = "<fieldset data-elastic-key='app_category' data-filtertype='hidden'><input type='hidden' name='app_category' value='"+thisNavCat+"' /></fieldset>";
					$form.append($fieldset);
				}
			},

	
			}, //u


//app-events are added to an element through data-app-event="extensionName|functionName"
//right now, these are not fully supported, but they will be going forward. 
//they're used heavily in the admin.html file.
//while no naming convention is stricly forced, 
//when adding an event, be sure to do off('click.appEventName') and then on('click.appEventName') to ensure the same event is not double-added if app events were to get run again over the same template.
		e : {	
			}, //e [app Events]	
			
		} //r object.
	return r;
	}