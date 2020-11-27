function findSize(){
	// Return sscale based on number of selections in  dropdowns
	let size = "region";
	if (region.value != -1)
		size = "state";	
	if (state.value != -1)
		size = "county";
		
	return size;
}


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
	

export { findSize, addTo, totals };