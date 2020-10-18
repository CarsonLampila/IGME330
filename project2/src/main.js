
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
	freqWave 		: true,
	showGradient	: true,
	showBall		: true,
	showBars		: true,
	showPaddle		: true,
	showNoise		: false,
	showInvert 		: false,
	showEmboss 		: false
};

// Startup
function init(){
	// Set inital song
	audio.setupWebaudio(DEFAULTS.sound1);

	// Setups
	let canvasElement = document.querySelector("canvas");
	setupUI(canvasElement);
	canvas.setupCanvas(canvasElement,audio.analyserNode);
	
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
	  // Pause
	  }else{
		  audio.pauseCurrentSound();
		  e.target.dataset.playing = "no";
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
  
  // Freq/Wave Checkbox
  document.querySelector("#modeCB").checked = true;
  document.querySelector("#modeCB").oninput = function(e){ 
		drawParams.freqWave = !drawParams.freqWave;
	};
  
  // Gradient Checkbox
  document.querySelector("#gradientCB").checked = true;
  document.querySelector("#gradientCB").oninput = function(e){ 
		drawParams.showGradient = !drawParams.showGradient;
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
	
	canvas.draw(drawParams);	
}

export {init};