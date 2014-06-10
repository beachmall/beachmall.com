
myApp.rq.push(['script',0,(document.location.protocol == 'file:') ? myApp.vars.testURL+'jsonapi/config.js' : myApp.vars.baseURL+'jsonapi/config.js',function(){
//in some cases, such as the zoovy UI, zglobals may not be defined. If that's the case, certain vars, such as jqurl, must be passed in via P in initialize:
//	myApp.u.dump(" ->>>>>>>>>>>>>>>>>>>>>>>>>>>>> zGlobals is an object");
	myApp.vars.username = zGlobals.appSettings.username.toLowerCase(); //used w/ image URL's.
//need to make sure the secureURL ends in a / always. doesn't seem to always come in that way via zGlobals
	myApp.vars.secureURL = zGlobals.appSettings.https_app_url;
	myApp.vars.domain = zGlobals.appSettings.sdomain; //passed in ajax requests.
	myApp.vars.jqurl = (document.location.protocol === 'file:') ? myApp.vars.testURL+'jsonapi/' : '/jsonapi/';
	}]); //The config.js is dynamically generated.
	
myApp.rq.push(['extension',0,'order_create','']);
myApp.rq.push(['extension',0,'cco','']);

myApp.rq.push(['extension',0,'store_routing','', 'attachEventHandlers']);
myApp.rq.push(['extension',0,'store_seo','extensions/store_seo.js', 'attachHandlers']);

myApp.rq.push(['extension',0,'store_prodlist','']);
myApp.rq.push(['extension',0,'prodlist_infinite','']); //removes pagination in product lists and allows population w/ scroll
myApp.rq.push(['extension',0,'store_navcats','']);
myApp.rq.push(['extension',0,'store_search','']);
myApp.rq.push(['extension',0,'store_product','']);
myApp.rq.push(['extension',0,'cart_message','']);
myApp.rq.push(['extension',0,'store_crm','']);
myApp.rq.push(['extension',0,'quickstart','','startMyProgram']);

myApp.rq.push(['extension',0,'seo_robots','']);

//myApp.rq.push(['extension',0,'entomologist','extensions/entomologist/extension.js']);
//myApp.rq.push(['extension',0,'tools_animation','extensions/tools_animation.js']);

myApp.rq.push(['extension',0,'beachmall_store','','startExtension']); 
myApp.rq.push(['extension',0,'beachmart','','startMyProgram']); // custom product page, built by JT based on old hybrid site
myApp.rq.push(['extension',0,'store_filter','','startExtension']); 
myApp.rq.push(['extension',0,'beachmall_search','']); //new place to seperate search features out to. 
myApp.rq.push(['extension',0,'beachmall_carousel','','startExtension']); 
myApp.rq.push(['extension',0,'beachmart_dropdown','', 'startExtension']); // custom product getter for dropdowns Runs startExtension as well
//myApp.rq.push(['extension',0,'beachmart_catsearch','extensions/beachmart_catsearch.js', 'startExtension']); // custom search of designated category and tag
//myApp.rq.push(['extension',0,'beachmart_items_per_page','extensions/beachmart_items_per_page.js', 'startExtension']); // changes number of items displayed in current prodlist
myApp.rq.push(['extension',0,'beachmall_banner','','startExtension']); // add banner to homepage that can be changed in _banners.json file 
myApp.rq.push(['extension',0,'beachmart_dropdown_image','']); // add images to dropdowns that can be changed in _dropdownimages.json file 
myApp.rq.push(['extension',0,'beachmall_cartestarrival','']); //estimates shipping/arrival times for cart items
myApp.rq.push(['extension',0,'beachmall_cartemail','']); //handles sending user an e-mail of cart contents
myApp.rq.push(['extension',0,'beachmall_cart','','startExtension']); //handles sending user an e-mail of cart contents
myApp.rq.push(['extension',0,'beachmart_dates','']); //handles various date based calculations
myApp.rq.push(['extension',0,'store_createaccount','','startExtension']); //handles account creation actions
myApp.rq.push(['extension',0,'beachmall_recentlyviewed','','startExtension']); //handles account creation actions
//myApp.rq.push(['script',0,myApp.vars.baseURL+'resources/jquery.touchSwipe-1.3.3.min.js']); //used w/ carouFedSel.
//myApp.rq.push(['script',0,myApp.vars.baseURL+'resources/jquery.carouFredSel-6.2.0.min.js']); //used for carousels.
myApp.rq.push(['extension',0,'beachmall_tracking','extensions/beachmall_tracking.js','startExtension']); //adds thirdparty tracking to app

