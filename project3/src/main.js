import * as maps from "./map.js";

let dates;
let index;
let dateRange = [];


let geojson = {
	type: 'FeatureCollection',
	features: []
};

function init(){
	maps.initMap();	
	setupUI();
}


function setupUI(){
	
	startYearSelect.onchange = (e) => {	
		// Reload with new data	
		if (dataType.value != 0){
			dateRange = [];
			rangeLoad();
		}
	}
	
	
	endYearSelect.onchange = (e) => {	
		// Reload with new data	
		if (dataType.value != 0){
			reload();	
			rangeLoad();
		}
	}
		
		
	dataType.onchange = (e) => {
		// Reload with new data
		
		if (region.length > 1){
			reload();	
			rangeLoad();
		}
		else{
			loadURLData(e);
		}

	}
	
	
	region.onchange = (e) => {
		// Clear
		clearSelect(state);
		clearSelect(county);
		// Reload
		loadURLData(e);
	}
	
	
	state.onchange = (e) => {
		// Clear
		clearSelect(county);
		// Reload
		loadURLData(e);
	}
	
	
	county.onchange = (e) => {
		// Reload
		loadURLData(e);
	}
	
		
	// Search returns selected value
	searchBtn.onclick = e => {
				
		console.log("search");
			
		
		// Reset on Search
		resetMap();	
		
		// Specific County
		if (county.value != 0)
			maps.calcMarkers(county, 1);
		
		// County
		else if (state.value != 0)
			maps.calcMarkers(county, 2);
		
		// State
		else if (region.value != 0)
			maps.calcMarkers(state, 3);
			
		// Region
		else
			maps.calcMarkers(region, 4);
		

		// Allow time to process
		setTimeout(function(){ 
			geojson = maps.makeGeoJSON(); 
			maps.addMarker(geojson, dateRange);
		}, 1000);

		
		// Data type selected
		if (dataType.value == 0)		
			alert("Please Select a Data Type First!");
	};
	
	resetBtn.onclick = e => {
		// Move Selects
		endYearSelect.options[0].selected = true;
		startYearSelect.options[1].selected = true;
		dataType.options[0].selected = true;
		// Clear Dropdowns
		clearSelect(region);
		clearSelect(state);
		clearSelect(county);
		// Reset Map
		resetMap();
	};
}


function loadURLData(e){
			
	// Make URL
	const xhr = new XMLHttpRequest();
		
	let size = "region";
	if (region.value != 0)
		size = "state";	
	if (state.value != 0)
		size = "county";
			
	const key = "27b8b7f546e9bb3da4d5c38c3c3f784e09b51f5d";
	const url = "https://api.census.gov/data/" + endYearSelect.value + "/acs/acs1?get=NAME,B28002_" + dataType.value + "E&for=" + size + ":*&key=" + key;
		
		
	// `onerror` error
	xhr.onerror = (e) => console.log("error");
			
	// `onload` handler
	xhr.onload = (e) => {	

		// Get and display data
		const jsonString = e.target.response;
		const json = JSON.parse(jsonString);

		// Create region dropdown
		if (size == "region")
			createDropDown(json, region, size);	
		// Create state dropdown
		if (size == "state")
			createDropDown(json, state, size, region.options[region.selectedIndex].text);
		// Create county dropdown
		if (size == "county")
			createDropDown(json, county, size, state.options[state.selectedIndex].text);
	};
			
	// Open the connection using the HTTP GET method
	xhr.open("GET",url);
	
	// Send request
	xhr.send();		
}


