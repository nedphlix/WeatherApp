var APPID = "89c2f6ec1e145fd124fc3f4dc6f87846";
var temp;
var desc;
var loc;
var pic;
var humidity;
var wind;

function updateByZip(zip) {
	var url = "http://api.openweathermap.org/data/2.5/weather?" +
		"zip=" + zip +
		"&APPID=" + APPID;
	sendRequest(url);  
}

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

function K2C (k) {
	return Math.round(k - 273.15);
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

function showPosition(position) {
	updateByGeo(position.coords.latitude, position.coords.longitude);
}

window.onload = function() {
	temp = document.getElementById("temperature");
	desc = document.getElementById("description");
	loc = document.getElementById("location");
	pic = document.getElementById("background-pic");
	humidity = document.getElementById("humidity");
	wind = document.getElementById("wind");

	if (!navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(showPosition);
	} else {
		var city = String(window.prompt("Could not discover your location. Please enter a city:"));
		// var city = "London";
		updateByCity(city);	
	}

	

}