var map;
var mypos;
var lat = 42.30321;
var lng = -71.09047;

var redline_north = [];
var north_names = ["Alewife Station", "Davis Station", "Porter Square Station", "Harvard Square Station", "Central Square Station", "Kendall/MIT Station", "Charles/MGH Station", "Park St. Station", "Downtown Crossing Station", "South Station", "Broadway Station", "Andrew Station", "JFK/UMass Station"];

var redline_braintree = [];
var braintree_names = ["JFK/UMass Station", "North Quincy Station", "Wollaston Station", "Quincy Center Station", "Quincy Adams Station", "Braintree Station"];

var redline_ashmont = [];
var ashmont_names = ["JFK/UMass Station", "Savin Hill Station", "Fields Corner Station", "Shawmut Station", "Ashmont Station"];


var codes = []; 
var t_icon = "assets/tsymbol.png";
var carmen = "assets/carmen.png";
var waldo = "assets/waldo.png";
var markers = [];
var red = "#FF0000";

var codes = [];

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
	findWaldoandCarmen();
}

function makeRedLine() {
	redline_north.push(new google.maps.LatLng(42.395428,-71.142483));   	// alewife
	codes["Alewife Station"] = ["RALEN", null];
	redline_north.push(new google.maps.LatLng(42.39674,-71.121815));    	// davis
	codes["Davis Station"] = ["RDAVN", "RDAVS"];
	redline_north.push(new google.maps.LatLng(42.3884,-71.119149));			// porter square
	codes["Porter Square Station"] = ["RPORN", "RPORS"];
	redline_north.push(new google.maps.LatLng(42.373362,-71.118956));		// harvard square
	codes["Harvard Square Station"] = ["RHARN", "RHARS"];
	redline_north.push(new google.maps.LatLng(42.365486,-71.103802));   	// central square
	codes["Central Square Station"] = ["RCENN", "RCENS"];
	redline_north.push(new google.maps.LatLng(42.36249079,-71.08617653));	// kendall/mit
	codes["Kendall/MIT Station"] = ["RKENN", "RKENS"];
	redline_north.push(new google.maps.LatLng(42.361166,-71.070628));     	// charles/mgh
	codes["Charles/MGH Station"] = ["RMGHN", "RMGHS"];
	redline_north.push(new google.maps.LatLng(42.35639457,-71.0624242));	// park street
	codes["Park St. Station"] = ["RPRKN", "RPRKS"];
	redline_north.push(new google.maps.LatLng(42.355518,-71.060225));     	// downtown crossing
	codes["Downtown Crossing Station"] = ["RDTCN", "RDTCS"];
	redline_north.push(new google.maps.LatLng(42.352271,-71.055242));     	// south station
	codes["South Station"] = ["RSOUN", "RSOUS"];
	redline_north.push(new google.maps.LatLng(42.342622,-71.056967));		// broadway
	codes["Broadway Station"] = ["RBRON", "RBROS"];
	redline_north.push(new google.maps.LatLng(42.330154,-71.057655));     	// andrew
	codes["Andrew Station"] = ["RANDN", "RANDS"];
	intersect = new google.maps.LatLng(42.320685,-71.052391);				// jfk/umass
	redline_north.push(intersect);     	
	redline_braintree.push(intersect);
	redline_ashmont.push(intersect);								
	codes["JFK/UMass Station"] = ["RJFKN", "RJFKS"];
	redline_ashmont.push(new google.maps.LatLng(42.31129,-71.053331));		// savin hill
	codes["Savin Hill Station"] = ["RSAVN", "RSAVS"];
	redline_ashmont.push(new google.maps.LatLng(42.300093,-71.061667));     // fields corner
	codes["Fields Corner Station"] = ["RFIEN", "RFIES"];
	redline_ashmont.push(new google.maps.LatLng(42.29312583,-71.06573796)); // shawmut
	codes["Shawmut Station"] = ["RSHAN", "RSHAS"];
	redline_ashmont.push(new google.maps.LatLng(42.284652,-71.064489));		// ashmont
	codes["Ashmont Station"] = [null, "RASHS"];
	redline_braintree.push(new google.maps.LatLng(42.275275,-71.029583));	// north quincy
	codes["North Quincy Station"] = ["RNQUN", "RNQUS"];
	redline_braintree.push(new google.maps.LatLng(42.2665139,-71.0203369)); // wollaston
	codes["Wollaston Station"] = ["RWOLN", "RWOLS"];
	redline_braintree.push(new google.maps.LatLng(42.251809,-71.005409));	// quincy center
	codes["Quincy Center Station"] = ["RQUCN", "RQUCS"];
	redline_braintree.push(new google.maps.LatLng(42.233391,-71.007153));	// quincy adams
	codes["Quincy Adams Station"] = ["RQUAN", "RQUAS"];
	redline_braintree.push(new google.maps.LatLng(42.2078543,-71.0011385)); // braintree
	codes["Braintree Station"] = [null, "RBRAS"];
	for(var i in redline_north) {
		markers.push(new google.maps.Marker({title: north_names[i], position: redline_north[i], icon: t_icon, map: map}));
	}
	for(i = 1; i < redline_ashmont.length; i++) {
		markers.push(new google.maps.Marker({title: ashmont_names[i], position: redline_ashmont[i],  icon: t_icon, map: map}));
	}
	for(i = 1; i < redline_braintree.length; i++) {
		markers.push(new google.maps.Marker({title: braintree_names[i], position: redline_braintree[i], icon: t_icon, map: map}));
	}
	addClickListeners();
}

