var APPID = "89c2f6ec1e145fd124fc3f4dc6f87846";
var temp;
var loc;
var icon;
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

function sendRequest(url) {
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			var data = JSON.parse(xmlhttp.responseText);
			var weather = {};
			weather.icon = data.weather[0].id;
			weather.humidity = data.main.humidity;
			weather.wind = data.wind.speed;
			weather.loc = data.name;
			weather.temp = K2C(data.main.temp);
			update(weather);
		}
	};
	xmlhttp.open("GET", url, true);
	xmlhttp.send();
}

function K2C (k) {
	return Math.round(k - 273.15);
}

function update(weather) {
	temp.innerHTML = weather.temp;
	loc.innerHTML = weather.loc;
	humidity.innerHTML = weather.humidity;
	wind.innerHTML = weather.wind;
	icon.src = "imgs/" + weather.icon + ".png";
}

function showPosition(position) {
	updateByGeo(position.coords.latitude, position.coords.longitude);
}

window.onload = function() {
	temp = document.getElementById("temperature");
	loc = document.getElementById("location");
	icon = document.getElementById("icon");
	humidity = document.getElementById("humidity");
	wind = document.getElementById("wind");

	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(showPosition);
	} else {
		var zip = String(window.prompt("Could not discover your location. What is your zip code?"));
		updateByZip(zip);	
	}

	

}