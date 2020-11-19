let map
let markers = [];

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

function addMarker(coordinates, title, description, className){
    let el = document.createElement('div');
    el.className = className;

	let marker = new mapboxgl.Marker(el)
		.setLngLat(coordinates)
		.setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
		.setHTML('<h3>' + title + '</h3><p>' + description + '</p>'))
		.addTo(map);
		
	markers.push(marker);
}

function addMarkersToMap(geojson){
	removeAllMarkers();
	
	// add markers to map
	for (let feature of geojson.features) {
		addMarker(feature.geometry.coordinates, feature.properties.title, feature.properties.description, "marker")
	};
}

function removeAllMarkers(){
  for(let m of markers){
    m.remove();
  }
  markers = [];
}

function createLayers(geojson){
	// https://docs.mapbox.com/mapbox-gl-js/api/#map#loaded
	if(map.loaded()){
		addCircleAndTextLayers();
	}else{
		map.on('load',addCircleAndTextLayers);
	}
	
	function addCircleAndTextLayers() {
		// 1 - here we "bind" the map to our `geojson` data
		// later on when we change `geojson` data to point at a different date, we will
		// be able to easily tell the map to refresh itself and display the new data
		map.addSource('cases', {
			type: 'geojson',
			data: geojson
		});
	
	
		// 2 - the first layer we are adding is of the `circle` type
		// https://docs.mapbox.com/mapbox-gl-js/style-spec/layers/#circle
		// other layer types include "background", "fill", "symbol" and "heatmap"
		// here we are drawing "ornamental" red circles, all of the same size
		// but we could also vary the size of the circles based on number of cases
		// note our use of the "paint" property below
		
		
		
		map.addLayer({
			id: 'cases-circle-varying',
			type: 'circle',
			source: 'cases', // we bound the `geojson` object to the "cases" name with `map.addSource()` above
			minzoom: 3,
				"paint": {
					'circle-stroke-color': 'white',
					'circle-stroke-width': 0,
					'circle-opacity': 0.3,
					'circle-translate': [1,-4],
					'circle-radius': {
						property: 'numCases',
						stops: [
							[0, 18],  // if there are 0 cases, the circle radius is 18
							[50, 25], // if there are 50 cases, the circle radius is 25
							[1000, 40], // if there are 1000 cases, the circle radius is 40
							[10000, 50], // if there are 10000 or more cases, the circle radius is 50
							/*
							Between 0 & 50 cases, the radius of the circle will interpolate from 18 to 25
							Between 50 & 1000 cases, the radius of the circle will interpolate from 25 to 40
							Between 1000 & 10000 cases, the radius of the circle will interpolate from 40 to 50
							*/
						]
					},
					'circle-color': {
						property: 'numCases',
						stops: [
							[0, "#00FF00"], // if there are 0 cases, the circle is green
							[1, "#555555"], // if there is 1 case, the circle is gray
							[50, "#FFFF00"],// if there are 50 cases, the circle is yellow
							[10000, "#FF0000"] // if there are 10000 or more cases, the circle is red
							/*
							Between 1 & 50 cases, the color of the circle will interpolate from gray to yellow
							Between 50 & 10000 cases, the color of the circle will interpolate from yellow to red
							*/
						],
					}
				}
		});
		
		
		/*
		map.addLayer({
			id: 'cases-circle',
			type: 'circle',
			source: 'cases',
			minzoom: 3,
			'paint': {
				'circle-radius' : 18,
				'circle-color': '#ff0000',
				'circle-stroke-color': 'white',
				'circle-stroke-width': 0,
				'circle-opacity': 0.1,
				'circle-translate': [1,-4], // [x,y]
			},
		}); // end circle layer code
		*/
	
	  // 3 - the second layer is a "symbol" layer that let's us draw text - here the 
	  // number of diagnosed cases
	  // Note that we are specifying both "paint" properties and "layout" properties
	  // https://docs.mapbox.com/mapbox-gl-js/style-spec/layers/#symbol
	  // https://docs.mapbox.com/help/glossary/layout-paint-property/
		map.addLayer({
			id: 'num-cases-text',
			type: 'symbol',
			source: 'cases',
			'paint': {
				'text-color' : 'red',
				'text-translate' : [0,-29] // [x,y]
			},
			'layout':{
				'text-field': ['get','numCases'], // this is grabbing `feature.properties.numCases`
			}
		}); // end text layer code
		
  } // end inner function `addCircleAndTextLayers()`
  
} // end function `createLayers()`

function makeGeoJSON(regions, index){
	// 1 - our "starter" 'FeatureCollection' object we will be returning
	const geojson = {type: 'FeatureCollection', features: [] };
	
	// 2 - loop through all the regions
	for (let r of regions){
		
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
		newFeature.geometry.coordinates = [+r.longitude, +r.latitude];
		
		// 5 - initialize `.properties.title` - and do so differently based on
		// whether or not the region has a `.provinceOrState` property
		newFeature.properties.title = r.provinceOrState ? r.provinceOrState + " - " + r.countryOrRegion : r.countryOrRegion;
		
		// 6 - we are going to display the most recent data - remember that `index` is
		// currently pointing at the last element of the array
		let numCases = r.data[index];
		
		// 7 - create `numCases` and `allCases` properties that we will use later
		newFeature.properties.numCases = numCases;
		newFeature.properties.allCases = r.data;
		
		// 8 - initialize `.properties.description`
		newFeature.properties.description = numCases + " cases";
		
		// 9 - add the new feature to the array
		geojson.features.push(newFeature);
	}
	return geojson;
}

function updateGeoJSON(geojson, index){
	// 1 - loop through array of features and update `numCases` to reflect current date
	for (let feature of geojson.features){
		const numCases = feature.properties.allCases[index];
		feature.properties.numCases = numCases;
		feature.properties.description = numCases + " cases";
	}
	
	// 2 - tell the map to reload the data, which will cause the symbol layer to refresh
	map.getSource('cases').setData(geojson);
}

export {map, initMap, addMarkersToMap, createLayers, makeGeoJSON, updateGeoJSON};