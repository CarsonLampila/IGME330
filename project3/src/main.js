import * as maps from "./map.js";

// Define
const savedTerm = "cel1369-prev"
const key = "27b8b7f546e9bb3da4d5c38c3c3f784e09b51f5d";
let startRange = [];
let endRange = [];
let allStartHouseholds = [];
let allEndHouseholds = [];
let prevData = 0;


// Startup
function init(){
	
	// Create Map
	maps.initMap();	

	// Load previous selections
	loadPrev();
	
	// Activate buttons
	setupUI();
}


// Setup Controls
function setupUI(){
		
	// Data Type Change
	dataType.onchange = () => {
		// If changed from "Select a Data Type"
		if (prevData == 0){
			// Load Region
			createDropDown();
		}
		prevData = 1;
	}
	
	
	// Region Change
	region.onchange = () => {
		// Clear
		clearSelect(state);
		clearSelect(county);
		// Load State
		createDropDown();
	}
	
	// State Change
	state.onchange = () => {
		// Clear
		clearSelect(county);
		// Loud County
		createDropDown();
	}
	
		
	// Load based on dropdown selections
	searchBtn.onclick = () => {
		
		// Data type selected
		if (dataType.value == 0)		
			alert("Please Select a Data Type!");
		else{
			// Loading Icon
			document.querySelector("#status").innerHTML = `<h3>Creating Map Points!</h3><img id="loading" src="images/spinner.gif" alt="loading"></img>`;
		
			// Preload
			startRange = [];
			endRange = [];
			allStartHouseholds = [];
			allEndHouseholds = [];		
			loadURLdata(startYearSelect.value, 1);
			loadURLdata(endYearSelect.value, 2);
			loadURLdata(startYearSelect.value, 3);
			loadURLdata(endYearSelect.value, 4);
		
			// Remove all map markers
			maps.removeAllMarkers();
			
			// Wait for preload
			setTimeout(function(){ 
			
				// Calc Markers
				// Specific County
				if (county.value != -1)
					maps.calcMarkers(county, 1, startRange, endRange, allStartHouseholds, allEndHouseholds);
		
				// County
				else if (state.value != -1)
					maps.calcMarkers(county, 2, startRange, endRange, allStartHouseholds, allEndHouseholds);
		
				// State
				else if (region.value != -1)
					maps.calcMarkers(state, 3, startRange, endRange, allStartHouseholds, allEndHouseholds);
			
				// Region
				else
					maps.calcMarkers(region, 4, startRange, endRange, allStartHouseholds, allEndHouseholds);
		

				// Wait for maps to finish calc
				setTimeout(function(){ 
					// Remove Load Icon
					document.querySelector("#status").innerHTML = "";
					
					// Save searches
					saveLast();
					
				}, 2000);
			}, 8000);
		}
	};
	
	// Resets everything
	resetBtn.onclick = () => {
		// Delete data
		startRange = [];
		endRange = [];
		allStartHouseholds = [];
		allEndHouseholds = [];
		// Move selects
		endYearSelect.options[0].selected = true;
		startYearSelect.options[0].selected = true;
		dataType.options[0].selected = true;
		prevData = 0;
		// Clear Dropdowns
		clearSelect(region);
		clearSelect(state);
		clearSelect(county);
		// Remove all map markers
		maps.removeAllMarkers();
		// Resets Saves
		localStorage.clear();
	};
}


// Create the Drop Down Contents
function createDropDown(){
			
	// Make URL
	const xhr = new XMLHttpRequest();
			
	// Determine latest selection level
	let size = findSize();
			
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


// Organize the drop downs
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
					}
					break;
				
				case "Midwest Region":
					// States within
					if (json[i][0] == "Illinois" && prev == "" || json[i][0] == "Indiana" && prev == "Illinois" || json[i][0] == "Iowa" && prev == "Indiana" || json[i][0] == "Kansas" && prev == "Iowa" || 
						json[i][0] == "Michigan" && prev == "Kansas" || json[i][0] == "Minnesota" && prev == "Michigan" || json[i][0] == "Missouri" && prev == "Minnesota" || 
						json[i][0] == "Nebraska" && prev == "Missouri" || json[i][0] == "North Dakota" && prev == "Nebraska" || json[i][0] == "Ohio" && prev == "North Dakota" || 
						json[i][0] == "South Dakota" && prev == "Ohio" || json[i][0] == "Wisconsin" && prev == "South Dakota"){
						
						add = true;
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
					}
					break;
				
				case "West Region":
					// States within
					if (json[i][0] == "Alaska" && prev == "" || json[i][0] == "Arizona" && prev == "Alaska" || json[i][0] == "California" && prev == "Arizona" || json[i][0] == "Colorado" && prev == "California" || 
						json[i][0] == "Hawaii" && prev == "Colorado" || json[i][0] == "Idaho" && prev == "Hawaii" || json[i][0] == "Montana" && prev == "Idaho" || json[i][0] == "Nevada" && prev == "Montana" || 
						json[i][0] == "New Mexico" && prev == "Nevada" || json[i][0] == "Oregon" && prev == "New Mexico" || json[i][0] == "Utah" && prev == "Oregon" || json[i][0] == "Washington" && prev == "Utah" || 
						json[i][0] == "Wyoming" && prev == "Washington"){
						
						add = true;				
					}
					break;
			}	
			
			// Add select option
			if (add){
				
				prev = json[i][0];	
				let newOption = document.createElement("option");
				newOption.text = json[i][0];			
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
				newOption.label = contain[0];			
				scale.add(newOption);
			}				
		}
	}
}


