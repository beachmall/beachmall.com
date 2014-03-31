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
				
				_app.rq.push(['templateFunction','categoryTemplate','onCompletes',function(infoObj) {
					var $context = $(_app.u.jqSelector('#'+infoObj.parentID));
				}]);
				
				_app.rq.push(['templateFunction','searchTemplate','onCompletes',function(infoObj) {
					var $context = $(_app.u.jqSelector('#'+infoObj.parentID));
				}]);
				
				_app.rq.push(['templateFunction','productTemplate','onCompletes',function(infoObj) {
					var $context = $(_app.u.jqSelector('#'+infoObj.parentID)); //grabs the currently loaded product page (to ignore previously loaded / invisible ones)
					_app.ext.store_filter.u.runProductCarousel($context);
					_app.ext.store_filter.u.runProductVerticalCarousel($context);
					_app.ext.store_filter.u.runProductVerticalCarousel2($context);
					_app.ext.store_filter.u.runProductRecentCarousel($context);
					//_app.u.dump('Product fredsel ran');
					_app.ext.store_filter.u.handleToolTip();
					_app.ext.store_filter.u.showRecentlyViewedItems($context,false);
				}]);
				
				_app.rq.push(['templateFunction','productTemplate','onDeparts',function(infoObj) {
					var $context = $(_app.u.jqSelector('#'+infoObj.parentID));
					var pid = infoObj.pid;
					_app.ext.store_filter.u.addRecentlyViewedItems($context, pid);
				}]);
				
				_app.rq.push(['templateFunction','cartTemplate','onCompletes',function(infoObj) {
					var $context = $(_app.u.jqSelector('#'+infoObj.parentID));
					_app.ext.store_filter.u.handleCartToolTip($context);
					_app.ext.store_filter.u.execCouponAdd($('.cartCouponButton',$context));
				}]);
				
				_app.rq.push(['templateFunction','checkoutTemplate','onCompletes',function(infoObj) {
					var $context = $(_app.u.jqSelector('#'+infoObj.parentID));
				}]);
				
				_app.rq.push(['templateFunction','companyTemplate','onCompletes',function(infoObj) {
					var $context = $(_app.u.jqSelector('#'+infoObj.parentID));
					_app.ext.store_filter.u.showRecentlyViewedItems($context,true);
					var $sideline = $('.sideline', $(_app.u.jqSelector('#',infoObj.parentID)));
					if (infoObj.show == 'recent') {
						$('.mainColumn',$context).css({'width':'960px','margin':'0 auto'});
						$sideline.hide();
					}
					else {
						$sideline.show();
						$('.mainColumn',$context).css({'width':'75%','margin':'0'});
					}
				}]);

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
			
			
			renderRedirectProduct : {
				onSuccess:function(responseData){	
					_app.u.dump(' -> renderRedirectProduct');
					responseData.$container.anycontent({"templateID":responseData.loadsTemplate,"datapointer":responseData.datapointer}); 
				},
				onError:function(responseData){	
					_app.u.dump('Error in extension: store_filter renderRedirectProduct');
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
				
				//Q&A link on product page will populate the order/prod id field on contact form w/ pid
			showContactPID : function (pid) {
				//app.u.dump('the pid is: '); app.u.dump(pid);
				setTimeout(function(){$('#contactFormOID','#mainContentArea_company').val('SKU: '+pid)},1000);
			},
		
				//reveals recommended accessories list, hides itself, shows "hide" accessories button
			showCartAcc : function($this) {
				$this.hide().css('opacity','0');
				$('.cartHideAccButton',$this.parent()).animate({'opacity':'1'}).show();
				$('.cartAccList',$this.parent()).animate({'height':'40px'});
			},
			
				//hides recommended accessories list, hides itself, show "reveal" accessories button
			hideCartAcc : function($this) {
				$this.hide().css('opacity','0');
				$('.cartShowAccButton',$this.parent()).animate({'opacity':'1'}).show();
				$('.cartAccList',$this.parent()).animate({'height':'0px'});
			},
			
			execFilter : function($form,$page){

				_app.u.dump("BEGIN store_filter.a.filter");
				var $prodlist = $("[data-app-role='productList']",$page).first().empty();


				$('.categoryList',$page).hide(); //hide any subcategory lists in the main area so customer can focus on results
				$('.categoryText',$page).hide(); //hide any text blocks.

				if(_app.ext.store_filter.u.validateFilterProperties($form))	{
				//	_app.u.dump(" -> validated Filter Properties.")
					var query = {
						"mode":"elastic-native",
						"size":50,
						"filter" : _app.ext.store_filter.u.buildElasticFilters($form)
						}//query
				//	_app.u.dump(" -> Query: "); _app.u.dump(query);
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
			
			scrollToRevealTab : function(pid, href) {
				var $context = $(app.u.jqSelector("#","productTemplate_"+pid));
				var $prodSizing = $(".tabbedProductContent",$context);
				setTimeout(function(){
					$("a[href="+href+"]",$context).mouseenter();
					$('html, body').animate({
						scrollTop: $prodSizing.offset().top
					}, 2000);
				},500);
			},
			
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
				app.u.dump('--> test'); app.u.dump();
				//<div data-bind='useParentData:true; format:testers; extension:store_filter;'></div>
			},
			
				//hides time in transit/geo location section if item is a drop-shipped item
				//time in transit code checks this attrib also, and doesn't run if it's set.
			hideIfDropShip : function($tag, data) {
				if(data.value) {
					$tag.before('<div>Expedited shipping not available for this item</div>');
					$tag.hide().css('display','none');
				}
			},
		
				//opens e-mail in default mail provider (new window if web-based)
				//if info is available will populate subject and body w/ prod name, mfg, & price
				//if only name, subject will have name, body will be empty. If no content, no subject or body
			bindMailto : function($tag, data){
	//			app.u.dump('data.value:'); app.u.dump(data.value);
				if(data.value['%attribs'] && data.value['%attribs']['zoovy:prod_name']) {
					
					var name = data.value['%attribs']['zoovy:prod_name'];
					
						//if all the info is present, add it all to the message
					if(data.value['%attribs']['zoovy:prod_mfg'] && data.value['%attribs']['zoovy:prod_msrp']) {
						var MFG = data.value['%attribs']['zoovy:prod_mfg'];
						var price = data.value['%attribs']['zoovy:prod_msrp'];
						$tag.on("click", function() {
							var eWindow = window.open("mailto:?subject="+name+"%20I%20found%20on%20beachmall.com&body="+name+",%20by%20"+MFG+",%20for%20only%20"+price+"%20"+window.location+""); //+window.location
						
								//window object has an array of content if something loaded in it.
								//the timeout was necessary to access the data to determine whether or not to close.
								//test thoroughly to determine the reliability of this method!!
								
								//the window is set, check if it's filled, and kill it if not
							setTimeout(function(){
								//app.u.dump('WindowObjectReference'); app.u.dump(eWindow.WindowObjectReference); //Security issues? check for later possibility of cleaner implementation 
								if(eWindow[0]) {//app.u.dump('Webmail, window has content don't close');
								}
								else {
									//app.u.dump('Outlook-esq, window has no content'); 
									eWindow.close();
								}
							},5000);
						});
					}
					else {
						$tag.on("click", function() {
							var eWindow = window.open("mailto:?subject="+name+"%20I%20found%20on%20beachmall.com&body=%20"+window.location+"");
							setTimeout(function(){if(eWindow[0]) {} else {eWindow.close();}	},5000);
						});
					}
				}
				else {
					$tag.on("click", function() {
						var eWindow = window.open("mailto:?body="+window.location+"");
						setTimeout(function(){if(eWindow[0]) {} else {eWindow.close();}	},5000);
					});
				}
			}, //bindMailto
		
				//adds product name on cart list item and puts a link on it by 
				//converting stid into pid and doing show content on it.
			cartProdName : function ($tag, data) {
			
					//get the product name and bind data if any show on the line item in the cart
				var o = '';
				if(data.value.prod_name) {
					if(jQuery.isEmptyObject(data.bindData))	{o = data.value.prod_name}
					else	{
						o += data.value.prod_name;
						}
				}
				$tag.html(o);
			
			//	app.u.dump('Who is this is?'); app.u.dump(stid);
				var stid = data.value.stid
				if((stid && stid[0] == '%') || data.value.asm_master)	{
					$tag.css({'text-decoration':'none','cursor':'text'});
				}
				else { //isn't a promo or assembly, add a the link
					if(stid.indexOf(':') != -1) {
						var pid = stid.split(':');
						pid = pid[0];
					}
					else if (stid.indexOf('/') != -1) {
						var pid = stid.split('/');
						pid = pid[0];
					}
					else {
						pid = stid;
					}
					
					$tag.off('click').on('click',function() {
						showContent('product',{'pid':pid});
					});
				}
			}, //showContentSTID
				
				//hide the update button on assembly products, put "(included)" text in it's place
			hideIfASM : function($tag, data) {
				if((data.value.stid && data.value.stid[0] == '%') || data.value.asm_master)	{
					$tag.hide()
					if($tag.attr('data-included') == 1) {
						$tag.after('(included)');
					}
				}
			},
			
				//checks for % at beginning of sku to see if item is a promo, sets css to red if so. 
			redMoney : function($tag, data) {
				if(data.value && data.value[0] == '%') {
					$tag.css('color','#e0463a');
				} else {}
			},

				//gets list of accessories from product (if present) and makes a list of them
			accessoryProductList : function($tag, data) {
				if(data.value.stid && data.value.stid[0] == '%' || data.value.asm_master) {
					return; //promos and assembly items don't get accessories list
				}
				else {
					var pid = app.ext.store_filter.u.pidFromStid(data.value.stid);
					var stid = app.u.makeSafeHTMLId(data.value.stid);
					setTimeout(function(){ //time out because appProductGet was coming back undefined
						var prod = app.data['appProductGet|'+pid];
						if(prod && prod['%attribs'] && prod['%attribs']['zoovy:accessory_products']) {
							$('.cartShowAccButton',$tag.parent()).removeClass('displayNone'); //show button to reveal list
							$('.cartItemWrapper[data-geostid='+stid+']').css('height','200px'); //make line item taller to fit list & button
							data.bindData.csv = prod['%attribs']['zoovy:accessory_products']; //add list to bindData
							app.ext.store_prodlist.u.buildProductList(data.bindData,$tag); //make list
						}
					},1000);
				}
			}, //accessoryProductList

				//hides geo location/time in transit and add to cart button if product is discontinued or not purchasable
				hideGeoElements : function($tag, data) {
					//app.u.dump('*********************'); app.u.dump(data.value.pid); 
					if(data.value['%attribs']['zoovy:prod_is_tags']
						&& data.value['%attribs']['zoovy:prod_is_tags'].indexOf('IS_DISCONTINUED') > 0) {
						$tag.hide();
						if($('.addToCartButton',$tag.parent())) {
							$('.addToCartButton',$tag.parent()).hide();
						}
					}
					else if (!app.ext.store_product.u.productIsPurchaseable(data.value.pid)){
						$tag.hide();	
						if($('.addToCartButton',$tag.parent())) {
							$('.addToCartButton',$tag.parent()).hide();
						}
					}
				},
				
					//Will add a message that current product is discontinued, and provide a link to a replacement
				addRedirectURL : function($tag, data) {
					//app.u.dump('Replacement Product: '); app.u.dump(data.value['%attribs']['user:replacement_product']);
					if(data.value['%attribs']['user:replacement_product']) {
						//$tag.append('THIS PRODUCT IS DISCONTINUED,<br><a class="pointer" title="new product" data-onclick="#!product?pid='+data.value['%attribs']['user:replacement_product']+'">CLICK HERE TO SEE</a><BR>THE NEW VERSION!');
						$tag.append('THIS PRODUCT IS DISCONTINUED,<br><a class="pointer" title="new product" onClick="return showContent(\'product\',{\'pid\':\''+data.value['%attribs']['user:replacement_product']+'\'});">CLICK HERE TO SEE</a><BR>THE NEW VERSION!');
					}																						 onClick="return showContent('product',{'pid':'wridt'});"
				},
				
					//if a product is discontinued, will add minimal info about the replacement and provide a link to it.
				addRedirectProduct : function($tag, data) {
					var obj = {
						pid : app.u.makeSafeHTMLId(data.value),
						"withVariations":1,
						"withInventory":1
					};
					
					var _tag = {								
						"callback":"renderRedirectProduct",		
						"extension":"store_filter",			
						"$container" : $tag,
						"loadsTemplate" : data.bindData.loadsTemplate
					};
					app.calls.appProductGet.init(obj, _tag, 'immutable');
				
					//execute calls
					app.model.dispatchThis('immutable');
				},
				
					//get product inventory and display in tag
				showInv :function($tag, data) {
					var pid = app.u.makeSafeHTMLId(data.value.pid);
					if(data.value['@inventory'] && data.value['@inventory'][pid] && data.value['@inventory'][pid].inv) {
						$tag.text("(" + data.value['@inventory'][pid].inv + ")");
					}
				}, //showInv

				showShipRegion : function($tag, data) {
					//app.u.dump('--------->'); app.u.dump(data.value);
					$tag.append(data.value); 
				},
				
				//Changes header in shipping section based on whether or not a zip code has been entered there
				displayOrShippingText : function($tag) {
					if(app.data.cartDetail && app.data.cartDetail.ship && app.data.cartDetail.ship.postal) {$tag.append('Shipping:');}
					else {$tag.append('Delivery:');}
				},
				
				showShipLatencyCart : function($tag, data) {
					var products = [];
					for(var index in data.value){
						if(data.value[index].product[0] != '%') {
							products.push(data.value[index].product);
						}
					}
					//app.u.dump('---------->'); app.u.dump(data.value);
					
					var numRequests = 0;
					for(var index in products){
						var _tag = {
							'callback':function(rd){
								if(app.model.responseHasErrors(rd)){
									//If an item in your cart gets an error, you're gonna have a bad time...
									app.u.throwMessage(rd);
									}
								else{
								//user:prod_shipping_msg'];
								//var us1ts = data.value['%attribs']['us1:ts'
										//if user:prod_ship_expavail is present and checked (set to 1) expedited shipping is available, show no message.
									if(app.data[rd.datapointer]['%attribs']['user:prod_ship_expavail'] && app.data[rd.datapointer]['%attribs']['user:prod_ship_expavail'] == 1){}
									else {	//the attribute is zero or not set, but either way no expedited shipping is available, show the message
										$tag.text('Expedited shipping not available');
									}
						//			if(app.data[rd.datapointer]['%attribs']['zoovy:base_price'] > 200){
						//				$tag.text('The rent is too damn high!');
						//				}
									}
								}
							};	
						numRequests += app.ext.store_prodlist.calls.appProductGet.init({'pid':products[index]},_tag, 'immutable');
						}
					if(numRequests > 0){app.model.dispatchThis('immutable');}
				},
		
				//Puts message indicating expedited shipping isn't available in cart if applicable to any items there
				expShipMessage : function($tag, data) {
					var products = [];
					for(var index in data.value){
						if(data.value[index].product[0] != '%') {
							products.push(data.value[index].product);
						}
					}
//					app.u.dump('---------->'); app.u.dump(data.value);
					var numRequests = 0;
					for(var index in products){
						var _tag = {
							'callback':function(rd){
								if(app.model.responseHasErrors(rd)){
									//If an item in your cart gets an error, you're gonna have a bad time...
									app.u.throwMessage(rd);
									}
								else{
									if(app.data[rd.datapointer]['%attribs']['user:prod_ship_expavail'] && app.data[rd.datapointer]['%attribs']['user:prod_ship_expavail'] == 1){
										//do nothing, expedited shipping is available.
									}
									else {	//if the attrib isn't set, expedited shipping is not available
										$tag.text('Expedited shipping not available for this order');
											//if one item has no expedited shipping no items have it, hide time in transit
										$tag.parent().attr('groundonall',1);
								/*		$('.shipMessage','#cartTemplateForm').hide();
										$('.estimatedArrivalDate','#cartTemplateForm').hide();
										$('.deliveryLocation','#cartTemplateForm').hide();
										$('.deliveryMethod','#cartTemplateForm').hide();
								*/	}
						//			if(app.data[rd.datapointer]['%attribs']['zoovy:base_price'] > 200){
						//				$tag.text('The rent is too damn high!');
						//				}
									}
								}
							};	
						numRequests += app.ext.store_prodlist.calls.appProductGet.init({'pid':products[index]},_tag, 'immutable');
						//app.u.dump('HERE'); app.u.dump(numRequests);
						}
					if(numRequests > 0){app.model.dispatchThis('immutable');}
				},
				
				//Puts shipping surcharge text (which will have a tool tip on it) in cart if applicable to any items there
				shipSurMessage : function($tag, data) {
					var products = [];
					for(var index in data.value) {
						if(data.value[index].product[0] != '%') {
							products.push(data.value[index].product);
						}
					}
					//app.u.dump(products);
					var numRequests = 0;
					for(var index in products) {
						var _tag = {
							'callback':function(rd) {
								if(app.model.responseHasErrors(rd)) {
									app.u.throwMessage(rd);
								}
								else {
									if(app.data[rd.datapointer]['%attribs']['user:prod_shipping'] && app.data.cartDetail['@SHIPMETHODS'] && app.data.cartDetail['@SHIPMETHODS'][0] && app.data.cartDetail['@SHIPMETHODS'][0].amount) {
										$tag.text('Shipping Surcharge');
										setTimeout(function(){
											$('.orderShipMethod','#modalCartContents')
												.empty()
												.css('position','relative')
												.append("<a class='floatLeft clearfix tipifyCart' href='#'><span class='surcharge'>Surcharge</span> / Shipping: </a>")
												.append("<div class='toolTip2 displayNone'>"
														+	"If the calculated shipping cost is not zero, then shipping surcharge is applied for "
														+	"items and destinations applicable. More details of this charge is stated on the shipping tab of the product page"
													+	"</div>");
											},250);
										setTimeout(function(){$('.orderShipMethod','#modalCartContents').mouseenter(function(){	$('.toolTip2','#modalCartContents').show();}).mouseleave(function(){	$('.toolTip2','#modalCartContents').hide();});},250);
									}
								}
							}
						};
						numRequests += app.ext.store_prodlist.calls.appProductGet.init({'pid':products[index]},_tag,'immutable');
					}
					if(numRequests > 0){app.model.dispatchThis('immutable');}
				},
				
				beachMoney : function($tag,data)	{
			
					app.u.dump('BEGIN view.formats.beachMoney');
					var amount = data.bindData.isElastic ? (data.value / 100) : data.value;
					app.u.dump('amount:'); app.u.dump(amount);
					if(amount)	{
						var r,o,sr;
						r = app.u.formatMoney(amount,data.bindData.currencySign,'',data.bindData.hideZero);
		//					app.u.dump(' -> attempting to use var. value: '+data.value);
		//					app.u.dump(' -> currencySign = "'+data.bindData.currencySign+'"');

		//if the value is greater than .99 AND has a decimal, put the 'change' into a span to allow for styling.
						if(r.indexOf('.') > 0)	{
		//					app.u.dump(' -> r = '+r);
							sr = r.split('.');
							o = sr[0];
							if(sr[1])	{o += '<span class="cents">.'+sr[1]+'<\/span>'}
							$tag.html(o);
							}
						else	{
							$tag.html(r);
							}
						}
					else {$tag.addClass('displayNone');}
				}, //beachMoney

				
				//shows container w/ accessories/similar tabbed content if one of them has values set
				showTabsIfSet : function($tag, data) {
					setTimeout(function(){ //timeout here to allow time for data to get added to dom before this is run
						var attribs = data.value['%attribs'] ? data.value['%attribs'] : false; 
						if(!attribs) return; //if no attribs, run for it Marty!
						var relatedProds = attribs['zoovy:related_products'] ? attribs['zoovy:related_products'] : false;
						var accessoryProds = attribs['zoovy:accessory_products'] ? attribs['zoovy:accessory_products'] : false;
						var L, relatedIsDiscontinued, accessoryIsDiscontinued; //used for length of attrib lists and to hold whether list is discontinued or not
						var listList = [];
						listList.push(relatedProds,accessoryProds);
					//	app.u.dump('--> List of lists'); app.u.dump(listList); 
						
						for(j=0;j<listList.length;j++) {
							if(listList[j]) {
								var count = 0; //used to compare # discontinued items to list lengths
								prodAttribList = listList[j].split(',');
								L = prodAttribList.length;
							
									//check for any empty strings in array. Remove and adjust length if found
								var p = L;
								for(k=0;k<p;k++) {
									if(prodAttribList[k] == "" || prodAttribList[k] == " ") {
										L -= 1;
										prodAttribList.splice(k,1);
									}
								}

									//check for discontinued and adjust count if found
								var tempProd; //used in loop
					//			app.u.dump('--> prodAttribList'+j+'---'); app.u.dump(prodAttribList);
								for(i=0;i<L;i++) {
									tempProd = app.data['appProductGet|'+app.u.makeSafeHTMLId(prodAttribList[i])];
									if(tempProd['%attribs'] && tempProd['%attribs']['zoovy:prod_is_tags']) {
										tempProd['%attribs']['zoovy:prod_is_tags'].indexOf('IS_DISCONTINUED') == -1 ? count = count : count += 1;
									}
								}
								L == count ? listList[j] = false : listList[j] = true; //if length is same as count, all prods in list are not show-able
							}
						}
							//check the findings for each list and set discontinued accordingly
						listList[0] == true ? relatedIsDiscontinued = false : relatedIsDiscontinued = true;
						listList[1] == true ? accessoryIsDiscontinued = false : accessoryIsDiscontinued = true;
						 
			//			app.u.dump('--> Lots to look at'); app.u.dump(relatedProds); app.u.dump(relatedIsDiscontinued); app.u.dump(accessoryProds); app.u.dump(accessoryIsDiscontinued);
					
						if( (relatedProds && !relatedIsDiscontinued) || (accessoryProds && !accessoryIsDiscontinued) ) {
							$tag.show();
						}
						
						if( (accessoryProds && !accessoryIsDiscontinued) && ( (!relatedProds) || (relatedProds && relatedIsDiscontinued) ) ) {
							$('.accTab',$tag).addClass('ui-state-active').addClass('ui-tabs-active');
							setTimeout(function(){
								$('.accAnch','.accTab',$tag).mouseenter();},500);
			//				app.u.dump('got past trigger');
						}
					},1000);	
				},
				
				//hides ships on/in message on product page if product isn't purchaseable
				hideShipLatency : function($tag, data) {
					var pid = data.value.pid;
//					app.u.dump('***PID'); app.u.dump(pid);
					if(!app.ext.store_product.u.productIsPurchaseable(pid)) {
						$tag.addClass('displayNone');
					}
				},
				
				//changes price description based on tag
				priceFrom : function($tag, data) {
					var priceModifier = data.value['%attribs']['user:prod_has_price_modifiers'];
					//app.u.dump('*** '+priceModifier);
					
					if(priceModifier < 1) {
						$tag.append('Our Price: ');
					} else {
						$tag.append('Our Price From: ');
					}
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
				
				productImages : function($tag,data)	{
	//				app.u.dump("BEGIN myRIA.renderFormats.productImages ["+data.value+"]");
					var pdata = app.data['appProductGet|'+data.value]['%attribs']; //short cut to product object in memory.
					var imgs = ''; //all the html for all the images. appended to $tag after loop.
					var imgName; //recycled in loop.
					for(i = 1; i < 30; i += 1)	{
						imgName = pdata['zoovy:prod_image'+i];
	//					app.u.dump(" -> "+i+": "+imgName);
						if(app.u.isSet(imgName)) {
							imgs += "<li><a data-pid="+data.value+" data-toolTipQuickview='data-toolTipQuickview' data-toolTipName='"+imgName+"'class='MagicThumb-swap' rel='zoom-id: prodBigImage_href_"+data.value+"; hint: false;' rev='"+app.u.makeImage({'tag':0,'w':380,'h':380,'name':imgName,'b':'ffffff'})+"' href='"+app.u.makeImage({'tag':0,'w':'','h':'','name':imgName,'b':'ffffff'})+"'><img src='"+app.u.makeImage({'tag':0,'w':50,'h':50,'name':imgName,'b':'ffffff'})+"' \/><\/a><\/li>";
							}
						}
					$tag.append(imgs);
				}, //productImages
				
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

					var $page = $(_app.u.jqSelector('#',infoObj.parentID));
					_app.u.dump(" -> $page.length: "+$page.length);
					if($page.data('filterAdded'))	{_app.u.dump("filter exists skipping form add");} //filter is already added, don't add again.
					else {
						$page.data('filterAdded',true)
						var $form = $("[name='"+_app.ext.store_filter.filterMap[infoObj.navcat].filter+"']",'#appFilters').clone().appendTo($('.filterContainer',$page));
						$form.on('submit.filterSearch',function(event){
							event.preventDefault()
							_app.u.dump(" -> Filter form submitted.");
							_app.ext.store_filter.a.execFilter($form,$page);
								//put a hold on infinite product list and hide loadingBG for it
							$page.find("[data-app-role='productList']").data('filtered',true);
							$page.find("[data-app-role='infiniteProdlistLoadIndicator']").hide();
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
					$context.empty().remove();
					showContent('category',{'navcat':infoObj.navcat});
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
				
				
					//called on depart from prod page to add item to recently viewed items list
					//changed this from quickstart's addition at page load to prevent items from showing in list on first page visit
				addRecentlyViewedItems : function($context, pid) {
						//pid is infoObj.pid passed from onDeparts
					if($.inArray(pid,app.ext.myRIA.vars.session.recentlyViewedItems) < 0)	{
						app.ext.myRIA.vars.session.recentlyViewedItems.unshift(pid);
						$('.numRecentlyViewed','#appView').text(app.ext.myRIA.vars.session.recentlyViewedItems.length);
						}
					else	{
						//the item is already in the list. move it to the front.
						app.ext.myRIA.vars.session.recentlyViewedItems.splice(0, 0, app.ext.myRIA.vars.session.recentlyViewedItems.splice(app.ext.myRIA.vars.session.recentlyViewedItems.indexOf(pid), 1)[0]);
						}
				},//addRecentlyViewedItems
				
				
					//populates carousel if items in recently viewed list, shows place holder text if list empty
					//show = true will show container w/ place holder text if empty. show = false will hide container until not empty
				showRecentlyViewedItems : function($context,show) {
					var $container = $('.recentlyViewedItemsContainer', $context);
					
						//if no recently viewed items && show is set, tell them the sky is blue
					if(app.ext.myRIA.vars.session.recentlyViewedItems.length == 0 && show) {
						$container.show();
						$('.recentEmpty',$container).show(); //contains place holder text
						//app.u.dump('There aint nuthin in there ma!');
						$context.removeClass('loadingBG');
					}
						//if no recent items && show is not set, container is already hidden do nada
					else if (app.ext.myRIA.vars.session.recentlyViewedItems.length == 0 && !show) {}
						//otherwise, show them what they've seen
					else {
						$container.show();
						$('.recentEmpty',$container).hide();
						$('ul',$container).empty(); //empty product list;
						$($container.anycontent({data:app.ext.myRIA.vars.session})); //build product list
						//app.u.dump('SESSION VAR:'); app.u.dump(app.ext.myRIA.vars.session.recentlyViewedItems);
						$context.removeClass('loadingBG');
					}
				},//showRecentlyViewedItems

			//CAROUSEL FUNCTIONS
				runCarousels : function() {
					
					//THIS CAROUSEL MAY BE REMOVED ENTIRELY, WAS REPLACED W/ CHANGEABLE BANNER
					//HOMEPAGE FEATURED PRODUCTS TALL CAROUSEL					
	/*				app.rq.push(['templateFunction','homepageTemplate','onCompletes',function(P) {
						var $target = $('#homeProdSearchNewArrivals');
						if($target.data('isCarousel'))	{} //only make it a carousel once.
						else	{
							$target.data('isCarousel',true);
					//for whatever reason, caroufredsel needs to be executed after a moment.
							setTimeout(function(){
								$target.carouFredSel({
									auto: { 
										/*items			: 6,
										duration		: 5000,
										easing			: "linear",
										timeoutDuration	: 0,*/
	/*									pauseOnHover	: "immediate"
									},
									prev: '.newCarouselPrev',
									next: '.newCarouselNext',
									width: '100%',
									pagination: '#featuredCarouselPagination',
									scroll: 5,
							//		mousewheel: true, //this is mobile, so mousewheel isn't necessary (plugin is not loaded)
									swipe: {
										onMouse: true,
										onTouch: true
										}
									});
								},1000); 
							}
					}]);						*/
						
					//HOMEPAGE FEATURED CAROUSEL	
					_app.rq.push(['templateFunction','homepageTemplate','onCompletes',function(P) {
						var $target = $('#homeProdSearchNewArrivals2');
						if($target.data('isCarousel'))	{} //only make it a carousel once.
						else	{
							$target.data('isCarousel',true);
					//for whatever reason, caroufredsel needs to be executed after a moment.
							setTimeout(function(){
								$target.carouFredSel({
									auto: {
										pauseOnHover: "immediate"
									},
									prev: '.new2CarouselPrev',
									next: '.new2CarouselNext',
									width: '100%',
									scroll: 1,
							//		mousewheel: true, //this is mobile, so mousewheel isn't necessary (plugin is not loaded)
									swipe: {
										onMouse: true,
										onTouch: true
										}
									});
								},1000); 
							}
					}]);
					
					//HOMEPAGE FEATURED PRODUCTS CAROUSEL
					_app.rq.push(['templateFunction','homepageTemplate','onCompletes',function(P) {
						var $target = $('#homeProdSearchFeatured');
						if($target.data('isCarousel'))	{} //only make it a carousel once.
						else	{
							$target.data('isCarousel',true);
					//for whatever reason, caroufredsel needs to be executed after a moment.
							setTimeout(function(){
								$target.carouFredSel({
									items: {
										start: 8,
									},
									auto:false, //{
							//			pauseOnHover: "immediate"
							//		},
									prev: '.featCarouselPrev',
									next: '.featCarouselNext',
									height: 405,
									width: 960,
									pagination: '#featCarPagenation',
									scroll: 4,
							//		mousewheel: true, //this is mobile, so mousewheel isn't necessary (plugin is not loaded)
									swipe: {
										onMouse: true,
										onTouch: true
										}
									});
								},1000); 
							}
					}]);

					//HOMEPAGE BESTSELLERS PRODCUTS CAROUSEL
					_app.rq.push(['templateFunction','homepageTemplate','onCompletes',function(P) {
						var $target = $('#homeProdSearchBestSellers');
						if($target.data('isCarousel'))	{} //only make it a carousel once.
						else	{
							$target.data('isCarousel',true);
					//for whatever reason, caroufredsel needs to be executed after a moment.
							setTimeout(function(){
								$target.carouFredSel({
									auto: {
										pauseOnHover: "immediate"
									},
									prev: '.bestCarouselPrev',
									next: '.bestCarouselNext',
									height: 405,
									width: 960,
									pagination: '#bestCarPagenation',
									scroll: 4,
							//		mousewheel: true, //this is mobile, so mousewheel isn't necessary (plugin is not loaded)
									swipe: {
										onMouse: true,
										onTouch: true
										}
									});
								},1000); 
							}
						}]);
					
				},//END  HOMEPAGE CAROUSEL FUNCTIONS
				
				//PRODUCT CAROUSELS
				runProductCarousel : function($context) {
					//CAROUSEL UNDER MAIN PRODUCT IMAGE
					var $target = $('.prodPageCarousel', $context);
					if($target.data('isCarousel'))	{} //only make it a carousel once.
					else	{
						$target.data('isCarousel',true);
				//for whatever reason, caroufredsel needs to be executed after a moment.
						setTimeout(function(){
							$target.carouFredSel({
								auto: {
									pauseOnHover: "immediate"
								},
								minimum: 1,
								prev: '.prodPageCarPrev',
								next: '.prodPageCarNext',
								height: 70,
								width: 300,
								//items: 4,
								//pagination: '#bestCarPagenation',
								scroll: 4,
						//		mousewheel: true, //this is mobile, so mousewheel isn't necessary (plugin is not loaded)
								swipe: {
									onMouse: true,
									onTouch: true
									}
								});
							},2000); 
						} //end prodPageCarousel
					},
					
					//YOU MAY LIKE THIS VERTICAL CAROUSEL
					runProductVerticalCarousel : function($context) {
						var $target = $('.testUL', $context);
						if($target.data('isCarousel'))	{} //only make it a carousel once.
						else	{
							$target.data('isCarousel',true);
							app.u.dump('*** Carousel is true');
					//for whatever reason, caroufredsel needs to be executed after a moment.
							setTimeout(function(){
								$target.carouFredSel({
									circular: true,
									auto: {
										delay : -1,
										pauseOnHover: "immediate"
									},
									direction: 'down',
									prev: '.testPrev',
									next: '.testNext',
									items:{
										height: 468,
										width: 240
									},
									minimum: 1,
									height: 490,
									width: 250,
									align: 'false',
									scroll:	{
										items: 1,
										duration: 500
									},
							//		mousewheel: true, //this is mobile, so mousewheel isn't necessary (plugin is not loaded)
									swipe: {
										onMouse: true,
										onTouch: true
										}
									});
								},2000); 
							}//END VERTICAL CAROUSEL1 
						},						
						
						//ACCESSORIES VERTICAL CAROUSEL
					runProductVerticalCarousel2 : function($context) {
						var $target = $('.testUL2', $context);
						if($target.data('isCarousel'))	{} //only make it a carousel once.
						else	{
							$target.data('isCarousel',true);
							//app.u.dump('*** Carousel is true');
					//for whatever reason, caroufredsel needs to be executed after a moment.
							setTimeout(function(){
								$target.carouFredSel({
									circular: true,
									auto: {
										delay :-1,
										pauseOnHover: "immediate"
									},
									direction: 'down',
									prev: '.testPrev2',
									next: '.testNext2',
									items:{
										height: 468,
										width: 240
									},
									minimum: 1,
									height: 490,
									width: 250,
									align: 'false',
									scroll: {
										items: 1,
										duration: 500
									},
							//		mousewheel: true, //this is mobile, so mousewheel isn't necessary (plugin is not loaded)
									swipe: {
										onMouse: true,
										onTouch: true
										}
									});
								},2000); 
						}//END VERTICAL CAROUSEL2  
						
					},//END PRODUCT PAGE CAROUSELS
					
					runProductRecentCarousel : function($context) {
						var $target = $('.productPreviousViewed', $context);
						if($target.data('isCarousel'))	{} //only make it a carousel once.
						else	{
							$target.data('isCarousel',true);
							//app.u.dump('*** Carousel is true');
					//for whatever reason, caroufredsel needs to be executed after a moment.
							setTimeout(function(){
								$target.carouFredSel({
						//			circular: true,
									auto: false,
									align: false,
									prev: '.productPreviousViewedPrev',
									next: '.productPreviousViewedNext',
									items:{
										height: 500,
										width: 240
									},
									height: 500,
									width: 960,
									//items: 4,
									pagination: '.productPreviousViewedPagenation',
									scroll: 4,
							//		mousewheel: true, //this is mobile, so mousewheel isn't necessary (plugin is not loaded)
									swipe: {
										onMouse: true,
										onTouch: true
									}
								});
							},2000); 
						}
					},//END PRODCUT RECENT CAROUSEL
						
				//PREVIOUSLY VIEWED ITEMS CAROUSEL
/*					_app.rq.push(['templateFunction','categoryTemplateBrands','onCompletes',function(P) {
						var $target = $('.brandCatsPreviousViewed');
//						if($target.data('isCarousel'))	{} //only make it a carousel once.

						var execCarousel = function(){ setTimeout(function(){
								$target.carouFredSel({
									auto: false,
									prev: '.brandsCatPrevViewedCarouselPrev',
									next: '.brandsCatPrevViewedCarouselNext',
									height: 405,
									width: 'variable',
									items : {
										visible : null
									},
									pagination: '.brandCatsPreviousViewedCarPagenation',
									scroll: 4,
							//		mousewheel: true, //this is mobile, so mousewheel isn't necessary (plugin is not loaded)
									swipe: {
										onMouse: true,
										onTouch: true
										}
									});
								},1000);}

						if($target.children().length === 0)	{} //no kids, do nothing.
						else if($target.data('isCarousel') == true)	{
							$target.carouFredSel('destroy');
							execCarousel();
							}
						else	{
							$target.data('isCarousel',true);
							execCarousel();
							app.u.dump(" -> !!! children: "+$target.children().length);
					//for whatever reason, caroufredsel needs to be executed after a moment.
 
							}
						}]);		*/

	/*			hidePreviouslyViewed : function($context) {
					$('#recentlyViewedItemsContainer').hide();
				},
				
				showPreviouslyViewed : function($context) {
					$('#recentlyViewedItemsContainer').show();
				}*/
				
				//shows tool tip on product page. Uses fade out to allow for click on link in tool tip pop up
				handleToolTip : function()	{
				app.u.dump("BEGIN beachmart.u.handleToolTip.");
					$('.tipify',$('#appView')).each(function(){
						var $this = $(this);
						$this.parent().css('position','relative'); //this is what makes the tooltip appear next to the link instead of off in space.
						$this.mouseover(function(){	$('.toolTip',$this.parent()).show();}).mouseout(function(){	$('.toolTip',$this.parent()).fadeOut(3000);});
						});
				},
					
				//shows tool tip in cart	
				handleCartToolTip : function($context) {	
					$('.tipifyCart', $context).each(function(){
						var $this = $(this);
						$this.parent().css('position','relative'); //this is what makes the tooltip appear next to the link instead of off in space.
						$this.mouseover(function(){	$('.toolTip',$this.parent()).show();}).mouseout(function(){	$('.toolTip',$this.parent()).hide();});
						});
				},
				
				
				//replacement for bindByAnchor href to make crawlable links. Currently used mainly on sitemap
				bindOnclick : function() {
					$('body').off('click', 'a[data-onclick]').on('click', 'a[data-onclick]', function(event){
						 var $this = $(this);
						 var P = _app.ext.quickstart.u.parseAnchor($this.data('onclick'));
						 return _app.ext.quickstart.a.showContent('',P);
					});
				},
				
				execCouponAdd : function($btn)	{
					app.u.dump($btn.text());
					//$btn.button();
					$btn.off('click.app.ext.store_filter.a.execCouponAdd').on('click.app.ext.store_filter.a.execCouponAdd',function(event){
						event.preventDefault();
						
						var $fieldset = $btn.closest('fieldset'),
						$form = $btn.closest('form'),
						$input = $("[name='coupon']",$fieldset);
						
						//$btn.button('disable');
	//update the panel only on a successful add. That way, error messaging is persistent. success messaging gets nuked, but coupon will show in cart so that's okay.
						app.ext.cco.calls.cartCouponAdd.init($input.val(),{"callback":function(rd){

							if(app.model.responseHasErrors(rd)){
								$fieldset.anymessage({'message':rd});
							}
							else	{
								$input.val(''); //reset input only on success.  allows for a typo to be corrected.
								$fieldset.anymessage(app.u.successMsgObject('Your coupon has been added.'));
								//app.ext.orderCreate.u.handlePanel($form,'chkoutCartItemsList',['empty','translate','handleDisplayLogic','handleAppEvents']);
	//							_gaq.push(['_trackEvent','Checkout','User Event','Cart updated - coupon added']);
							}

						}});
						//app.ext.orderCreate.u.handleCommonPanels($form);
						app.ext.store_cart.u.updateCartSummary();
						app.model.dispatchThis('immutable');
					})
				}, //execCouponAdd
				
				pidFromStid : function(stid) {
					if(stid.indexOf(':') != -1) {
						var pid = stid.split(':');
						pid = app.u.makeSafeHTMLId(pid[0]);
					}
					else if (stid.indexOf('/') != -1) {
						var pid = stid.split('/');
						pid = app.u.makeSafeHTMLId(pid[0]);
					}
					else {
						pid = app.u.makeSafeHTMLId(stid);
					}
					return pid;
				},

	/*			showShipRegion : function($context) {
					$('.cartRegion', $context).each(function() {
						var $this = $(this);
						app.u.dump('--------->'); app.u.dump($context);					
					});
				},
	*/			
		//		runPhoneChatLive : function() {
		//			var $container = $('.phoneChatScript','#homepageTemplate_');
		//			//app.u.dump('--------->'); app.u.dump($container);
		//			var $script =  $('<script type="text/javascript">var seyXFh=document.createElement("script"); seyXFh.type="text/javascript"; var seyXFhs=(location.protocol.indexOf("https")==0?"https":"http")+"://image.providesupport.com/js/1qaxuqjnvcj4w1csevb7u0l3tc/safe-textlink.js?ps_h=yXFh&ps_t="+new Date().getTime()+"&online-link-html=Live%20Chat%20Online&offline-link-html=Live%20Chat%20Offline"; setTimeout("seyXFh.src=seyXFhs;document.getElementById("sdyXFh").appendChild(seyXFh)",1);</script>')
		//			$container.append($script);
		//		}
			
			}, //u


//app-events are added to an element through data-app-event="extensionName|functionName"
//right now, these are not fully supported, but they will be going forward. 
//they're used heavily in the admin.html file.
//while no naming convention is stricly forced, 
//when adding an event, be sure to do off('click.appEventName') and then on('click.appEventName') to ensure the same event is not double-added if app events were to get run again over the same template.
		e : {	
			}, //e [app Events]
			
			
////////////////////////////////////   VARIATIONS    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\			
			
		variations : {
		
			renderOptionCUSTOMIMGGRID : function(pog) {
				var pogid = pog.id;
				var $parentDiv = $("<span \/>");
				if(pog['ghint']) {$parentDiv.append(pogs.showHintIcon(pogid,pog['ghint']))}
				
				var $radioInput; //used to create the radio button element.
				var radioLabel; //used to create the radio button label.
				var thumbnail; //guess what this holds
				var thumbnailTag; //tag created manually to add jquery tool tip attribs
				var i = 0;
				var len = pog['@options'].length;
				while (i < len) {
					thumbnail = app.u.makeImage({"w":pog.width,"h":pog.height,"name":pog['@options'][i]['img'],"b":"FFFFFF","lib":app.username});
					thumbnailTag = "<img src='"+thumbnail+"' width='"+pog.width+"' height='"+pog.height+"' name='"+pog['@options'][i]['img']+"' data-grid-img='"+thumbnail+"' data-tooltip-title='"+pog['@options'][i]['prompt']+"'>";
				//	app.u.dump('----thumbnail'); app.u.dump(thumbnail); app.u.dump(thumbnailTag);
					radioLabel = "<label>"+pog['@options'][i]['prompt']+"<\/label>";
					$radioInput = $('<input>').attr({type: "radio", name: pogid, value: pog['@options'][i]['v']});
					$parentDiv.append(thumbnailTag).append($radioInput).append(radioLabel).wrap("<div class='floatLeft'><\/div>");;
					i++
					}
				
				return $parentDiv;
			},
			
			//puts color options on product page as image selectable select list. Also adds jquery tool tip pop up of image for zoom
			renderOptionCUSTOMIMGSELECT: function(pog) {

//				app.u.dump('POG -> '); app.u.dump(pog);
				
				var $parent = $('<div class="optionsParent" />');
				var $select = $("<select class='optionsSelect' name="+pog.id+" />");
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
//					app.u.dump('IMG: '); app.u.dump(option.img);
					$option = $("<option value="+option.v+">"+option.prompt+"</option>");
					$select.append($option);
					var thumbImg = app.u.makeImage({"w":pog.width,"h":pog.height,"name":option.img,"b":"FFFFFF","tag":false,"lib":app.username});
					var bigImg = app.u.makeImage({"w":400,"h":400,"name":option.img,"b":"FFFFFF","tag":false,"lib":app.username});																									//need to try moving these to be appended
					
					var $imgContainer = $('<div class="floatLeft optionImagesCont" data-pogval="'+option.v+'" />');
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
						}
					});
				});

				$parent.append($select);
				return $parent;
			}, // END renderOptionCUSTOMIMGSELECT
			
			xinit : function(){
				this.addHandler("type","imggrid","renderOptionCUSTOMIMGGRID");
				this.addHandler("type","imgselect","renderOptionCUSTOMIMGSELECT");
				app.u.dump("--- RUNNING XINIT");
			}
			
		} //variations	
			
		} //r object.
	return r;
	}