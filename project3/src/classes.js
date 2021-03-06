class Marker{
	
	constructor(coors, title, start, end, startTotal, endTotal){
		this.coors = coors;
		this.title = title;
		this.start = start;
		this.end = end;
		this.startTotal = startTotal;
		this.endTotal = endTotal;
	}
	
	
	// Make map marker
	addMarker(){
		// create a HTML element for each feature
		let el = document.createElement('div');
		el.className = 'marker';	

		// make a marker for each feature and add to the map
		let marker = new mapboxgl.Marker(el)
			.setLngLat(this.coors)
			.setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
			.setHTML(this.contentGenerator()))
			//.addTo(map);
			
			
		return marker;
	}
	
	
	// Make content for markers
	contentGenerator(){
	
		let content;

		// Calc percent total
		let percentStart = Math.round(((this.start / this.startTotal) * 100) * 100) / 100;
		let percentEnd = Math.round(((this.end / this.endTotal) * 100) * 100) / 100;
	
	
		// If years are the same ignore
		if (startYearSelect.value == endYearSelect.value){
			content = '<h3>' + this.title + '</h3><p>Number of Households with ' + dataType.options[dataType.selectedIndex].label + 
						'</p><h4>' + endYearSelect.value + ":</h4><p>" + this.end + ' households</p><p>' + percentEnd + '% of total households</p>';
		}
		else{
			// Find Growth/Loss rates
			let math = Math.round((100 - ((this.start / this.end) * 100)) * 100) / 100;
			let pos;
			if (math > 0)
				pos = "% growth";
			else
				pos = "% loss";
		
			content = '<h3>' + this.title + '</h3><p>Number of Households with ' + dataType.options[dataType.selectedIndex].label + 
						'</p><h4>' + startYearSelect.value + ":</h4><p>" + this.start + ' households</p><p>' + percentStart + '% of total households</p>' +
						'</p><h4>' + endYearSelect.value + ":</h4><p>" + this.end + ' households</p><p>' + percentEnd + '% of total households</p><h4>' +
						math + pos + '</h4>';
		}
	
		return content;
	}
}

export {Marker};