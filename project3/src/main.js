import * as maps from "./map.js";

let dates;
let index;
let startRange = [];
let endRange = [];


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
			startRange = [];
			rangeLoad(startYearSelect.value, true);
		}
	}
	
	
	endYearSelect.onchange = (e) => {	
		// Reload with new data	
		if (dataType.value != 0){
			endRange = [];
			rangeLoad(endYearSelect.value, false);
		}
	}
		
		
	dataType.onchange = (e) => {
		
		console.log("difs");
		
		
		clearSelect(region);
		clearSelect(state);
		clearSelect(county);
		
		createDropDown(e);
		
		startRange = [];
		endRange = [];
		rangeLoad(startYearSelect.value, true);
		rangeLoad(endYearSelect.value, false);
	}
	
	
	region.onchange = (e) => {
		// Clear
		clearSelect(state);
		clearSelect(county);
		// Reload
		createDropDown(e);
		
		startRange = [];
		endRange = [];
		rangeLoad(startYearSelect.value, true);
		rangeLoad(endYearSelect.value, false);
	}
	
	
	state.onchange = (e) => {
		// Clear
		clearSelect(county);
		// Reload
		createDropDown(e);
		
		startRange = [];
		endRange = [];
		rangeLoad(startYearSelect.value, true);
		rangeLoad(endYearSelect.value, false);
	}
	
	
	county.onchange = (e) => {
		startRange = [];
		endRange = [];
		rangeLoad(startYearSelect.value, true);
		rangeLoad(endYearSelect.value, false);
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
			geojson = maps.makeGeoJSON(startRange, endRange); 
			maps.addMarker(geojson,);
		}, 1000);

		
		// Data type selected
		if (dataType.value == 0)		
			alert("Please Select a Data Type First!");
	};
	
	resetBtn.onclick = e => {
		// Move Selects
		endYearSelect.options[0].selected = true;
		startYearSelect.options[0].selected = true;
		dataType.options[0].selected = true;
		// Clear Dropdowns
		clearSelect(region);
		clearSelect(state);
		clearSelect(county);
		// Reset Map
		resetMap();
	};
}


function createDropDown(e){
			
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
			selectOptions(json, region, size);	
		// Create state dropdown
		if (size == "state")
			selectOptions(json, state, size, region.options[region.selectedIndex].text);
		// Create county dropdown
		if (size == "county")
			selectOptions(json, county, size, state.options[state.selectedIndex].text);
	};
			
	// Open the connection using the HTTP GET method
	xhr.open("GET",url);
	
	// Send request
	xhr.send();		
}


function selectOptions(json, scale, size, area = "none"){
	
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
					//newOption.value = json[j][1];						
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
				//newOption.value = json[i][1];				
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
				//newOption.value = json[i][1];
				newOption.label = contain[0];		
				scale.add(newOption);
			}				
		}
	}
}


function rangeLoad(year, isStart){
	
	// Define
	let loop = 0;
	let search = [];
	let divs = [];
	
	// Find size
	let size = "region";
	if (region.value != 0)
		size = "state";	
	if (state.value != 0)
		size = "county";
		
	// If older data set
	if (year < 2015){
		// Regular
		if (+dataType.options[dataType.selectedIndex].text < 100){
			loop = 1;
			search.push(dataType.options[dataType.selectedIndex].text);
		}
		// Cellular
		else if (+dataType.options[dataType.selectedIndex].text == 101){
			loop = 4;
			search = ["005", "008", "011", "014"];
		}
		// Broadband
		else if (+dataType.options[dataType.selectedIndex].text == 102){
			loop = 3;
			search = ["004", "007", "010"];
		}
	}
	// Newer data set
	else{
		loop = 1;
		search.push(dataType.options[dataType.selectedIndex].value);
	}
		
	// Loop to hit all urls
	for (let i = 0; i < loop; i++){
		
		// Make URL
		const xhr = new XMLHttpRequest();	
		const key = "27b8b7f546e9bb3da4d5c38c3c3f784e09b51f5d";
		const url = "https://api.census.gov/data/" + year + "/acs/acs1?get=NAME,B28002_" + search[i] + "E&for=" + size + ":*&key=" + key;
		
			
		// `onerror` error
		xhr.onerror = (e) => console.log("error");
			
		// `onload` handler
		xhr.onload = (e) => {	

			// Get and display data
			const jsonString = e.target.response;
			const json = JSON.parse(jsonString);
		

			// Add all relevant data to a seperate array
			// If region currently selected
			if (size == "region"){
				for (let j = 0; j < region.length; j++){
					for (let k = 0; k < json.length; k++){					
						if (region.options[j].text == json[k][0])				
							divs.push([region.options[j].text, json[k][1]]);										
					}		
				}
			}
			// If state currently selected
			else if (size == "state"){
				for (let j = 0; j < state.length; j++){
					for (let k = 0; k < json.length; k++){				
						if (state.options[j].text == json[k][0])
							divs.push([state.options[j].text, json[k][1]]);					
					}		
				}
			}
			// If county currently selected
			else if (size == "county"){
				for (let j = 0; j < county.length; j++){
					for (let k = 0; k < json.length; k++){
						// Split
						let contain = json[k][0].split(", ");
						// Some counties have the same name
						if (county.options[j].label == contain[0] && county.options[j].text == contain[1])
							divs.push([county.options[j].label, json[k][1]]);		
					}		
				}
			}
		};
			
		// Open the connection using the HTTP GET method
		xhr.open("GET",url);
	
		// Send request
		xhr.send();
	}	
	
	
	// Process array data
	setTimeout(function(){totals(size, divs, isStart);}, 1500);
}


function totals(size, divs, isStart){
	
	let total;
	
	// Add all data of same area together
	// If region currently selected
	if (size == "region"){
		for (let i = 1; i < region.length; i++){	
			total = 0;	
			for (let j = 0; j < divs.length; j++){
				if (region.options[i].text == divs[j][0])
					total += (+divs[j][1]);
			}
			if (isStart)
				startRange.push(total);
			else
				endRange.push(total);
		}
	}
	// If state currently selected
	else if (size == "state"){
		for (let i = 1; i < state.length; i++){
			total = 0;
			for (let j = 0; j < divs.length; j++){
				if (state.options[i].text == divs[j][0])
					total += (+divs[j][1]);		
			}
			if (isStart)
				startRange.push(total);
			else
				endRange.push(total);
		}
	}
	// If county currently selected
	else if (size == "county"){
		for (let i = 1; i < county.length; i++){	
			total = 0;		
			for (let j = 0; j < divs.length; j++){
				if (county.options[i].label == divs[j][0])
					total += (+divs[j][1]);
			}	
			if (isStart)
				startRange.push(total);
			else
				endRange.push(total);
		}
	}
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