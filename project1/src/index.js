"use strict";
console.log("index.js loaded");

(function(){
	const canvasWidth = 1000, canvasHeight = 700;
	const canvasStartX = 0, canvasStartY = 0;
	let ctx;
	let animate;
	let mouseX = -1, mouseY = -1;
	let x = 0, y = 0;
	let n = 0;
	let stop = true, reverse = false;
	let shape = 0;
	let colorStart = 0, colorEnd = -1, colorChange = 0;
	let radius = 2.5, radiusCur = 2.5, sizeChange = 0;
	let space = 10, spaceCur = 10, padChange = 0;
	let change = .005;
	let divergence = 137.5;
	let fps = 60;
	
	
	window.onload = init;
		
	// On window load
	function init(){
		ctx = canvas.getContext("2d");
		canvas.width = canvasWidth;
		canvas.height = canvasHeight;
		ctx.fillRect(canvasStartX,canvasStartY,canvasWidth + canvasStartX,canvasHeight + canvasStartY);
		setupUI();
	}
		
	// Setup UI
	function setupUI()
	{		
		// Draw
		canvas.onclick = canvasClicked;

		// Button Controls
		// How to create and utilize buttons: https://www.w3schools.com/tags/tag_button.asp
		document.querySelector("#btnPause").onclick = function(e){
			stop = true;
		}; 	
		document.querySelector("#btnResume").onclick = function(e){
			stop = false;
			loop();
		}; 	
		document.querySelector("#btnRandom").onclick = randomize;
		document.querySelector("#btnReverse").onclick = function(e){
			reverse = !reverse;
			divergence = -divergence;	
		};
		document.querySelector("#btnClear").onclick = function(e){
			celLIB.cls(ctx, canvasStartX, canvasStartY);
			stop = true;
			n = 0;
		}; 		
		document.querySelector("#btnExport").onclick = celLIB.doExport;
		
		// Shape Controls
		// How to create and utilize radials: https://www.w3schools.com/tags/att_input_type_radio.asp
		document.querySelector("#shape1").checked = true;
		document.querySelector("#shape1").onclick = function(e){ shape = 0; };
		document.querySelector("#shape2").onclick = function(e){ shape = 1; };
		document.querySelector("#shape3").onclick = function(e){ shape = 2; };
		document.querySelector("#shape4").onclick = function(e){ shape = 3; };
		document.querySelector("#shape5").onclick = function(e){ shape = 4; }; 
			
		// Color Start Controls
		document.querySelector("#sRed").checked = true;
		document.querySelector("#sRed").onclick = function(e){ colorSet(0, colorEnd); };
		document.querySelector("#sOrange").onclick = function(e){ colorSet(50, colorEnd); };
		document.querySelector("#sYellow").onclick = function(e){ colorSet(100, colorEnd); };
		document.querySelector("#sGreen").onclick = function(e){ colorSet(200, colorEnd); };
		document.querySelector("#sBlue").onclick = function(e){ colorSet(350, colorEnd); }; 
		document.querySelector("#sPurple").onclick = function(e){ colorSet(500, colorEnd); };
			
		// Color End Controls
		document.querySelector("#eCycle").checked = true;
		document.querySelector("#eRed").onclick = function(e){ colorSet(colorStart, 0); };
		document.querySelector("#eOrange").onclick = function(e){ colorSet(colorStart, 50); };
		document.querySelector("#eYellow").onclick =  function(e){ colorSet(colorStart, 100); };
		document.querySelector("#eGreen").onclick = function(e){ colorSet(colorStart, 200); };
		document.querySelector("#eBlue").onclick = function(e){ colorSet(colorStart, 350); };
		document.querySelector("#ePurple").onclick = function(e){ colorSet(colorStart, 500); };
		document.querySelector("#eCycle").onclick = function(e){ colorSet(colorStart, -1); };
			
		// Petal Controls
		// How to create and utilize sliders: https://www.w3schools.com/howto/howto_js_rangeslider.asp
		document.querySelector("#petalSize").oninput = function(e){ radius = document.querySelector("#petalSize").value / 10; 
			radiusCur = radius;
		};
		document.querySelector("#sNone").checked = true;
		document.querySelector("#sNone").onclick = function(e){ sizeChange = 0; };
		document.querySelector("#sInc").onclick = function(e){ sizeChange = 1; };
		document.querySelector("#sDec").onclick = function(e){ sizeChange = 2; };
			
		// Space Controls
		document.querySelector("#padding").oninput = function(e){ space = document.querySelector("#padding").value / 10; 
			spaceCur = space;
		};
		document.querySelector("#pNone").checked = true;
		document.querySelector("#pNone").onclick = function(e){ padChange = 0; };
		document.querySelector("#pInc").onclick = function(e){ padChange = 1; };
		document.querySelector("#pDec").onclick = function(e){ padChange = 2; };
		
		// Degree Controls
		document.querySelector("#degree4").checked = true;
		document.querySelector("#degree1").onclick = function(e){ degreeTransition(100.0); };
		document.querySelector("#degree2").onclick = function(e){ degreeTransition(129.1); };
		document.querySelector("#degree3").onclick = function(e){ degreeTransition(-137.1); };
		document.querySelector("#degree4").onclick = function(e){ degreeTransition(137.5); };
		document.querySelector("#degree5").onclick = function(e){ degreeTransition(-137.9); };
		document.querySelector("#degree6").onclick = function(e){ degreeTransition(-138.1); };
		document.querySelector("#degree7").onclick = function(e){ degreeTransition(200.0); };
			
		// FPS Controls
		document.querySelector("#fps4").checked = true;
		document.querySelector("#fps1").onclick = function(e){ fps = 15; };
		document.querySelector("#fps2").onclick = function(e){ fps = 30; };
		document.querySelector("#fps3").onclick = function(e){ fps = 45; };
		document.querySelector("#fps4").onclick = function(e){ fps = 60; };
		document.querySelector("#fps5").onclick = function(e){ fps = 75; };
		document.querySelector("#fps6").onclick = function(e){ fps = 90; };
		document.querySelector("#fps7").onclick = function(e){ fps = 105; };
		document.querySelector("#fps8").onclick = function(e){ fps = 120; };
	}

	// Draw Fireworks
	function loop()
	{
		// Pause
		if (stop) return;
		
		// each frame draw a new dot
		animate = setTimeout(loop,1000/fps);

		// `a` is the angle
		// `n` is the distance from start
		// `r` is the radius
		// `space` is the "padding/spacing" between the dots
		let a = n * celLIB.dtr(divergence);
		let r = spaceCur * Math.sqrt(n);
		
		// Calculate
		x = r * Math.cos(a) + mouseX;
		y = r * Math.sin(a) + mouseY;
		
		radiusCur = celLIB.increment(radiusCur, sizeChange, change);
			
		colorChange = celLIB.colorTransition(colorChange, colorStart, colorEnd);	
		let color = `hsl(${colorChange/2 % 361},100%,50%)`;	
		
		// Draw
		draw(x, y, color);
				
		// Alternate	
		spaceCur = celLIB.increment(spaceCur, padChange, change);
		n++;
	}
		
	// Start firework where click
	function canvasClicked(e){
		// Find x and y
		let rect = e.target.getBoundingClientRect();
		mouseX = e.clientX - rect.x;
		mouseY = e.clientY - rect.y;
		
		// Reset
		clearTimeout(animate);
		n = 0;
		radiusCur = radius;
		spaceCur = space;
		colorChange = colorStart;
		stop = false;
		loop();
	}
	
	// Draw Shapes
	function draw(x, y, color){
		switch(shape){
			// Circle
			case 0:
				celLIB.drawCircle(ctx,x,y,radiusCur,color);
				break;
			// Square
			case 1:
				celLIB.drawRectangle(ctx,x,y,radiusCur*2,radiusCur*2,color);
				break;	
			// Triangle
			case 2:
				celLIB.drawTriangle(ctx,x,y,radiusCur* 2,color);
				break;
			// Diamond
			case 3:
				celLIB.drawDiamond(ctx,x,y,radiusCur* 2,color);
				break;
			// X
			case 4:
				celLIB.drawX(ctx,x,y,radiusCur* 2,radiusCur,color);
				break;
		}
	}
		
	// Set Color
	function colorSet(cStart, cEnd){
		stop = true;
		n = 0;
		colorStart = cStart;
		colorEnd = cEnd;
		colorChange = colorStart;	
	}
		
	// Transition Degree
	function degreeTransition(dStart){
		divergence = dStart;
		if(reverse)
			divergence = -divergence; 
	}
	
	// Randomize Selection
	function randomize(){
		// Shape
		let sh = celLIB.getRandomInt(0,4);
		switch(sh){
			case 0:
				document.querySelector("#shape1").checked = true;
				shape = sh;
				break;
			case 1:
				document.querySelector("#shape2").checked = true;
				shape = sh;
				break;
			case 2:
				document.querySelector("#shape3").checked = true;
				shape = sh;
				break;
			case 3:
				document.querySelector("#shape4").checked = true;
				shape = sh;
				break;
			case 4:
				document.querySelector("#shape5").checked = true;
				shape = sh;
				break;						
		}
		
		// Start Color
		let sc = celLIB.getRandomInt(0,5);
		switch(sc){
			case 0:
				document.querySelector("#sRed").checked = true;
				colorSet(0, colorEnd);
				break;
			case 1:
				document.querySelector("#sOrange").checked = true;
				colorSet(50, colorEnd);
				break;
			case 2:
				document.querySelector("#sYellow").checked = true;
				colorSet(100, colorEnd);
				break;
			case 3:
				document.querySelector("#sGreen").checked = true;
				colorSet(200, colorEnd);
				break;
			case 4:
				document.querySelector("#sBlue").checked = true;
				colorSet(350, colorEnd);
				break;
			case 5:
				document.querySelector("#sPurple").checked = true;
				colorSet(500, colorEnd);
				break;							
		}
			
		// End Color
		let ec = celLIB.getRandomInt(0,6);	
		switch(ec) {
			case 0:
				document.querySelector("#eRed").checked = true;
				colorSet(colorStart, 0);
				break;
			case 1:
				document.querySelector("#eOrange").checked = true;
				colorSet(colorStart, 50);
				break;
			case 2:
				document.querySelector("#eYellow").checked = true;
				colorSet(colorStart, 100);
				break;
			case 3:
				document.querySelector("#eGreen").checked = true;
				colorSet(colorStart, 200);
				break;
			case 4:
				document.querySelector("#eBlue").checked = true;
				colorSet(colorStart, 350);
				break;
			case 5:
				document.querySelector("#ePurple").checked = true;
				colorSet(colorStart, 500);
				break;		
			case 6:
				document.querySelector("#eCycle").checked = true;
				colorSet(colorStart, -1);
				break;						
		}
			
		// Size
		let s = celLIB.getRandomInt(1,50);
		document.querySelector("#petalSize").value = s;
		radius = s / 10;
		let cs = celLIB.getRandomInt(0,2);
		switch(cs){
			case 0:
				document.querySelector("#sNone").checked = true;
				break;
			case 1:
				document.querySelector("#sInc").checked = true;
				break;
			case 2:
				document.querySelector("#sDec").checked = true;
				break;						
		}
		sizeChange = cs;
	
		// Padding
		let p = celLIB.getRandomInt(1,200);
		document.querySelector("#padding").value = p; 
		space = p / 10;
		let cp = celLIB.getRandomInt(0,2);
		switch(cp){
			case 0:
				document.querySelector("#pNone").checked = true;
				break;
			case 1:
				document.querySelector("#pInc").checked = true;
				break;
			case 2:
				document.querySelector("#pDec").checked = true;
				break;						
		}
		padChange = cp;
			
		// Degree
		let d = celLIB.getRandomInt(0,6);
		switch(d) {
			case 0:
				document.querySelector("#degree1").checked = true;
				degreeTransition(100.0);
				break;
			case 1:
				document.querySelector("#degree2").checked = true;
				degreeTransition(129.1);
				break;
			case 2:
				document.querySelector("#degree3").checked = true;
				degreeTransition(-137.1);
				break;
			case 3:
				document.querySelector("#degree4").checked = true;
				degreeTransition(137.5);
				break;
			case 4:
				document.querySelector("#degree5").checked = true;
				degreeTransition(-137.9);
				break;
			case 5:
				document.querySelector("#degree6").checked = true;
				degreeTransition(-138.1);
				break;		
			case 6:
				document.querySelector("#degree7").checked = true;
				degreeTransition(200.0);
				break;						
		}
			
		// FPS
		let f = celLIB.getRandomInt(0,7);
		switch(f) {
			case 0:
				document.querySelector("#fps1").checked = true;
				fps = 15;
				break;
			case 1:
				document.querySelector("#fps2").checked = true;
				fps = 30;
				break;
			case 2:
				document.querySelector("#fps3").checked = true;
				fps = 45;
				break;
			case 3:
				document.querySelector("#fps4").checked = true;
				fps = 60;
				break;
			case 4:
				document.querySelector("#fps5").checked = true;
				fps = 75;
				break;
			case 5:
				document.querySelector("#fps6").checked = true;
				fps = 90;
				break;		
			case 6:
				document.querySelector("#fps7").checked = true;
				fps = 105;
				break;		
			case 7:
				document.querySelector("#fps8").checked = true;
				fps = 120;
				break;								
		}
	}
})();