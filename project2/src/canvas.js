
// Imports
import * as utils from './utils.js';
import * as classes from './classes.js';

// Canvas
let ctx,canvasWidth,canvasHeight,gradient,analyserNode,audioData;

// All Ball Objects
let ball = [];

// All Paddle Objects
let paddles = [];

// Rotation
let centerAngle = 0, currentAngle = 0;
let rotation = .0001;
let radius = 25;

let lU = false, lD = false, rU = false, rD = false;


// Setup Canvas
function setupCanvas(canvasElement,analyserNodeRef){
	// Setup Context
	ctx = canvasElement.getContext("2d");
	canvasWidth = canvasElement.width;
	canvasHeight = canvasElement.height;
	
	// Gradient
	gradient = utils.getLinearGradient(ctx,0,0,0,canvasHeight,[{percent:0,color:"#191970"},{percent:.25,color:"#0000FF"},{percent:.5,color:"#00BFFF"},{percent:.75,color:"#0000FF"},{percent:1,color:"#191970"}]);
	
	// Audio
	analyserNode = analyserNodeRef;
	audioData = new Uint8Array(analyserNode.fftSize/10);
	
	// Establish Angle
	centerAngle = ((2 * Math.PI) / audioData.length)
}

// Draw
function draw(params={}){

	// Populate Analyser Node
	analyserNode.getByteFrequencyData(audioData);
	// OR
	//analyserNode.getByteTimeDomainData(audioData); // waveform data
	
	// Background
	ctx.save();
	ctx.fillStyle = "black";
	ctx.globalAlpha = .1;
	ctx.fillRect(0,0,canvasWidth,canvasHeight);
	ctx.restore();
		
	// Gradient Enable
	if(params.showGradient){
		
		// Gradient Background
		ctx.save();
		ctx.fillStyle = gradient;
		ctx.globalAlpha = .3;
		ctx.fillRect(0,0,canvasWidth,canvasHeight);
		ctx.restore();
	}
	
	// Ball Enable
	if (params.showBall){
		
		// Add Bar Music
		musicBall();
		
		// Bounce Ball
		moveBall();	
		
		// Loop through ball objects
		for (let i = 0; i < ball.length; i++){
			ball[i].draw(ctx);	
		}	
	}
	
	
	// Paddle Enable
	if (params.showPaddle){

		// Move paddles
		document.addEventListener('keydown', press);
		document.addEventListener('keyup', depress);
		movePaddles();
		
		// Loop through paddle objects
		for (let i = 0; i < paddles.length; i++){
			paddles[i].draw(ctx);	
		}	
	}
	
		
			
	
	// Bitmap Manipulation
	// Defenitions
	let imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
	let data = imageData.data;
	let length = data.length;
	let width = imageData.width;
	
	// Loop through each pixel (pixel = 0 - 3 (RGBA))
	for (let i = 0; i < length; i+= 4) {
		// Random Noise Enable
		if (params.showNoise && Math.random() < .05) {
			// data[i] is the red channel
			// data[i+1] is the green channel
			// data[i+2] is the blue channel
			// data[i+3] is the alpha channel
			data[i] = data[i+1] = data[i+2] = 255; 
		}
		
		// Invert Enable
		if(params.showInvert){
			let red = data[i], green = data[i+1], blue = data[i+2];
			// Negate values
			data[i] = 255 - red;
			data[i+1] = 255 - green;
			data[i+2] = 255 - blue;
		}
	}
	
	// Emboss Enable
	if(params.showEmboss){
		// Loop through every pixel + RGBA
		for (let i = 0; i < length; i++) {
			// Skip Alpha
			if (i%4 == 3) 
				continue;
			// Effect
			data[i] = 127 + 2*data[i] - data[i+4] - data[i+width*4];
		}
	}	
	
	// Reinput changed fata to Canvas
	ctx.putImageData(imageData, 0, 0);
}

// Create inital ball
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

	// Make sure direction is not up and down
	let tempDir = utils.getRandomUnitVector();
	while (tempDir.y < .2 && tempDir.y > -.2)
		tempDir = utils.getRandomUnitVector();
	
	let direction = tempDir	
		
	// Draw center circle
	let center = new classes.CircleSprite(canvasWidth/2, canvasHeight/2, radius, direction, speed, "white");
	ball.push(center);
		
		
	// Loop through audio data to draw bars
	for (let i=0; i<audioData.length; i++) {

		// Define start and end of line with angle
		cX = Math.cos(currentAngle) * (radius) + canvasWidth/2;	
		cY = Math.sin(currentAngle) * (radius) + canvasHeight/2;					

		// Define color
		color = `hsl(${currentColor/2 % 361},100%,50%)`;
			
		// Draw bars
		let bar = new classes.BarSprite(cX, cY, cX, cY, barWidth, direction, speed, color);
		ball.push(bar);
		
		// Update angle and color
		currentAngle += centerAngle;
		currentColor += colorChange;
	}
}

