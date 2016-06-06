// Global variable declarations

var APPID = "89c2f6ec1e145fd124fc3f4dc6f87846";
var temp;
var desc;
var loc;
var pic;
var humidity;
var wind;
var geoOptions = {
	maximumAge: 5 * 60 * 1000,
	timeout: 10 * 1000,
	}

// API calls

function updateByGeo(lat, lon) {
	var url = "http://api.openweathermap.org/data/2.5/weather?" +
		"lat=" + lat +
		"&lon=" + lon +
		"&APPID=" + APPID;
	sendRequest(url);
}

function updateByCity(city) {
	var url = "http://api.openweathermap.org/data/2.5/weather?" +
		"q=" + city +
		"&APPID=" + APPID;
	sendRequest(url);
	console.log(url);
}

function sendRequest(url) {
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			var data = JSON.parse(xmlhttp.responseText);
			var weather = {};
			weather.pic = data.weather[0].icon;
			// weather.pic = "50n";
			weather.humidity = data.main.humidity;
			weather.wind = mphToKmh(data.wind.speed);
			weather.loc = data.name + ", " + data.sys.country;
			weather.temp = K2C(data.main.temp);
			weather.desc = toTitleCase(data.weather[0].description);
			update(weather);
		}
	};
	xmlhttp.open("GET", url, true);
	xmlhttp.send();
}

// Helper functions

function K2C(k) {
	return Math.round(k - 273.15);
}

function C2F(c) {
	return Math.round(c * 1.8 + 32);
}

function F2C(f) {
	return Math.round((f - 32) / 1.8);
}

function tempSwitcherF2C() {
	if (celsius.className != "temp-active") {
		celsius.className = "temp-active";
		fahrenheit.className = "";
		temp.innerHTML = F2C(+temp.innerHTML);
		tempUnit.innerHTML = "&deg;&nbsp;C";	
	}
}

function tempSwitcherC2F() {
	if (fahrenheit.className != "temp-active") {
		fahrenheit.className = "temp-active";
		celsius.className = "";
		temp.innerHTML = C2F(+temp.innerHTML);
		tempUnit.innerHTML = "&deg;&nbsp;F";	
	}	
}

function switchCity () {
	var city = String(window.prompt("Please type your city here:"));
	// var city = "London";
	updateByCity(city);	
}

function showCredits() {
	window.alert("Built for Free Code Camp by Sebastien Phlix.\nThanks to Samuel Q. Green and Designify.me from Noun Project for the beautiful icons <3");
}


function mphToKmh(mph) {
	var kmh = mph * 1.60934;
	kmh = +kmh.toFixed(1);
	return kmh;
}

function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt) {
    	return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    	}
    );
}

// Editing the HTML

function update(weather) {
	temp.innerHTML = weather.temp;
	desc.innerHTML = weather.desc;
	loc.innerHTML = weather.loc;
	humidity.innerHTML = weather.humidity;
	wind.innerHTML = weather.wind;
	// pic.src = "imgs/" + weather.pic + ".png";
	document.getElementById("img-container").style.backgroundImage = "url(imgs/" + weather.pic + ".png)";
	console.log(weather.pic);
}

// Using geolocation

function geoSuccess(position) {
	console.log("ran geoSuccess");
	lat = position.coords.latitude;
	lon = position.coords.longitude;
	updateByGeo(lat, lon);
}

function geoError() {
	console.log("ran geoError");
    var city = String(window.prompt("Uh oh! It looks like you disabled location services in your browser. Please type your city here:"));
	// var city = "London";
	updateByCity(city);	
}

// Loading the script

window.onload = function() {
	temp = document.getElementById("temperature");
	desc = document.getElementById("description");
	loc = document.getElementById("location");
	pic = document.getElementById("background-pic");
	humidity = document.getElementById("humidity");
	wind = document.getElementById("wind");
	celsius = document.getElementById("celsius");
	fahrenheit = document.getElementById("fahrenheit");
	tempUnit = document.getElementById("temp-unit");
	citySwitch = document.getElementById("switch-city");
	credits = document.getElementById("credits");

	celsius.addEventListener("click", tempSwitcherF2C);
	fahrenheit.addEventListener("click", tempSwitcherC2F);
	citySwitch.addEventListener("click", switchCity);
	credits.addEventListener("click", showCredits);
	
	navigator.geolocation.getCurrentPosition(geoSuccess, geoError, geoOptions);
}

