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




var store_routing = function(_app) {
	var theseTemplates = new Array('');
	var r = {


////////////////////////////////////   CALLBACKS    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\



	callbacks : {
		init : {
			onSuccess : function()	{
				var r = false; 
				
				if(_app.u.getParameterByName('seoRequest')){
					_app.vars.showContentHashChange = true;
					_app.vars.ignoreHashChange = true;
					}
				
				
				_app.router.addAlias('homepage', 	function(routeObj){showContent('homepage',	routeObj.params);});
				_app.router.addAlias('category', 	function(routeObj){
					//* 201403 -> chrome on iOS doesn't like /. in hashbang.
					if(routeObj.params && routeObj.params.navcat && routeObj.params.navcat.charAt(0) != '.')	{
						routeObj.params.navcat = '.'+routeObj.params.navcat;
						}
					showContent('category',	routeObj.params);
					});

				_app.router.addAlias('product', 	function(routeObj){showContent('product',	routeObj.params);});
				_app.router.addAlias('company', 	function(routeObj){showContent('company',	routeObj.params);});
				_app.router.addAlias('customer', 	function(routeObj){showContent('customer',	routeObj.params);});
				_app.router.addAlias('checkout', 	function(routeObj){showContent('checkout',	routeObj.params);});

				_app.router.addAlias('search', 		function(routeObj){showContent('search',	routeObj.params);});
// beachmall custom alias
				_app.router.addAlias('bestsellers', function(routeObj){showContent('search',	{'elasticsearch':{'filter':{'and':[{'term':{'tags':'IS_BESTSELLER'}},{'term':{'app_category':routeObj.params.navcat}},{'not':{'term':{'tags':'IS_DISCONTINUED'}}}]}}});});
				_app.router.addAlias('featured',	function(routeObj){showContent('search',	{'elasticsearch':{'filter':{'and':[{'or':[{'term':{'tags':'IS_USER6'}},{'term':{'tags':'IS_USER2'}},{'term':{'tags':'IS_USER3'}},{'term':{'prod_promo':'IS_USER4'}}]},{'term':{'app_category':routeObj.params.navcat}},{'not':{'term':{'tags':'IS_DISCONTINUED'}}}]}}});});
				_app.router.addAlias('clearance',	function(routeObj){showContent('search',	{'elasticsearch':{'filter':{'and':[{'term':{'tags':'IS_CLEARANCE'}},{'term':{'app_category':'.beach-chair.adirondack-furniture'}},{'not':{'term':{'tags':'IS_DISCONTINUED'}}}]}}});});
				_app.router.addAlias('homepagefeatured',	function(routeObj){showContent('search',	{'elasticsearch':{'filter':{'and':[{'or':[{'term':{'tags':'IS_USER4'}},{'term':{'tags':'IS_COLORFUL'}},{'term':{'tags':'IS_USER5'}},{'term':{'user:prod_promo':'IS_USER4'}}]},{'not':{'term':{'tags':'IS_DISCONTINUED'}}}]}}});});
				_app.router.addAlias('homepagebestseller',	function(routeObj){showContent('search',	{'elasticsearch':{'filter':{'and':[{'term':{'tags':'IS_BESTSELLER'}},{'not':{'term':{'tags':'IS_DISCONTINUED'}}}]}}});});
				_app.router.addAlias('homepagefeaturedviewall',	function(routeObj){showContent('category',{'navcat':'.', 'templateID':'categoryTemplateHomepageFeatured'});});
				_app.router.addAlias('homepagebestsellerviewall',	function(routeObj){showContent('category',{'navcat':'.', 'templateID':'categoryTemplateHomepageBestseller'});});				
				
				_app.router.addAlias('.beach-accessories',	function(routeObj) { showContent('category',{'navcat':'.beach-accessories'}); } ); 
				_app.router.addAlias('.beach-accessories.beach-bags-totes',	function(routeObj) { showContent('category',{'navcat':'.beach-accessories.beach-bags-totes'}); } ); 
				_app.router.addAlias('.beach-accessories.beach-blanket',	function(routeObj) { showContent('category',{'navcat':'.beach-accessories.beach-blanket'}); } ); 
				_app.router.addAlias('.beach-accessories.beach-cart',	function(routeObj) { showContent('category',{'navcat':'.beach-accessories.beach-cart'}); } ); 
				_app.router.addAlias('.beach-accessories.picnic-backpack',	function(routeObj) { showContent('category',{'navcat':'.beach-accessories.picnic-backpack'}); } ); 
				_app.router.addAlias('.beach-accessories.picnic-baskets',	function(routeObj) { showContent('category',{'navcat':'.beach-accessories.picnic-baskets'}); } ); 
				_app.router.addAlias('.beach-accessories.picnic-cooler',	function(routeObj) { showContent('category',{'navcat':'.beach-accessories.picnic-cooler'}); } ); 
				_app.router.addAlias('.beach-accessories.tailgating',	function(routeObj) { showContent('category',{'navcat':'.beach-accessories.tailgating'}); } ); 
				_app.router.addAlias('.beach-chair',	function(routeObj) { showContent('category',{'navcat':'.beach-chair'}); } ); 
				_app.router.addAlias('.beach-chair.adirondack-furniture',	function(routeObj) { showContent('category',{'navcat':'.beach-chair.adirondack-furniture'}); } ); 
				_app.router.addAlias('.beach-chair.backpack-chair',	function(routeObj) { showContent('category',{'navcat':'.beach-chair.backpack-chair'}); } ); 
				_app.router.addAlias('.beach-chair.beach-chairs',	function(routeObj) { showContent('category',{'navcat':'.beach-chair.beach-chairs'}); } ); 
				_app.router.addAlias('.beach-chair.beach-chaise',	function(routeObj) { showContent('category',{'navcat':'.beach-chair.beach-chaise'}); } ); 
				_app.router.addAlias('.beach-chair.beach-lounges',	function(routeObj) { showContent('category',{'navcat':'.beach-chair.beach-lounges'}); } ); 
				_app.router.addAlias('.beach-chair.beach-lounges.beach-recliner',	function(routeObj) { showContent('category',{'navcat':'.beach-chair.beach-lounges.beach-recliner'}); } ); 
				_app.router.addAlias('.beach-chair.beach-lounges.pool-floats',	function(routeObj) { showContent('category',{'navcat':'.beach-chair.beach-lounges.pool-floats'}); } ); 
				_app.router.addAlias('.beach-chair.canopy-beach-chair',	function(routeObj) { showContent('category',{'navcat':'.beach-chair.canopy-beach-chair'}); } ); 
				_app.router.addAlias('.beach-chair.folding-beach-chairs',	function(routeObj) { showContent('category',{'navcat':'.beach-chair.folding-beach-chairs'}); } ); 
				_app.router.addAlias('.beach-chair.heavy-beach-chairs',	function(routeObj) { showContent('category',{'navcat':'.beach-chair.heavy-beach-chairs'}); } ); 
				_app.router.addAlias('.beach-chair.heavy-duty-beach-chairs',	function(routeObj) { showContent('category',{'navcat':'.beach-chair.heavy-duty-beach-chairs'}); } ); 
				_app.router.addAlias('.beach-chair.high-beach-chair',	function(routeObj) { showContent('category',{'navcat':'.beach-chair.high-beach-chair'}); } ); 
				_app.router.addAlias('.beach-chair.lafuma-recliner',	function(routeObj) { showContent('category',{'navcat':'.beach-chair.lafuma-recliner'}); } ); 
				_app.router.addAlias('.beach-chair.lafuma-recliner.lafuma-chairs',	function(routeObj) { showContent('category',{'navcat':'.beach-chair.lafuma-recliner.lafuma-chairs'}); } ); 
				_app.router.addAlias('.beach-chair.sand-chair',	function(routeObj) { showContent('category',{'navcat':'.beach-chair.sand-chair'}); } ); 
				_app.router.addAlias('.beach-chair.sand-chairs',	function(routeObj) { showContent('category',{'navcat':'.beach-chair.sand-chairs'}); } ); 
				_app.router.addAlias('.beach-chair.wooden-beach-chairs',	function(routeObj) { showContent('category',{'navcat':'.beach-chair.wooden-beach-chairs'}); } ); 
				_app.router.addAlias('.beach-chairs.beach-gear',	function(routeObj) { showContent('category',{'navcat':'.beach-chairs.beach-gear'}); } ); 
				_app.router.addAlias('.beach-chairs.beach-gear.beach-products',	function(routeObj) { showContent('category',{'navcat':'.beach-chairs.beach-gear.beach-products'}); } ); 
				_app.router.addAlias('.beach-chairs.beach-gear.blueridge-lawn-chair',	function(routeObj) { showContent('category',{'navcat':'.beach-chairs.beach-gear.blueridge-lawn-chair'}); } ); 
				_app.router.addAlias('.beach-chairs.beach-gear.california-umbrellas',	function(routeObj) { showContent('category',{'navcat':'.beach-chairs.beach-gear.california-umbrellas'}); } ); 
				_app.router.addAlias('.beach-chairs.beach-gear.ergo-lounger-chaise',	function(routeObj) { showContent('category',{'navcat':'.beach-chairs.beach-gear.ergo-lounger-chaise'}); } ); 
				_app.router.addAlias('.beach-chairs.beach-gear.fiberbuilt-umbrellas',	function(routeObj) { showContent('category',{'navcat':'.beach-chairs.beach-gear.fiberbuilt-umbrellas'}); } ); 
				_app.router.addAlias('.beach-chairs.beach-gear.frankford-umbrellas',	function(routeObj) { showContent('category',{'navcat':'.beach-chairs.beach-gear.frankford-umbrellas'}); } ); 
				_app.router.addAlias('.beach-chairs.beach-gear.galtech-umbrellas',	function(routeObj) { showContent('category',{'navcat':'.beach-chairs.beach-gear.galtech-umbrellas'}); } ); 
				_app.router.addAlias('.beach-chairs.beach-gear.gift_baskets',	function(routeObj) { showContent('category',{'navcat':'.beach-chairs.beach-gear.gift_baskets'}); } ); 
				_app.router.addAlias('.beach-chairs.beach-gear.green-corner-umbrellas',	function(routeObj) { showContent('category',{'navcat':'.beach-chairs.beach-gear.green-corner-umbrellas'}); } ); 
				_app.router.addAlias('.beach-chairs.beach-gear.kids-beachwear',	function(routeObj) { showContent('category',{'navcat':'.beach-chairs.beach-gear.kids-beachwear'}); } ); 
				_app.router.addAlias('.beach-chairs.beach-gear.lafuma-chair-recliner',	function(routeObj) { showContent('category',{'navcat':'.beach-chairs.beach-gear.lafuma-chair-recliner'}); } ); 
				_app.router.addAlias('.beach-chairs.beach-gear.ostrich-beach-chair-chaise',	function(routeObj) { showContent('category',{'navcat':'.beach-chairs.beach-gear.ostrich-beach-chair-chaise'}); } ); 
				_app.router.addAlias('.beach-chairs.beach-gear.picnic-ascot-accessories',	function(routeObj) { showContent('category',{'navcat':'.beach-chairs.beach-gear.picnic-ascot-accessories'}); } ); 
				_app.router.addAlias('.beach-chairs.beach-gear.picnic-basket-beyond',	function(routeObj) { showContent('category',{'navcat':'.beach-chairs.beach-gear.picnic-basket-beyond'}); } ); 
				_app.router.addAlias('.beach-chairs.beach-gear.picnic-plus-baskets',	function(routeObj) { showContent('category',{'navcat':'.beach-chairs.beach-gear.picnic-plus-baskets'}); } ); 
				_app.router.addAlias('.beach-chairs.beach-gear.picnic-time-backpacks',	function(routeObj) { showContent('category',{'navcat':'.beach-chairs.beach-gear.picnic-time-backpacks'}); } ); 
				_app.router.addAlias('.beach-chairs.beach-gear.platypus',	function(routeObj) { showContent('category',{'navcat':'.beach-chairs.beach-gear.platypus'}); } ); 
				_app.router.addAlias('.beach-chairs.beach-gear.polywood-adirondack-chairs',	function(routeObj) { showContent('category',{'navcat':'.beach-chairs.beach-gear.polywood-adirondack-chairs'}); } ); 
				_app.router.addAlias('.beach-chairs.beach-gear.rio-beach-chair-umbrellas',	function(routeObj) { showContent('category',{'navcat':'.beach-chairs.beach-gear.rio-beach-chair-umbrellas'}); } ); 
				_app.router.addAlias('.beach-chairs.beach-gear.shadebrella-umbrellas',	function(routeObj) { showContent('category',{'navcat':'.beach-chairs.beach-gear.shadebrella-umbrellas'}); } ); 
				_app.router.addAlias('.beach-chairs.beach-gear.sun-tent',	function(routeObj) { showContent('category',{'navcat':'.beach-chairs.beach-gear.sun-tent'}); } ); 
				_app.router.addAlias('.beach-chairs.beach-gear.sutherland-baskets',	function(routeObj) { showContent('category',{'navcat':'.beach-chairs.beach-gear.sutherland-baskets'}); } ); 
				_app.router.addAlias('.beach-chairs.beach-gear.sutherland-baskets',	function(routeObj) { showContent('category',{'navcat':'.beach-chairs.beach-gear.sutherland-baskets'}); } ); 
				_app.router.addAlias('.beach-chairs.beach-gear.swimwear-bathing-suits',	function(routeObj) { showContent('category',{'navcat':'.beach-chairs.beach-gear.swimwear-bathing-suits'}); } ); 
				_app.router.addAlias('.beach-chairs.beach-gear.telescope-beach-chairs',	function(routeObj) { showContent('category',{'navcat':'.beach-chairs.beach-gear.telescope-beach-chairs'}); } ); 
				_app.router.addAlias('.beach-chairs.beach-gear.wearever-chairs',	function(routeObj) { showContent('category',{'navcat':'.beach-chairs.beach-gear.wearever-chairs'}); } ); 
				_app.router.addAlias('.beach-chairs.beach-gear.wheeleez-beach-carts',	function(routeObj) { showContent('category',{'navcat':'.beach-chairs.beach-gear.wheeleez-beach-carts'}); } ); 
				_app.router.addAlias('.beach-sports',	function(routeObj) { showContent('category',{'navcat':'.beach-sports'}); } ); 
				_app.router.addAlias('.beach-sports.bodyboards',	function(routeObj) { showContent('category',{'navcat':'.beach-sports.bodyboards'}); } ); 
				_app.router.addAlias('.beach-sports.inflatables',	function(routeObj) { showContent('category',{'navcat':'.beach-sports.inflatables'}); } ); 
				_app.router.addAlias('.beach-sports.pool-floats',	function(routeObj) { showContent('category',{'navcat':'.beach-sports.pool-floats'}); } ); 
				_app.router.addAlias('.beach-sports.skimboards',	function(routeObj) { showContent('category',{'navcat':'.beach-sports.skimboards'}); } ); 
				_app.router.addAlias('.beach-umbrellas-shelter',	function(routeObj) { showContent('category',{'navcat':'.beach-umbrellas-shelter'}); } ); 
				_app.router.addAlias('.beach-umbrellas-shelter.beach-cabana',	function(routeObj) { showContent('category',{'navcat':'.beach-umbrellas-shelter.beach-cabana'}); } ); 
				_app.router.addAlias('.beach-umbrellas-shelter.beach-tent-shelters',	function(routeObj) { showContent('category',{'navcat':'.beach-umbrellas-shelter.beach-tent-shelters'}); } ); 
				_app.router.addAlias('.beach-umbrellas-shelter.beach-umbrella',	function(routeObj) { showContent('category',{'navcat':'.beach-umbrellas-shelter.beach-umbrella'}); } ); 
				_app.router.addAlias('.beach-umbrellas-shelter.patio-umbrella',	function(routeObj) { showContent('category',{'navcat':'.beach-umbrellas-shelter.patio-umbrella'}); } ); 
				_app.router.addAlias('.beach-umbrellas-shelter.patio-umbrella.6-foot-patio-umbrellas',	function(routeObj) { showContent('category',{'navcat':'.beach-umbrellas-shelter.patio-umbrella.6-foot-patio-umbrellas'}); } ); 
				_app.router.addAlias('.beach-umbrellas-shelter.patio-umbrella.7-foot-patio-umbrellas',	function(routeObj) { showContent('category',{'navcat':'.beach-umbrellas-shelter.patio-umbrella.7-foot-patio-umbrellas'}); } ); 
				_app.router.addAlias('.beach-umbrellas-shelter.patio-umbrella.offset-umbrellas',	function(routeObj) { showContent('category',{'navcat':'.beach-umbrellas-shelter.patio-umbrella.offset-umbrellas'}); } ); 
				_app.router.addAlias('.beach-umbrellas-shelter.patio-umbrella.market-umbrellas',	function(routeObj) { showContent('category',{'navcat':'.beach-umbrellas-shelter.patio-umbrella.market-umbrellas'}); } ); 
				_app.router.addAlias('.beach-umbrellas-shelter.umbrella-stand-stands-base',	function(routeObj) { showContent('category',{'navcat':'.beach-umbrellas-shelter.umbrella-stand-stands-base'}); } ); 
				_app.router.addAlias('.beachwear',	function(routeObj) { showContent('category',{'navcat':'.beachwear'}); } ); 
				_app.router.addAlias('.beachwear.beach-hat',	function(routeObj) { showContent('category',{'navcat':'.beachwear.beach-hat'}); } ); 
				_app.router.addAlias('.beachwear.beach-hat.baby-hats',	function(routeObj) { showContent('category',{'navcat':'.beachwear.beach-hat.baby-hats'}); } ); 
				_app.router.addAlias('.beachwear.beach-hat.kids-hats',	function(routeObj) { showContent('category',{'navcat':'.beachwear.beach-hat.kids-hats'}); } ); 
				_app.router.addAlias('.beachwear.beach-swimwear',	function(routeObj) { showContent('category',{'navcat':'.beachwear.beach-swimwear'}); } ); 
				_app.router.addAlias('.beachwear.beach-swimwear.babies-swimsuit',	function(routeObj) { showContent('category',{'navcat':'.beachwear.beach-swimwear.babies-swimsuit'}); } ); 
				_app.router.addAlias('.beachwear.beach-swimwear.beach-wear',	function(routeObj) { showContent('category',{'navcat':'.beachwear.beach-swimwear.beach-wear'}); } ); 
				_app.router.addAlias('.beachwear.beach-swimwear.beach-wear.boys-swimwear',	function(routeObj) { showContent('category',{'navcat':'.beachwear.beach-swimwear.beach-wear.boys-swimwear'}); } ); 
				_app.router.addAlias('.beachwear.beach-swimwear.beach-wear.girls-swimwear',	function(routeObj) { showContent('category',{'navcat':'.beachwear.beach-swimwear.beach-wear.girls-swimwear'}); } ); 
				_app.router.addAlias('.beachwear.beach-swimwear.board-shorts',	function(routeObj) { showContent('category',{'navcat':'.beachwear.beach-swimwear.board-shorts'}); } ); 
				_app.router.addAlias('.beachwear.beach-swimwear.board-shorts.boys-boardshorts',	function(routeObj) { showContent('category',{'navcat':'.beachwear.beach-swimwear.board-shorts.boys-boardshorts'}); } ); 
				_app.router.addAlias('.beachwear.beach-swimwear.board-shorts.girls-board-shorts',	function(routeObj) { showContent('category',{'navcat':'.beachwear.beach-swimwear.board-shorts.girls-board-shorts'}); } ); 
				_app.router.addAlias('.beachwear.beach-swimwear.board-shorts.kids',	function(routeObj) { showContent('category',{'navcat':'.beachwear.beach-swimwear.board-shorts.kids'}); } ); 
				_app.router.addAlias('.beachwear.beach-swimwear.kids-swimsuit',	function(routeObj) { showContent('category',{'navcat':'.beachwear.beach-swimwear.kids-swimsuit'}); } ); 
				_app.router.addAlias('.beachwear.beach-swimwear.rashguard',	function(routeObj) { showContent('category',{'navcat':'.beachwear.beach-swimwear.rashguard'}); } ); 
				_app.router.addAlias('.beachwear.beach-swimwear.rashguard.girls-rash-guard',	function(routeObj) { showContent('category',{'navcat':'.beachwear.beach-swimwear.rashguard.girls-rash-guard'}); } ); 
				_app.router.addAlias('.beachwear.beach-swimwear.rashguard.kids-rash-guard',	function(routeObj) { showContent('category',{'navcat':'.beachwear.beach-swimwear.rashguard.kids-rash-guard'}); } ); 
				_app.router.addAlias('.beachwear.beach-swimwear.rashguard.rashguards',	function(routeObj) { showContent('category',{'navcat':'.beachwear.beach-swimwear.rashguard.rashguards'}); } ); 
				_app.router.addAlias('.beach-chairs.beach-gear.women-swimwear-bikinis',	function(routeObj) { showContent('category',{'navcat':'.beach-chairs.beach-gear.women-swimwear-bikinis'}); } );
				_app.router.addAlias('.buyer_guides',	function(routeObj) { showContent('category',{'navcat':'.buyer_guides'}); } ); 
				_app.router.addAlias('.buyer_guides.adirondack-chairs',	function(routeObj) { showContent('category',{'navcat':'.buyer_guides.adirondack-chairs'}); } ); 
				_app.router.addAlias('.buyer_guides.backpack-beach-chairs',	function(routeObj) { showContent('category',{'navcat':'.buyer_guides.backpack-beach-chairs'}); } ); 
				_app.router.addAlias('.buyer_guides.beach-bags-beach-totes',	function(routeObj) { showContent('category',{'navcat':'.buyer_guides.beach-bags-beach-totes'}); } ); 
				_app.router.addAlias('.buyer_guides.beach-cabanas',	function(routeObj) { showContent('category',{'navcat':'.buyer_guides.beach-cabanas'}); } ); 
				_app.router.addAlias('.buyer_guides.beach-carts',	function(routeObj) { showContent('category',{'navcat':'.buyer_guides.beach-carts'}); } ); 
				_app.router.addAlias('.buyer_guides.beach-chairs',	function(routeObj) { showContent('category',{'navcat':'.buyer_guides.beach-chairs'}); } ); 
				_app.router.addAlias('.buyer_guides.beach-tents',	function(routeObj) { showContent('category',{'navcat':'.buyer_guides.beach-tents'}); } ); 
				_app.router.addAlias('.buyer_guides.beach-umbrellas',	function(routeObj) { showContent('category',{'navcat':'.buyer_guides.beach-umbrellas'}); } ); 
				_app.router.addAlias('.buyer_guides.beach-wear',	function(routeObj) { showContent('category',{'navcat':'.buyer_guides.beach-wear'}); } ); 
				_app.router.addAlias('.buyer_guides.bodyboards-body-board',	function(routeObj) { showContent('category',{'navcat':'.buyer_guides.bodyboards-body-board'}); } ); 
				_app.router.addAlias('.buyer_guides.hammocks',	function(routeObj) { showContent('category',{'navcat':'.buyer_guides.hammocks'}); } ); 
				_app.router.addAlias('.buyer_guides.lafuma-chairs-recliners',	function(routeObj) { showContent('category',{'navcat':'.buyer_guides.lafuma-chairs-recliners'}); } ); 
				_app.router.addAlias('.buyer_guides.market-umbrellas',	function(routeObj) { showContent('category',{'navcat':'.buyer_guides.market-umbrellas'}); } ); 
				_app.router.addAlias('.buyer_guides.outdoor-umbrellas',	function(routeObj) { showContent('category',{'navcat':'.buyer_guides.outdoor-umbrellas'}); } ); 
				_app.router.addAlias('.buyer_guides.picnic-backpacks',	function(routeObj) { showContent('category',{'navcat':'.buyer_guides.picnic-backpacks'}); } ); 
				_app.router.addAlias('.buyer_guides.picnic-baskets',	function(routeObj) { showContent('category',{'navcat':'.buyer_guides.picnic-baskets'}); } ); 
				_app.router.addAlias('.buyer_guides.picnic-blankets',	function(routeObj) { showContent('category',{'navcat':'.buyer_guides.picnic-blankets'}); } ); 
				_app.router.addAlias('.buyer_guides.picnic-cooler-beach-coolers',	function(routeObj) { showContent('category',{'navcat':'.buyer_guides.picnic-cooler-beach-coolers'}); } ); 
				_app.router.addAlias('.buyer_guides.skimboards-skim-board',	function(routeObj) { showContent('category',{'navcat':'.buyer_guides.skimboards-skim-board'}); } ); 
				_app.router.addAlias('.buyer_guides.umbrella-stands-bases',	function(routeObj) { showContent('category',{'navcat':'.buyer_guides.umbrella-stands-bases'}); } ); 
				_app.router.addAlias('.sitemap',	function(routeObj) { showContent('category',{'navcat':'.sitemap'}); } ); 
				_app.router.addAlias('.affiliates',	function(routeObj) { showContent('category',{'navcat':'.affiliates'}); } ); 
				_app.router.addAlias('.directory',	function(routeObj) { showContent('category',{'navcat':'.directory'}); } ); 
				
				
				
/*APPENDS*/				
				_app.router.appendHash({'type':'exact','route':'cart','callback':function(routeObj){showContent('cart',routeObj.params);}});
				_app.router.appendHash({'type':'exact','route':'homepage','callback':'homepage'});
				_app.router.appendHash({'type':'exact','route':'homepage/','callback':'homepage'});
				_app.router.appendHash({'type':'exact','route':'/','callback':'homepage'});
				_app.router.appendHash({'type':'exact','route':'','callback':'homepage'});
				_app.router.appendHash({'type':'match','route':'category/{{navcat}}*','callback':'category'});
				_app.router.appendHash({'type':'match','route':'product/{{pid}}/{{name}}*','callback':'product'});
				_app.router.appendHash({'type':'match','route':'product/{{pid}}*','callback':'product'});
				_app.router.appendHash({'type':'match','route':'company/{{show}}*','callback':'company'});
				_app.router.appendHash({'type':'exact','route':'company','callback':'company'});
				_app.router.appendHash({'type':'match','route':'customer/{{show}}*','callback':'customer'});
				_app.router.appendHash({'type':'exact','route':'customer','callback':'company'});
				_app.router.appendHash({'type':'match','route':'checkout*','callback':'checkout'});
				_app.router.appendHash({'type':'match','route':'search/tag/{{tag}}*','callback':'search'});
				_app.router.appendHash({'type':'match','route':'search/keywords/{{KEYWORDS}}*','callback':'search'});
// beachmall custom append
				_app.router.appendHash({'type':'match','route':'{{seo}}/c/{{navcat}}','callback':'category'});
				_app.router.appendHash({'type':'match','route':'{{seo}}/p/{{pid}}.html','callback':'product'});
				_app.router.appendHash({'type':'match','route':'redirect/p/pid={{pid}}','callback':'product'});
				_app.router.appendHash({'type':'match','route':'{{seo}}/bestsellers/c/{{navcat}}*','callback':'bestsellers'});
				_app.router.appendHash({'type':'match','route':'{{seo}}/featured/c/{{navcat}}*','callback':'featured'});
				_app.router.appendHash({'type':'match','route':'{{seo}}/clearance/c/{{navcat}}*','callback':'clearance'});
				_app.router.appendHash({'type':'match','route':'homepagefeatured','callback':'homepagefeatured'});
				_app.router.appendHash({'type':'match','route':'homepagebestseller','callback':'homepagebestseller'});
				_app.router.appendHash({'type':'exact','route':'viewallfeatured/','callback':'homepagefeaturedviewall'});
				_app.router.appendHash({'type':'exact','route':'viewallbestseller/','callback':'homepagebestsellerviewall'});
				
				_app.router.appendHash({'type':'match','route':'beach-accessories/','callback':'.beach-accessories'});
				_app.router.appendHash({'type':'match','route':'beach-bags-totes/','callback':'.beach-accessories.beach-bags-totes'});
				_app.router.appendHash({'type':'match','route':'beach-towels-blankets/','callback':'.beach-accessories.beach-blanket'});
				_app.router.appendHash({'type':'match','route':'beach-carts/','callback':'.beach-accessories.beach-cart'});
				_app.router.appendHash({'type':'match','route':'picnic-backpacks/','callback':'.beach-accessories.picnic-backpack'});
				_app.router.appendHash({'type':'match','route':'picnic-baskets/','callback':'.beach-accessories.picnic-baskets'});
				_app.router.appendHash({'type':'match','route':'coolers/','callback':'.beach-accessories.picnic-cooler'});
				_app.router.appendHash({'type':'match','route':'tailgating/','callback':'.beach-accessories.tailgating'});
				_app.router.appendHash({'type':'match','route':'beach-chairs/','callback':'.beach-chair'});
				_app.router.appendHash({'type':'match','route':'adirondack/','callback':'.beach-chair.adirondack-furniture'});
				_app.router.appendHash({'type':'match','route':'backpack-chairs/','callback':'.beach-chair.backpack-chair'});
				_app.router.appendHash({'type':'match','route':'cup-holder-chairs/','callback':'.beach-chair.beach-chairs'});
				_app.router.appendHash({'type':'match','route':'beach-chaises/','callback':'.beach-chair.beach-chaise'});
				_app.router.appendHash({'type':'match','route':'beach-pool-lounges/','callback':'.beach-chair.beach-lounges'});
				_app.router.appendHash({'type':'match','route':'beach-lounges/','callback':'.beach-chair.beach-lounges.beach-recliner'});
				_app.router.appendHash({'type':'match','route':'pool-lounges/','callback':'.beach-chair.beach-lounges.pool-floats'});
				_app.router.appendHash({'type':'match','route':'canopy-beach-chairs/','callback':'.beach-chair.canopy-beach-chair'});
				_app.router.appendHash({'type':'match','route':'padded-beach-chairs/','callback':'.beach-chair.folding-beach-chairs'});
				_app.router.appendHash({'type':'match','route':'high-back-beach-chairs/','callback':'.beach-chair.heavy-beach-chairs'});
				_app.router.appendHash({'type':'match','route':'large-beach-chairs/','callback':'.beach-chair.heavy-duty-beach-chairs'});
				_app.router.appendHash({'type':'match','route':'high-seat-beach-chairs/','callback':'.beach-chair.high-beach-chair'});
				_app.router.appendHash({'type':'match','route':'folding-beach-chairs/','callback':'.beach-chair.lafuma-recliner.lafuma-chairs'});
				_app.router.appendHash({'type':'match','route':'premium-chairs/','callback':'.beach-chair.lafuma-recliner'});
				_app.router.appendHash({'type':'match','route':'low-seat-beach-chairs/','callback':'.beach-chair.sand-chair'});
				_app.router.appendHash({'type':'match','route':'lay-flat-beach-chairs/','callback':'.beach-chair.sand-chairs'});
				_app.router.appendHash({'type':'match','route':'wooden-beach-chairs/','callback':'.beach-chair.wooden-beach-chairs'});
				_app.router.appendHash({'type':'match','route':'shop-by-brand/','callback':'.beach-chairs.beach-gear'});
				_app.router.appendHash({'type':'match','route':'copa-sports/','callback':'.beach-chairs.beach-gear.beach-products'});
				_app.router.appendHash({'type':'match','route':'blueridge-chair/','callback':'.beach-chairs.beach-gear.blueridge-lawn-chair'});
				_app.router.appendHash({'type':'match','route':'shadezilla-umbrellas/','callback':'.beach-chairs.beach-gear.california-umbrellas'});
				_app.router.appendHash({'type':'match','route':'ergo-lounger/','callback':'.beach-chairs.beach-gear.ergo-lounger-chaise'});
				_app.router.appendHash({'type':'match','route':'fiberbuilt/','callback':'.beach-chairs.beach-gear.fiberbuilt-umbrellas'});
				_app.router.appendHash({'type':'match','route':'frankford-umbrellas/','callback':'.beach-chairs.beach-gear.frankford-umbrellas'});
				_app.router.appendHash({'type':'match','route':'galtech/','callback':'.beach-chairs.beach-gear.galtech-umbrellas'});
				_app.router.appendHash({'type':'match','route':'gift-baskets/','callback':'.beach-chairs.beach-gear.gift_baskets'});
				_app.router.appendHash({'type':'match','route':'green-corner/','callback':'.beach-chairs.beach-gear.green-corner-umbrellas'});
				_app.router.appendHash({'type':'match','route':'snapper-rock/','callback':'.beach-chairs.beach-gear.kids-beachwear'});
				_app.router.appendHash({'type':'match','route':'lafuma/','callback':'.beach-chairs.beach-gear.lafuma-chair-recliner'});
				_app.router.appendHash({'type':'match','route':'ostrich-chairs/','callback':'.beach-chairs.beach-gear.ostrich-beach-chair-chaise'});
				_app.router.appendHash({'type':'match','route':'picnic-ascot/','callback':'.beach-chairs.beach-gear.picnic-ascot-accessories'});
				_app.router.appendHash({'type':'match','route':'picnic-beyond/','callback':'.beach-chairs.beach-gear.picnic-basket-beyond'});
				_app.router.appendHash({'type':'match','route':'picnic-plus/','callback':'.beach-chairs.beach-gear.picnic-plus-baskets'});
				_app.router.appendHash({'type':'match','route':'picnic-time/','callback':'.beach-chairs.beach-gear.picnic-time-backpacks'});
				_app.router.appendHash({'type':'match','route':'platypus/','callback':'.beach-chairs.beach-gear.platypus'});
				_app.router.appendHash({'type':'match','route':'polywood-furniture/','callback':'.beach-chairs.beach-gear.polywood-adirondack-chairs'});
				_app.router.appendHash({'type':'match','route':'rio-brand/','callback':'.beach-chairs.beach-gear.rio-beach-chair-umbrellas'});
				_app.router.appendHash({'type':'match','route':'shadezilla/','callback':'.beach-chairs.beach-gear.shadebrella-umbrellas'});
				_app.router.appendHash({'type':'match','route':'abo gear/','callback':'.beach-chairs.beach-gear.sun-tent'});
				_app.router.appendHash({'type':'match','route':'abo gear/','callback':'.beach-chairs.beach-gear.sutherland-baskets'});
				_app.router.appendHash({'type':'match','route':'solarguard/','callback':'.beach-chairs.beach-gear.sutherland-baskets'});
				_app.router.appendHash({'type':'match','route':'wonder-wheeler/','callback':'.beach-chairs.beach-gear.swimwear-bathing-suits'});
				_app.router.appendHash({'type':'match','route':'telescope-casual/','callback':'.beach-chairs.beach-gear.telescope-beach-chairs'});
				_app.router.appendHash({'type':'match','route':'wearever-chairs/','callback':'.beach-chairs.beach-gear.wearever-chairs'});
				_app.router.appendHash({'type':'match','route':'wheeleez/','callback':'.beach-chairs.beach-gear.wheeleez-beach-carts'});
				_app.router.appendHash({'type':'match','route':'recreation/','callback':'.beach-sports'});
				_app.router.appendHash({'type':'match','route':'bodyboards/','callback':'.beach-sports.bodyboards'});
				_app.router.appendHash({'type':'match','route':'inflatables/','callback':'.beach-sports.inflatables'});
				_app.router.appendHash({'type':'match','route':'pool-floats/','callback':'.beach-sports.pool-floats'});
				_app.router.appendHash({'type':'match','route':'skimboards/','callback':'.beach-sports.skimboards'});
				_app.router.appendHash({'type':'match','route':'umbrellas-shelters/','callback':'.beach-umbrellas-shelter'});
				_app.router.appendHash({'type':'match','route':'beach-cabanas/','callback':'.beach-umbrellas-shelter.beach-cabana'});
				_app.router.appendHash({'type':'match','route':'beach-tents-shelters/','callback':'.beach-umbrellas-shelter.beach-tent-shelters'});
				_app.router.appendHash({'type':'match','route':'beach-umbrellas/','callback':'.beach-umbrellas-shelter.beach-umbrella'});
				_app.router.appendHash({'type':'match','route':'market-patio-umbrellas/','callback':'.beach-umbrellas-shelter.patio-umbrella'});
				_app.router.appendHash({'type':'match','route':'6-foot-wide-umbrellas/','callback':'.beach-umbrellas-shelter.patio-umbrella.6-foot-patio-umbrellas'});
				_app.router.appendHash({'type':'match','route':'7-foot-wide-umbrellas/','callback':'.beach-umbrellas-shelter.patio-umbrella.7-foot-patio-umbrellas'});
				_app.router.appendHash({'type':'match','route':'9-foot-wide-umbrellas-/','callback':'.beach-umbrellas-shelter.patio-umbrella.offset-umbrellas'});
				_app.router.appendHash({'type':'match','route':'11-foot-wide-umbrellas-/','callback':'.beach-umbrellas-shelter.patio-umbrella.market-umbrellas'});
				_app.router.appendHash({'type':'match','route':'umbrella-accessories/','callback':'.beach-umbrellas-shelter.umbrella-stand-stands-base'});
				_app.router.appendHash({'type':'match','route':'beach-wear/','callback':'.beachwear'});
				_app.router.appendHash({'type':'match','route':'summer-hats/','callback':'.beachwear.beach-hat'});
				_app.router.appendHash({'type':'match','route':'baby-hats/','callback':'.beachwear.beach-hat.baby-hats'});
				_app.router.appendHash({'type':'match','route':'kids-sun-hats/','callback':'.beachwear.beach-hat.kids-hats'});
				_app.router.appendHash({'type':'match','route':'beach-pool-apparels/','callback':'.beachwear.beach-swimwear'});
				_app.router.appendHash({'type':'match','route':'babies-swim-wear/','callback':'.beachwear.beach-swimwear.babies-swimsuit'});
				//beach-wear used as pretty name twice, prepended swim to the pretty name in seo anchor function to differentiate.
				_app.router.appendHash({'type':'match','route':'swim-beach-wear/','callback':'.beachwear.beach-swimwear.beach-wear'});
				_app.router.appendHash({'type':'match','route':'boys-beach-wear/','callback':'.beachwear.beach-swimwear.beach-wear.boys-swimwear'});
				_app.router.appendHash({'type':'match','route':'girls-beach-wear/','callback':'.beachwear.beach-swimwear.beach-wear.girls-swimwear'});
				_app.router.appendHash({'type':'match','route':'board-shorts/','callback':'.beachwear.beach-swimwear.board-shorts'});
				_app.router.appendHash({'type':'match','route':'boy-board-shorts/','callback':'.beachwear.beach-swimwear.board-shorts.boys-boardshorts'});
				_app.router.appendHash({'type':'match','route':'girls-board-shorts/','callback':'.beachwear.beach-swimwear.board-shorts.girls-board-shorts'});
				_app.router.appendHash({'type':'match','route':'kids-board-shorts/','callback':'.beachwear.beach-swimwear.board-shorts.kids'});
				_app.router.appendHash({'type':'match','route':'kids-swim-wear/','callback':'.beachwear.beach-swimwear.kids-swimsuit'});
				_app.router.appendHash({'type':'match','route':'rash-guards/','callback':'.beachwear.beach-swimwear.rashguard'});
				_app.router.appendHash({'type':'match','route':'girls-rash-guards/','callback':'.beachwear.beach-swimwear.rashguard.girls-rash-guard'});
				_app.router.appendHash({'type':'match','route':'kids-baby-rash-guards/','callback':'.beachwear.beach-swimwear.rashguard.kids-rash-guard'});
				_app.router.appendHash({'type':'match','route':'boys-rash-guards/','callback':'.beachwear.beach-swimwear.rashguard.rashguards'});
				_app.router.appendHash({'type':'match','route':'love-swimwear/','callback':'.beach-chairs.beach-gear.women-swimwear-bikinis'});
				_app.router.appendHash({'type':'match','route':'buyer-guides/','callback':'.buyer_guides'});
				_app.router.appendHash({'type':'match','route':'adirondack-chairs-buyer-guide/','callback':'.buyer_guides.adirondack-chairs'});
				_app.router.appendHash({'type':'match','route':'backpack-beach-chairs-buyer-guide/','callback':'.buyer_guides.backpack-beach-chairs'});
				_app.router.appendHash({'type':'match','route':'beach-bags-buyer-guide/','callback':'.buyer_guides.beach-bags-beach-totes'});
				_app.router.appendHash({'type':'match','route':'beach-cabanas-buyer-guide/','callback':'.buyer_guides.beach-cabanas'});
				_app.router.appendHash({'type':'match','route':'beach-carts-buyer-guide/','callback':'.buyer_guides.beach-carts'});
				_app.router.appendHash({'type':'match','route':'beach-chairs-buyer-guide/','callback':'.buyer_guides.beach-chairs'});
				_app.router.appendHash({'type':'match','route':'beach-tents-buyer-guide/','callback':'.buyer_guides.beach-tents'});
				_app.router.appendHash({'type':'match','route':'beach-umbrellas-buyer-guide/','callback':'.buyer_guides.beach-umbrellas'});
				_app.router.appendHash({'type':'match','route':'beach-wear-buyer-guide/','callback':'.buyer_guides.beach-wear'});
				_app.router.appendHash({'type':'match','route':'bodyboards-buyer-guide/','callback':'.buyer_guides.bodyboards-body-board'});
				_app.router.appendHash({'type':'match','route':'hammocks-buyer-guide/','callback':'.buyer_guides.hammocks'});
				_app.router.appendHash({'type':'match','route':'lafuma-chairs-buyer-guide/','callback':'.buyer_guides.lafuma-chairs-recliners'});
				_app.router.appendHash({'type':'match','route':'market-umbrellas-buyer-guide/','callback':'.buyer_guides.market-umbrellas'});
				_app.router.appendHash({'type':'match','route':'patio-umbrellas-buyer-guide/','callback':'.buyer_guides.outdoor-umbrellas'});
				_app.router.appendHash({'type':'match','route':'picnic-backpacks-buyer-guide/','callback':'.buyer_guides.picnic-backpacks'});
				_app.router.appendHash({'type':'match','route':'picnic-baskets-buyer-guide/','callback':'.buyer_guides.picnic-baskets'});
				_app.router.appendHash({'type':'match','route':'picnic-blankets-buyer-guide/','callback':'.buyer_guides.picnic-blankets'});
				_app.router.appendHash({'type':'match','route':'picnic-coolers-buyer-guide/','callback':'.buyer_guides.picnic-cooler-beach-coolers'});
				_app.router.appendHash({'type':'match','route':'skimboards-buyer-guide/','callback':'.buyer_guides.skimboards-skim-board'});
				_app.router.appendHash({'type':'match','route':'umbrella-stands-buyer-guide/','callback':'.buyer_guides.umbrella-stands-bases'});
				_app.router.appendHash({'type':'match','route':'sitemap/','callback':'.sitemap'});
				_app.router.appendHash({'type':'match','route':'affiliates/','callback':'.affiliates'});
				_app.router.appendHash({'type':'match','route':'directory/','callback':'.directory'});
			
				
/*
some other things we could do
_app.router.appendHash({'type':'match','route':'quickview/product/{{pid}}*','callback':function(routeObj){
	quickview('product',routeObj.params);
	}});

or a more generic one, like so:
_app.router.appendHash({'type':'match','route':'modal/product/{{pid}}*','callback':function(routeObj){
	quickview('product',routeObj.params);
	}});
*/
				r = true;

				return r;
				},
			onError : function()	{
				_app.u.dump('BEGIN store_routing.callbacks.init.onError');
				}
			},
		attachEventHandlers : {
			onSuccess : function(){
				dump('START store_routing.callbacks.attachEventHandlers.onSuccess');
				$.merge(_app.ext.seo_robots.vars.pages,[
					"#!company/about/",
					"#!company/contact/",
					"#!viewallfeatured/",
					"#!viewallbestseller/"
				]);
			
				var callback = function(event, $context, infoObj) {
					dump('--> store_routing complete event');
					event.stopPropagation();
					if(infoObj) {
						var hash = "";
						var $routeEle = $('[data-routing-hash]',$context);
						if($routeEle.length){
							hash = $routeEle.attr('data-routing-hash');
						}
						else {
							switch(infoObj.pageType) {
								case 'homepage':
									hash = "#!/"
									break;
								case 'product':
									hash = "#!/product/"+infoObj.pid+"/";
									break;
								case 'category':
									hash = "#!/category/"+infoObj.navcat+"/";
									break;
								case 'static':
									hash = window.location.hash;
									break;
								case 'search':
										hash = window.location.hash; //"#!/search/"+encodeURIComponent(infoObj.KEYWORDS)+"/"
									break;
								case 'company':
									hash = "#!company/"+infoObj.show+"/"
									break;
								case 'customer':
									hash = "#!customer/"+infoObj.show+"/";
									break;
								case 'cart':
									hash = "#!cart/";
									break;
								case 'checkout':
									hash = "#!checkout/";
									break;
							}
						}
						_app.ext.store_routing.u.setHash(hash);
					}
				}	
				for(var i in _app.templates) {
					_app.templates[i].on('complete.routing',callback);
				}
				$('#appTemplates').children().each(function(){
					$(this).on('complete.routing',callback);
				});
		
				
			},
			onError : function(){}
		}	
	}, //callbacks



////////////////////////////////////   ACTION    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

		a : {

			}, //Actions

////////////////////////////////////   RENDERFORMATS    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
		
		tlcFormats : {
			productlink : function(data, thisTLC){
				var args = thisTLC.args2obj(data.command.args, data.globals);
				if(args.pid && args.seo){
					data.globals.binds[data.globals.focusBind] =  _app.ext.store_routing.u.productAnchor(args.pid, args.seo);
					return true;
					} 
				else {
					dump('-> store_routing productlink tlcformat: The PID or SEO content was not provided in the tlc.');
					//stop execution of the commands.  throw a tantrum.
					return false;
					}
				},

/*
optional params:
	type -> acceptable values are product, category, dwiw or blank (blank = dwiw). set implicitly for best results.
		 -> if blank/dwiw, type is guessed.
	seo -> supported for both category and product, will append /product pretty name or /category pretty name (uri encoded) to the end of the href.
*/
			seoanchor : function(data, thisTLC){
				var args = thisTLC.args2obj(data.command.args, data.globals), r;
				if(!args.type || args.type == 'dwiw')	{
					if(data.value.pid)	{args.type = 'product'}
					else if(data.value.path)	{args.type = 'category'}
					else	{}
					}

				switch(args.type) {
					case 'product':
						r = true;
						var seoname = '';
						if(args.seoname) {
							seoname = args.seoname;
							}
						//seoname isn't clearly defined, so we go into some dwiw guesswork.
						else if(args.seo && data.value['%attribs'])	{
/*beachmall*/						//seoname = data.value['%attribs']['zoovy:prod_seo_title'] || data.value['%attribs']['zoovy:prod_name'];
/*beachmall*/						seoname = data.value['%attribs']['seo:custom_prod_url'] || data.value['%attribs']['zoovy:prod_name']; //wants prod_name in hash, not seo_title
							}
						else if(args.seo && data.value.prod_name)	{
							seoname = data.value.prod_name; //this would be an elastic search results.
							}
						else	{} //not defined. guesswork came back negative.
						data.globals.binds[data.globals.focusBind] = _app.ext.store_routing.u.productAnchor(data.value.pid, seoname);
						break;
					
					case 'category':
						r = true;
						//uses pretty name for hash, but buyer guides and beach wear cats have the same pretty names so check to see if one of those is being shown and alter the hash to fit. 
						if(data.value.path.indexOf('buyer_guides') > -1) {
							data.globals.binds[data.globals.focusBind] = _app.ext.store_routing.u.categoryAnchor(data.value.path, (args.seo ? data.value.pretty+'-buyer-guide' : ''));
						}
						else if (data.value.path == '.beachwear.beach-swimwear.beach-wear') {
							data.globals.binds[data.globals.focusBind] = _app.ext.store_routing.u.categoryAnchor(data.value.path, (args.seo ? 'swim-'+data.value.pretty : ''));
						}
						else {
							data.globals.binds[data.globals.focusBind] = _app.ext.store_routing.u.categoryAnchor(data.value.path, (args.seo ? data.value.pretty : ''));
						}
						break;
					
					default:
						dump("in tlcFormat.seolink, the type specified ["+args.type+"] is not recognized.");
						r = false; //unrecognized 'type'
					}
				return r;
				} //seolink

			},
		
		renderFormats : {
			productLink : function($tag, data){
				var href="#!product/";
				if(data.bindData.useParentData){
					href += data.value.pid+"/";
					if(data.bindData.seoattr){
						href += data.value["%attribs"][data.bindData.seoattr];
						}
					}
				else {
					href += data.value+"/";
					}
				$tag.attr('href',href);
				}
			}, //renderFormats
////////////////////////////////////   UTIL [u]   \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

		u : {
			setHash : function(hash){
				dump('setting hash to: '+hash);
				var $canonical = $('link[rel=canonical]');
				if(!$canonical.length){
					dump('NO CANONICAL IN THE DOCUMENT'); dump(hash);
					$canonical = $('<link rel="canonical" href="" />');
					$('head').append($canonical);
				}
				$canonical.attr('href',hash);
				if(_app.vars.showContentHashChange) {
					dump('forcing a hash change');
					window.location.href = window.location.href.split("#")[0]+hash;
				}
			},
				
			productAnchor : function(pid, seo){
				//return "#!product/"+pid+"/"+(seo ? encodeURIComponent(seo) : '');
				if(seo) {
/*beachmall*/		seo = _app.ext.beachmall_store.u.removeUnwantedChars(seo);
					return "#!"+encodeURIComponent(seo).replace(/%20/g, "-")+"/p/"+pid+".html";
				}
				else return "#!product/"+pid;
				},
			categoryAnchor : function(path,seo)	{
				//return "#!category/"+path+((seo) ? "/"+encodeURI(seo) : '');
				
				if(seo) {
/*beachmall*/		seo = _app.ext.beachmall_store.u.removeUnwantedChars(seo);
					//return "#!"+encodeURIComponent(seo).replace(/%20/g, "-")+"/c/"+path;
					return "#!"+encodeURIComponent(seo).replace(/%20/g, "-")+"/";
				}
				else return "#!category/"+path+"/";
				},
/*beachmall*/
			categorySearchAnchor : function(path,seo,type) {
				if(seo) {
					seo = _app.ext.beachmall_store.u.removeUnwantedChars(seo);
					return "#!"+encodeURIComponent(seo).replace(/%20/g, "-")+"/"+type+"/c/"+path; 
				}
				else return "#!category/"+type+"/"+path;
/*beachmall*/	},
			searchAnchor : function(type,value)	{
				var r;
				if(type == 'tag')	{
					r = '#!search/tag/'+value;
					}
				else if(type == 'keywords')	{
					r = '#!search/keywords/'+value;
					}
// ### FUTURE -> support ability to search for a match on a specific attribute.
//				else if(type == 'attrib')	{
//					r = '#!search/attrib/' ... some key value pair.
//					}
				else	{
					//unrecognized type
					}
				return "#!category/"+path+((seo) ? "/"+encodeURIComponent(seo) : '');
				}
			}, //u [utilities]

		e : {
/*			
			navigateTo : function($ele,P)	{
				if($ele.data('type'))	{
					switch($ele.data('type'))	{
						case 'product':
							document.location.hash = _app.ext.store_routing.u.productAnchor($ele.data('pid'));
							break;
						case 'category':
							document.location.hash = _app.ext.store_routing.u.categoryAnchor($ele.data('path'));
							break;
						default:
							$("#globalMessaging").anymessage({"message":"In store_router.e.navigateTo, invalid data.type ["+$ele.data('type')+"] on trigger element.","gMessage":true});
						}
					}
				else	{
					
					}
				}
*/
			} //e [app Events]
		} //r object.
	return r;
	}
