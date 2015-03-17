function initialize() {
	FMEServer.init({
		server: "https://fmewt15-safe-software.fmecloud.com",
		token: "3dcba266ab918fbe17e1c950334bfc1098faf5ac"
	});

	var myLatlng = new google.maps.LatLng(49.264549,-123.114166);

	var myOptions = {
		zoom: 8,
		center: myLatlng,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		mapTypeControl: true,
		mapTypeControlOptions: {
			style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
			position: google.maps.ControlPosition.LEFT_BOTTOM
		},
	}

	var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

	// Storage for Markers
	var markers = new Array();
	var markers2 = new Array();
	var markers3 = new Array();
	var markers4 = new Array();


	// Storage for WebSocket connections
	var wsG1, wsG2, wsG3, wsG4;

	var imageRoot = '/fmepedia-realtime-sensor-data/www/libs/';
	//1 = green
	var image1 = imageRoot + 'number_1.png';
	//2 = blue
	var image2 = imageRoot + 'number_2.png';
	//3 = red
	var image3 = imageRoot + 'number_3.png';
	//4 = yellow
	var image4 = imageRoot + 'number_4.png';

	// Do we have web sockets?
	if ("WebSocket" in window) {
	
		//GROUP 1
		wsG1 = FMEServer.getWebSocketConnection("group1");
		wsG1.onmessage = function (evt) {
			displayPoints(evt, markers, 'group1', image1);
		};

		//GROUP 2
		wsG2 = FMEServer.getWebSocketConnection("group2");
		wsG2.onmessage = function (evt) {
			displayPoints(evt, markers2, 'group2', image2);
		};

		//GROUP 3
		wsG2 = FMEServer.getWebSocketConnection("group3");
		wsG2.onmessage = function (evt) {
			displayPoints(evt, markers3, 'group3', image3);
		};

		//GROUP 4
		wsG2 = FMEServer.getWebSocketConnection("group4");
		wsG2.onmessage = function (evt) {
			displayPoints(evt, markers4, 'group4', image4);
		};
		
	} else {
		alert("Your broswer does not support WebSockets. Try using the latest Firefox, Chrome or Safari browser.");

	};

	function displayPoints(evt, markers, group, image){

			var data = evt.data;

			log_message(data, group);

			dataObj = JSON.parse(data);
			loaderID = dataObj.loaderID;
			var point = new google.maps.LatLng(dataObj['Latitude'],dataObj['Longitude']);
      
      		var imgScaledSize = new google.maps.Size(30,35);
			var markerImg = new google.maps.MarkerImage(image, null, null, null, imgScaledSize);
			
			if(markers[loaderID] == undefined) {

				var title = "LoaderID" + loaderID;
				var marker = new google.maps.Marker({
					position: point,
					map: map,
					title: title,
					icon: markerImg
				});
				markers[loaderID] = marker;
			}
			else {
				markers[loaderID].setPosition(point);
			}
	}

	/*** Function to log received WebSocket messages ***/
	function log_message(message, div_id) {
		var div = document.getElementById(div_id);
		div.innerHTML = '<p>' + message+'</p>';
	}

}

	

