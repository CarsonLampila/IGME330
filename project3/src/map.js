import * as classes from "./classes.js";

// Define
const key = "pk.eyJ1IjoiY2VsMTM2OSIsImEiOiJja2hmNzYyZDQwb2ExMnpwNXdwaWJyOHllIn0.FPJLn2H_xaYcX9VRMEpoUA";
let map
let markers = [];
let names = [];
let coors = [];
let orderS = [];
let orderE = [];
let orderST = [];
let orderET = [];


// Generate map
function initMap(){
	
	// Create map
	mapboxgl.accessToken = key;

	map = new mapboxgl.Map({
		container: 'map',
		style: 'mapbox://styles/mapbox/light-v10',
		center: [-96, 37.8],
		zoom: 3
	});
}


// Calc the contents for each marker
function calcMarkers(scale, div, start, end, startTotal, endTotal){
	
	// Define 
	let repeat = false;


	// Loop through drop down
	for (let i = 1; i < scale.length; i++){
		
		// Define
		let area;
		let searchArea;
		
		// Generate URL
		const xhr = new XMLHttpRequest();
		
		
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
		
		/*
		// If pushed here name will always match data not always with coords
		// Add marker vars
		names.push(area);
		*/
			
		const url = "https://api.mapbox.com/geocoding/v5/mapbox.places/" + searchArea + ".json?access_token=" + key;

	
		// `onerror` error
		xhr.onerror = (e) => console.log("error");
			
		// `onload` handler
		xhr.onload = (e) => {	

			// Get and display data
			const jsonString = e.target.response;
			const json = JSON.parse(jsonString);

			
			// Region hard code due to lack of available api coords
			if (div == 4){
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
			}
			// Add searched coords
			else
				coors.push([+json.features[0].geometry.coordinates[0], +json.features[0].geometry.coordinates[1]]);
				
				
			// If pushed here name will always match with coords but not always with data	
			// Add marker vars
			names.push(area);
			orderS.push(start[i - 1]);
			orderE.push(end[i - 1]);
			orderST.push(startTotal[i - 1]);
			orderET.push(endTotal[i - 1]);
				
				
			// If last time through the loop
			if (i == scale.length - 1){
				// Allow time to load
				setTimeout(function(){ 
					createMarkers(a, b, c, d);
				}, 2000);
			}
			
		};
			
		// Open the connection using the HTTP GET method
		xhr.open("GET",url);
	
		// Send request
		xhr.send();	
	}	
}


// Using data generate map markers
function createMarkers(start, end, startTotals, endTotals){

	// Loop for length
	for (let i = 0; i < names.length; i++){

		// Create a marker
		let current = new classes.Marker([coors[i][0], coors[i][1]], names[i], start[i], end[i], startTotals[i], endTotals[i]);
		// Add to map
		let temp = current.addMarker();
		temp.addTo(map);
		markers.push(temp);
	}
}


// Clean all markers
function removeAllMarkers(){

	// Remove and clean all
	for(let m of markers){
		m.remove();
	}
	markers = [];
	names = [];
	coors = [];
	orderS = [];
	orderE = [];
	orderST = [];
	orderET = [];
}



export {markers, initMap, calcMarkers, createMarkers, removeAllMarkers};