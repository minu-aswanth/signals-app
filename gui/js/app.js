//default map
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
		var marker = L.marker([lat, lng]).bindLabel(signalName, { noHide: true }).addTo(mymap);
		marker.bindPopup('<input id="signalId" style="display:none" type="text" name="signalId" value="' + signalId + '">Latitude: <input id="latInput" type="text" name="lat" value="' + lat + '"><br>Longitude: <input id="lngInput" type="text" name="lng" value="' + lng + '"><br>Signal Name: <input id="signalNameInput" type="text" name="signalName" value="' + signalName + '"><br><button class="btn btn-primary" id="updateSignalButton">Update signal</button><button class="btn btn-primary" id="deleteSignalButton">Delete signal</button>');
		marker.on("popupopen", onPopupOpen);
	}

	for(i=0; i<signalsArray.length; i++){
		$("#createGroupButton").before('<input type="checkbox" name="signals[]" value="' + signalsArray[i].id + '">' + signalsArray[i].name + '<br>');
	}
	
});

//to open a popup
function addMarker(e) {
	var popup = L.popup()
		.setLatLng(e.latlng)
		.setContent('Latitude: <input id="latInput" type="text" name="lat" value="' + e.latlng.lat + '"><br>Longitude: <input id="lngInput" type="text" name="lng" value="' + e.latlng.lng + '"><br>Signal Name: <input id="signalNameInput" type="text" name="signalName"><br><button class="btn btn-primary" onclick="addSignal()">Add signal</button>')
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
		marker.bindPopup('<input id="signalId" style="display:none" type="text" name="signalId" value="' + signalId + '">Latitude: <input id="latInput" type="text" name="lat" value="' + lat + '"><br>Longitude: <input id="lngInput" type="text" name="lng" value="' + lng + '"><br>Signal Name: <input id="signalNameInput" type="text" name="signalName" value="' + signalName + '"><br><button class="btn btn-primary" id="updateSignalButton">Update signal</button><button class="btn btn-primary" id="deleteSignalButton">Delete signal</button>');
		marker.on("popupopen", onPopupOpen);
		$("#individualGroupForm").empty();
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
			marker.bindPopup('<input id="signalId" style="display:none" type="text" name="signalId" value="' + signalId + '">Latitude: <input id="latInput" type="text" name="lat" value="' + lat + '"><br>Longitude: <input id="lngInput" type="text" name="lng" value="' + lng + '"><br>Signal Name: <input id="signalNameInput" type="text" name="signalName" value="' + signalName + '"><br><button class="btn btn-primary" id="updateSignalButton">Update signal</button><button class="btn btn-primary" id="deleteSignalButton">Delete signal</button>');
			marker.on("popupopen", onPopupOpen);
			$("#individualGroupForm").empty();
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
			$("#individualGroupForm").empty();	
		});
    	
    });
}

//Second part i.e. groups

//individual
$("#individualGroupButton").click(function(){
	$("#individualGroupForm").empty();
	$.get("../utils/all.php", function(data, status){
		var signalsArray = JSON.parse(data);
		$("#individualGroupForm").append('Group Name: <input id="groupNameInput" type=text name="groupName"><br>');
		for(i=0; i<signalsArray.length; i++){
			$("#individualGroupForm").append('<input type="checkbox" name="signals" value="' + signalsArray[i].id + "|||" + signalsArray[i].name + '">' + signalsArray[i].name + '<br>');
		}
		$("#individualGroupForm").append('<br><button class="btn btn-success" id="createGroupButton">Create group</button>&nbsp&nbsp&nbsp<button class="btn btn-warning" id="cancelGroupButton">Cancel</button>');
		
		$("#createGroupButton").click(function(){
			var signalIds = [];
			var signalNames = [];
			$.each($("input[name='signals']:checked"), function(){            
                signalIds.push($(this).val().split("|||")[0]);
                signalNames.push($(this).val().split("|||")[1]);
            });
            var groupName = $("#groupNameInput").val();
            var data = {"name": groupName, "id": signalIds, "signalNames": signalNames};
            $.post("../utils/add_group.php", "x="+JSON.stringify(data), function(response, status){
            	$("#individualGroupForm").empty();
				if(response == "success")
					alert("Group was successfully created");
				else if(response == "signaloccupied")
					alert("One or more of the signals already belongs to another group");
				else
					alert("There was some error. Please try again");            	
            })
		});

		//cancel button closes destroys the form
		$("#cancelGroupButton").click(function(){
			$("#individualGroupForm").empty();
		});
	});
});

