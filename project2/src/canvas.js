// Imports
import * as utils from './utils.js';
import * as classes from './classes.js';

// Canvas
let ctx,canvasWidth,canvasHeight,gradient,analyserNodeFreq,audioDataFreq,analyserNodeWave,audioDataWave;

// Ball Object
let ball;

// All Bar Objects
let bars = [];

// All Paddle Objects
let paddles = [];

// Rotation
let centerAngle = 0, currentAngle = 0;

// Controls
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
	analyserNodeFreq = analyserNodeRef;
	audioDataFreq = new Uint8Array(analyserNodeFreq.fftSize/8);
	
	analyserNodeWave = analyserNodeRef;
	audioDataWave = new Uint8Array(analyserNodeWave.fftSize/2);
	
	// Establish Angle
	centerAngle = ((2 * Math.PI) / audioDataFreq.length)
}

// Draw
function draw(params={}){

	analyserNodeFreq.getByteFrequencyData(audioDataFreq); // Frequency
	analyserNodeWave.getByteTimeDomainData(audioDataWave); // Waveform 	
	
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
	
	// Bounce Ball
	moveBall();	
	
	// Reset Pos when out of X and Y bounds
	if (ball.cX + (ball.size * 3) < 0 ||
		ball.cX - (ball.size * 3) > canvasWidth ||
		ball.cY + (ball.size * 3) < 0 ||
		ball.cY - (ball.size * 3) > canvasHeight){
				
		bars = []
		createBall();
	}
	
	// Ball Enable
	if (params.showBall){
		
		// Freq or Wave
		if (params.freqWaveCir)	
			ball.draw(ctx, audioDataFreq);		
		else
			ball.draw(ctx, audioDataWave);	
	}  
	
	
	// Bar Enable
	if (params.showBars){
		
		// Add Bar Music Freq or Wave
		if (params.freqWaveBar)	
			musicBars(audioDataFreq);
		else
			musicBars(audioDataWave);
		
		// Loop through ball objects
		for (let i = 0; i < bars.length; i++){
			bars[i].draw(ctx);	
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
	let radius = 30;
	let barWidth = (200 / audioDataFreq.length);
	let colorChange = 700/audioDataFreq.length;
		
	// Reset start angle and color
	let currentColor = 0;
	currentAngle = 0;
		
	// Movement
	let speed = 2;

	// Make sure direction is not up and down
	let tempDir = utils.getRandomUnitVector();
	while (tempDir.y < .7 && tempDir.y > -.7 &&
			tempDir.x < .7 && tempDir > .7)
		tempDir = utils.getRandomUnitVector();
	
	let direction = tempDir	
		
	// Draw center circle
	ball = new classes.CircleSprite(canvasWidth/2, canvasHeight/2, radius, direction, speed, "white", audioDataWave);
	
		
	// Loop through audio data to draw bars
	for (let i=0; i<audioDataFreq.length; i++) {

		// Define start and end of line with angle
		cX = Math.cos(currentAngle) * (radius) + canvasWidth/2;	
		cY = Math.sin(currentAngle) * (radius) + canvasHeight/2;		

		// Define color
		color = `hsl(${currentColor/2 % 361},100%,50%)`;
			
		// Draw bars
		let bar = new classes.BarSprite(cX, cY, cX, cY, barWidth, direction, speed, color);
		bars.push(bar);
		
		// Update angle and color
		currentAngle += centerAngle;
		currentColor += colorChange;
	}
}

// Move the Ball and Bounce
function moveBall(){

	// Loop through all ball objects
	for (let i = -1; i < bars.length; i++){
		
		// Move based on vector
		if (i == -1){
			ball.move();
		} else {
			bars[i].move();
		}
		
		// X Bounce
		// Center of paddles
		let paddleLC = paddles[1].cY + (paddles[1].height / 2);
		let paddleRC = paddles[0].cY + (paddles[0].height / 2);
		
		// Left side of screen
		if (ball.cX < canvasWidth/2){
			
			// Ball is not past paddle
			if (ball.cX - (ball.size*1.5) > 0){
				
				// Check if ball is within range of paddle Y
				if (ball.cY > paddleLC - (paddles[1].height / 2) - (ball.size / 2) && 		// Top
					ball.cY < paddleLC + (paddles[1].height / 2) + (ball.size / 2)){		// Bottom
					
					// Check if ball is within range of paddle X
					if (ball.cX <= (ball.size) + (0.5 * paddles[1].width) + paddles[1].width){	// Left
						
						// Bounce
						if (i == -1){
							ball.reflectX();
						} else {
							bars[i].reflectX();
						}
						ball.move();
					}	
				}
			}
		}
		// Right side of screen
		else{
			
			// Ball is not past paddle
			if (ball.cX + (ball.size*1.5) < canvasWidth){
				
				// Check if ball is within range of paddle Y	
				if (ball.cY > paddleRC - (paddles[0].height / 2) - (ball.size / 2) && 		// Top
					ball.cY < paddleRC + (paddles[0].height / 2) + (ball.size / 2)){		// Bottom
					
					// Check if ball is within range of paddle X
					if (ball.cX >= canvasWidth - (ball.size) - (0.5 * paddles[0].width) - paddles[0].width){	// Right
					
						// Bounce
						if (i == -1){
							ball.reflectX();
						} else {
							bars[i].reflectX();
						}
						ball.move();
					}	
				}	
			}
		}
		
		
		
		// Y Bounce
		// Center of paddles
		let paddleTC = paddles[2].cX + (paddles[2].width / 2);
		let paddleBC = paddles[3].cX + (paddles[3].width / 2);
		
		// Top side of screen
		if (ball.cY < canvasHeight/2){
			
			// Ball is not past paddle
			if (ball.cY - (ball.size*1.5) > 0){
				
				// Check if ball is within range of paddle X
				if (ball.cX > paddleTC - (paddles[2].width / 2) - (ball.size / 2) && 				// Left
					ball.cX < paddleTC + (paddles[2].width / 2) + (ball.size / 2)){					// Right
					
					// Check if ball is within range of paddle X
					if (ball.cY <= (ball.size) + (0.5 * paddles[2].height) + paddles[2].height){	// Top
						
						// Bounce
						if (i == -1){
							ball.reflectY();
						} else {
							bars[i].reflectY();
						}
						ball.move();
					}	
				}
			}
		}
		// Bottom side of screen
		else{
			
			// Ball is not past paddle
			if (ball.cY + (ball.size*1.5) < canvasWidth){
				
				// Check if ball is within range of paddle Y	
				if (ball.cX > paddleBC - (paddles[3].width / 2) - (ball.size / 2) && 							// Left
					ball.cX < paddleBC + (paddles[3].width / 2) + (ball.size / 2)){								// Right
					
					// Check if ball is within range of paddle X
					if (ball.cY >= canvasHeight - (ball.size) - (0.5 * paddles[3].height) - paddles[3].height){	// Bottom
					
						// Bounce
						if (i == -1){
							ball.reflectY();
						} else {
							bars[i].reflectY();
						}
						ball.move();
					}	
				}	
			}
		}
	}
}

// Update bars for music
function musicBars(audio){
	
	let rotation = .0001;
	
	// Loop through ball objects except circle
	for (let i = 0; i < bars.length; i++){
		
		// Update Close Bar
		bars[i].cX = Math.cos(currentAngle) * ball.size + ball.cX;	
		bars[i].cY = Math.sin(currentAngle) * ball.size + ball.cY;
		
		// Update Far Bar
		bars[i].fX = (Math.cos(currentAngle) * (audio[i]/5)) + bars[i].cX;
		bars[i].fY = (Math.sin(currentAngle) * (audio[i]/5)) + bars[i].cY;
		
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
	let	cY = canvasHeight - height;
	let dirR = {x:0, y:0}
	let dirL = {x:0, y:0}
	let dirU = {x:0, y:0}
	let dirD = {x:0, y:0}
	let speed = 3;	
	let lineWidth = 0.5;
			
	// Draw right paddle
	let right = new classes.RectSprite(cX, cY, width, height, dirR, speed, "white", lineWidth, "black");
	paddles.push(right);
	
	
	// Draw left paddle
	cX = 0.5 * width;
	cY = 0;
	
	let left = new classes.RectSprite(cX, cY, width, height, dirL, speed, "white", lineWidth, "black");
	paddles.push(left);
	
	
	// Draw top paddle
	let temp = width
	width = height;
	height = temp;
	
	cX = 0;
	cY = 0.5 * height;
	
	let up = new classes.RectSprite(cX, cY, width, height, dirU, speed*2.5, "white", lineWidth, "black");
	paddles.push(up);
	
	
	// Draw bottom paddle
	cX = canvasWidth - width;
	cY = canvasHeight - 1.5 * height;
	
	let down = new classes.RectSprite(cX, cY, width, height, dirD, speed*2.5, "white", lineWidth, "black");
	paddles.push(down);
	
}

// Key is pressed
function press(e){
	// W
	if (e.keyCode === 87)
		lU = true;
	// S
	if (e.keyCode === 83)
		lD = true;
	// Up Arrow
	if (e.keyCode === 38)
		rU = true;
	// Down Arrow
	if (e.keyCode === 40)
		rD = true;
}

// Key is released
function depress(e){
	// W
	if (e.keyCode === 87)
		lU = false;
	// S
	if (e.keyCode === 83)
		lD = false;
	// Up Arrow
	if (e.keyCode === 38)
		rU = false;
	// Down Arrow
	if (e.keyCode === 40)
		rD = false;
}

// Move the paddles
function movePaddles(){
	// Left Top Bound
	if (paddles[1].cY >= 0){
		if (lU){
			// Towards Top Left Corner
			paddles[1].fwd.y = -1;
			paddles[1].move();
			paddles[2].fwd.x = -1;
			paddles[2].move();
		}
	}
	// Left Bottom Bound
	if (paddles[1].cY <= canvasHeight - paddles[1].height){
		if (lD){
			// Away from Top Left Corner
			paddles[1].fwd.y = 1;
			paddles[1].move();
			paddles[2].fwd.x = 1;
			paddles[2].move();
		}
	}
	// Right Top Bound
	if (paddles[0].cY >= 0){
		if (rU){
			// Towards Bottom Right Corner
			paddles[0].fwd.y = -1;
			paddles[0].move();
			paddles[3].fwd.x = -1;
			paddles[3].move();
		}
	}
	// Right Bottom Bound
	if (paddles[0].cY <= canvasHeight - paddles[0].height){
		if (rD){
			// Away from Bottom Right Corner
			paddles[0].fwd.y = 1;
			paddles[0].move();
			paddles[3].fwd.x = 1;
			paddles[3].move();
		}
	}
}



export {setupCanvas, draw, createBall, createPaddles};