// Move the Ball and Bounce
function moveBall(){

	// Loop through all ball objects
	for (let i = 0; i < ball.length; i++){
		
		// Move based on vector
		ball[i].move();
	
	
		// X Bounce
		// Center of paddles
		let paddleLC = paddles[1].cY + (paddles[1].height / 2);
		let paddleRC = paddles[0].cY + (paddles[0].height / 2);
		
		// Left side of screen
		if (ball[0].cX < canvasWidth/2){
			
			// Ball is not past paddle
			if (ball[0].cX > paddles[1].cX){
				
				// Check if ball is within range of paddle Y
				if (ball[0].cY > paddleLC - (paddles[0].height / 2) - (ball[0].size / 2) && 		// Top
					ball[0].cY < paddleLC + (paddles[0].height / 2) + (ball[0].size / 2)){			// Bottom
					
					// Check if ball is within range of paddle X
					if (ball[0].cX <= (ball[0].size) + (0.5 * paddles[1].width) + paddles[1].width){	// Left
						
						// Bounce
						ball[i].reflectX();
						ball[i].move();
					}	
				}
			}
		}
		// Right side of screen
		else{
			
			// Ball is not past paddle
			if (ball[0].cX < paddles[0].cX){
				
				// Check if ball is within range of paddle Y	
				if (ball[0].cY > paddleRC - (paddles[1].height / 2) - (ball[0].size / 2) && 		// Top
					ball[0].cY < paddleRC + (paddles[1].height / 2) + (ball[0].size / 2)){			// Bottom
					
					// Check if ball is within range of paddle X
					if (ball[0].cX >= canvasWidth - (ball[0].size) - (0.5 * paddles[0].width) - paddles[1].width){	// Right
					
						// Bounce
						ball[i].reflectX();
						ball[i].move();
					}	
				}	
			}
		}
		
		// Y Bounce
		if (ball[0].cY <= ball[0].size  || ball[0].cY >= canvasHeight - ball[0].size){

			ball[i].reflectY();
			ball[i].move();
		}	
	}
}

// Update bars for music
function musicBall(){
	
	// Loop through ball objects except circle
	for (let i = 1; i < ball.length; i++){
		
		// Update Close Bar
		ball[i].cX = Math.cos(currentAngle) * (radius) + ball[0].cX;	
		ball[i].cY = Math.sin(currentAngle) * (radius) + ball[0].cY;
		
		// Update Far Bar
		ball[i].fX = (Math.cos(currentAngle) * (audioData[i-1]/5)) + ball[i].cX;
		ball[i].fY = (Math.sin(currentAngle) * (audioData[i-1]/5)) + ball[i].cY;
		
		// Rotate for each bar + rotation for spin
		currentAngle += centerAngle + rotation;
	}
}


// Create side paddles
function createPaddles() {

	// Paddle Stats
	let width = canvasWidth * .02;
	let height = canvasHeight / 3;
	let cX = canvasWidth - 1.5 * width;
	let cY = (canvasHeight - height) / 2;
	let fwd = {x:0, y:1}
	let speed = 3;	
	let lineWidth = 0.5;
			
	// Draw right paddle
	let right = new classes.RectSprite(cX, cY, width, height, fwd, speed, "black", lineWidth, "white");
	paddles.push(right);
	

	cX = 0.5 * width;
	
	// Draw left paddle
	let left = new classes.RectSprite(cX, cY, width, height, fwd, speed, "black", lineWidth, "white");
	paddles.push(left);
}

// Key is pressed
function press(e){
	if (e.keyCode === 87)
		lU = true;
	if (e.keyCode === 83)
		lD = true;	
	if (e.keyCode === 38)
		rU = true;
	if (e.keyCode === 40)
		rD = true;
}

// Key is released
function depress(e){
	if (e.keyCode === 87)
		lU = false;
	if (e.keyCode === 83)
		lD = false;
	if (e.keyCode === 38)
		rU = false;
	if (e.keyCode === 40)
		rD = false;
}

// Move the paddles
function movePaddles(){
	// Left Top Bound
	if (paddles[1].cY >= 0){
		if (lU){
			paddles[1].fwd.y = -1;
			paddles[1].move();
		}
	}
	// Left Bottom Bound
	if (paddles[1].cY <= canvasHeight - paddles[1].height){
		if (lD){
			paddles[1].fwd.y = 1;
			paddles[1].move();
		}
	}
	// Right Top Bound
	if (paddles[0].cY >= 0){
		if (rU){
			paddles[0].fwd.y = -1;
			paddles[0].move();
		}
	}
	// Right Bottom Bound
	if (paddles[0].cY <= canvasHeight - paddles[0].height){
		if (rD){
			paddles[0].fwd.y = 1;
			paddles[0].move();
		}
	}
}





export {setupCanvas, draw, createBall, createPaddles};