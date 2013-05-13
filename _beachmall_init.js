var app = app || {vars:{},u:{}}; //make sure app exists.
app.rq = app.rq || []; //ensure array is defined. rq = resource queue.



app.rq.push(['extension',0,'orderCreate','extensions/checkout/extension.js']);
app.rq.push(['extension',0,'cco','extensions/cart_checkout_order.js']);


app.rq.push(['extension',0,'store_prodlist','extensions/store_prodlist.js']);
app.rq.push(['extension',0,'store_navcats','extensions/store_navcats.js']);
app.rq.push(['extension',0,'store_search','extensions/store_search.js']);
app.rq.push(['extension',0,'store_product','extensions/store_product.js']);
app.rq.push(['extension',0,'store_cart','extensions/store_cart.js']);
app.rq.push(['extension',0,'store_crm','extensions/store_crm.js']);
app.rq.push(['extension',0,'myRIA','app-quickstart.js','startMyProgram']);
app.rq.push(['extension',0,'beachmart','extensions/beachmart_custom.js']); // custom product page, built by JT based on old hybrid site
app.rq.push(['extension',0,'store_filter','extensions/beachmart.js']); 
app.rq.push(['extension',0,'beachmart_dropdown','extensions/beachmart_dropdown.js', 'startExtension']); // custom product getter for dropdowns Runs startExtension as well
app.rq.push(['extension',0,'beachmart_catsearch','extensions/beachmart_catsearch.js', 'startExtension']); // custom search of designated category and tag

//app.rq.push(['extension',1,'google_analytics','extensions/partner_google_analytics.js','startExtension']);
app.rq.push(['extension',0,'partner_addthis','extensions/partner_addthis.js','startExtension']);
//app.rq.push(['extension',1,'resellerratings_survey','extensions/partner_buysafe_guarantee.js','startExtension']); /// !!! needs testing.
//app.rq.push(['extension',1,'buysafe_guarantee','extensions/partner_buysafe_guarantee.js','startExtension']);

app.rq.push(['extension',0,'powerReviews_reviews','extensions/partner_powerreviews_reviews.js','startExtension']);
app.rq.push(['extension',0,'magicToolBox_mzp','extensions/partner_magictoolbox_mzp.js','startExtension']); // (not working yet - ticket in to MTB)

// ** moved here from extension to make sure it gets loaded early enough.
app.rq.push(['script',0,'http://cdn.powerreviews.com/repos/11531/pr/pwr/engine/js/full.js']);

app.rq.push(['script',0,(document.location.protocol == 'file:') ? app.vars.testURL+'jquery/config.js' : app.vars.baseURL+'jquery/config.js']); //The config.js is dynamically generated.
app.rq.push(['script',0,app.vars.baseURL+'model.js']); //'validator':function(){return (typeof zoovyModel == 'function') ? true : false;}}
app.rq.push(['script',0,app.vars.baseURL+'includes.js']); //','validator':function(){return (typeof handlePogs == 'function') ? true : false;}})

app.rq.push(['script',0,app.vars.baseURL+'controller.js']);


app.rq.push(['script',1,app.vars.baseURL+'resources/jquery.ui.jeditable.js']); //used for making text editable (customer address). non-essential. loaded late.
app.rq.push(['script',0,app.vars.baseURL+'resources/jquery.showloading-v1.0.jt.js']); //used for making text editable (customer address). non-essential. loaded late.
app.rq.push(['script',0,app.vars.baseURL+'resources/jquery.ui.anyplugins.js']); //in zero pass because it contains essential functions (anymessage & anycontent)

app.rq.push(['script',1,app.vars.baseURL+'resources/jquery.touchSwipe-1.3.3.min.js']); //used w/ carouFedSel.
app.rq.push(['script',1,app.vars.baseURL+'resources/jquery.carouFredSel-6.2.0.min.js']); //used on homepage.
app.rq.push(['script',1,app.vars.baseURL+'resources/jquery.jcarousellite.js']); //used on product pages.