myApp.rq.push(['extension',0,'google_analytics','extensions/partner_google_analytics.js','startExtension']);
//myApp.rq.push(['extension',0,'google_adwords','extensions/partner_google_adwords.js','startExtension']); //handled in beachmall_tracking extension
//myApp.rq.push(['extension',1,'tools_ab_testing','extensions/tools_ab_testing.js']);
myApp.rq.push(['extension',0,'partner_addthis','extensions/partner_addthis.js','startExtension']);
//myApp.rq.push(['extension',1,'resellerratings_survey','extensions/partner_buysafe_guarantee.js','startExtension']); /// !!! needs testing.
//myApp.rq.push(['extension',1,'buysafe_guarantee','extensions/partner_buysafe_guarantee.js','startExtension']);
// ** moved here from extension to make sure it gets loaded early enough.
//myApp.rq.push(['script',0,'http://cdn.powerreviews.com/repos/11531/pr/pwr/engine/js/full.js']); old user id "11531"
//myApp.rq.push(['script',0,'http://cdn.powerreviews.com/repos/11024/pr/pwr/engine/js/full.js']);
myApp.rq.push(['extension',0,'powerreviews_reviews','','startExtension']);
myApp.rq.push(['extension',0,'magictoolbox_mzp','','startExtension']); // (not working yet - ticket in to MTB)


//myApp.rq.push(['script',0,myApp.vars.baseURL+'resources/jquery.showloading-v1.0.jt.js']); //used pretty early in process..
//myApp.rq.push(['script',0,myApp.vars.baseURL+'resources/jquery.ui.anyplugins.js']); //in zero pass in case product page is first page.
//myApp.rq.push(['script',0,myApp.vars.baseURL+'resources/tlc.js']); //in zero pass in case product page is first page.
//myApp.rq.push(['css',1,myApp.vars.baseURL+'resources/anyplugins.css']);

//myApp.rq.push(['script',0,myApp.vars.baseURL+'resources/jsonpath.0.8.0.js']); //used pretty early in process..

//once peg is loaded, need to retrieve the grammar file. Order is important there. This will validate the file too.
myApp.u.loadScript(myApp.vars.baseURL+'resources/peg-0.8.0.js',function(){
	myApp.model.getGrammar(myApp.vars.baseURL+"resources/pegjs-grammar-20140203.pegjs");
	}); // ### TODO -> callback on RQ.push wasn't getting executed. investigate.

//Cart Messaging Responses.
myApp.cmr.push(['chat.join',function(message){
//	dump(" -> message: "); dump(message);
	var $ui = myApp.ext.quickstart.a.showBuyerCMUI();
	$("[data-app-role='messageInput']",$ui).show();
	$("[data-app-role='messageHistory']",$ui).append("<p class='chat_join'>"+message.FROM+" has joined the chat.<\/p>");
	$('.show4ActiveChat',$ui).show();
	$('.hide4ActiveChat',$ui).hide();
	}]);

myApp.cmr.push(['goto',function(message,$context){
	var $history = $("[data-app-role='messageHistory']",$context);
	$P = $("<P>")
		.addClass('chat_post')
		.append("<span class='from'>"+message.FROM+"<\/span> has sent over a "+(message.vars.pageType || "")+" link for you within this store. <span class='lookLikeLink'>Click here<\/span> to view.")
		.on('click',function(){
			showContent(myApp.ext.quickstart.u.whatAmIFor(message.vars),message.vars);
			});
	$history.append($P);
	$history.parent().scrollTop($history.height());
	}]);


