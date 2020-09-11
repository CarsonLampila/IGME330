"use strict";
console.log("index.js loaded");

(function(){
	const canvasWidth = 1000, canvasHeight = 700;
	const canvasStartX = 0, canvasStartY = 0;
	let ctx;
	let mouseX = -1, mouseY = -1;
	let x = 0, y = 0;
	let n = 0;
	let colorStart = 0, colorEnd = -1, colorChange = 0;
	let radius = 2;
	let spaceStart = 10, spaceChange = 10;
	let divergence = 137.5;
	let fps = 60;
	let stop = true, reverse = false;

	
	let index = 
	{
		// On window load
		init(){
			ctx = canvas.getContext("2d");
			canvas.width = canvasWidth;
			canvas.height = canvasHeight;
			ctx.fillRect(canvasStartX,canvasStartY,canvasWidth + canvasStartX,canvasHeight + canvasStartY);
			index.setupUI();
		},
		
		// Setup UI
		setupUI()
		{		
			// Draw
			canvas.onclick = index.canvasClicked;
			
			// Button Controls
			document.querySelector("#btnStart").onclick = function(e){
				stop = false;
				index.loop();
			}; 	
			document.querySelector("#btnPause").onclick = function(e){
				stop = true;
			}; 	
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
			
			// Color Controls
			document.querySelector("#sRed").checked = true;
			document.querySelector("#sRed").onclick = function(e){ index.colorSet(0, colorEnd); };
			document.querySelector("#sOrange").onclick = function(e){ index.colorSet(50, colorEnd); };
			document.querySelector("#sYellow").onclick =  function(e){index.colorSet(100, colorEnd); };
			document.querySelector("#sGreen").onclick = function(e){ index.colorSet(200, colorEnd); };
			document.querySelector("#sBlue").onclick = function(e){ index.colorSet(350, colorEnd); }; 
			document.querySelector("#sPurple").onclick = function(e){ index.colorSet(500, colorEnd); };
			
			document.querySelector("#eCycle").checked = true;
			document.querySelector("#eRed").onclick = function(e){ index.colorSet(colorStart, 0); };
			document.querySelector("#eOrange").onclick = function(e){ index.colorSet(colorStart, 50); };
			document.querySelector("#eYellow").onclick =  function(e){index.colorSet(colorStart, 100); };
			document.querySelector("#eGreen").onclick = function(e){ index.colorSet(colorStart, 200); };
			document.querySelector("#eBlue").onclick = function(e){ index.colorSet(colorStart, 350); };
			document.querySelector("#ePurple").onclick = function(e){ index.colorSet(colorStart, 500); };
			document.querySelector("#eCycle").onclick = function(e){ index.colorSet(colorStart, -1); };
			
			// Petal Controls
			document.querySelector("#petalSize").oninput = function(e){ radius = document.querySelector("#petalSize").value / 10; };
			
			// Space Controls
			document.querySelector("#padding").oninput = function(e){ 
				spaceStart = document.querySelector("#padding").value; 
				spaceChange = document.querySelector("#padding").value; 
			};
			
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
				
			// Degree Controls
			document.querySelector("#degree4").checked = true;
			document.querySelector("#degree1").onclick =  function(e){index.degreeTransition(100.0); };
			document.querySelector("#degree2").onclick = function(e){ index.degreeTransition(129.1); };
			document.querySelector("#degree3").onclick = function(e){ index.degreeTransition(-137.1); };
			document.querySelector("#degree4").onclick = function(e){ index.degreeTransition(137.5); };
			document.querySelector("#degree5").onclick = function(e){ index.degreeTransition(-137.9); };
			document.querySelector("#degree6").onclick = function(e){ index.degreeTransition(-138.1); };
			document.querySelector("#degree7").onclick = function(e){ index.degreeTransition(200.0); };
		},

		// Draw Fireworks
		loop()
		{
			// Pause
			if (stop) return;
			
			// each frame draw a new dot
			setTimeout(index.loop,1000/fps);

			// `a` is the angle
			// `n` is the distance from start
			// `r` is the radius
			// `space` is the "padding/spacing" between the dots
			let a = n * celLIB.dtr(divergence);
			let r = spaceChange * Math.sqrt(n);
		
			// Calculate
			let x = r * Math.cos(a) + mouseX;
			let y = r * Math.sin(a) + mouseY;
			
			colorChange = celLIB.colorTransition(colorChange, colorStart, colorEnd);	
			let color = `hsl(${colorChange/2 % 361},100%,50%)`;	
		
			// Draw
			celLIB.drawCircle(ctx,x,y,radius,color);
				
			// Alternate	
			n++;
			spaceChange-=.005;
		}, 
		
		// Start firework where click
		canvasClicked(e){
			// Find x and y
			let rect = e.target.getBoundingClientRect();
			mouseX = e.clientX - rect.x;
			mouseY = e.clientY - rect.y;
			
			// Reset
			n = 0;
			spaceChange = spaceStart;
			colorChange = colorStart;
			stop = false;
			index.loop();
		},
		
		// Set Color
		colorSet(cStart, cEnd){
			stop = true;
			n = 0;
			spaceChange = spaceStart;
			colorStart = cStart;
			colorEnd = cEnd;
			colorChange = colorStart;
			
		},
		
		// Transition Degree
		degreeTransition(dStart){
			divergence = dStart;
			if(reverse)
				divergence = -divergence; 
		}
	};
	
	if (window)
	{
		window["index"] = index;
	}
	else
	{
		throw "'window' is not defined!";
	}
})();