// get the estimate arrival code running. works passively.
app.rq.push(['templateFunction','productTemplate','onCompletes',function(P) {
	app.ext.beachmart.u.initEstArrival(P);
	}]);

//add previously viwed items to the div 'recentlyViewedItemsContainer' if present
app.rq.push(['templateFunction','productTemplate','onDeparts',function(P) {
	var $container = $('#recentlyViewedItemsContainer');
	$container.show();
	$("ul",$container).empty(); //empty product list
	$container.anycontent({data:app.ext.myRIA.vars.session}); //build product list
	}]);

//add previously viwed items to the div 'recentlyViewedItemsContainer' if present
/*app.rq.push(['templateFunction','categoryTemplateBrands','onCompletes',function(P) {
	app.u.dump("prodTemplate on depart");	
	var $context = $(app.u.jqSelector('#',P.parentID));
	var $container = $('.recentContainer', $context);
	$container.show();
	$('ul',$container).empty();
	$container.anycontent({data:app.ext.myRIA.vars.session}); //build product list
	}]);  */

//adds tabs to image/video IF video is set.
app.rq.push(['templateFunction','productTemplate','onCompletes',function(P) {
	app.u.dump("BEGIN templateFunction for images/video tabs");
	if(app.data[P.datapointer] &&  app.data[P.datapointer]['%attribs'])	{
		if(app.data[P.datapointer]['%attribs']['youtube:videoid'])	{
		var $prodPage = $(app.u.jqSelector('#',P.parentID)),
		$tabContainer = $(".imageAndVideoTabs",$prodPage);
			$tabContainer.show();
			if($tabContainer.data("widget") == 'anytabs'){} //tabs have already been instantiated. no need to be redundant.
			else	{
				$tabContainer.anytabs();
				}
			}
		else	{
			app.u.dump("youtube:videoid NOT set. no video.");
			}
		}
	else	{
		//video ID not set for this product.
		app.u.dump("Issue w/ the product data. can't reach attribs.");
		}
	}]);





//add tabs to product lists.
app.rq.push(['templateFunction','productTemplate','onCompletes',function(P) {
	var $tabContainer = $("[data-app-role='xsellTabContainer']",$(app.u.jqSelector('#',P.parentID)));
	if($tabContainer.length)	{
		if($tabContainer.data("widget") == 'anytabs'){} //tabs have already been instantiated. no need to be redundant.
		else	{
			$tabContainer.anytabs();
			}
		}
	else	{
		app.u.dump("WARNING! could not find selector for xsell items");
		} //couldn't find the tab to tabificate.
	}]);



//add tabs to product data.
app.rq.push(['templateFunction','productTemplate','onCompletes',function(P) {
	var $tabContainer = $( ".tabbedProductContent",$(app.u.jqSelector('#',P.parentID)));
	if($tabContainer.length)	{
		if($tabContainer.data("widget") == 'anytabs'){} //tabs have already been instantiated. no need to be redundant.
		else	{
			$tabContainer.anytabs();
			}
		}
	else	{} //couldn't find the tab to tabificate.
	}]);



//add tabs to product data.
app.rq.push(['templateFunction','categoryTemplateBrands','onCompletes',function(P) {
	var $tabContainer = $( ".brandsTabs",$(app.u.jqSelector('#',P.parentID)));
	if($tabContainer.length)	{
		if($tabContainer.data("widget") == 'anytabs'){} //tabs have already been instantiated. no need to be redundant.
		else	{
			$tabContainer.anytabs();
			}
		}
	else	{} //couldn't find the tab to tabificate.
	}]);


