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



//    !!! ->   TODO: replace 'username' in the line below with the merchants username.     <- !!!

var beachmart_dates = function(_app) {
	var theseTemplates = new Array('');
	var r = {


////////////////////////////////////   CALLBACKS    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\



	callbacks : {
//executed when extension is loaded. should include any validation that needs to occur.
		init : {
			onSuccess : function()	{
				var r = false; //return false if extension won't load for some reason (account config, dependencies, etc).

				//if there is any functionality required for this extension to load, put it here. such as a check for async google, the FB object, etc. return false if dependencies are not present. don't check for other extensions.
				r = true;

				return r;
				},
			onError : function()	{
//errors will get reported for this callback as part of the extensions loading.  This is here for extra error handling purposes.
//you may or may not need it.
				_app.u.dump('BEGIN admin_orders.callbacks.init.onError');
				}
			}
		}, //callbacks



////////////////////////////////////   ACTION    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

//actions are functions triggered by a user interaction, such as a click/tap.
//these are going the way of the do do, in favor of app events. new extensions should have few (if any) actions.
		a : {

			}, //Actions

////////////////////////////////////   RENDERFORMATS    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

//renderFormats are what is used to actually output data.
//on a data-bind, format: is equal to a renderformat. extension: tells the rendering engine where to look for the renderFormat.
//that way, two render formats named the same (but in different extensions) don't overwrite each other.
		renderFormats : {

			}, //renderFormats
////////////////////////////////////   UTIL [u]   \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

//utilities are typically functions that are exected by an event or action.
//any functions that are recycled should be here.
		u : {
		
				//returns: MONTH DAY, YEAR HOUR MIN SEC format. ie: september 14, 2013 16:48:10
			yyyymmdd2Pretty : function(str)	{
				var r = false;
				if(Number(str))	{
					var year = str.substr(0,4);
					var month = Number(str.substr(4,2));
					var day = str.substr(6,2);
					var hour = str.substr(8,2);
					var d = new Date();
					//mins and secs may not always be passed, use value if they are, 0 if not
					if (str.substr(10,2)) {var min = str.substr(10,2);}
					else {var min = 0;}
					if (str.substr(12,2)) {var sec = str.substr(12,2);}
					else {var sec = 0;}
					d.setFullYear(year, (month - 1), day);
//					_app.u.dump(" date obj: "); _app.u.dump(d);
//					_app.u.dump(" -> YYYYMMDD2Pretty ["+str+"]: Y["+year+"]  Y["+month+"]  Y["+day+"] ");
					r = this.getMonthFromNumber(d.getMonth())+" "+day+", "+year+" "+hour+":"+min+":"+sec;
				}
				else	{
					_app.u.dump("WARNING! the parameter passed into YYYYMMDD2Pretty is not a number ["+str+"]");
				}
				return r;
			}, //yyyymmdd2Pretty 
			
			
				//returns text format of day of the week based on date object value passed in
			getDOWFromDay : function(X)	{
				var weekdays = new Array('Sun','Mon','Tue','Wed','Thu','Fri','Sat');
				return weekdays[X];
			},
			
			
				//returns text format of month of the year based on date object value passed in
			getMonthFromNumber : function(X) {
				var months = new Array('january','february','march','april','may','june','july','august','september','october','november','december');
				return months[X];
			},
			
			
				//reformats millisecond time to YYYYMMDDHH
			millisecondsToYYYYMMDDHH : function(dateObj) {
				var year = dateObj.getFullYear();
				var month = dateObj.getMonth()+1; 
				var day = dateObj.getDate();
				var hours = dateObj.getHours();
				if (month < 10){month = '0'+month};
				if (day < 10){day = '0'+day};
				return ""+year+month+day+hours;
			},
			
			
				//reformats millisecond time to YYYYMMDD
			millisecondsToYYYYMMDD : function(dateObj) {
				var year = dateObj.getFullYear(); dump(year);
				var month = dateObj.getMonth()+1; 
				var day = dateObj.getDate();
				if (month < 10){month = '0'+month}; dump(month);
				if (day < 10){day = '0'+day}; dump(day);
				return ""+year+month+day;
			},
				
			
				//returns millisecond time for specific time zone. 
				//@param {number} offset offset from UTC for the time zone desired (ie: Florida is 4)
			makeUTCZoneTimeMS : function(offset) {
				var d = new Date();
				var localTime = d.getTime();
				var localOffset = d.getTimezoneOffset() * 6000;
				var UTC = localTime + localOffset;
				var homeTime = UTC + (3600000*offset);
				return homeTime; 
			},
			
			
				//returns millisecond time from YYYYMMDD
			yyyymmddToMilliseconds : function(date) {
		//		_app.u.dump('---> yyyymmddToMilliseconds');// _app.u.dump(date); 
				var year = date.slice(0,4);
				var month = date.slice(4,6);
				month = month - 1;
				var day = date.slice(6,8);
				_app.u.dump(''+year+' '+month+' '+day);
				var milliseconds = new Date(year,month,day).getTime();
//				_app.u.dump('---> yyyymmddToMilliseconds'); _app.u.dump(milliseconds);
				return milliseconds;
			},	
			
			
				//returns the sum of two YYYYMMDD dates (a date in the future)
			getFutureDate : function(A, B) {
//				_app.u.dump('---> getFutureDate'); _app.u.dump(A); _app.u.dump(B);
				var backorderDate = _app.ext.beachmart_dates.u.yyyymmddToMilliseconds(A);
				var presentShipDate = _app.ext.beachmart_dates.u.yyyymmddToMilliseconds(B);
				var today = new Date().getTime();
				var futureShipDate = (presentShipDate - today) + backorderDate;
				
//				_app.u.dump(backorderDate); _app.u.dump(presentShipDate); 
//				_app.u.dump(_app.ext.beachmart_dates.u.millisecondsToYYYYMMDD(new Date(futureShipDate)));
				futureShipDate = _app.ext.beachmart_dates.u.noWeekends(futureShipDate);
				return _app.ext.beachmart_dates.u.millisecondsToYYYYMMDD(new Date(futureShipDate));
 			},
			
			
				//makes sure date doesn't land on Sat or Sun (adds time to make Mon if so)
			noWeekends : function(date) {
//				_app.u.dump('--> noWeekends'); _app.u.dump(new Date(date).getDay());
				if(new Date(date).getDay() == 4) { return new Date().setTime(date + 172800000); } //it's sat, add two days
				else if(new Date(date).getDay() == 5) { return new Date().setTime(date + 86400000); } //it's sun, add one day
				else { return date; } //it's not sat or sun leave date alone.
			},
			
			
				//creates a new now time for _app time
			appTimeNow : function() {
				if(_app.data.time && _app.data.time.unix)	{
					return new Date(_app.data.time.unix*1000);
				} else { return false; }
			},
			
			//checks date arg passed in and returns true if it is in the future, false if it is in the past. arg should be in YYYYMMDD format
			dateAfterToday : function(compare) {
				dump('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!compare startes out as:'); dump(compare);
				var r = true; //what gets returned, false if compare date has already passed
				var today = new Date().getTime(); //dump('today is:'); dump(today); dump(_app.ext.beachmart_dates.u.millisecondsToYYYYMMDD(new Date(today)));
				compare = _app.ext.beachmart_dates.u.yyyymmddToMilliseconds(compare); //dump('the date to compare is:'); dump(compare); dump(_app.ext.beachmart_dates.u.millisecondsToYYYYMMDD(new Date(compare)));
				r = compare < today ? false : true; //dump(r);
				return r;
			}
			
		}, //u [utilities]

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