var mymap = L.map('mainMap').setView([17.3850, 78.4867], 13);
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
	maxZoom: 18,
	id: 'mapbox.streets',
	accessToken: 'pk.eyJ1IjoibWludS1hc3dhbnRoIiwiYSI6ImNqMmZ5eHI2NjA3NTcycW84cWJ0aTVhNTMifQ.gr7zDVUOL4aNC5XFZD4CiA'
}).addTo(mymap);
mymap.on('click', addMarker);

//add existing markers
$.get("../utils/all.php", function(data, status){
	var signalsArray = JSON.parse(data);
	for(i=0; i<signalsArray.length; i++){
		var lat = signalsArray[i].lat;
		var lng = signalsArray[i].lon;
		var signalName = signalsArray[i].name;
		var signalId = signalsArray[i].id;
		var marker = L.marker([lat, lng]).addTo(mymap);
		marker.bindPopup('<input id="signalId" style="display:none" type="text" name="signalId" value="' + signalId + '">Latitude: <input id="latInput" type="text" name="lat" value="' + lat + '"><br>Longitude: <input id="lngInput" type="text" name="lng" value="' + lng + '"><br>Signal Name: <input id="signalNameInput" type="text" name="signalName" value="' + signalName + '"><br><button id="updateSignalButton">Update signal</button><button id="deleteSignalButton">Delete signal</button>');
		marker.on("popupopen", onPopupOpen);
	}
});

//to open a popup
function addMarker(e) {
	var popup = L.popup()
		.setLatLng(e.latlng)
		.setContent('Latitude: <input id="latInput" type="text" name="lat" value="' + e.latlng.lat + '"><br>Longitude: <input id="lngInput" type="text" name="lng" value="' + e.latlng.lng + '"><br>Signal Name: <input id="signalNameInput" type="text" name="signalName"><br><button onclick="addSignal()">Add signal</button>')
		.openOn(mymap);
}

//to create a marker and bind a popup
function addSignal(){
	var lat = document.getElementById('latInput').value;
	var lng = document.getElementById('lngInput').value;
	var signalName = document.getElementById('signalNameInput').value;
	var data = {"lat": lat, "lon": lng, "name": signalName};
	console.log(data);
	 
	$.post("../utils/insert.php", "x="+JSON.stringify(data), function(response, status){
		console.log(response);
		var signalId = JSON.parse(response);
		
		mymap.closePopup();
		var marker = L.marker([lat, lng]).addTo(mymap);
		marker.bindPopup('<input id="signalId" style="display:none" type="text" name="signalId" value="' + signalId + '">Latitude: <input id="latInput" type="text" name="lat" value="' + lat + '"><br>Longitude: <input id="lngInput" type="text" name="lng" value="' + lng + '"><br>Signal Name: <input id="signalNameInput" type="text" name="signalName" value="' + signalName + '"><br><button id="updateSignalButton">Update signal</button><button id="deleteSignalButton">Delete signal</button>');
		marker.on("popupopen", onPopupOpen);
	});
	
}

function onPopupOpen() {
    var tempMarker = this;
    document.getElementById("updateSignalButton").addEventListener("click", function(){
    	var lat = document.getElementById('latInput').value;
		var lng = document.getElementById('lngInput').value;
		var signalName = document.getElementById('signalNameInput').value;
		var signalId = document.getElementById("signalId").value;
		var data = {"id": signalId, "lat": lat, "lon": lng, "name": signalName};
		console.log(data); 
		$.post("../utils/update.php", "x="+JSON.stringify(data), function(response, status){
			console.log(response);
			var signalId = JSON.parse(response);
			//remove existing marker
			mymap.removeLayer(tempMarker);
			//add new marker
			var marker = L.marker([lat, lng]).addTo(mymap);
			//bind new popup
			marker.bindPopup('<input id="signalId" style="display:none" type="text" name="signalId" value="' + signalId + '">Latitude: <input id="latInput" type="text" name="lat" value="' + lat + '"><br>Longitude: <input id="lngInput" type="text" name="lng" value="' + lng + '"><br>Signal Name: <input id="signalNameInput" type="text" name="signalName" value="' + signalName + '"><br><button id="updateSignalButton">Update signal</button><button id="deleteSignalButton">Delete signal</button>');
			marker.on("popupopen", onPopupOpen);
		});
	});
    document.getElementById("deleteSignalButton").addEventListener("click", function(){
    	var lat = document.getElementById('latInput').value;
		var lng = document.getElementById('lngInput').value;
		var signalName = document.getElementById('signalNameInput').value;
		var signalId = document.getElementById("signalId").value;
		var data = {"id": signalId, "lat": lat, "lon": lng, "name": signalName};
		console.log(data); 
		$.post("../utils/delete.php", "x="+JSON.stringify(data), function(response, status){
			console.log(response);
			var signalId = JSON.parse(response);
			mymap.removeLayer(tempMarker);
		});
    	
    });
}