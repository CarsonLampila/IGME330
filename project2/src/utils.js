
// Random Num between Max-Min
const getRandom = (min, max) => {
  return Math.random() * (max - min) + min;
};

// Random Unit Vector
const getRandomUnitVector = () => {
	let x = getRandom(-1,1);
	let y = getRandom(-1,1);
	let length = Math.sqrt(x*x + y*y);
	// Point Right
	if(length == 0){
		x=1;
		y=0;
		length = 1;
	} else{
		x /= length;
		y /= length;
	}
	return {x:x, y:y};
};

// Create gradient
const getLinearGradient = (ctx,startX,startY,endX,endY,colorStops) => {
  let lg = ctx.createLinearGradient(startX,startY,endX,endY);
  for(let stop of colorStops){
    lg.addColorStop(stop.percent,stop.color);
  }
  return lg;
};

// Make Fullscreen
const goFullscreen = (element) => {
	if (element.requestFullscreen) {
		element.requestFullscreen();
	} else if (element.mozRequestFullscreen) {
		element.mozRequestFullscreen();
	} else if (element.mozRequestFullScreen) {
		element.mozRequestFullScreen();
	} else if (element.webkitRequestFullscreen) {
		element.webkitRequestFullscreen();
	}
};


export {getRandom, getRandomUnitVector, getLinearGradient, goFullscreen};