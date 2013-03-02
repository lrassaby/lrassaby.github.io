var map;
var lat = 42.37501;
var lng = -71.11619;

function initialize() {
	mapOptions = {
		zoom: 12, 
		center: new google.maps.LatLng(lat, lng),
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	map = new google.maps.Map(document.getElementById("canvas"), mapOptions);
	findMyLocation();
}
		
function findMyLocation() {
	if(navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
			infowindow = new google.maps.InfoWindow({
				map: map,
				position: pos,
				content: "<h3> My Location </h3>"
			});
		}, function() {
			message = document.createTextNode("Error: cannot get geolocation.")
			printError(message);
		});
	} else {  // Browser doesn't support Geolocation
		message = document.createTextNode("Error: your browser's too old for this.")
		printError(message);
	}
}

function printError(message) {
	topbar = document.getElementById("topbar");
	topbar.appendChild(document.createElement("p"));
	topbar.appendChild(message)
}