//Filter Search:
//sample of an onDeparts. executed any time a user leaves this page/template type.
app.rq.push(['templateFunction','categoryTemplate','onCompletes',function(P) {
	
	//context for reset button to reload page
	var $context = $(app.u.jqSelector('#',P.parentID)); 
	
	app.u.dump("BEGIN categoryTemplate onCompletes for filtering");
	if(app.ext.store_filter.filterMap[P.navcat])	{
		app.u.dump(" -> safe id DOES have a filter.");

		var $page = $(app.u.jqSelector('#',P.parentID));
		app.u.dump(" -> $page.length: "+$page.length);
		if($page.data('filterAdded'))	{app.u.dump("filter exists skipping form add");} //filter is already added, don't add again.
		else	{
			$page.data('filterAdded',true)
			var $form = $("[name='"+app.ext.store_filter.filterMap[P.navcat].filter+"']",'#appFilters').clone().appendTo($('.filterContainer',$page));
			$form.on('submit.filterSearch',function(event){
				event.preventDefault()
				app.u.dump(" -> Filter form submitted.");
				app.ext.store_filter.a.execFilter($form,$page);
				});

			if(typeof app.ext.store_filter.filterMap[P.navcat].exec == 'function')	{
				app.ext.store_filter.filterMap[P.navcat].exec($form,P)
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
  			showContent('category',{'navcat':P.navcat});
  		});

	}]);
	
	
//Display Recently viewed items
app.rq.push(['templateFunction','productTemplate','onDeparts',function(P) {
	var $container = $('#recentlyViewedItemsContainer');
	$container.show();
	$("ul",$container).empty(); //empty product list
	$container.anycontent({data:app.ext.myRIA.vars.session}); //build product list
}]);






/*

//puts thumbnails into carousel IF there are more than 5
app.rq.push(['templateFunction','productTemplate','onCompletes',function(P) {
	var $prodPage = $(app.u.jqSelector('#','productTemplate_'+app.u.makeSafeHTMLId(P.pid))),
	$imageUL = $( ".prodPageImageThumbs ul",$prodPage);
app.u.dump("$imageUL.children().length: "+$imageUL.children().length)	
	if($imageUL.data('isCarousel'))	{} //already a carousel. Do nothing.
	else if($imageUL.children().length > 5)	{
		$imageUL.data('isCarousel',true);
		var guid = app.u.guidGenerator();
		$('.carouselButtonPrev',$prodPage).attr('id','carouselButtonPrev_'+guid);
		$('.carouselButtonNext',$prodPage).attr('id','carouselButtonNext_'+guid);

//for whatever reason, caroufredsel needs to be executed after a moment.
	setTimeout(function(){
		$imageUL.carouFredSel({
			auto: false,
			prev: '#carouselButtonPrev_'+guid,
			next: '#carouselButtonNext_'+guid,
			width: '100%',
			scroll: 2,
	//		mousewheel: true, //this is mobile, so mousewheel isn't necessary (plugin is not loaded)
			swipe: {
				onMouse: true,
				onTouch: true
				}
			});
		},1000); 

		}
	else	{
		$('.carouselButtonPrev',$prodPage).hide();
		$('.carouselButtonNext',$prodPage).hide();		
		} //doesn't need to be a carousel
	}]);

*/


//make sure big rootcat thumbs are hidden. restore rollover location to below instead of over.
app.rq.push(['templateFunction','homepageTemplate','onDeparts',function(P) {
	$('#tier1categories .rootCatThumb').slideUp('slow');
	$('#tier1categories .catMenu').removeAttr('style'); /* revert rollover positioning to default */
	}]);

//make sure big thumbs for root categories are visible. adjust rollover location to position over big thumbs.
app.rq.push(['templateFunction','homepageTemplate','onCompletes',function(P) {
	$('#tier1categories .rootCatThumb').slideDown('slow');
	$('#tier1categories .catMenu').css('bottom','35px'); /* adjust rollover positioning to appear over category images */
	}]);









//group any third party files together (regardless of pass) to make troubleshooting easier.
app.rq.push(['script',0,(document.location.protocol == 'https:' ? 'https:' : 'http:')+'//ajax.googleapis.com/ajax/libs/jqueryui/1.10.1/jquery-ui.min.js']);


/*
This function is overwritten once the controller is instantiated. 
Having a placeholder allows us to always reference the same messaging function, but not impede load time with a bulky error function.
*/
app.u.throwMessage = function(m)	{
	alert(m); 
	}

app.u.howManyPassZeroResourcesAreLoaded = function(debug)	{
	var L = app.vars.rq.length;
	var r = 0; //what is returned. total # of scripts that have finished loading.
	for(var i = 0; i < L; i++)	{
		if(app.vars.rq[i][app.vars.rq[i].length - 1] === true)	{
			r++;
			}
		if(debug)	{app.u.dump(" -> "+i+": "+app.vars.rq[i][2]+": "+app.vars.rq[i][app.vars.rq[i].length -1]);}
		}
	return r;
	}


//gets executed once controller.js is loaded.
//check dependencies and make sure all other .js files are done, then init controller.
//function will get re-executed if not all the scripts in app.vars.scripts pass 1 are done loading.
//the 'attempts' var is incremented each time the function is executed.

app.u.initMVC = function(attempts){
	app.u.dump("app.u.initMVC activated ["+attempts+"]");
	var includesAreDone = true;

//what percentage of completion a single include represents (if 10 includes, each is 10%).
	var percentPerInclude = (100 / app.vars.rq.length);  
	var resourcesLoaded = app.u.howManyPassZeroResourcesAreLoaded();
	var percentComplete = Math.round(resourcesLoaded * percentPerInclude); //used to sum how many includes have successfully loaded.
	//make sure precentage is never over 100
	if(percentComplete > 100 )	{
		percentComplete = 100;
		}

	$('#appPreViewProgressBar','#appPreView').val(percentComplete);
	//$('#appPreViewProgressBar','#appPreView').css('width',percentComplete+'%'); Beachmall
	$('#appPreViewProgressText','#appPreView').empty().append(percentComplete+"% Complete");

	if(resourcesLoaded == app.vars.rq.length)	{
		var clickToLoad = false;
		if(clickToLoad){
			$('#loader').fadeOut(1000);
			$('#clickToLoad').delay(1000).fadeIn(1000).click(function() {
				app.u.loadApp();
			});
		} else {
			app.u.loadApp();
			}
		}
	else if(attempts > 50)	{
		app.u.dump("WARNING! something went wrong in init.js");
		//this is 10 seconds of trying. something isn't going well.
		$('#appPreView').empty().append("<h2>Uh Oh. Something seems to have gone wrong. </h2><p>Several attempts were made to load the store but some necessary files were not found or could not load. We apologize for the inconvenience. Please try 'refresh' and see if that helps.<br><b>If the error persists, please contact the site administrator</b><br> - dev: see console.</p>");
		app.u.howManyPassZeroResourcesAreLoaded(true);
		}
	else	{
		setTimeout("app.u.initMVC("+(attempts+1)+")",250);
		}

	}

app.u.loadApp = function() {
//instantiate controller. handles all logic and communication between model and view.
//passing in app will extend app so all previously declared functions will exist in addition to all the built in functions.
//tmp is a throw away variable. app is what should be used as is referenced within the mvc.
	app.vars.rq = null; //to get here, all these resources have been loaded. nuke record to keep DOM clean and avoid any duplication.
	var tmp = new zController(app);
//instantiate wiki parser.
	myCreole = new Parse.Simple.Creole();
	}


//Any code that needs to be executed after the app init has occured can go here.
//will pass in the page info object. (pageType, templateID, pid/navcat/show and more)
app.u.appInitComplete = function(P)	{
	app.u.dump("Executing myAppIsLoaded code...");
	}




//don't execute script till both jquery AND the dom are ready.
$(document).ready(function(){
	app.u.handleRQ(0)
	});






