var map;
var mypos;
var lat = 42.30321;
var lng = -71.09047;
var open_infowindow = null;

var redline_north = [];
var redline_braintree = [];
var redline_ashmont = [];

var t_icon = "assets/tsymbol.png";
var carmen = "assets/carmen.png";
var waldo = "assets/waldo.png";
markers = [];
var red = "#FF0000";


function initialize() {
	mapOptions = {
		zoom: 11, 
		center: new google.maps.LatLng(lat, lng),
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	map = new google.maps.Map(document.getElementById("canvas"), mapOptions);
	makeRedLine();
	mapRedLine();
	findMyLocation();
}

function makeRedLine() {
	var i = 0;
	redline_north.push(new google.maps.LatLng(42.395428,-71.142483));   	// alewife
	markers.push(new google.maps.Marker({title: "Alewife Station", position: redline_north[i++], icon: t_icon, map: map, ncode: "RALEN", scode: null}));
	redline_north.push(new google.maps.LatLng(42.39674,-71.121815));    	// davis
	markers.push(new google.maps.Marker({title: "Davis Station", position: redline_north[i++], icon: t_icon, map: map, ncode: "RDAVN", scode: "RDAVS"}));
	redline_north.push(new google.maps.LatLng(42.3884,-71.119149));			// porter square
	markers.push(new google.maps.Marker({title: "Porter Square Station", position: redline_north[i++], icon: t_icon, map: map, ncode: "RPORN", scode: "RPORS"}));
	redline_north.push(new google.maps.LatLng(42.373362,-71.118956));		// harvard square
	markers.push(new google.maps.Marker({title: "Harvard Square Station", position: redline_north[i++], icon: t_icon, map: map, ncode: "RHARN", scode: "RHARS"}));
	redline_north.push(new google.maps.LatLng(42.365486,-71.103802));   	// central square
	markers.push(new google.maps.Marker({title: "Central Square Station", position: redline_north[i++], icon: t_icon, map: map, ncode: "RCENN", scode: "RCENS"}));
	redline_north.push(new google.maps.LatLng(42.36249079,-71.08617653));	// kendall/mit
	markers.push(new google.maps.Marker({title: "Kendall/MIT Station", position: redline_north[i++], icon: t_icon, map: map, ncode: "RKENN", scode: "RKENS"}));
	redline_north.push(new google.maps.LatLng(42.361166,-71.070628));     	// charles/mgh
	markers.push(new google.maps.Marker({title: "Charles/MGH Station", position: redline_north[i++], icon: t_icon, map: map, ncode: "RMGHN", scode: "RMGHS"}));
	redline_north.push(new google.maps.LatLng(42.35639457,-71.0624242));	// park street
	markers.push(new google.maps.Marker({title: "Park St. Station", position: redline_north[i++], icon: t_icon, map: map, ncode: "RPRKN", scode: "RPRKS"}));
	redline_north.push(new google.maps.LatLng(42.355518,-71.060225));     	// downtown crossing
	markers.push(new google.maps.Marker({title: "Downtown Crossing Station", position: redline_north[i++], icon: t_icon, map: map, ncode: "RDTCN", scode: "RDTCS"}));
	redline_north.push(new google.maps.LatLng(42.352271,-71.055242));     	// south station
	markers.push(new google.maps.Marker({title: "South Station", position: redline_north[i++], icon: t_icon, map: map, ncode: "RSOUN", scode: "RSOUS"}));
	redline_north.push(new google.maps.LatLng(42.342622,-71.056967));		// broadway
	markers.push(new google.maps.Marker({title: "Broadway Station", position: redline_north[i++], icon: t_icon, map: map, ncode: "RBRON", scode: "RBROS"}));
	redline_north.push(new google.maps.LatLng(42.330154,-71.057655));     	// andrew
	markers.push(new google.maps.Marker({title: "Andrew Station", position: redline_north[i++], icon: t_icon, map: map, ncode: "RANDN", scode: "RANDS"}));
	intersect = new google.maps.LatLng(42.320685,-71.052391);				// jfk/umass
	redline_north.push(intersect);     	
	redline_braintree.push(intersect);
	redline_ashmont.push(intersect);								
	markers.push(new google.maps.Marker({title: "JFK/UMass Station", position: redline_north[i++], icon: t_icon, map: map, ncode: "RJFKN", scode: "RJFKS"}));
	 
	i = 1;
	redline_ashmont.push(new google.maps.LatLng(42.31129,-71.053331));		// savin hill
	markers.push(new google.maps.Marker({title: "Savin Hill Station", position: redline_ashmont[i++], icon: t_icon, map: map, ncode: "RSAVN", scode: "RSAVS"}));
	redline_ashmont.push(new google.maps.LatLng(42.300093,-71.061667));     // fields corner
	markers.push(new google.maps.Marker({title: "Fields Corner Station", position: redline_north[i++], icon: t_icon, map: map, ncode: "RFIEN", scode: "RFIES"}));
	redline_ashmont.push(new google.maps.LatLng(42.29312583,-71.06573796)); // shawmut
	markers.push(new google.maps.Marker({title: "Shawmut Station", position: redline_ashmont[i++], icon: t_icon, map: map, ncode: "RSHAN", scode: "RSHAS"}));
	redline_ashmont.push(new google.maps.LatLng(42.284652,-71.064489));		// ashmont
	markers.push(new google.maps.Marker({title: "Ashmont Station", position: redline_ashmont[i++], icon: t_icon, map: map, ncode: null, scode: "RASHS"}));
	
	i = 1;
	redline_braintree.push(new google.maps.LatLng(42.275275,-71.029583));	// north quincy
	markers.push(new google.maps.Marker({title: "North Quincy Station", position: redline_braintree[i++], icon: t_icon, map: map, ncode: "RNQUN", scode: "RNQUS"}));
	redline_braintree.push(new google.maps.LatLng(42.2665139,-71.0203369)); // wollaston
	markers.push(new google.maps.Marker({title: "Wollaston Station", position: redline_braintree[i++], icon: t_icon, map: map, ncode: "RWOLN", scode: "RWOLS"}));
	redline_braintree.push(new google.maps.LatLng(42.251809,-71.005409));	// quincy center
	markers.push(new google.maps.Marker({title: "Quincy Center Station", position: redline_north[i++], icon: t_icon, map: map, ncode: "RQUCN", scode: "RQUCS"}));
	redline_braintree.push(new google.maps.LatLng(42.233391,-71.007153));	// quincy adams
	markers.push(new google.maps.Marker({title: "Quincy Adams Station", position: redline_braintree[i++], icon: t_icon, map: map, ncode: "RQUAN", scode: "RQUAS"}));
	redline_braintree.push(new google.maps.LatLng(42.2078543,-71.0011385)); // braintree
	markers.push(new google.maps.Marker({title: "Braintree Station", position: redline_braintree[i++], icon: t_icon, map: map, ncode: null, scode: "RBRAS"}));
	addClickListeners();
}


function addClickListeners() {
	for(var i in markers) {
		google.maps.event.addListener(markers[i], 'click', function(){
			request = new XMLHttpRequest();
			request.open("GET", "http://mbtamap-cedar.herokuapp.com/mapper/redline.json", false);
			request.send(null);
			
			request.onreadystatechange = function() {
				if(request.readyState == request.DONE) {
					if(request.status == 200){
						json_response = JSON.parse(request.responseText);
						
					} 
					else {
						printMessage("Error: " + request.status + " when retreiving JSON listing.");
					}
				} 
			}
			/* This is the only solution we found -- adding another get request to wait for 
			 * previous request to finish. Credit to Trevor Rothouse. 
			 */
			request.open("GET", "http://mbtamap-cedar.herokuapp.com/mapper/redline.json", false);
			request.send(null);
			request.onreadystatechange = function() {}
			
			
			printSchedule(this);
			function printSchedule(marker) {	
				name = marker.title;
				northcode = marker.ncode;
				southcode = marker.scode;
				content = "<h3>" + name + "</h3> <table><tr><th>Direction</th><th>Time Until Arrival</th></tr>";
				for(var j in json_response) {
					key = json_response[j].PlatformKey;
					if(json_response[j].InformationType == "Predicted") {
						if(key == northcode) {
							content += "<tr><td>Northbound</td><td>" + json_response[j].TimeRemaining + '</td></tr>';
						} else if(key == southcode) {
							content += "<tr><td>Southbound</td><td>" + json_response[j].TimeRemaining + '</td></tr>';
						}
					}
				}				
				content += "</table>";
				if(open_infowindow != null) open_infowindow.close();
				open_infowindow = new google.maps.InfoWindow({
					map: map,
					position: marker.position, 
					content: content
				});
			}
			
		});
	}
}

function findWaldoandCarmen(mypos) {
	request = new XMLHttpRequest();
	try {
		request.open("GET", "http://messagehub.herokuapp.com/a3.json ");
		request.send(null);
		request.onreadystatechange = function() {
			if(request.readyState == request.DONE) {
				if(request.status == 200){
					json_response = JSON.parse(request.responseText);
					for(var i in json_response) {
						var name = json_response[i].name;
						if(name == "Waldo") {
							var icon = waldo;
						}
						else if(name == "Carmen Sandiego") {
							var icon = carmen;
						}
						var lat = json_response[i].loc.latitude;
						var lng = json_response[i].loc.longitude;
						var msg = json_response[i].loc.note;
						var pos = new google.maps.LatLng(lat, lng);
						new google.maps.Marker({title: name, position: pos, icon: icon, map: map});
						if(mypos) {
							var dist = calculateDistance(mypos, pos);
							printMessage(name + " is " + dist.toFixed(2) + " miles away. Note: " + msg);
						}
					}
				} 
				else {
					printMessage("Error: " + request.status + " when retreiving JSON listing. Can't find Waldo or Carmen.");
				}
			} 
		}
	}
	catch(error) {
		printMessage("Error: bad Waldo/Carmen listing.");
	}
}
		
function findMyLocation() {
	if(navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(
			function(position) {
				mypos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
				station = findClosestMarker(mypos);
				if(open_infowindow != null) open_infowindow.close();
				open_infowindow = new google.maps.InfoWindow({
					map: map,
					position: mypos, 
					content: "<h3> Found you! </h3> Closest station is <strong>" + station.title + "</strong> at a distance of " + station.distance.toFixed(2) + " miles."
				});
				mypos_to_station = new google.maps.Polyline({
					map: map,
					path: station.positionArr,
					strokeColor: "#000000",
					strokeOpacity: 0.5,
					strokeWeight: 8
				});
				positionmarker = new google.maps.Marker({
					map: map,
					position: mypos
				});
				map.setCenter(mypos);
				findWaldoandCarmen(mypos);
			}, 
			function() {
				printMessage("Error: cannot get geolocation. You may have it turned off.");
				findWaldoandCarmen();
			}
		);
	}
	else {  // Browser doesn't support Geolocation
		printMessage("Error: your browser has no support for geolocation.");
		findWaldoandCarmen();
	}
}


function mapRedLine() {
	redline_north_pline = new google.maps.Polyline({
		map: map,
		path: redline_north,
		strokeColor: red,
		strokeOpacity: 0.8,
		strokeWeight: 8
	});
	redline_ashmont_pline = new google.maps.Polyline({
		map: map,
		path: redline_ashmont,
		strokeColor: red,
		strokeOpacity: 0.8,
		strokeWeight: 8
	});
	redline_braintree_pline = new google.maps.Polyline({
		map: map,
		path: redline_braintree,
		strokeColor: red,
		strokeOpacity: 0.8,
		strokeWeight: 8
	});
	
}

function printMessage(message) {
	errorbar = document.getElementById("messages");
	errorbar.appendChild(document.createElement("br"));
	errorbar.appendChild(document.createTextNode(message));
}

function calculateDistance(mypos, pos) {
	var R = 3963.1676; // miles
	var lat = mypos.lat();
    var lng = mypos.lng();
    var pLat = pos.lat();
    var pLng = pos.lng();
    var dLat  = rad(pLat - lat);
    var dLong = rad(pLng - lng);
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(rad(lat)) * Math.cos(rad(lat)) * Math.sin(dLong/2) * Math.sin(dLong/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;
    return d;
}

function rad(x) {return x*Math.PI/180;}
/* haversine formula for distance: modified from an example on stackoverflow */
function findClosestMarker() {
	var lat = mypos.lat();
    var lng = mypos.lng();
    var R = 3963.1676; // radius of earth in miles
    var distances = [];
    var closest = -1;
    for(var i in markers) {
    	/*
        var mlat = markers[i].position.lat();
        var mlng = markers[i].position.lng();
        var dLat  = rad(mlat - lat);
        var dLong = rad(mlng - lng);
        var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(rad(lat)) * Math.cos(rad(lat)) * Math.sin(dLong/2) * Math.sin(dLong/2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        var d = R * c;
        */
        distances[i] = calculateDistance(mypos, markers[i].position;
        if ( closest == -1 || d < distances[closest] ) {
            closest = i;
        }
    }
    station = new Object();
    station.positionArr = [];
    station.positionArr[0] = markers[closest].position;
    station.positionArr[1] = mypos;
    station.title = markers[closest].title;
    station.distance = distances[closest];
    return station;
}
