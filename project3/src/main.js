import * as ajax from "./ajax.js";
import * as classes from "./classes.js";
import * as maps from "./map.js";

let dates;
let index;


let geojson = {
	type: 'FeatureCollection',
	features: []
};

function init(){
	maps.initMap();
	
		
	setupUI();
	
	//loadMapData();
	loadSearchData();
}

function loadMapData(){
	
	const url = "data/time_series_covid19_confirmed_global.csv";

	
	// callback function for when data shows up
	function dataLoaded(string){
		//console.log(`string=${string}`);
		let regions = parseCSV(string);
		//console.log(regions);
		geojson = maps.makeGeoJSON(regions, index);
		maps.addMarkersToMap(geojson);
		maps.createLayers(geojson)
		console.log(geojson);
		
		setupUI();
	}
	
	// start download
	ajax.downloadFile(url, dataLoaded);
	
}

function loadSearchData(){

	yearSelect.onchange = (e) => {	
		// Reload with new data	
		if (dataType.value != 0)
			reload();	
	}
		
	dataType.onchange = (e) => {
		// Reload with new data
		loadURLData(e);
		reload();	
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
}

function parseCSV(string){
	// 1 - `regions` will hold `Region` instances
	let regions = [];
		
	// 2 - Currently the entire file is just one big String
	// So we'll turn it into an array of `rows` by "splitting" on new line characterSet
	// We'll also get rif of any leading or trailing spaces with `.trim()`
	let rows = string.trim().split("\n");
	
	// 3 - We'll grab the first row of the file - which is the names of the fields 
	// Province/State, Country/Region, Lat, Long, 11/13/2020
	let fieldNames = rows.shift().split(",");
	// get rid of the first 4 field names, which leaves us with just the dates
	fieldNames.splice(0,4);
	// the `dates` variable now points at this array of dates
	dates = fieldNames;
	// this will be the most recent date in the spreadsheet (the rightmost column)
	index = dates.length - 1;
		
	// 4 - loop through `rows` and split again, this time on commas
	// this gives us an array of values
	// starting at the value for the first date in the spreadsheet
	for (let row of rows){
		row = row.split(",");
		regions.push(new classes.Region(row));
	}
		
	// 5 - here's the rejex we'll use to detect 1 or more commas inside of quotes
	// https://stackoverflow.com/questions/26664371/remove-more-than-one-comma-in-between-quotes-in-csv-file-using-regex?rq=1
	const regex = /,(?!(([^"]*"){2})*[^"]*$)/;
	for (let row of rows){
		// 6 - replace the commas inside of quotes with a dash
		row = row.replace(regex, " - ");
		
		// 7 - get rid of all (that's what /g does) quotes in the `row` (we don't need them anymore)
		row = row.replace(/"/g,"");
		
		// 8 - the extra comma(s) and quotes are gone - now turn `row` into an array
		row = row.split(",");
		regions.push(new classes.Region(row));
	}	
	return regions;
}


function setupUI(){
	
	/*
	
	// 1 - clear out the <select>
	dateSelect.innerHTML = "";
	
	// 2 - loop through `dates` array
	for (let d of dates){
		// add an <option> for each date
		let option = document.createElement("option");
		option.innerText = d;
		dateSelect.appendChild(option);
	}

	// 3 - make the last date the selected one
	dateSelect.lastChild.selected = "selected"; // show last date
	
	// 4 - when the <select> is changed ...
	dateSelect.onchange = e => {
		// get the value (the text, in this case) of the current <option>
		let value = e.target.value.trim();
		
		// look for that value in the `dates` array
		index = dates.findIndex(el => el.trim() == value);
		console.log(`index is now ${index}`);
		
		maps.updateGeoJSON(geojson, index);
		maps.addMarkersToMap(geojson);
	};
	
	*/
	
	// Search returns selected value
	searchBtn.onclick = e => {
				
		console.log("seat");
		
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
			geojson = maps.makeGeoJSONState(); 
			maps.addStateMarker(geojson);
		}, 1000);

		
		// Data type selected
		if (dataType.value != 0){		
			// Region selected
			if (region.value != 0){				
				let selected = region;	
				// State selected
				if (state.value != 0){	
					selected = state;	
					// County selected
					if (county.value != 0){	
						selected = county;	
					}					
				}
				// Print
				console.log(selected.value);
			}
			else{
				// Add region values
				let added = (+region[1].value) + (+region[2].value) + (+region[3].value) + (+region[4].value);
				console.log(added);
			}
		}
		else
			console.log("Please Select a Data Type First!");
			
	};
	
	resetBtn.onclick = e => {
		// Move Selects
		yearSelect.options[0].selected = true;
		dataType.options[0].selected = true;
		// Clear Dropdowns
		clearSelect(region);
		clearSelect(state);
		clearSelect(county);
		// Reset Map
		resetMap();
	};
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
function loadURLData(e){
			
	// Make URL
	const xhr = new XMLHttpRequest();
		
	let size = "region";
	if (region.value != 0)
		size = "state";	
	if (state.value != 0)
		size = "county";
			
	const key = "27b8b7f546e9bb3da4d5c38c3c3f784e09b51f5d";
	const url = "https://api.census.gov/data/" + yearSelect.value + "/acs/acs1?get=NAME,B28002_" + dataType.value + "E&for=" + size + ":*&key=" + key;
		
		
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
	
function clearSelect(scale){
	// Delete all but first element (blank)
	let length = scale.length;
	for (let i = 0; i < length; i++){	
		scale.options[length - i] = null
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
		const url = "https://api.census.gov/data/" + yearSelect.value + "/acs/acs1?get=NAME,B28002_" + dataType.value + "E&for=" + size + ":*&key=" + key;
			
		
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
							county.options[i].value.worth = json[j][1];
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

function resetMap(){
	maps.removeAllMarkers();
	geojson = {
		type: 'FeatureCollection',
		features: []
	};
}


export {init};