function addClickListeners() {
	for(var i in markers) {
		google.maps.event.addListener(markers[i], 'click', function(){
			request = new XMLHttpRequest();
			request.open("GET", "http://mbtamap-cedar.herokuapp.com/mapper/redline.json");
			request.send(null);
			request.onreadystatechange = function() {
				if(request.readyState == request.DONE) {
					if(request.status == 200){
						json_response = JSON.parse(request.responseText);
						name = this.title;
						northcode = codes[name][0];
						southcode = codes[name][1];
						northbound = [];
						southbound = [];
						for(var j in json_response) {
							key = json_response[j].PlatformKey;
							if(key == northcode) {
								northbound.push(json_response[j]);
							} else if(key == southcode) {
								southbound.push(json_response[j]);
							}
						}
					} 
					else {
						printMessage("Error: " + request.status + " when retreiving JSON listing.");
					}
				} 
			}
		});
	}
}

function findWaldoandCarmen() {
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
						var dist = calculateDistance(pos);
						printMessage(name + " is " + dist + " miles away. Note: " + msg);
					}
				} 
				else {
					printMessage("Error: " + request.status + " when retreiving JSON listing.");
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
				infowindow = new google.maps.InfoWindow({
					map: map,
					position: mypos, 
					content: "<h3> I found you! </h3> Closest station is <strong>" + station.title + "</strong> at a distance of " + station.distance.toFixed(2) + " miles."
				});
				positionmarker = new google.maps.Marker({
					map: map,
					position: mypos
				});
				mypos_to_station = new google.maps.Polyline({
					map: map,
					path: station.positionArr,
					strokeColor: "#000000",
					strokeOpacity: 0.5,
					strokeWeight: 8
				});
				map.setCenter(mypos);

			}, 
			function() {
				printMessage("Error: cannot get geolocation. You may have it turned off.");
			}
		);
	}
	else {  // Browser doesn't support Geolocation
		printMessage("Error: your browser has no support for geolocation.");
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

function calculateDistance(point_b) {
	var R = 3963.1676; // miles
	var lat = mypos.lat();
    var lng = mypos.lng();
    var blat = point_b.lat();
    var blng = point_b.lng();
    var dLat  = rad(blat - lat);
    var dLong = rad(blng - lng);
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
        var mlat = markers[i].position.lat();
        var mlng = markers[i].position.lng();
        var dLat  = rad(mlat - lat);
        var dLong = rad(mlng - lng);
        var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(rad(lat)) * Math.cos(rad(lat)) * Math.sin(dLong/2) * Math.sin(dLong/2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        var d = R * c;
        distances[i] = d;
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
