
// Imports
import * as utils from './utils.js';
import * as audio from './audio.js';
import * as canvas from './canvas.js';

// Set default song
const DEFAULTS = Object.freeze({
	sound1  :  "media/BeetleJuiceTheme.mp3"
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
	showGreyscale	: false,
	showTint		: false,
	tintColor		: "red",
	showEmboss 		: false,
	soundQuality	: false
};

// Controls
const ctrlParams = {
	ballSpeed		: 2,
	paddleSize		: 135,
	paddleSpeed		: 3,
	paddleCount		: 1,
};



// Startup
function init(){
	// Set inital song
	audio.setupWebaudio(DEFAULTS.sound1);

	// Setups
	let canvasElement = document.querySelector("canvas");
	setupUI(canvasElement);
	canvas.setupCanvas(canvasElement,audio);
	
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
 
 
  // Play / Pause Controls
  let audioControls = document.querySelector("audio");
  // Play
  audioControls.onplay = e => {
	  audio.audioCtx.resume();
	  drawParams.paused = false;
  }
  // Pause
  audioControls.onpause = e => {
	  drawParams.paused = true;
  }
  
  
  // Track Select
  // https://www.w3schools.com/tags/tag_select.asp (Drop Downs)
  let trackSelect = document.querySelector("#trackSelect");
  // Track Change
  trackSelect.onchange = e => {
	  audio.loadSoundFile(e.target.value);
	  drawParams.paused = true;
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
  
 
  // Ball Speed Controls
  let ballSpeedSlider = document.querySelector("#ballSpeedSlider");
  let ballSpeedLabel = document.querySelector("#ballSpeedLabel");
  
  // Ball Speed Control Changes
  ballSpeedSlider.oninput = e => {
	  // Speed Change
	  ctrlParams.ballSpeed = e.target.value;
	  // Text Change
	  ballSpeedLabel.innerHTML = e.target.value * 20;
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
	  paddleSizeLabel.innerHTML = Math.round(e.target.value * 0.37);
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
	  paddleSpeedLabel.innerHTML = e.target.value * 20;
  };
  
  // Label = Value of slider
  paddleSpeedSlider.dispatchEvent(new Event("input"));
  
  
  // Paddle Controls
  document.querySelector("#paddlesHor").checked = true;
  document.querySelector("#paddlesNone").onclick = function(e){ ctrlParams.paddleCount = 0; };
  document.querySelector("#paddlesHor").onclick = function(e){ ctrlParams.paddleCount = 1; };
  document.querySelector("#paddlesVer").onclick = function(e){ ctrlParams.paddleCount = 2; };
  document.querySelector("#paddlesAll").onclick = function(e){ ctrlParams.paddleCount = 3; };
  
  
  // Gradient Checkbox
  document.querySelector("#gradientCB").checked = true;
  document.querySelector("#gradientCB").oninput = function(e){ 
		drawParams.showGradient = !drawParams.showGradient;
	};
	
	
  // Frequency/Wave Circle Select
  // https://www.w3schools.com/tags/tag_select.asp (Drop Downs)
  let fwCirSelect = document.querySelector("#fwCirSelect");
  // Audio Data Change
  fwCirSelect.onchange = e => {
	  // Frequency
	  if (e.target.value == "freq")
		  drawParams.freqWaveCir = true;
	  // Waveform
	  else
		  drawParams.freqWaveCir = false;
  };
  
  // Frequency/Wave Bar Select
  // https://www.w3schools.com/tags/tag_select.asp (Drop Downs)
  let fwBarSelect = document.querySelector("#fwBarSelect");
  // Audio Data Change
  fwBarSelect.onchange = e => {
	  // Frequency
	  if (e.target.value == "freq")
		  drawParams.freqWaveBar = true;
	  // Waveform
	  else
		  drawParams.freqWaveBar = false;
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
	
  // Greyscale Checkbox
  document.querySelector("#greyscaleCB").oninput = function(e){ 
		drawParams.showGreyscale = !drawParams.showGreyscale;
	};
	
  // Tint Checkbox
  document.querySelector("#tintCB").oninput = function(e){ 
		drawParams.showTint = !drawParams.showTint;
	};
	
  // Emboss Checkbox
  document.querySelector("#embossCB").oninput = function(e){ 
		drawParams.showEmboss = !drawParams.showEmboss;
	};
	
  // Tint Change
  // https://www.w3schools.com/tags/tag_select.asp (Drop Downs)
  document.querySelector("#tints").onchange = function(e){ 
		drawParams.tintColor = e.target.value;
	};
	
	
  // Quality Controls
  let qualitySlider = document.querySelector("#qualitySlider");
  let qualityLabel = document.querySelector("#qualityLabel");
  // Quality Control Changes
  qualitySlider.oninput = e => {
		// Text Change
		qualityLabel.innerHTML =  Math.round(e.target.value * 4);
	};
  
  // Enable Quality Change
 document.querySelector("#qualityCB").oninput = function(e){ 
	drawParams.soundQuality = !drawParams.soundQuality;
  
	// Quality Control Changes
	qualitySlider.oninput = e => {
		// Sound Change
		audio.setQuality(e.target.value);	
		// Text Change
		qualityLabel.innerHTML =  Math.round(e.target.value * 4);
	};
	// Label = Value of slider
	qualitySlider.dispatchEvent(new Event("input"));
	
	// Reset on disable
	if (!drawParams.soundQuality)
		audio.resetQuality();
 };
}


// Loop
function loop(){

	requestAnimationFrame(loop);
	
	canvas.draw(drawParams, ctrlParams);
}



export {init};