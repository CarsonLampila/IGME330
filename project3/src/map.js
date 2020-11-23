let map
let markers = [];
let names = [];
let coors = [];
let des = [];

function initMap(){
	mapboxgl.accessToken = 'pk.eyJ1IjoiY2VsMTM2OSIsImEiOiJja2hmNzYyZDQwb2ExMnpwNXdwaWJyOHllIn0.FPJLn2H_xaYcX9VRMEpoUA';

	map = new mapboxgl.Map({
		container: 'map',
		style: 'mapbox://styles/mapbox/light-v10',
		center: [-96, 37.8],
		zoom: 3
	});
	
	return map;
}


function calcMarkers(scale, div){
	
	// Define 
	let repeat = false;

	// loop through drop down
	for (let i = 1; i < scale.length; i++){
		
		// Define
		let area;
		let searchArea;
		
		// Generate URL
		const xhr = new XMLHttpRequest();
		const key = "pk.eyJ1IjoiY2VsMTM2OSIsImEiOiJja2hmNzYyZDQwb2ExMnpwNXdwaWJyOHllIn0.FPJLn2H_xaYcX9VRMEpoUA";
		
		
		switch(div){
			// Specific County
			case 1:
				if (repeat == false){
					area = scale.options[scale.selectedIndex].label;
					searchArea = (scale.options[scale.selectedIndex].text + " " + scale.options[scale.selectedIndex].label);
					repeat = true;
				}
				break;
				
			// County
			case 2:
				area = scale.options[i].label;
				searchArea = (scale.options[i].text + " " + scale.options[i].label);
				break;
				
			// State
			case 3:
				area = scale.options[i].text;
				searchArea = area;
				break;
				
			// Region
			case 4:
				area = scale.options[i].text;
				searchArea = area;
				break;		
		}
		
		const url = "https://api.mapbox.com/geocoding/v5/mapbox.places/" + searchArea + ".json?access_token=" + key;
		
		
		// `onerror` error
		xhr.onerror = (e) => console.log("error");
			
		// `onload` handler
		xhr.onload = (e) => {	

			// Get and display data
			const jsonString = e.target.response;
			const json = JSON.parse(jsonString);
	
			// Add marker vars
			names.push(area);
			
			
			// Region hard code due to lack of available api coords
			if (div == 4)
				switch(i){
					// NE
					case 1:
						coors.push([-72.9432, 42.3081]);
						break;
						
					// MW
					case 2:
						coors.push([-92.1723, 42.3207]);					
						break;
						
					// S
					case 3:
						coors.push([-84.8914, 35.1210]);	
						break;
						
					// W
					case 4:
						coors.push([-113.1809, 41.1388]);
						break;
				}
			else
				coors.push([+json.features[0].geometry.coordinates[0], +json.features[0].geometry.coordinates[1]]);
						
			
			des.push(scale.options[i].value);
		};
			
		// Open the connection using the HTTP GET method
		xhr.open("GET",url);
	
		// Send request
		xhr.send();	
	}
}


function makeGeoJSON(){
	// 1 - our "starter" 'FeatureCollection' object we will be returning
	let geojson = {type: 'FeatureCollection', features: [] };

	// 2 - loop through all the regions
	for (let i = 0; i < names.length; i++){
		
		// 3 - Here's am "empty" GeoJSON "feature"
		const newFeature = {
			type: 'Feature',
			geometry: {
				type: 'Point',
				coordinates: []
			},
			properties: {
				title: '',
				description: 'None'
			}
		};
		
		// 4 - initialize `.geometry.coordinates`		
		newFeature.geometry.coordinates = [coors[i][0], coors[i][1]];
		
		// 5 - initialize `.properties.title` - and do so differently based on
		// whether or not the region has a `.provinceOrState` property
		newFeature.properties.title = names[i];
		
		// 8 - initialize `.properties.description`
		newFeature.properties.description = des[i];
		
		// 9 - add the new feature to the array
		geojson.features.push(newFeature);
	}
	
	return geojson;
}


function addMarker(geojson, dateRange){
	
	let i = 0;
	
	// add markers to map
	for (let feature of geojson.features) {
		
		// create a HTML element for each feature
		let el = document.createElement('div');
		el.className = 'marker';	

		// make a marker for each feature and add to the map
		let marker = new mapboxgl.Marker(el)
			.setLngLat(feature.geometry.coordinates)
			.setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
			.setHTML(contentGenerator(feature, dateRange[i])))
			.addTo(map);
			
		markers.push(marker);
		
		// Interval
		i++;
	};
}


function contentGenerator(feat, start){
	
	let content;
	
	// If years are the same ignore
	if (startYearSelect.value == endYearSelect.value){
		content = '<h3>' + feat.properties.title + '</h3><p>Number of Households with ' + dataType.options[dataType.selectedIndex].text + '</p><p>' + endYearSelect.value + ": " +
					feat.properties.description + '</p>';
	}
	else{
		// Find Growth/Loss rates
		let math = Math.round((100 - ((start / feat.properties.description) * 100)) * 100) / 100;
		let pos;
		if (math > 0)
			pos = "% growth";
		else
			pos = "% loss";
		
		content = '<h3>' + feat.properties.title + '</h3><p>Number of Households with ' + dataType.options[dataType.selectedIndex].text + '</p><p>' + startYearSelect.value + ": " + start + 
					'</p><p>' + endYearSelect.value + ": " + feat.properties.description + '</p><p>' + math + pos;
	}
	
	return content;
}



function removeAllMarkers(){

	for(let m of markers){
		m.remove();
	}
	markers = [];
	names = [];
	coors = [];
	des = [];
}


export {initMap, calcMarkers,  makeGeoJSON, addMarker, removeAllMarkers};