function createDropDown(json, scale, size, area = "none"){
	
	// Variables
	let order = 1;	
	let add = false;
	let prev = "";	

	
	// Loop through data
	for (let i = 0; i < json.length; i++){		

		// Add regions
		if (size == "region"){
			
			// Loop through all data
			for (let j = 0; j < json.length; j++){
								
				// Add alphabetically
				if (json[j][2] == order){
								
					// Add select option
					let newOption = document.createElement("option");
					newOption.text = json[j][0];
					newOption.value = json[j][1];						
					scale.add(newOption);				
								
					// Next + Exit
					order++;
					break;
				}
			}
		}

		// Add states
		if (size == "state"){

			add = false;
			
			// Hard coded because states are ordered 1-72 with 52 total elements not in numerical order and not in alphabetical order
			switch(area){
		
				case "Northeast Region":
					// States within
					if (json[i][0] == "Connecticut" && prev == "" || json[i][0] == "Maine" && prev == "Connecticut" || json[i][0] ==  "Massachusetts" && prev == "Maine" || 
						json[i][0] == "New Hampshire" && prev == "Massachusetts" || json[i][0] == "New Jersey" && prev == "New Hampshire" || json[i][0] == "New York" && prev == "New Jersey" || 
						json[i][0] == "Pennsylvania" && prev == "New York" || json[i][0] == "Rhode Island" && prev == "Pennsylvania" || json[i][0] ==  "Vermont" && prev == "Rhode Island"){
									
						add = true;
						prev = json[i][0];				
					}
					break;
				
				case "Midwest Region":
					// States within
					if (json[i][0] == "Illinois" && prev == "" || json[i][0] == "Indiana" && prev == "Illinois" || json[i][0] == "Iowa" && prev == "Indiana" || json[i][0] == "Kansas" && prev == "Iowa" || 
						json[i][0] == "Michigan" && prev == "Kansas" || json[i][0] == "Minnesota" && prev == "Michigan" || json[i][0] == "Missouri" && prev == "Minnesota" || 
						json[i][0] == "Nebraska" && prev == "Missouri" || json[i][0] == "North Dakota" && prev == "Nebraska" || json[i][0] == "Ohio" && prev == "North Dakota" || 
						json[i][0] == "South Dakota" && prev == "Ohio" || json[i][0] == "Wisconsin" && prev == "South Dakota"){
						
						add = true;
						prev = json[i][0];	
					}
					break;
				
				case "South Region":
					// States within
					if (json[i][0] == "Alabama" && prev == "" || json[i][0] == "Arkansas" && prev == "Alabama" || json[i][0] == "Delaware" && prev == "Arkansas" || 
						json[i][0] == "District of Columbia" && prev == "Delaware" || json[i][0] == "Florida" && prev == "District of Columbia" || json[i][0] == "Georgia" && prev == "Florida" || 
						json[i][0] == "Kentucky" && prev == "Georgia" || json[i][0] == "Louisiana" && prev == "Kentucky" || json[i][0] == "Maryland" && prev == "Louisiana" || 
						json[i][0] == "Mississippi" && prev == "Maryland" || json[i][0] == "North Carolina" && prev == "Mississippi" || json[i][0] ==  "Oklahoma" && prev == "North Carolina" || 
						json[i][0] == "South Carolina" && prev == "Oklahoma" || json[i][0] == "Tennessee" && prev == "South Carolina" || json[i][0] == "Texas" && prev == "Tennessee" || 
						json[i][0] == "Virginia" && prev == "Texas" || json[i][0] == "West Virginia" && prev == "Virginia"){
						
						add = true;
						prev = json[i][0];
					}
					break;
				
				case "West Region":
					// States within
					if (json[i][0] == "Alaska" && prev == "" || json[i][0] == "Arizona" && prev == "Alaska" || json[i][0] == "California" && prev == "Arizona" || json[i][0] == "Colorado" && prev == "California" || 
						json[i][0] == "Hawaii" && prev == "Colorado" || json[i][0] == "Idaho" && prev == "Hawaii" || json[i][0] == "Montana" && prev == "Idaho" || json[i][0] == "Nevada" && prev == "Montana" || 
						json[i][0] == "New Mexico" && prev == "Nevada" || json[i][0] == "Oregon" && prev == "New Mexico" || json[i][0] == "Utah" && prev == "Oregon" || json[i][0] == "Washington" && prev == "Utah" || 
						json[i][0] == "Wyoming" && prev == "Washington"){
						
						add = true;
						prev = json[i][0];					
					}
					break;
			}	
			
			// Add select option
			if (add){
				
				let newOption = document.createElement("option");
				newOption.text = json[i][0];
				newOption.value = json[i][1];				
				scale.add(newOption);
				
				i = 0;
			}
		}

		// Add counties
		if (size == "county"){
			
			// Split
			let contain = json[i][0].split(", ");

			// Add counties to dropdowns
			if (area == contain[1]){	
				let newOption = document.createElement("option");
				newOption.text = contain[1];
				newOption.value = json[i][1];
				newOption.label = contain[0];		
				scale.add(newOption);
			}				
		}
	}
}
	

