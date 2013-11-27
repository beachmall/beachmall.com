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


var store_filter = function() {
	var r = {

	vars : {
		'templates' : []
		},

					////////////////////////////////////   CALLS    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\		


//store_search contains the maintained elastic query search. use that.
	calls : {}, //calls
//key is safe id. value is name of the filter form.
	filterMap : {

		".beach-umbrellas-shelter.beach-umbrella":{
			"filter": "UmbrellasForm",
			"exec" : function($form,infoObj){app.ext.store_filter.u.renderSlider($form, infoObj, {MIN:0,MAX:500});}
		},
		".beach-umbrellas-shelter.patio-umbrella":{
			"filter": "UmbrellasForm",
			"exec" : function($form,infoObj){app.ext.store_filter.u.renderSlider($form, infoObj, {MIN:0,MAX:500});}
		},
/* ACCESSORIES FORMS */
		".beach-accessories.beach-bags-totes":{
			"filter": "AccessoriesForm",
			"exec" : function($form,infoObj){app.ext.store_filter.u.renderSlider($form, infoObj, {MIN:0,MAX:500});}
		},	
		".beach-accessories.picnic-backpack":{
			"filter": "AccessoriesForm",
			"exec" : function($form,infoObj){app.ext.store_filter.u.renderSlider($form, infoObj, {MIN:0,MAX:500});}
		},	
		".beach-accessories.picnic-baskets":{
			"filter": "AccessoriesForm",
			"exec" : function($form,infoObj){app.ext.store_filter.u.renderSlider($form, infoObj, {MIN:0,MAX:500});}
		}, 
/* BEACH CHAIR FORMS */
		".beach-chair.beach-chairs":{
			"filter": "BeachChairsForm",
			"exec" : function($form,infoObj){app.ext.store_filter.u.renderSlider($form, infoObj, {MIN:0,MAX:500});}
		},
		".beach-chair.canopy-beach-chair":{
			"filter": "BeachChairsForm",
			"exec" : function($form,infoObj){app.ext.store_filter.u.renderSlider($form, infoObj, {MIN:0,MAX:500});}
		},
		".beach-chair.folding-beach-chairs":{
			"filter": "BeachChairsForm",
			"exec" : function($form,infoObj){app.ext.store_filter.u.renderSlider($form, infoObj, {MIN:0,MAX:500});}
		},
		".beach-chair.heavy-beach-chairs":{
			"filter": "BeachChairsForm",
			"exec" : function($form,infoObj){app.ext.store_filter.u.renderSlider($form, infoObj, {MIN:0,MAX:500});}
		},
		".beach-chair.high-beach-chair":{
			"filter": "BeachChairsForm",
			"exec" : function($form,infoObj){app.ext.store_filter.u.renderSlider($form, infoObj, {MIN:0,MAX:500});}
		},
		".beach-chair.sand-chair":{
			"filter": "BeachChairsForm",
			"exec" : function($form,infoObj){app.ext.store_filter.u.renderSlider($form, infoObj, {MIN:0,MAX:500});}
		},
		".beach-chair.sand-chairs":{
			"filter": "BeachChairsForm",
			"exec" : function($form,infoObj){app.ext.store_filter.u.renderSlider($form, infoObj, {MIN:0,MAX:500});}
		},
		".beach-chair.wooden-beach-chairs":{
			"filter": "BeachChairsForm",
			"exec" : function($form,infoObj){app.ext.store_filter.u.renderSlider($form, infoObj, {MIN:0,MAX:500});}
		},
/* WOMENS COVER UP FORM */
		".beachwear.swimwear-women.cover-ups":{
			"filter": "WomensCoverUpsForm",
			"exec" : function($form,infoObj){app.ext.store_filter.u.renderSlider($form, infoObj, {MIN:0,MAX:500});}
		},
/* WOMENS SWIMWEAR FORMS */
		".beachwear.swimwear-women.bathing-suits":{
			"filter": "WomensSwimwearForm",
			"exec" : function($form,infoObj){app.ext.store_filter.u.renderSlider($form, infoObj, {MIN:0,MAX:500});}
		},
		".beachwear.swimwear-women.bikini-two-piece":{
			"filter": "WomensSwimwearForm",
			"exec" : function($form,infoObj){app.ext.store_filter.u.renderSlider($form, infoObj, {MIN:0,MAX:500});}
		},
		".beachwear.swimwear-women.monokinis-tankinis":{
			"filter": "WomensSwimwearForm",
			"exec" : function($form,infoObj){app.ext.store_filter.u.renderSlider($form, infoObj, {MIN:0,MAX:500});}
		},
		".beachwear.swimwear-women.one-piece-swimsuits":{
			"filter": "WomensSwimwearForm",
			"exec" : function($form,infoObj){app.ext.store_filter.u.renderSlider($form, infoObj, {MIN:0,MAX:500});}
		},
		".beachwear.swimwear-women.plus-size-swimsuits":{
			"filter": "WomensSwimwearForm",
			"exec" : function($form,infoObj){app.ext.store_filter.u.renderSlider($form, infoObj, {MIN:0,MAX:500});}
		}

	},

					////////////////////////////////////   CALLBACKS    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\



	callbacks : {
//callbacks.init need to return either a true or a false, depending on whether or not the file will execute properly based on store account configuration. Use this for any config or dependencies that need to occur.
//the callback is auto-executed as part of the extensions loading process.
		init : {
			onSuccess : function()	{
			
				app.ext.store_filter.u.bindOnclick();
			
				app.ext.store_filter.u.runCarousels();
				
				//app.rq.push(['script',0,'http://path.to.script.js/', function(){
					//This function is called when the script has finished loading
					//for provide support- add stuff to the DOM here
				//	}]);
				
			//	app.rq.push(['templateFunction','homepageTemplate','onCompletes',function(infoObj) {
					//app.ext.store_filter.u.runPhoneChatLive();
				
					//var $context = $(app.u.jqSelector('#'+infoObj.parentID));
					//app.ext.store_filter.u.hidePreviouslyViewed($context);
			//	}]);
				
				app.rq.push(['templateFunction','productTemplate','onCompletes',function(infoObj) {
					var $context = $(app.u.jqSelector('#'+infoObj.parentID)); //grabs the currently loaded product page (to ignore previously loaded / invisible ones)
					app.ext.store_filter.u.runProductCarousel($context);
					app.ext.store_filter.u.runProductVerticalCarousel($context);
					app.ext.store_filter.u.runProductVerticalCarousel2($context);
					app.ext.store_filter.u.runProductRecentCarousel($context);
					//app.u.dump('Product fredsel ran');
					app.ext.store_filter.u.handleToolTip();
					app.ext.store_filter.u.showRecentlyViewedItems($context);
				}]);
				
				app.rq.push(['templateFunction','productTemplate','onDeparts',function(infoObj) {
					var $context = $(app.u.jqSelector('#'+infoObj.parentID));
					var pid = infoObj.pid;
					app.ext.store_filter.u.addRecentlyViewedItems($context, pid);
				}]);
				
				app.rq.push(['templateFunction','cartTemplate','onCompletes',function(infoObj) {
					var $context = $(app.u.jqSelector('#'+infoObj.parentID));
					app.ext.store_filter.u.handleCartToolTip($context);
					app.ext.store_filter.u.execCouponAdd($('.cartCouponButton',$context));
				}]);
				
				//creates tool tip for variations and product sibling thumbnails
				$( document ).tooltip({
					items : "img[data-big-img], [data-toolTipThumb], [data-cartToolTipThumb], [data-toolTipQuickview]",
					position : {
						my : "bottom-5",
						at : "top"
					},
					//track : true,
					content : function(){
						var element = $(this);
						//thumbnail zoom for option thumbnails
						if (element.is("img[data-big-img]")) {
							var pid = $(this).closest('[data-pid]').attr('data-pid');
							var product = app.data['appProductGet|'+pid];
							//app.u.dump('>>>>> '); app.u.dump(product);
							//app.u.dump('>>>>> '); app.u.dump(product['@variations']['1']['options']['0'].prompt);
							return '<div class="toolTipWrapper"><span class="optionsZoom">'+$(this).attr('data-tooltip-title')+'</span><img src="'+$(this).attr('data-big-img')+'" width="400" height="400" /></div>';
							}
						//thumbnail zoom for sibling thumbnails
						if (element.is("[data-toolTipThumb]")) {
							//app.u.dump($(this).closest('[data-pid]').attr('data-pid'));
							var pid = $(this).closest('[data-pid]').attr('data-pid');
							var product = app.data['appProductGet|'+pid];
							if(product && product['%attribs'] && product['%attribs']['zoovy:prod_name']) {
								var prodName = product['%attribs']['zoovy:prod_name'];
								var productImg = app.u.makeImage({"w":400,"h":400,"b":"ffffff",tag:0,"name":product['%attribs']['zoovy:prod_image1']});
								return '<div class="toolTipWrapper"><span class="siblingZoom">'+prodName+'</span><img src="'+productImg+'" width="400" height="400" /></div>';
							}
						}
						//thumbnail zoom for accessory in cart line items
						if (element.is("[data-cartToolTipThumb]")) {
							//app.u.dump($(this).closest('[data-pid]').attr('data-pid'));
							var pid = $(this).closest('[data-pid]').attr('data-pid');
							var product = app.data['appProductGet|'+pid];
							if(product && product['%attribs']) {
								var prodName = product['%attribs']['zoovy:prod_name'] ? product['%attribs']['zoovy:prod_name'] : "";
								var prodPrice = product['%attribs']['zoovy:base_price'] ? product['%attribs']['zoovy:base_price'] : "";
								prodPrice = app.u.formatMoney(prodPrice,'$',2,true);
								var productImg = app.u.makeImage({"w":200,"h":200,"b":"ffffff",tag:0,"name":product['%attribs']['zoovy:prod_image1']});
								return '<div class="cartToolTipWrapper"><span class="cartAccZoom">'+prodName+'</span><span class="cartAccZoom cartAccZoomPrice">'+prodPrice+'</span><img src="'+productImg+'" width="200" height="200" /></div>';
							}
						}
						//thumbnail zoom for thumbs under main prod images in quickview
						if (element.is("[data-toolTipQuickview]")) {
							app.u.dump('&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&'); app.u.dump($(this).closest('[data-toolTipName]').attr('data-toolTipName'));
							var pid = $(this).closest('[data-pid]').attr('data-pid');
							var product = app.data['appProductGet|'+pid];
							var prodName = product['%attribs']['zoovy:prod_name'];
							var imgName = $(this).closest('[data-toolTipName]').attr('data-toolTipName');
							var productImg = app.u.makeImage({"w":400,"h":400,"b":"ffffff",tag:0,"name":imgName});
							return '<div class="toolTipWrapper"><span class="quickviewZoom">'+prodName+'</span><img src="'+productImg+'" width="400" height="400" /></div>';
							}
						}
					});
					
					
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
					if(app.ext.myRIA && app.ext.myRIA.template && app.ext.powerReviews_reviews && handlePogs){
		/*				app.u.dump('*** Power Reviews is Loaded');
						app.rq.push(['templateFunction','homepageTemplate','onDeparts',function(infoObj) {
							var $context = $(app.u.jqSelector('#'+infoObj.parentID));
							app.ext.store_filter.u.noReviews($context);
						}]);
		*/				
						app.u.dump("beachmart Extension Started");
						$.extend(handlePogs.prototype,app.ext.store_filter.variations);
						//app.u.dump('*** Extending Pogs');
		
					} else	{
						setTimeout(function(){app.ext.beachmart.callbacks.startExtension.onSuccess()},250);
					}
				},
				onError : function (){
					app.u.dump('BEGIN app.ext.store_filter.callbacks.startExtension.onError');
				}
			},
			
			
			renderRedirectProduct : {
				onSuccess:function(responseData){	
					app.u.dump(' -> renderRedirectProduct');
					responseData.$container.anycontent({"templateID":responseData.loadsTemplate,"datapointer":responseData.datapointer}); 
				},
				onError:function(responseData){	
					app.u.dump('Error in extension: store_filter renderRedirectProduct');
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
					app.u.dump("WARNING! could not detect .ui-slider class within fieldset for slider filter.");
					}
				return r;
				}, //slider

			hidden : function($fieldset){
				return app.ext.store_filter.u.buildElasticTerms($("input:hidden",$fieldset),$fieldset.attr('data-elastic-key'));
				},
			checkboxes : function($fieldset)	{
				return app.ext.store_filter.u.buildElasticTerms($(':checked',$fieldset),$fieldset.attr('data-elastic-key'));
				} //checkboxes

			}, //getFilterObj




////////////////////////////////////   Actions    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\


		a : {
				
				//Q&A link on product page will populate the order/prod id field on contact form w/ pid
			showContactPID : function (pid) {
				//app.u.dump('the pid is: '); app.u.dump(pid);
				setTimeout(function(){$('#contactFormOID','#mainContentArea_company').val('SKU: '+pid)},1000);
			},
			
				//clears the order/prod id field in contact form to be sure it doesn't still 
				//have showContactPID value still displayed (if form did not get submitted). 
			resetContactPID : function() {
				//app.u.dump('Got Here');
				var $field = $('#contactFormOID','#mainContentArea_company');
				$field.val('');
				//$field.attr('placeholder', 'Order Number (if applicable)');
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
				
			showContentNoPropagation : function(product, pid) {
				app.u.dump('Somthing to Read!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
				showContent(product,pid);
				return false;
			},
		
			execFilter : function($form,$page){

				app.u.dump("BEGIN store_filter.a.filter");
				var $prodlist = $("[data-app-role='productList']",$page).first().empty();


				$('.categoryList',$page).hide(); //hide any subcategory lists in the main area so customer can focus on results
				$('.categoryText',$page).hide(); //hide any text blocks.

				if(app.ext.store_filter.u.validateFilterProperties($form))	{
				//	app.u.dump(" -> validated Filter Properties.")
					var query = {
						"mode":"elastic-native",
						"size":50,
						"filter" : app.ext.store_filter.u.buildElasticFilters($form)
						}//query
				//	app.u.dump(" -> Query: "); app.u.dump(query);
					if(query.filter.and.length > 0)	{
						$prodlist.addClass('loadingBG');
						app.ext.store_search.calls.appPublicProductSearch.init(query,{'callback':function(rd){

							if(app.model.responseHasErrors(rd)){
								$page.anymessage({'message':rd});
								}
							else	{
								var L = app.data[rd.datapointer]['_count'];
								$prodlist.removeClass('loadingBG')
								if(L == 0)	{
									$page.anymessage({"message":"Your query returned zero results."});
									}
								else	{
									$prodlist.append(app.ext.store_search.u.getElasticResultsAsJQObject(rd));
									}
								}

							},'datapointer':'appPublicSearch|elasticFiltering','templateID':'productListTemplateResultsNoPreview'});
						app.model.dispatchThis();
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
		
				//opens e-mail in default mail provider (new window if web-based)
				//if info is available will populate subject and body w/ prod name, mfg, & price
				//if only name, subject will have name, body will be empty. If no content, no subject or body
			bindMailto : function($tag, data){
				app.u.dump('data.value:'); app.u.dump(data.value);
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
	
				//gets list of siblings from product (if present) and puts first two on product list
				//the one that doesn't match the product is set first
			siblingProductList : function($tag,data)	{
//				app.u.dump("BEGIN store_filter.renderFormats.siblingProductList");
//				app.u.dump(" -> data.bindData: "); app.u.dump(data.bindData);
				var pid = app.u.makeSafeHTMLId($tag.parent().attr('data-pid'));
		
				if(app.u.isSet(data.value))	{
						//data is comma separated list, make into array for processing
					var listOfProducts = data.value.split(",");
						//if at least two sib images exist,
						//check if first sib is prod image, if not send as is, if so put second image first
					if(listOfProducts[0] && listOfProducts[1]) {
						if(listOfProducts[0].indexOf(''+pid) < 0) {
							data.bindData.csv = data.value;
						}
						else {  //flip values
							var tmp = listOfProducts[1];
							listOfProducts[1] = listOfProducts[0];
							listOfProducts[0] = tmp;
 							data.bindData.csv = listOfProducts;
						}
						app.ext.store_prodlist.u.buildProductList(data.bindData,$tag);	
					}
					
				}
			}, //siblingProductList	
			
				//gets list of accessories from product (if present) and makes a list of them
			accessoryProductList : function($tag, data) {
				if(data.value.stid && data.value.stid[0] == '%' || data.value.asm_master) {
					return; //promos and assembly items don't get accessories list
				}
				else {
					var pid = app.ext.store_filter.u.pidFromStid(data.value.stid);
					setTimeout(function(){ //time out because appProductGet was coming back undefined
						var prod = app.data['appProductGet|'+pid];
						if(prod && prod['%attribs'] && prod['%attribs']['zoovy:accessory_products']) {
							$('.cartShowAccButton',$tag.parent()).removeClass('displayNone'); //show button to reveal list
							$('.cartItemWrapper','#cartStuffList_'+pid).css('height','200px'); //make line item taller to fit list & button
							data.bindData.csv = prod['%attribs']['zoovy:accessory_products']; //add list to bindData
							app.ext.store_prodlist.u.buildProductList(data.bindData,$tag); //make list
						}
					},1000);
				}
			},

				//looks at siblings added with siblingProductList and hides if not purchasable.
				//adds an attribute used for counting number of purchasable siblings if is purchasable
			hideIfNotPurchaseable : function($tag, data) {
				if(app.ext.store_product.u.productIsPurchaseable(data.value)) {
					$tag.attr('data-purchasable',true);
//					app.u.dump('Product is purchasable....');
					//yay, you get to stay in the list!!
				}
				else {
					$tag.hide();
//					app.u.dump('TAG HIDDEN!!');
				}
			}, //hideIfNotPurchaseable
			
			siblingCount : function($tag, data) {
				var count = 0;
				$('ul.fluidList li',$tag.parent().parent()).each(function(){
					if($(this).attr('data-purchasable')) {
						count += 1;
					}
				});
				
				if(count > 3) {
					$tag.show();
				}
			},
		
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
					app.u.dump('---------->'); app.u.dump(data.value);
					
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
			
					app.u.dump('BEGIN view.formats.money');
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
					if(data.value['%attribs']['zoovy:related_products'] ||
						data.value['%attribs']['zoovy:accessory_products']){
							$tag.show();
						}
					if(data.value['%attribs']['zoovy:accessory_products'] && 
						!data.value['%attribs']['zoovy:related_products']) {
						$('.accTab',$tag).addClass('ui-state-active').addClass('ui-tabs-active');
						setTimeout(function(){
							$('.accAnch','.accTab',$tag).mouseenter();},500);
						app.u.dump('got past trigger');
					}
				},
				
		
				//shows free shipping statement in product list if value is set
				showFreeShippingTag: function($tag, data) {
					//var isShipFree = data.value['%attribs']['zoovy:prod_is_tags'];
					var isShipFree = (data.bindData.isElastic) ? data.value.tags : data.value['%attribs']['zoovy:prod_is_tags'];
					if(isShipFree) {
						if(isShipFree.indexOf('IS_SHIPFREE') >= 0) {
							$tag.show();
						}
					}
				}, //End showFreeShippingTag
				
				//hides ships on/in message on product page if product isn't purchaseable
				hideShipLatency : function($tag, data) {
					var pid = data.value.pid;
//					app.u.dump('***PID'); app.u.dump(pid);
					if(!app.ext.store_product.u.productIsPurchaseable(pid)) {
						$tag.addClass('displayNone');
					}
				},
				
				//shows ships on/in message if data is set, takes into account when the message is displayed
				showShipLatency : function ($tag, data) {
					//app.u.dump('***TEST '); app.u.dump(data.value);
					setTimeout(function(){
							//set the vars needed to determine message
						if($tag.attr('data-cart')) {	//if is for cart prod list
							if((data.value.stid && data.value.stid[0] == '%') || data.value.asm_master) {
								return; //if this is an assembly product in the cart, skip the time in trans altogether
							}
							else if(data.value.product) {
								var prod = app.data['appProductGet|'+app.u.makeSafeHTMLId(data.value.product)];
								//possible for this user:prod_shipping_msg to be present but not set, make it a blank string to prevent undefined. 
								var userProdShipMsg = prod['%attribs']['user:prod_shipping_msg'] ? prod['%attribs']['user:prod_shipping_msg'] : "" ;
								var us1ts = prod['%attribs']['us1:ts'];
							}
								//pass stid so each item can be found in cart later when time in transit info gets added
							var stid = app.u.makeSafeHTMLId($tag.parent().parent().parent().attr('data-stid'));
							app.ext.beachmart_cartEstArrival.u.initEstArrival(prod, stid);
						}
						else {	//else is for not cart prod list
							//possible for this user:prod_shipping_msg to be present but not set, make it a blank string to prevent undefined.
							var userProdShipMsg = data.value['%attribs']['user:prod_shipping_msg'] ? data.value['%attribs']['user:prod_shipping_msg'] : "";
							var us1ts = data.value['%attribs']['us1:ts'];
						}
						var zoovyProdSalesRank = data.value['%attribs']['zoovy:prod_salesrank'];
						var zoovyPreOrder = data.value['%attribs']['zoovy:prod_is_tags'];
						var d = new Date();
						var month = d.getMonth()+1;
						var day = d.getDate();
						var year = d.getFullYear();
						if (month < 10){month = '0'+month};
						if (day < 10){day = '0'+day};
						var date = year + '' + month + '' + day;
						
						//Item is preorder, get back to the future Marty! (when it will be shipped)
						if (zoovyPreOrder && zoovyPreOrder.indexOf('IS_PREORDER') > -1 && ([zoovyProdSalesRank > -1 || zoovyProdSalesRank != undefined] && zoovyProdSalesRank > date) ) {
							//var outputDate =  zoovyProdSalesRank.substring(5,6) + '/' + zoovyProdSalesRank.substring(7,8) + '/' + zoovyProdSalesRank.substring(0,4);
							//app.u.dump('*** '+outputDate);
							$tag.empty().append('Will ship on '+app.ext.beachmart.u.yyyymmdd2Pretty(zoovyProdSalesRank));
						}
						//Not a pre-order, show present-day ship info.
						else if (zoovyProdSalesRank == undefined || zoovyProdSalesRank <= date) {
							//$tag.children('.shipTime').show();
							$tag.children('.shipTime').empty().text(userProdShipMsg).show();
							var n = d.getDay();
							var t = d.getUTCHours();
							if(date < 20131103) {
								t = t - 4;
							}
							else if (date > '20131102' && date < '20140309') {
								t = t - 5;
							}
							else {
								// posibly need further years calculated here
							}
							if(userProdShipMsg) {
								if(userProdShipMsg.indexOf('Ships Today by 12 Noon EST') > -1){
									if ( (t >= 12 && (n > 0 && n < 5)) || date == 20130704 || date == 20130902 || date == 20131225 || date == 20131231 || date == 20140101 || date == 20140526 || date == 20140704) {
										//Time is after noon, day is Mon-Thurs, OR is a UPS holiday weekday
										$tag.empty().append('Ships Next Business Day');
									}
									else if (((t >= 12 && n == 5) || (n > 5 && n < 1)) || date == 20131128 || date == 20131129) {
										//Time is after noon, day is Fri (FUN FUN FUN FUN)
										//OR it is the Weekend, OR is UPS Thanksgiving weekend
										$tag.empty().append('Ships Monday by 12 Noon EST');
									}
									else {
										//It is before noon on a Weekday, shipping message is perfectly fine
									}
								}
							}
							else { //userProdShipMsg is not set, skip it
							}
						}
						else { 
							//do nada*/
						}
					},1000); //setTimeout
				},
				
				//sets a description on the price of a product (usually in a product list)
				prodPriceDesc : function($tag, data) {
					//var priceFrom = (data.bindData.isElastic) ? data.value.tags : data.value['%attribs']['zoovy:prod_is_tags'];
					var priceFrom = data.value['%attribs']['user:prod_has_price_modifiers'];
					//var sale = (data.bindData.isElastic) ? data.value.tags : data.value['%attribs']['zoovy:prod_is_tags'];
					var sale = data.value['%attribs']['is:sale'];
					//var zoovyIsTags = (data.bindData.isElastic) ? data.value.tags : data.value['%attribs']['zoovy:prod_is_tags'];
					var zoovyIsTags = data.value['%attribs']['zoovy:prod_is_tags'];
					
					//app.u.dump('*** zoovyIsTags = '+zoovyIsTags);
					//app.u.dump('***Price Modifier = '+priceFrom);
					if (zoovyIsTags.indexOf('IS_USER3') >= 0) {
						$tag.append('Clearance Price!');
					}
					else if (zoovyIsTags.indexOf('IS_SALE') >= 0) {
						$tag.append('Sale Price!');
					}
					else if (sale != 0) {
						$tag.append('Sale Price!');
					}
					else if(priceFrom == 1) {
						$tag.append('From');
					} 
					else {
						$tag.append('Our Price');
					}
					
				}, //End prodPriceDesc

				//sets the overhang tag and hides discontinued products in a product list.
				showProdModifier : function($tag, data) {
				//	if(data.bindData.isElastic){
				//		app.u.dump(data.value);
				//		}
						
					var zoovyIsTags = (data.bindData.isElastic) ? data.value.tags : data.value['%attribs']['zoovy:prod_is_tags'];
					
					//app.u.dump('*** IS_USER2 = '+newLowPrice);
					if (zoovyIsTags.indexOf('IS_DISCONTINUED') >= 0) {
						$tag.parent().parent().parent().hide();
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
				
				//was intended to hide reviews based on text, but text wasn't accessable at the time, may need to be deleted.
				noReviews : function($context) {
		/*			var $blah = "";
					$blah = $('.reviewsStarsCount', $context);
					app.u.dump('*** '+$blah.text());
					if($blah.text().indexOf() > -1) {
						$blah.hide();
					}
		*/		},
				
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
				//color or siblin variations. It is a temp fix for the display of color option graphics in product lists.
				optionsCount : function($tag, data) {
				//app.u.dump(data.value.length);
					if(data.value.length) {
						$tag.text(data.value.length + ' VARIATIONS AVAILABLE!');
						$tag.show();
					}
				},
				
				//if inventory is 0, don't show in product list (not used w/ elastic because of pagination)
				inventoryHide : function($tag, data) {
					var pid = data.value.pid;
					if(data.value['@inventory'] && data.value['@inventory'][pid]) {
						var inventory = data.value['@inventory'][pid]['inv'];
						if(inventory == 0) {
							$tag.addClass('displayNone');
						}
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
					else if(typeof app.ext.store_filter.getElasticFilter[filterType] != 'function')	{
						r = false;
						$form.anymessage({"message":"WARNING! type ["+filterType+"] has no matching getElasticFilter function. [typoof: "+typeof app.ext.store_filter.getElasticFilter[filterType]+"]",gMessage:true});
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
	filter = app.ext.store_filter.getElasticFilter[$fieldset.attr('data-filtertype')]($fieldset);
	if(filter)	{
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

				},

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
						r.terms[attr].push((attr == pogs) ? $(this).val() : $(this).val().toLowerCase());
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
				
				
					//populates carousel if items in recently viewed list, shows placeholder text if list empty
				showRecentlyViewedItems : function($context) {
					var $container = $('.recentlyViewedItemsContainer', $context);
					
						//if no recently viewed items, tell them the sky is blue
					if(app.ext.myRIA.vars.session.recentlyViewedItems.length == 0) {
		//container hidden by default. show by default and uncomment below to use a message indicating it's empty
				//		$('.recentEmpty',$container).show();
						//app.u.dump('There aint nuthin in there ma!');
					}
						//otherwise, show them what they've seen
					else {
						$container.show();
				//		$('.recentEmpty',$container).hide();
						$('ul',$container).empty(); //empty product list;
						$($container.anycontent({data:app.ext.myRIA.vars.session})); //build product list
						//app.u.dump('SESSION VAR:'); app.u.dump(app.ext.myRIA.vars.session.recentlyViewedItems);
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
					app.rq.push(['templateFunction','homepageTemplate','onCompletes',function(P) {
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
					app.rq.push(['templateFunction','homepageTemplate','onCompletes',function(P) {
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
									auto: {
										pauseOnHover: "immediate"
									},
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
					app.rq.push(['templateFunction','homepageTemplate','onCompletes',function(P) {
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
						//			align: 'left',
									prev: '.productPreviousViewedPrev',
									next: '.productPreviousViewedNext',
									items:{
										height: 468,
										width: 240
									},
									height: 405,
									width: 960,
									//items: 4,
									pagination: '.productPreviousViewedPagenation',
									scroll: 1,
							//		mousewheel: true, //this is mobile, so mousewheel isn't necessary (plugin is not loaded)
									swipe: {
										onMouse: true,
										onTouch: true
									}
								});
							},1000); 
						}
					},//END PRODCUT RECENT CAROUSEL
						
				//PREVIOUSLY VIEWED ITEMS CAROUSEL
/*					app.rq.push(['templateFunction','categoryTemplateBrands','onCompletes',function(P) {
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
						 var P = app.ext.myRIA.u.parseAnchor($this.data('onclick'));
						 return app.ext.myRIA.a.showContent('',P);
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
				}
				
				
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
			
		variations : {
			
			//puts color options on product page as image selectable select list. Also adds jquery tool tip pop up of image for zoom
			renderOptionCUSTOMIMGSELECT: function(pog) {

//				app.u.dump('POG -> '); app.u.dump(pog);
				
				var $parent = $('<div class="optionsParent" />');
				var $select = $("<select class='optionsSelect' name="+pog.id+" />");
				var $hint = $('<div class="zhint">mouse over thumbnail to see larger swatches</div>');
				$parent.append($hint);

				var len = pog.options.length;				
				if(len > 0) {
					optionTxt = (pog['optional'] == 1) ? "" : "Please choose (required)";
					selOption = "<option value='' disabled='disabled' selected='selected'>"+optionTxt+"<\/option>";
					$select.append(selOption);
				}
				
				var $option;
				for (var index in pog.options) {
					var option = pog.options[index];
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
				this.addHandler("type","imgselect","renderOptionCUSTOMIMGSELECT");
				app.u.dump("--- RUNNING XINIT");
			}
			
		} //variations	
			
		} //r object.
	return r;
	}