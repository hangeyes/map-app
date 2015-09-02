var mapApp = angular.module("mapApp", ['chart.js']);
mapApp.controller("infoCtrl", function($scope, $http) {
	var geojson;
	$http.get("http://divi.gis-support.pl/api/features/OQ.7kYuqmYHgl8H1fa2vFxavO2Eu8w").success(function(response) {
		$scope.objects = response.features;
		$scope.properties = response.features[1].properties;
		var map = L.map('map').setView([
              52.4102835766679,
              16.8758386862567
            ], 14);
	L.tileLayer('http://api.gis-support.pl/v1/maptile/0062ea45e2b9e7957211ef97a9791b71/tiles/inwestor/webmercator/{z}/{x}/{y}.png', {
  		attribution: "Dane © OpenStreetMap.org, hosting i grafika GIS Support ",
  		maxZoom: 18
  }).addTo(map);
	geojson = L.geoJson($scope.objects, {
		style: {
    	"color": "#ff7800",
    	"weight": 5,
    	"opacity": 0.65
		},
		onEachFeature: onEachFeature
	} ).addTo(map);
	console.log($scope.objects[0].properties.name);
	});
	
	$scope.labels = [];
  	$scope.series = ['Seria A'];
	
  	$scope.data = [];
	$scope.selectedOption = 0;
	$scope.changeOption = function() {
		var sum = 0;
		var labelSet = [];
		var dataSet = [];
		angular.forEach($scope.objects, function(value, key) {
			sum += parseInt(value.properties[$scope.selectedItem]);
			labelSet.push(value.id);
			dataSet.push(parseFloat(value.properties[$scope.selectedItem]));	
		});
		$scope.sum = sum;
		$scope.avg = sum/$scope.objects.length;
		$scope.data = [dataSet];
		$scope.labels = labelSet;
		if($scope.selectedObject) {
			labelSet = [];
			angular.forEach($scope.objects, function(value, key) { 
				labelSet.push(value.properties[$scope.selectedObject]);
			});
			$scope.labels = labelSet;
		};
	};
	
	$scope.changeLabels = function() {
		var labelSet = [];
		angular.forEach($scope.objects, function(value, key) { 
			labelSet.push(value.properties[$scope.selectedObject]);
		});
		$scope.labels = labelSet;
	};
	
	function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera) {
        layer.bringToFront();
    }
}

	function resetHighlight(e) {
    	geojson.resetStyle(e.target);
	}

	function onClick(e) {
		var dataSet = [];
		angular.forEach($scope.objects, function(value, key) {
			if(e.target.feature.id == value.id) {
				dataSet.push(parseFloat(value.properties[$scope.selectedItem]));	
			} else {
				dataSet.push(0);
			}
		});
		$scope.data = [dataSet];
		$scope.$apply();
	}
	function onEachFeature(feature, layer) {
	    layer.on({
	        mouseover: highlightFeature,
	        mouseout: resetHighlight,
	        click: onClick
	    });
	}
});