// Search the API to fill arrays corsponding to the currently selected drop downs
function loadURLdata(year, arrNum){
	
	// Define
	let loop = 0;
	let search = [];
	let divs = [];

	
	// Find size
	let size = findSize();
		
	// Getting totals
	if (arrNum == 3 || arrNum == 4){
		loop = 1;
		search = ["001"];
	}
	else{
		// If older data set
		if (year <= 2015){
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
	}

	// Loop to hit all urls
	for (let i = 0; i < loop; i++){
		
		// Make URL
		const xhr = new XMLHttpRequest();	
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
				// Match scale and json
				for (let j = 0; j < region.length; j++){
					for (let k = 0; k < json.length; k++){					
						if (region.options[j].text == json[k][0]){
							// Regular Add
							if (loop == 1)
								addTo(arrNum, json[k][1]);
							// Total Add
							else{
								divs.push([region.options[j].text, json[k][1]]);	
								if (divs.length == ((region.length - 1) * loop))
									totals(divs, region, arrNum);
							}	
						}
					}		
				}
			}
			// If state currently selected
			else if (size == "state"){
				// Match scale and json
				for (let j = 0; j < state.length; j++){
					for (let k = 0; k < json.length; k++){				
						if (state.options[j].text == json[k][0]){
							// Regular Add
							if (loop == 1)
								addTo(arrNum, json[k][1]);
							// Total Add
							else{
								divs.push([state.options[j].text, json[k][1]]);	
								if (divs.length == ((state.length - 1) * loop))
									totals(divs, state, arrNum);
							}	
						}							
					}		
				}
			}
			// If county currently selected
			else if (size == "county"){
				// Match scale and json
				for (let j = 0; j < county.length; j++){
					for (let k = 0; k < json.length; k++){
						// Split
						let contain = json[k][0].split(", ");
						// Some counties have the same name
						if (county.options[j].label == contain[0] && county.options[j].text == contain[1]){
							if (loop == 1)
								// Regular Add
								addTo(arrNum, json[k][1]);
							// Total Add
							else{
								divs.push([county.options[j].label, json[k][1]]);	
								if (divs.length == ((county.length - 1) * loop))
									totals(divs, county, arrNum);
							}								
						}
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


// Save last searched values 
function saveLast() {
	// Save: Start Year, End Year, Data Type, Region Selection, State Selection, County Selection
	let prev = [startYearSelect.selectedIndex, endYearSelect.selectedIndex, dataType.selectedIndex, region.selectedIndex, state.selectedIndex, county.selectedIndex]
    localStorage.setItem(savedTerm, prev)
}


// Apply all searched data
function loadPrev(){
	// Load previous searches
	let prev = localStorage.getItem(savedTerm);
	if (prev != null){
		// Loading icon
		document.querySelector("#status").innerHTML = `<h3>Loading Previous Data!</h3><img id="loading" src="images/spinner.gif" alt="loading"></img>`;
		prev = prev.split(",");
		// Set equal to previous
		startYearSelect.options[prev[0]].selected = true;
		endYearSelect.options[prev[1]].selected = true;
		dataType.options[prev[2]].selected = true;
		prevData = prev[2];
		// Region
		if (prev[2] != 0){
			createDropDown();
			// Allow dopdown to load
			setTimeout(function(){ 
				region.options[prev[3]].selected = true;
				// State
				if (prev[3] != 0){
					createDropDown();
					// Allow dopdown to load
					setTimeout(function(){ 
						state.options[prev[4]].selected = true;
						// County
						if (prev[4] != 0){
							createDropDown();
							// Allow dopdown to load
							setTimeout(function(){ 
								county.options[prev[5]].selected = true;	
								// Remove Load Icon
								document.querySelector("#status").innerHTML = "";

							}, 1500);
						}
						else{
							document.querySelector("#status").innerHTML = "";
						}
					}, 1500);
				}
				else{
					document.querySelector("#status").innerHTML = "";		
				}
			}, 1500);
		}
		else{
			document.querySelector("#status").innerHTML = "";
		}
	}
}


// Find smallest level of selections
function findSize(){
	// Return sscale based on number of selections in  dropdowns
	let size = "region";
	if (region.value != -1)
		size = "state";	
	if (state.value != -1)
		size = "county";
		
	return size;
}


// Add input to corresponding arrays
function addTo(arrNum, cur){
	// Add to according array
	switch(arrNum) {
		case 1:
			startRange.push(cur);
			break;
					
		case 2:
			endRange.push(cur);
			break;
					
		case 3:
			allStartHouseholds.push(cur);
			break;
					
		case 4:
			allEndHouseholds.push(cur);
			break;
	}
}


// Calculate totals for calculating cell and broadband <= 2015   (different api data style)
function totals(divs, scale, arrNum){
	// Calc totals
	let total;
	for (let i = 1; i < scale.length; i++){	
		total = 0;		
		// Calc total for each scale
		for (let j = 0; j < divs.length; j++){

			if (scale.options[i].label == divs[j][0])
				total += (+divs[j][1]);
		}
		// Add to correct array			
		addTo(arrNum, total);
	}
}


function clearSelect(scale){
	// Delete all but first element (blank)
	let length = scale.length;
	for (let i = 0; i < length; i++){	
		scale.options[length - i] = null
	}
}



export {init};