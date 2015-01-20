
//
// SITEMAP GENERATOR
//


var fs = require('fs');
var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
var dateFormat = require('dateformat');
var now = new Date();

var opts = require('nomnom')
        .option('domain', {
                abbr: 'd',
                required : true,
                help : 'domain to generate a sitemap for'
                })
        .option('path', {
                abbr: 'p',
                default : './',
                help : 'path to write the file'
                })
		.option('customurls',{
				abbr:'c',
				default : false,
				help : 'path to json file containing an array of custom urls to be added to the sitemap'
				}).parse();

var DOMAIN = opts['domain'];
var PATH = opts['path'];
var URLS = new Array;           // a list of URLS *without* the domain name ex: /path/to/file

//
// step1: load any extra files
//
if(opts['customurls']){
	console.log('Trying to load custom urls from file: '+opts['customurls']);
	if(opts['customurls'].charAt(0) !== "."){
		opts['customurls'] = "./"+opts['customurls'];
		}
	var customUrls;
	try{
		customUrls = require(opts['customurls']);
		if(customUrls instanceof Array){
			URLS = URLS.concat(customUrls);
			}
		else {
			console.err("Custom URL file specified was not an Array");
			}
		}
	catch(e){
		throw "Either could not load custom urls from path: "+opts['customurls']+" or specified json file was not an Array";
		}
	
	}

//
// now load all products and categories
//

var CommerceEngine = require('./commerce-engine.js');
var ce = new CommerceEngine(DOMAIN, {'pipelineSize':500});

var request = new XMLHttpRequest();
request.open('GET','http://'+DOMAIN+'/jsonapi/call/v201411/appSEOFetch',false);	
request.send(null);

var urls = JSON.parse(request.responseText);
//console.log(urls['@OBJECTS']);


function cleanURIComponent(str){
	//trims whitespace
	var component = str.replace(/^\s+|\s+$/g, '');
	component = str.replace('--','-'); //just in case, some prod_names have two consecutive "-"
	component = str.replace('---','-'); //just in case, some prod_names have three consecutive "-"
	//replaces all non alphanumerics with dashes
	component = component.replace(/[^a-zA-Z0-9]+/g, '-');
	component = component.toLowerCase();
	return component;
}
var someArray = [];
function getOtherAttribs(thisObj,num) {
ce.enqueue({
			"pid": thisObj.id,
			"_cmd": "appProductGet"
		}, 
		function(response){
			if(response['%attribs']['zoovy:prod_name'] != "undefined") {
				thisObj.nameURL = cleanURIComponent(response['%attribs']['zoovy:prod_name']);
				someArray.push(thisObj);
				pooCount++
				console.log(thisObj.id);
			}
		});
		
}

var count = 0;
var pooCount = 0;
//	for(var a in urls['@OBJECTS']) {
//		var ctArray = urls['@OBJECTS'][a];
//		if(!ctArray['noindex'] && ctArray.type === "pid") { 
//			count++; //console.log(count); 
//		}
//	}

for(var j in urls['@OBJECTS']) {
//for(var j = 0; j < 151; j++) {
	var blah = urls['@OBJECTS'][j];
	//if(blah.type === "pid") {
	if(!blah['noindex'] && blah.type === "pid") {
		count++;
		//console.log(count);
		getOtherAttribs(blah,count);
		ce.dispatch(function(data) {
		//	console.log(pooCount);
			//console.log(count);
		//	if(pooCount > 190) console.log(someArray);
		//	if(someArray.length == count) {
		//		console.log('DONE');
		//	}
		});
	}
}

//while(count < 759) { setTimeout(function(){},500); console.log(count); }
//console.log(someArray);

/*
var today = new Date();
var datestr = dateFormat(now,"yyyy-mm-dd");

for( var i in urls['@OBJECTS'] ) {
        // { id: '.mlb.boston_red_sox.z_david_ortiz', type: 'navcat' }
        var res = urls['@OBJECTS'][i];
		if(!res['noindex']){ //changed from "seo:noindex" because was only being returned as "noindex", which was failing the test.
				var url = '';
				switch (res.type) {
						case 'pid':
								//url = '/product/' + res.id + '/';
								url = JSON.stringify(res);
								break;
						case 'navcat':
								//All categories for beachmall handled with custom urls since pretty names are used as path.
								//url = '/category/' + res.id.substr(1) +'/';  // strip leading . in category name
								break;
						case 'list' :
								// we don't index these.
								break;
						default :
								console.log(res);
								break;
						}
				if (url) {
						URLS.push(url);
						}
				}
		else {
			//console.log('Following object was skipped due to inclusion of seo:noindex attribute:');
			//console.dir(res);
				}
        }
		//console.log('URLS:');
		//console.log(URLS);


//
// SPLIT URLS INTO 50000 URL CHUNKS
//
var CHUNKCOUNT = 0;
var CHUNKS = new Array;
while (URLS.length > 0) {
        if (CHUNKS[CHUNKCOUNT]  == null) { CHUNKS[CHUNKCOUNT] = new Array; }    // initialize array
        CHUNKS[CHUNKCOUNT].push( URLS.shift() );
        if (CHUNKS[CHUNKCOUNT].length >= 50000) { CHUNKCOUNT++; }
        }

//
// GENERATE THE FILES
//              sitemap.xml :index to all files
//              sitemap-www.domain.com-1.xml : file
//
var XMLWriter = require('xml-writer');
si = new XMLWriter;
si.startDocument();
//si.startElement('urlset').writeAttribute('xmlns','http://www.google.com/schemas/sitemap/0.84');
//si.writeRaw("\n");
si.startElement('sitemapindex').writeAttribute('xmlns','http://www.sitemaps.org/schemas/sitemap/0.9');
si.writeRaw("\n");
var FILENUM = 0;
while (CHUNKS.length>0) {
        var XMLWriter = require('xml-writer');
        xw = new XMLWriter;
        xw.startDocument();
        xw.startElement('urlset').writeAttribute('xmlns','http://www.google.com/schemas/sitemap/0.84');
        xw.writeRaw("\n");
        // write the files
        URLS = CHUNKS.shift();
        for(var i in URLS) {
                var url = URLS[i];
                url = 'http://' + DOMAIN + url;
                xw.startElement("url");
                        xw.startElement("loc").text(url).endElement();
                        xw.startElement("priority").text("1").endElement();
                xw.endElement();
                xw.writeRaw("\n");
                }
        xw.endDocument();
        FILENUM++;


        var FILENAME = 'sitemap-'+DOMAIN+'-'+FILENUM+'.xml';
        si.startElement('sitemap');
                si.startElement('loc').text( 'http://' + DOMAIN + '/' + FILENAME).endElement();
                si.startElement('lastmod').text(datestr).endElement();
        si.endElement();
        si.writeRaw("\n");

        console.log('writing '+PATH+FILENAME);
        fs.writeFileSync(PATH + FILENAME,xw.toString());
        //   console.log(xw.toString());
        }

console.log('writing '+PATH+'sitemap.xml');
fs.writeFileSync(PATH + 'sitemap.xml', si.toString());
console.log('done');
*/