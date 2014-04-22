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
				_app.router.addAlias('category', 	function(routeObj){showContent('category',	routeObj.params);});
				_app.router.addAlias('product', 	function(routeObj){showContent('product',	routeObj.params);});
				_app.router.addAlias('company', 	function(routeObj){showContent('company',	routeObj.params);});
				_app.router.addAlias('customer', 	function(routeObj){showContent('customer',	routeObj.params);});
				_app.router.addAlias('checkout', 	function(routeObj){showContent('checkout',	routeObj.params);});

				_app.router.addAlias('search', 		function(routeObj){showContent('search',	routeObj.params);});
// beachmall custom alias
				_app.router.addAlias('bestsellers', function(routeObj){showContent('search',	{'elasticsearch':{'filter':{'and':[{'term':{'tags':'IS_BESTSELLER'}},{'term':{'app_category':routeObj.params.navcat}}]}}});});
				_app.router.addAlias('featured',	function(routeObj){showContent('search',	{'elasticsearch':{'filter':{'and':[{'or':[{'term':{'tags':'IS_USER6'}},{'term':{'tags':'IS_USER2'}},{'term':{'tags':'IS_USER3'}},{'term':{'prod_promo':'IS_USER4'}}]},{'term':{'app_category':routeObj.params.navcat}}]}}});});
				_app.router.addAlias('clearance',	function(routeObj){showContent('search',	{'elasticsearch':{'filter':{'and':[{'term':{'tags':'IS_CLEARANCE'}},{'term':{'app_category':'.beach-chair.adirondack-furniture'}}]}}});});
				_app.router.addAlias('homepagefeatured',	function(routeObj){showContent('search',	{'elasticsearch':{'filter':{'and':[{'or':[{'term':{'tags':'IS_USER4'}},{'term':{'tags':'IS_COLORFUL'}},{'term':{'tags':'IS_USER5'}},{'term':{'user:prod_promo':'IS_USER4'}}]},{'not':{'term':{'tags':'IS_DISCONTINUED'}}}]}}});});
				_app.router.addAlias('homepagebestseller',	function(routeObj){showContent('search',	{'elasticsearch':{'filter':{'and':[{'term':{'tags':'IS_BESTSELLER'}},{'not':{'term':{'tags':'IS_DISCONTINUED'}}}]}}});});
				_app.router.addAlias('homepagefeaturedviewall',	function(routeObj){showContent('category',{'navcat':'.', 'templateID':'categoryTemplateHomepageFeatured'});});
				_app.router.addAlias('homepagebestsellerviewall',	function(routeObj){showContent('category',{'navcat':'.', 'templateID':'categoryTemplateHomepageBestseller'});});
				
				_app.router.appendHash({'type':'exact','route':'cart','callback':function(routeObj){showContent('cart',routeObj.params);}});
				_app.router.appendHash({'type':'exact','route':'home','callback':'homepage'});
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
				_app.router.appendHash({'type':'match','route':'{{seo}}/bestsellers/c/{{navcat}}*','callback':'bestsellers'});
				_app.router.appendHash({'type':'match','route':'{{seo}}/featured/c/{{navcat}}*','callback':'featured'});
				_app.router.appendHash({'type':'match','route':'{{seo}}/clearance/c/{{navcat}}*','callback':'clearance'});
				_app.router.appendHash({'type':'match','route':'homepagefeatured','callback':'homepagefeatured'});
				_app.router.appendHash({'type':'match','route':'homepagebestseller','callback':'homepagebestseller'});
				_app.router.appendHash({'type':'exact','route':'viewallfeatured','callback':'homepagefeaturedviewall'});
				_app.router.appendHash({'type':'exact','route':'viewallbestseller','callback':'homepagebestsellerviewall'});
				
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
				_app.templates.homepageTemplate.on('complete.routing', function(event, $context, infoObj){_app.ext.store_routing.u.setHash("#!/");});
				
				_app.templates.categoryTemplate.on('complete.routing', function(event, $context, infoObj){
					var hash = "";
					var $routeEle = $('[data-routing-hash]',$context)
					if($routeEle.length){
						hash = $routeEle.attr('data-routing-hash');
						}
					else {
						hash = "#!/category/"+infoObj.navcat+"/";
					}
					_app.ext.store_routing.u.setHash(hash);
					});
					
				_app.templates.categoryTemplateFilteredSearch.on('complete.routing', function(event, $context, infoObj){
					var hash = "";
					var $routeEle = $('[data-routing-hash]',$context)
					if($routeEle.length){
						hash = $routeEle.attr('data-routing-hash');
						}
					else {
						hash = "#!/category/"+infoObj.navcat+"/";
					}
					_app.ext.store_routing.u.setHash(hash);
					});
					
				_app.templates.productTemplate.on('complete.routing', function(event, $context, infoObj){
					dump('here');
					dump('here');
					dump('here');
					var hash = "";
					var $routeEle = $('[data-routing-hash]',$context)
					if($routeEle.length){
						hash = $routeEle.attr('data-routing-hash');
						}
					else {
						hash = "#!/product/"+infoObj.pid+"/";
					}
					dump(hash);
					_app.ext.store_routing.u.setHash(hash);
					});
				
				_app.templates.companyTemplate.on('complete.routing', function(event, $context, infoObj){_app.ext.store_routing.u.setHash("#!/company/"+infoObj.show+"/");});
				_app.templates.customerTemplate.on('complete.routing', function(event, $context, infoObj){_app.ext.store_routing.u.setHash("#!/customer/"+infoObj.show+"/");});
				_app.templates.searchTemplate.on('complete.routing', function(event, $context, infoObj){_app.ext.store_routing.u.setHash("#!/search/"+encodeURIComponent(infoObj.KEYWORDS)+"/");});
				_app.templates.cartTemplate.on('complete.routing', function(event, $context, infoObj){if(infoObj.show == "inline"){_app.ext.store_routing.u.setHash("#!/cart/");}});
				//_app.templates.checkoutTemplate.on('complete.routing', function(event, $context, infoObj){_app.ext.store_routing.u.setHash("#!/checkout/");});
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
							//seoname = data.value['%attribs']['zoovy:prod_seo_title'] || data.value['%attribs']['zoovy:prod_name'];
							seoname = data.value['%attribs']['zoovy:prod_name']; //wants prod_name in hash, not seo_title
							}
						else if(args.seo && data.value.prod_name) {
							seoname = data.value.prod_name; //this would be for elastic search results.
							}
						data.globals.binds[data.globals.focusBind] = _app.ext.store_routing.u.productAnchor(data.value.pid, seoname);
						break;
					
					case 'category':
						r = true;
						dump('----DATA.VALUE:'); dump(data.value);
						data.globals.binds[data.globals.focusBind] = _app.ext.store_routing.u.categoryAnchor(data.value.path, (args.seo ? data.value.pretty : ''));
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
				if(_app.vars.showContentHashChange){
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
					return "#!"+encodeURIComponent(seo).replace(/%20/g, "-")+"/c/"+path;
				}
				else return "#!category/"+path;
				},
/*beachmall*/
			categorySearchAnchor : function(path,seo,type) {
				if(seo) {
					seo = _app.ext.beachmall_store.u.removeUnwantedChars(seo);
					return "#!"+encodeURIComponent(seo)+"/"+type+"/c/"+path;
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
