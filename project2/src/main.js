
// Imports
import * as utils from './utils.js';
import * as audio from './audio.js';
import * as canvas from './canvas.js';

// Set default song
const DEFAULTS = Object.freeze({
	sound1  :  "media/Beetle Juice Theme Song.mp3"
});

// Enables
const drawParams = {
	paused			: true,
	showGradient	: true,
	freqWaveCir    	: false,
	freqWaveBar    	: true,
	showBall		: true,
	showBars		: true,
	showPaddle		: true,
	showCurves		: true,
	showNoise		: false,
	showInvert 		: false,
	showEmboss 		: false
};

// Controls
const ctrlParams = {
	ballSize		: 30,
	ballSpeed		: 2,
	paddleSize		: 135,
	paddleSpeed		: 3
};


// Startup
function init(){
	// Set inital song
	audio.setupWebaudio(DEFAULTS.sound1);

	// Setups
	let canvasElement = document.querySelector("canvas");
	setupUI(canvasElement);
	canvas.setupCanvas(canvasElement,audio,playButton);
	
	// Create curvesCB
	canvas.createCurves();
	
	// Create ball
	canvas.createBall();
	
	// Create Paddles
	canvas.createPaddles();
	
	
	// Start Loop
	loop();
}

// UI Setup
function setupUI(canvasElement){
	
  // Fullscreen Button
  const fsButton = document.querySelector("#fsButton");
  fsButton.onclick = e => {
    utils.goFullscreen(canvasElement);
  };
  
  // Play Button
  playButton.onclick = e => {
	  
	  // Check if paused
	  if (audio.audioCtx.state == "suspended")
		  audio.audioCtx.resume();


	  // Flip Play and Pause Sound and Text
	  // Play
	  if (e.target.dataset.playing == "no") {
		  audio.playCurrentSound();
		  e.target.dataset.playing = "yes";
		  drawParams.paused = false;
	  // Pause
	  }else{
		  audio.pauseCurrentSound();
		  e.target.dataset.playing = "no";
		  drawParams.paused = true;
	  }
  };
  
  // Volume Controls
  let volumeSlider = document.querySelector("#volumeSlider");
  let volumeLabel = document.querySelector("#volumeLabel");
  
  // Volume Control Changes
  volumeSlider.oninput = e => {
	  // Sound Change
	  audio.setVolume(e.target.value);
	  // Text Change
	  volumeLabel.innerHTML = Math.round((e.target.value/2 * 100));
  };
  
  // Label = Value of slider
  volumeSlider.dispatchEvent(new Event("input"));
  
  
  // Ball Size Controls
  let ballSizeSlider = document.querySelector("#ballSizeSlider");
  let ballSizeLabel = document.querySelector("#ballSizeLabel");
  
  // Ball Size Control Changes
  ballSizeSlider.oninput = e => {
	  // Size Change
	  ctrlParams.ballSize = e.target.value;
	  // Text Change
	  ballSizeLabel.innerHTML = Math.round(e.target.value);
  };
  
  // Label = Value of slider
  ballSizeSlider.dispatchEvent(new Event("input"));
  
  
  // Ball Speed Controls
  let ballSpeedSlider = document.querySelector("#ballSpeedSlider");
  let ballSpeedLabel = document.querySelector("#ballSpeedLabel");
  
  // Ball Speed Control Changes
  ballSpeedSlider.oninput = e => {
	  // Speed Change
	  ctrlParams.ballSpeed = e.target.value;
	  // Text Change
	  ballSpeedLabel.innerHTML = Math.round(e.target.value);
  };
  
  // Label = Value of slider
  ballSpeedSlider.dispatchEvent(new Event("input"));
  
  
  // Paddle Size Controls
  let paddleSizeSlider = document.querySelector("#paddleSizeSlider");
  let paddleSizeLabel = document.querySelector("#paddleSizeLabel");
  
  // Paddle Size Control Changes
  paddleSizeSlider.oninput = e => {
	  // Size Change
	  ctrlParams.paddleSize = e.target.value;
	  // Text Change
	  paddleSizeLabel.innerHTML = Math.round(e.target.value);
  };
  
  // Label = Value of slider
  paddleSizeSlider.dispatchEvent(new Event("input"));
  
  
  // Paddle Speed Controls
  let paddleSpeedSlider = document.querySelector("#paddleSpeedSlider");
  let paddleSpeedLabel = document.querySelector("#paddleSpeedLabel");
  
  // Paddle Speed Control Changes
  paddleSpeedSlider.oninput = e => {
	  // Size Change
	  ctrlParams.paddleSpeed = e.target.value;
	  // Text Change
	  paddleSpeedLabel.innerHTML = Math.round(e.target.value);
  };
  
  // Label = Value of slider
  paddleSpeedSlider.dispatchEvent(new Event("input"));
  
  
  
  // Track Select
  let trackSelect = document.querySelector("#trackSelect");
  // Track Change
  trackSelect.onchange = e => {
	  audio.loadSoundFile(e.target.value);
	  // Pause current
	  if (playButton.dataset.playing = "yes") {
		  playButton.dispatchEvent(new MouseEvent("click"));
	  }
  };
  
  // Gradient Checkbox
  document.querySelector("#gradientCB").checked = true;
  document.querySelector("#gradientCB").oninput = function(e){ 
		drawParams.showGradient = !drawParams.showGradient;
	};
	
  // Freq/Wave Circle Checkbox
  document.querySelector("#freqWaveCirCB").oninput = function(e){ 
		drawParams.freqWaveCir = !drawParams.freqWaveCir;
	};
	
  // Freq/Wave Bar Checkbox
  document.querySelector("#freqWaveBarCB").checked = true;
  document.querySelector("#freqWaveBarCB").oninput = function(e){ 
		drawParams.freqWaveBar = !drawParams.freqWaveBar;
	};
	
  // Ball Checkbox
  document.querySelector("#circlesCB").checked = true;
  document.querySelector("#circlesCB").oninput = function(e){ 
		drawParams.showBall = !drawParams.showBall;
	};
	
  // Bar Checkbox
  document.querySelector("#barsCB").checked = true;
  document.querySelector("#barsCB").oninput = function(e){ 
		drawParams.showBars = !drawParams.showBars;
	};
	
  // Paddle Checkbox
  document.querySelector("#paddlesCB").checked = true;
  document.querySelector("#paddlesCB").oninput = function(e){ 
		drawParams.showPaddle = !drawParams.showPaddle;
	};
	
  // Curve Checkbox
  document.querySelector("#curvesCB").checked = true;
  document.querySelector("#curvesCB").oninput = function(e){ 
		drawParams.showCurves = !drawParams.showCurves;
	};
	
  // Noise Checkbox
  document.querySelector("#noiseCB").oninput = function(e){ 
		drawParams.showNoise = !drawParams.showNoise;
	};
	
  // Invert Checkbox
  document.querySelector("#invertCB").oninput = function(e){ 
		drawParams.showInvert = !drawParams.showInvert;
	};
	
  // Emboss Checkbox
  document.querySelector("#embossCB").oninput = function(e){ 
		drawParams.showEmboss = !drawParams.showEmboss;
	};
	
}

// Loop
function loop(){

	requestAnimationFrame(loop);
	
	canvas.draw(drawParams, ctrlParams);	
}

export {init};