//gets executed from app-admin.html as part of controller init process.
//progress is an object that will get updated as the resources load.
/*
'passZeroResourcesLength' : [INT],
'passZeroResourcesLoaded' : [INT],
'passZeroTimeout' : null //the timeout instance running within loadResources that updates this object. it will run indef unless clearTimeout run here OR all resources are loaded.

*/
myApp.u.showProgress = function(progress)	{
	function showProgress(attempt)	{
		if(progress.passZeroResourcesLength == progress.passZeroResourcesLoaded)	{
			//All pass zero resources have loaded.
			//the app will handle hiding the loading screen.
			myApp.u.appInitComplete();
			}
		else if(attempt > 150)	{
			//hhhhmmm.... something must have gone wrong.
			clearTimeout(progress.passZeroTimeout); //end the resource loading timeout.
			}
		else	{
			var percentPerInclude = (100 / progress.passZeroResourcesLength);
			var percentComplete = Math.round(progress.passZeroResourcesLength * percentPerInclude); //used to sum how many includes have successfully loaded.
//			dump(" -> percentPerInclude: "+percentPerInclude+" and percentComplete: "+percentComplete);
			$('#appPreViewProgressBar').val(percentComplete);
			$('#appPreViewProgressText').empty().append(percentComplete+"% Complete");
			attempt++;
			setTimeout(function(){showProgress(attempt);},250);
			}
		}
	showProgress(0)
	}


//Any code that needs to be executed after the app init has occured can go here.
//will pass in the page info object. (pageType, templateID, pid/navcat/show and more)
myApp.u.appInitComplete = function()	{
	myApp.u.dump("Executing myAppIsLoaded code...");
	
	myApp.ext.order_create.checkoutCompletes.push(function(vars,$checkout){
		dump(" -> begin checkoutCOmpletes code: "); dump(vars);
		
		var cartContentsAsLinks = myApp.ext.cco.u.cartContentsAsLinks(myApp.data[vars.datapointer].order);
		dump(" -> cartContentsAsLinks: "+cartContentsAsLinks);
		
//append this to 
		$("[data-app-role='thirdPartyContainer']",$checkout).append("<h2>What next?</h2><div class='ocm ocmFacebookComment pointer zlink marginBottom checkoutSprite  '></div><div class='ocm ocmTwitterComment pointer zlink marginBottom checkoutSprit ' ></div><div class='ocm ocmContinue pointer zlink marginBottom checkoutSprite'></div>");
		$('.ocmTwitterComment',$checkout).click(function(){
			window.open('http://twitter.com/home?status='+cartContentsAsLinks,'twitter');
			_gaq.push(['_trackEvent','Checkout','User Event','Tweeted about order']);
			});
		//the fb code only works if an appID is set, so don't show banner if not present.				
		if(myApp.u.thisNestedExists("zGlobals.thirdParty.facebook.appId") && typeof FB == 'object')	{
			$('.ocmFacebookComment',$checkout).click(function(){
				myApp.ext.quickstart.thirdParty.fb.postToWall(cartContentsAsLinks);
				_gaq.push(['_trackEvent','Checkout','User Event','FB message about order']);
				});
			}
		else	{$('.ocmFacebookComment').hide()}
		});
	}





//this will trigger the content to load on app init. so if you push refresh, you don't get a blank page.
//it'll also handle the old 'meta' uri params.
//this will trigger the content to load on app init. so if you push refresh, you don't get a blank page.
//it'll also handle the old 'meta' uri params.
myApp.router.appendInit({
	'type':'function',
	'route': function(v){
		return {'init':true} //returning anything but false triggers a match.
		},
	'callback':function(f,g){
		dump(" -> triggered callback for appendInit");
		g = g || {};
		if(g.uriParams.seoRequest){
			showContent(g.uriParams.pageType, g.uriParams);
			}
		else if(document.location.hash)	{	
			myApp.u.dump('triggering handleHash');
			myApp.router.handleHashChange();
			}
		else	{
			//IE8 didn't like the shortcut to showContent here.
			myApp.ext.quickstart.a.showContent('homepage');
			}
		if(g.uriParams && g.uriParams.meta)	{
			myApp.ext.cco.calls.cartSet.init({'want/refer':infoObj.uriParams.meta,'_cartid':_app.model.fetchCartID()},{},'passive');
			}
		if(g.uriParams && g.uriParams.meta_src)	{
			myApp.ext.cco.calls.cartSet.init({'want/refer_src':infoObj.uriParams.meta_src,'_cartid':_app.model.fetchCartID()},{},'passive');
			}
		}
	});





