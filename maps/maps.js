var map;
var lat = 42.37501;
var lng = -71.11619;
var redline_north = [];
var redline_braintree = [];
var redline_ashmont = [];
var t_icon = "assets/tsymbol.png";
var markers = [];


function initialize() {
	mapOptions = {
		zoom: 12, 
		center: new google.maps.LatLng(lat, lng),
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	map = new google.maps.Map(document.getElementById("canvas"), mapOptions);
	makeRedLine();
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
	redline_braintree.push(new google.maps.LatLng(42.2665139,-71.0203369)); // wolllaston
	redline_braintree.push(new google.maps.LatLng(42.251809,-71.005409));	// quincy center
	redline_braintree.push(new google.maps.LatLng(42.233391,-71.007153));	// quincy adams
	redline_braintree.push(new google.maps.LatLng(42.2078543,-71.0011385)); // braintree
}
		
function findMyLocation() {
	if(navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
			infowindow = new google.maps.InfoWindow({
				map: map,
				position: pos,
				content: "<h3> You are here! </h3>"
			});
		}, function() {
			message = document.createTextNode("Error: cannot get geolocation. You may be blocking it.")
			printMessage(message);
		});
	} else {  // Browser doesn't support Geolocation
		message = document.createTextNode("Error: your browser has no support for geolocation.")
		printMessage(message);
	}
}

function mapRedLine() {
	redline_north_pline = new google.maps.Polyline({
		path: redline_north,
		strokeColor: "#FF0000",
		strokeOpacity: 1.0,
		strokeWeight: 15
	});
	redline_ashmont_pline = new google.maps.Polyline({
		path: redline_ashmont,
		strokeColor: "#FF0000",
		strokeOpacity: 1.0,
		strokeWeight: 15
	});
	redline_braintree_pline = new google.maps.Polyline({
		path: redline_braintree,
		strokeColor: "#FF0000",
		strokeOpacity: 1.0,
		strokeWeight: 15
	});
	redline_north_pline.setmap(map);
	redline_ashmont_pline.setmap(map);
	redline_braintree_pline.setmap(map);
}

function printMessage(message) {
	topbar = document.getElementById("topbar");
	topbar.appendChild(document.createElement("p"));
	topbar.appendChild(message)
}
