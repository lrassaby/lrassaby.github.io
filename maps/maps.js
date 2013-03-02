var map;
var mypos;
var json_response = [];
var lat = 42.30321;
var lng = -71.09047;

var redline_north = [];
var north_names = ["Alewife Station", "Davis Station", "Porter Square Station", "Harvard Square Station", "Central Square Station", "Kendall/MIT Station", "Charles/MGH Station", "Park St. Station", "Downtown Crossing Station", "South Station", "Broadway Station", "Andrew Station", "JFK/UMass Station"];

var redline_braintree = [];
var braintree_names = ["JFK/UMass Station", "North Quincy Station", "Wollaston Station", "Quincy Center Station", "Quincy Adams Station", "Braintree Station"];

var redline_ashmont = [];
var ashmont_names = ["JFK/UMass Station", "Savin Hill Station", "Fields Corner Station", "Shawmut Station", "Ashmont Station"];

var t_icon = "assets/tsymbol.png";
var carmen = "assets/carmen.png";
var waldo = "assets/waldo.png";
var markers = [];
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
	getJSONlisting();
	findMyLocation();
}

function makeRedLine() {
	redline_north.push(new google.maps.LatLng(42.395428,-71.142483));   	// alewife
	redline_north.push(new google.maps.LatLng(42.39674,-71.121815));    	// davis
	redline_north.push(new google.maps.LatLng(42.3884,-71.119149));			// porter square
	redline_north.push(new google.maps.LatLng(42.373362,-71.118956));		// harvard square
	redline_north.push(new google.maps.LatLng(42.365486,-71.103802));   	// central square
	redline_north.push(new google.maps.LatLng(42.36249079,-71.08617653));	// kendall/mit
	redline_north.push(new google.maps.LatLng(42.361166,-71.070628));     	// charles/mgh
	redline_north.push(new google.maps.LatLng(42.35639457,-71.0624242));	// park street
	redline_north.push(new google.maps.LatLng(42.355518,-71.060225));     	// downtown crossing
	redline_north.push(new google.maps.LatLng(42.352271,-71.055242));     	// south station
	redline_north.push(new google.maps.LatLng(42.342622,-71.056967));		// broadway
	redline_north.push(new google.maps.LatLng(42.330154,-71.057655));     	// andrew
	intersect = new google.maps.LatLng(42.320685,-71.052391);				// jfk/umass
	redline_north.push(intersect);     	
	redline_braintree.push(intersect);
	redline_ashmont.push(intersect);								
	redline_ashmont.push(new google.maps.LatLng(42.31129,-71.053331));		// savin hill
	redline_ashmont.push(new google.maps.LatLng(42.300093,-71.061667));     // fields corner
	redline_ashmont.push(new google.maps.LatLng(42.29312583,-71.06573796)); // shawmut
	redline_ashmont.push(new google.maps.LatLng(42.284652,-71.064489));		// ashmont
	redline_braintree.push(new google.maps.LatLng(42.275275,-71.029583));	// north quincy
	redline_braintree.push(new google.maps.LatLng(42.2665139,-71.0203369)); // wollaston
	redline_braintree.push(new google.maps.LatLng(42.251809,-71.005409));	// quincy center
	redline_braintree.push(new google.maps.LatLng(42.233391,-71.007153));	// quincy adams
	redline_braintree.push(new google.maps.LatLng(42.2078543,-71.0011385)); // braintree
	for(var i in redline_north) {
		markers.push(new google.maps.Marker({title: north_names[i], position: redline_north[i], icon: t_icon, map: map}));
	}
	for(var i in redline_ashmont) {
		markers.push(new google.maps.Marker({title: ashmont_names[i], position: redline_ashmont[i],  icon: t_icon, map: map}));
	}
	for(var i in redline_braintree) {
		markers.push(new google.maps.Marker({title: braintree_names[i], position: redline_braintree[i], icon: t_icon, map: map}));
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
					content: "<h3> Found you! </h3> Closest station is <strong>" + station.title + "</strong> at a distance of " + station.distance.toFixed(2) + " kilometers."
				});
				positionmarker = new google.maps.Marker({
					map: map,
					position: mypos
				});
				mypos_to_station = new google.maps.Polyline({
					map: map,
					path: station.positionArr,
					strokeColor: "#000000",
					strokeOpacity: 0.8,
					strokeWeight: 8
				});

			}, 
			function() {
				printMessage(document.createTextNode("Error: cannot get geolocation. You may have it turned off."));
			}
		);
	}
	else {  // Browser doesn't support Geolocation
		printMessage(document.createTextNode("Error: your browser has no support for geolocation."));
	}
}

function getJSONlisting() {
	try {
		request = new XMLHttpRequest();
		request.open("GET", "http://mbtamap-cedar.herokuapp.com/mapper/redline.json");
		request.send(null);
		request.onreadystatechange = checkStatus;
	}
	catch(error) {
		printMessage(document.createTextNode("Error: " + error.message));
	}
}

function checkStatus() {
	if(request.readyState == request.DONE) {
		if(request.status == 200){
			json_response = JSON.parse(request.responseText);
		} 
		else {
			printMessage(document.createTextNode("Error: " + request.status + " when retreiving JSON listing."));
		}
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
	errorbar = document.getElementById("error");
	errorbar.appendChild(document.createElement("br"));
	errorbar.appendChild(message);
}

function rad(x) {return x*Math.PI/180;}

function findClosestMarker() {
	var lat = mypos.lat();
    var lng = mypos.lng();
    var R = 6371; // radius of earth in km
    var distances = [];
    var closest = -1;
    for(var i=0; i < markers.length; i++) {
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
