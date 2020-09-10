"use strict";
console.log("index.js loaded");

(function(){
	const canvasWidth = 1000, canvasHeight = 700;
	const fps = 12;
	let ctx;
	let x = 0, y = 0;
	let n = 0, c = 10;
	let stop = true;
	//const divergence = 137.5;
	//const divergence = -137.3;
	const divergence = -137.6;
	let mouseX = -1, mouseY = -1;
	let radius = 2;
	let colorChange = 0;
	
	let index = 
	{
		init(){
			ctx = canvas.getContext("2d");
			canvas.width = canvasWidth;
			canvas.height = canvasHeight;
			ctx.fillRect(0,0,canvasWidth,canvasHeight);
			index.setupUI();
			index.loop();
		},
		
		setupUI()
		{		
			// Draw
			canvas.onclick = index.canvasClicked;
			
			// Buttons
			document.querySelector("#btnStart").onclick = function(e){
				stop = false;
				index.loop();
			}; 	
			document.querySelector("#btnPause").onclick = function(e){
				stop = true;
			}; 	
			document.querySelector("#btnClear").onclick = function(e){
				celLIB.cls(ctx);
				stop = true;
				n = 0;
				c = 10;
			}; 		
			document.querySelector("#btnExport").onclick = celLIB.doExport;
			
			// Radio
			document.querySelector("#red").checked = true;
			document.querySelector("#red").onclick = function(e){ 
				stop = true;
				n = 0;
				colorChange = 0;
			};
			document.querySelector("#orange").onclick = function(e){ 
				stop = true;
				n = 0;
				colorChange = 50;
			};
			document.querySelector("#yellow").onclick = function(e){ 
				stop = true;
				n = 0;
				colorChange = 100;
			};
			document.querySelector("#green").onclick = function(e){ 
				stop = true;
				n = 0;
				colorChange = 200;
			};
			document.querySelector("#blue").onclick = function(e){ 
				stop = true;
				n = 0;
				colorChange = 350;
			};
			document.querySelector("#purple").onclick = function(e){ 
				stop = true;
				n = 0;
				colorChange = 500;
			};		
		},

		loop()
		{
			if (stop) return;
			if (mouseX != -1 && mouseY != -1)
			{
				setTimeout(index.loop,100/fps);
				// each frame draw a new dot
				// `a` is the angle
				// `r` is the radius from the center (e.g. "Pole") of the flower
				// `c` is the "padding/spacing" between the dots
				let a = n * celLIB.dtr(divergence);
				let r = c * Math.sqrt(n);
		
				// now calculate the `x` and `y`
				let x = r * Math.cos(a) + mouseX;
				let y = r * Math.sin(a) + mouseY;
		
				//let color = `rgb(${n % 256},0,255)`;
			
				//let aDegrees = (n * divergence) % 256;
				//let color = `rgb(${aDegrees},0,255)`;
			
				//let aDegrees = (n * divergence) % 361;
				//let color = `hsl(${aDegrees},100%,50%)`;
		
				let color = `hsl(${colorChange/2 % 361},100%,50%)`;
		
				c-=.005;
		
				celLIB.drawCircle(ctx,x,y,radius,color);
				n++;
				colorChange++;
			}
		}, 
		
		canvasClicked(e){
			let rect = e.target.getBoundingClientRect();
			mouseX = e.clientX - rect.x;
			mouseY = e.clientY - rect.y;
			stop = false;
			index.loop();
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