//draw on map
var drawnItems = new L.FeatureGroup();
    mymap.addLayer(drawnItems);
    var drawControl = new L.Control.Draw({
     	position: 'topright',
	  	draw: {
	    // disable toolbar item by setting it to false
	    polygon: false,
	    polyline: false,
	    circle: false, // Turns off this drawing tool
	    marker: false
	    },
        edit: {
            featureGroup: drawnItems,
            edit: false,
            remove: false
        }
    });
    mymap.addControl(drawControl);
mymap.on('draw:created', function(e) {
	$("#individualGroupForm").empty();
  	console.log(e.layer._latlngs[0]);
  	var latLimitsFirst = e.layer._latlngs[0][0].lat;
  	var latLimitsSecond = e.layer._latlngs[0][2].lat;
  	var lngLimitsFirst = e.layer._latlngs[0][0].lng;
  	var lngLimitsSecond = e.layer._latlngs[0][2].lng;
  	var signalIds = [];
  	var signalNames = [];
  	$.get("../utils/all.php", function(data, status){
		var signalsArray = JSON.parse(data);
		for(i=0;i<signalsArray.length;i++){
			var lat = signalsArray[i].lat;
			var lng = signalsArray[i].lon;
			var signalName = signalsArray[i].name;
			var signalId = signalsArray[i].id;
			if(lat > latLimitsFirst && lat < latLimitsSecond && lng > lngLimitsFirst && lng < lngLimitsSecond){
				signalIds.push(signalId);
				signalNames.push(signalName);
			}
		}
		console.log(signalIds);
		$("#individualGroupForm").append('Group Name: <input id="groupNameInput" type=text name="groupName"><br><br>You have selected:<br>');
		
		for(i=0; i<signalNames.length; i++){
			$("#individualGroupForm").append('<p>' + signalNames[i] + '</p>');
		}
		$("#individualGroupForm").append('<button class="btn btn-success" id="createGroupButton">Create group</button>&nbsp&nbsp&nbsp<button class="btn btn-warning" id="cancelGroupButton">Cancel</button>');
		
		$("#createGroupButton").click(function(){
            var groupName = $("#groupNameInput").val();
            var data = {"name": groupName, "id": signalIds, "signalNames": signalNames};
            $.post("../utils/add_group.php", "x="+JSON.stringify(data), function(response, status){
            	$("#individualGroupForm").empty();
				if(response == "success")
					alert("Group was successfully created");
				else
					alert("There was some error. Please try again");            	
            })
		});

		//cancel button closes destroys the form
		$("#cancelGroupButton").click(function(){
			$("#individualGroupForm").empty();
		});
	});
});

//next tab i.e showing created groups
$("#createdGroupsTab").click(function(){
	$("#groupsTable").empty();
	$("#groupsTable").append('<table class="table table-bordered"><thead><tr><th>Group Name</th><th>Signals in group</th><th>Delete group</th></tr></thead><tbody id="createdTableBody"></tbody></table>');
	$.get("../utils/get_all_groups.php", function(response, status){
		var parsedResponse = JSON.parse(response);
		for(i=0;i<parsedResponse.length;i++){
			var groupName = parsedResponse[i].name;
			var signalIds = parsedResponse[i].signals;
			var signalNames = parsedResponse[i].signalnames;
			$("#createdTableBody").append('<tr><td>' + groupName + '</td><td>' + signalNames + '</td><td><button class="btn btn-danger" value=' + signalIds + ' onclick="deleteGroup(this.value)">Delete</button></td></tr>');
		}
	});


});

function deleteGroup(ids){
	console.log(ids);
	$.post("../utils/delete_groups.php", "x="+ids, function(response, status){
		if(response == "success"){
			alert("The group was deleted successfully");
			$("#groupsTable").empty();
			$("#groupsTable").append('<table class="table table-bordered"><thead><tr><th>Group Name</th><th>Signals in group</th><th>Delete group</th></tr></thead><tbody id="createdTableBody"></tbody></table>');
			$.get("../utils/get_all_groups.php", function(response, status){
				var parsedResponse = JSON.parse(response);
				for(i=0;i<parsedResponse.length;i++){
					var groupName = parsedResponse[i].name;
					var signalIds = parsedResponse[i].signals;
					var signalNames = parsedResponse[i].signalnames;
					$("#createdTableBody").append('<tr><td>' + groupName + '</td><td>' + signalNames + '</td><td><button class="btn btn-danger" value=' + signalIds + ' onclick="deleteGroup(this.value)">Delete</button></td></tr>');
				}
			});
		}
		else
			alert("Some error occured. Please try again");
	});
}