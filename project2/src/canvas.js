/*
	The purpose of this file is to take in the analyser node and a <canvas> element: 
	  - the module will create a drawing context that points at the <canvas> 
	  - it will store the reference to the analyser node
	  - in draw(), it will loop through the data in the analyser node
	  - and then draw something representative on the canvas
	  - maybe a better name for this file/module would be *visualizer.js* ?
*/

import * as utils from './utils.js';
import * as classes from './classes.js';


let ctx,canvasWidth,canvasHeight,gradient,analyserNode,audioData;
let ball = [];
let centerAngle = 0;
let currentAngle = 0;
let rotation = .0001;
let radius = 25;



function setupCanvas(canvasElement,analyserNodeRef){
	// create drawing context
	ctx = canvasElement.getContext("2d");
	canvasWidth = canvasElement.width;
	canvasHeight = canvasElement.height;
	// create a gradient that runs top to bottom
	gradient = utils.getLinearGradient(ctx,0,0,0,canvasHeight,[{percent:0,color:"#191970"},{percent:.25,color:"#0000FF"},{percent:.5,color:"#00BFFF"},{percent:.75,color:"#0000FF"},{percent:1,color:"#191970"}]);
	// keep a reference to the analyser node
	analyserNode = analyserNodeRef;
	// this is the array where the analyser data will be stored
	audioData = new Uint8Array(analyserNode.fftSize/10);
	centerAngle = ((2 * Math.PI) / audioData.length)
}

function draw(params={}){
  // 1 - populate the audioData array with the frequency data from the analyserNode
	// notice these arrays are passed "by reference" 
	analyserNode.getByteFrequencyData(audioData);
	// OR
	//analyserNode.getByteTimeDomainData(audioData); // waveform data
	
	// 2 - draw background
	ctx.save();
	ctx.fillStyle = "black";
	ctx.globalAlpha = .1;
	ctx.fillRect(0,0,canvasWidth,canvasHeight);
	ctx.restore();
		
	// 3 - draw gradient
	if(params.showGradient){
		ctx.save();
		ctx.fillStyle = gradient;
		ctx.globalAlpha = .3;
		ctx.fillRect(0,0,canvasWidth,canvasHeight);
		ctx.restore();
	}
	
	// Draw Ball
	if (params.showBall){
		
		musicBall();
		moveBall();	
		drawBall();
		
	}
		
		
		
		
	
	// 6 - bitmap manipulation
	// TODO: right now. we are looping though every pixel of the canvas (320,000 of them!), 
	// regardless of whether or not we are applying a pixel effect
	// At some point, refactor this code so that we are looping though the image data only if
	// it is necessary

	// A) grab all of the pixels on the canvas and put them in the `data` array
	// `imageData.data` is a `Uint8ClampedArray()` typed array that has 1.28 million elements!
	// the variable `data` below is a reference to that array 
	let imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
	let data = imageData.data;
	let length = data.length;
	let width = imageData.width; // not using here
	// B) Iterate through each pixel, stepping 4 elements at a time (which is the RGBA for 1 pixel)
	for (let i = 0; i < length; i+= 4) {
		// C) randomly change every 20th pixel to red
		if (params.showNoise && Math.random() < .05) {
			// data[i] is the red channel
			// data[i+1] is the green channel
			// data[i+2] is the blue channel
			// data[i+3] is the alpha channel
			data[i] = data[i+1] = data[i+2] = 255; // zero out the red and green and blue channels
			//data[i] = 255; // make the red channel 100% red
		} // end if
		
		// Draw invert
		if(params.showInvert){
			let red = data[i], green = data[i+1], blue = data[i+2];
			data[i] = 255 - red;		// set red value
			data[i+1] = 255 - green;	// set green value
			data[i+2] = 255 - blue;		// set blue value
			//data[i+3] is the alpha but we're leaving that alone
		}
	} // end for
	
	// Emboss
	if(params.showEmboss){
		// note we are stepping through *each* sub-pixel
		for (let i = 0; i < length; i++) {
			if (i%4 == 3) continue; // skip alpha channel
			data[i] = 127 + 2*data[i] - data[i+4] - data[i+width*4];
		}
	}

		
	
	// D) copy data back to canvas
	ctx.putImageData(imageData, 0, 0);
	
}

function createBall() {
	// Bar Stats
	let cX, cY, fX, fY, color;
	let barWidth = (200 / audioData.length);
	let colorChange = 700/audioData.length;
		
	// Reset start angle and color
	let currentColor = 0;
	currentAngle = 0;
		
	// Movement
	let speed = 2;	
	let direction = utils.getRandomUnitVector();
		
		
	// Draw center circle
	let center = new classes.Sprite(canvasWidth/2, canvasHeight/2, canvasWidth/2, canvasHeight/2, radius, direction, speed, rotation, "white");
	center.drawCircle(ctx);
	ball.push(center);
		
		
	// Loop through audio data to draw bars
	for (let i=0; i<audioData.length; i++) {

		// Define start and end of line with angle
		cX = Math.cos(currentAngle) * (radius) + canvasWidth/2;	
		cY = Math.sin(currentAngle) * (radius) + canvasHeight/2;					

		// Define color
		color = `hsl(${currentColor/2 % 361},100%,50%)`;
			
		// Draw
		let bar = new classes.Sprite(cX, cY, cX, cY, barWidth, direction, speed, rotation, color);
		bar.drawBar(ctx);
		ball.push(bar);
		
		// Update angle and color
		currentAngle += centerAngle;
		currentColor += colorChange;
	}
}

// #9 - standard "move and check world boundaries" code
function moveBall(){

	ctx.save();
	
	for (let i = 0; i < ball.length; i++){
		
		
		// move sprite
		ball[i].move();
	
		// check sides and bounce
		if (ball[0].cX <= ball[0].size / 2  || ball[0].cX >= canvasWidth - ball[0].size / 2){
			
			ball[i].reflectX();
			ball[i].move();
		}
		if (ball[0].cY <= ball[0].size / 2  || ball[0].cY >= canvasHeight - ball[0].size / 2){

			ball[i].reflectY();
			ball[i].move();
		}
		
	}// end for

	ctx.restore();
}


function musicBall(){
	for (let i = 1; i < ball.length; i++){
		
		ball[i].cX = Math.cos(currentAngle) * (radius) + ball[0].cX;	
		ball[i].cY = Math.sin(currentAngle) * (radius) + ball[0].cY;
		
		
		ball[i].fX = (Math.cos(currentAngle) * (audioData[i-1]/5)) + ball[i].cX;
		ball[i].fY = (Math.sin(currentAngle) * (audioData[i-1]/5)) + ball[i].cY;
		
		currentAngle += centerAngle + rotation;
	}

}

function drawBall(){
	
	for (let i = 0; i < ball.length; i++){
		
		if (i == 0){
			ball[i].drawCircle(ctx);
			
		} else {
			ball[i].drawBar(ctx);
		}		
	}
}


export {setupCanvas,draw, createBall};