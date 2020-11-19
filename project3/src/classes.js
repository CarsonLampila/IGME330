class Region{
	// Province/State, Country/Region, Lat, Long, 11/13/2020
	constructor(row){
		[this.provinceOrState, this.countryOrRegion, this.latitude, this.longitude, ...this.data] = row;		
		this.data = this.data.map(el => +el);
		this.latitude = +this.latitude; 
		this.longitude = +this.longitude;
	}
}

export {Region};