function reload(){
	
	// Loop for each dropdown
	for (let i = 0; i < 3; i++){
		
		// Make URL
		const xhr = new XMLHttpRequest();
		
		let size;
		
		if (i == 0)
			size = "region";
		else if (i == 1)
			size = "state";
		else
			size = "county";
			
		const key = "27b8b7f546e9bb3da4d5c38c3c3f784e09b51f5d";
		const url = "https://api.census.gov/data/" + endYearSelect.value + "/acs/acs1?get=NAME,B28002_" + dataType.value + "E&for=" + size + ":*&key=" + key;
			
		
		// `onerror` error
		xhr.onerror = (e) => console.log("error");
			
		// `onload` handler
		xhr.onload = (e) => {	

			// Get and display data
			const jsonString = e.target.response;
			const json = JSON.parse(jsonString);

			// Update region values
			if (size == "region"){
				for (let i = 0; i < region.length; i++){
					for (let j = 0; j < json.length; j++){
						
						if (region.options[i].text == json[j][0])
							region.options[i].value = json[j][1];
					}		
				}
			}
			// Update state values
			if (size == "state"){
				for (let i = 0; i < state.length; i++){
					for (let j = 0; j < json.length; j++){
						
						if (state.options[i].text == json[j][0])
							state.options[i].value = json[j][1];
					}		
				}
			}
			// Update county values
			if (size == "county"){
				for (let i = 0; i < county.length; i++){
					for (let j = 0; j < json.length; j++){
						// Split
						let contain = json[j][0].split(", ");
						// Some counties have the same name
						if (county.options[i].label == contain[0] && county.options[i].text == contain[1])
							county.options[i].value = json[j][1];
					}		
				}
			}
		};
			
		// Open the connection using the HTTP GET method
		xhr.open("GET",url);
	
		// Send request
		xhr.send();			
	}	
}


function rangeLoad(){
	
		
	// Make URL
	const xhr = new XMLHttpRequest();
		
	let size = "region";
	if (region.value != 0)
		size = "state";	
	if (state.value != 0)
		size = "county";

			
	const key = "27b8b7f546e9bb3da4d5c38c3c3f784e09b51f5d";
	const url = "https://api.census.gov/data/" + startYearSelect.value + "/acs/acs1?get=NAME,B28002_" + dataType.value + "E&for=" + size + ":*&key=" + key;
			
		
	// `onerror` error
	xhr.onerror = (e) => console.log("error");
			
	// `onload` handler
	xhr.onload = (e) => {	

		// Get and display data
		const jsonString = e.target.response;
		const json = JSON.parse(jsonString);
		

		// Add second year variables 
		// If region currently selected
		if (size == "region"){
			for (let i = 0; i < region.length; i++){
				for (let j = 0; j < json.length; j++){
						
					if (region.options[i].text == json[j][0])
						dateRange.push(json[j][1]);
				}		
			}
		}
		// If state currently selected
		else if (size == "state"){
			for (let i = 0; i < state.length; i++){
				for (let j = 0; j < json.length; j++){
						
					if (state.options[i].text == json[j][0])
						dateRange.push(json[j][1]);
				}		
			}
		}
		// If county currently selected
		else if (size == "county"){
			for (let i = 0; i < county.length; i++){
				for (let j = 0; j < json.length; j++){
					// Split
					let contain = json[j][0].split(", ");
					// Some counties have the same name
					if (county.options[i].label == contain[0] && county.options[i].text == contain[1])
						dateRange.push(json[j][1]);
				}		
			}
		}
	};
			
	// Open the connection using the HTTP GET method
	xhr.open("GET",url);
	
	// Send request
	xhr.send();	
		
}


function clearSelect(scale){
	// Delete all but first element (blank)
	let length = scale.length;
	for (let i = 0; i < length; i++){	
		scale.options[length - i] = null
	}
}


function resetMap(){
	maps.removeAllMarkers();
	geojson = {
		type: 'FeatureCollection',
		features: []
	};
}



export {init};