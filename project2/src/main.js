/*
	main.js is primarily responsible for hooking up the UI to the rest of the application 
	and setting up the main event loop
*/

// We will write the functions in this file in the traditional ES5 way
// In this instance, we feel the code is more readable if written this way
// If you want to re-write these as ES6 arrow functions, to be consistent with the other files, go ahead!

import * as utils from './utils.js';
import * as audio from './audio.js';
import * as canvas from './canvas.js';

// 1 - here we are faking an enumeration
const DEFAULTS = Object.freeze({
	sound1  :  "media/how to train your dragon - Flying theme.mp3"
});

const drawParams = {
	showGradient	: true,
	showBall		: true,
	showNoise		: false,
	showInvert 		: false,
	showEmboss 		: false
};

function init(){
	audio.setupWebaudio(DEFAULTS.sound1);

	let canvasElement = document.querySelector("canvas"); // hookup <canvas> element
	setupUI(canvasElement);
	canvas.setupCanvas(canvasElement,audio.analyserNode);
	
	canvas.createBall();
	loop();
}

function setupUI(canvasElement){
  // A - hookup fullscreen button
  const fsButton = document.querySelector("#fsButton");
	
  // add .onclick event to button
  fsButton.onclick = e => {
    console.log("init called");
    utils.goFullscreen(canvasElement);
  };
  
  // add .onclick event to button
  playButton.onclick = e => {
	  
	  // check if context is in suspended state (autoplay)
	  if (audio.audioCtx.state == "suspended") {
		  audio.audioCtx.resume();
	  }

	  if (e.target.dataset.playing == "no") {
		  // if track is currently paused, play italics
		  audio.playCurrentSound();
		  e.target.dataset.playing = "yes"; // our CSS will set the text to "Pause"
		  // if track IS playing, pause italics
	  }else{
		  audio.pauseCurrentSound();
		  e.target.dataset.playing = "no"; // our CSS will set the text to "Play"
	  }
  };
  
  // C - hookup volume slider & label
  let volumeSlider = document.querySelector("#volumeSlider");
  let volumeLabel = document.querySelector("#volumeLabel");
  
  // add .oninput event to slider
  volumeSlider.oninput = e => {
	  // set the gain
	  audio.setVolume(e.target.value);
	  // update value of label to match value of slider
	  volumeLabel.innerHTML = Math.round((e.target.value/2 * 100));
  };
  
  // set value of label to match initial value of slider
  volumeSlider.dispatchEvent(new Event("input"));
  
  // D - hookup track <select>
  let trackSelect = document.querySelector("#trackSelect");
  // add.onchange event to <select>
  trackSelect.onchange = e => {
	  audio.loadSoundFile(e.target.value);
	  // pause the current track if it is playing
	  if (playButton.dataset.playing = "yes") {
		  playButton.dispatchEvent(new MouseEvent("click"));
	  }
  };
  
  
  document.querySelector("#gradientCB").checked = true;
  document.querySelector("#gradientCB").oninput = function(e){ 
		drawParams.showGradient = !drawParams.showGradient;
	};
	
  document.querySelector("#circlesCB").checked = true;
  document.querySelector("#circlesCB").oninput = function(e){ 
		drawParams.showBall = !drawParams.showBall;
	};
	
  document.querySelector("#noiseCB").oninput = function(e){ 
		drawParams.showNoise = !drawParams.showNoise;
	};
	
	
  document.querySelector("#invertCB").oninput = function(e){ 
		drawParams.showInvert = !drawParams.showInvert;
	};
	
  document.querySelector("#embossCB").oninput = function(e){ 
		drawParams.showEmboss = !drawParams.showEmboss;
	};
	
} // end setupUI

function loop(){

	requestAnimationFrame(loop);
	
	canvas.draw(drawParams);
	
}

export {init};