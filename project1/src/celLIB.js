"use strict";
console.log("celLIB.js loaded");

(function(){
	let celLIB = 
	{
		// Reurn Random Int
		getRandomInt(min, max) 
		{
			return Math.floor(Math.random() * (max - min + 1)) + min;
		},
		
		// Return Random Color
		getRandomColor()
		{
			const getByte = _ => 55 + Math.round(Math.random() * 200);		
			return `rgba(${getByte()},${getByte()},${getByte()},.8)`;
		},
		
		// Increment a number
		increment(input, direction, change){
			switch(direction){
				// None
				case 0:
					break;
				// Inc
				case 1:
					input += change;
					break;
				// Dec
				case 2:
					input -= change;
					break;
			}
			return input;
		},
		
		// Convert to Degrees
		dtr(degrees){
			return degrees * (Math.PI/180);
		},
			
		// Clear Screen
		cls(ctx, canvasStartX, canvasStartY){
			ctx.clearRect(canvasStartX, canvasStartY, canvas.width + canvasStartX, canvas.height + canvasStartY);
			ctx.fillRect(canvasStartX, canvasStartY, canvas.width + canvasStartX, canvas.height + canvasStartY);
			clearTimeout();
		},
		
		// Draw Circles
		drawCircle(ctx, x, y, size, fillStyle="black", lineWidth=0, strokeStyle="black"){
			ctx.save();
			ctx.fillStyle = fillStyle;
			ctx.beginPath();
			ctx.arc(x,y,size,0,Math.PI * 2, false);
			ctx.closePath();
			ctx.lineWidth = lineWidth;
			ctx.strokeStyle = strokeStyle;
			ctx.stroke();
			ctx.fill();
			ctx.restore();
		},
		
		// Draw Rectangle
		drawRectangle(ctx, x, y, width, height, fillStyle="black", lineWidth=0, strokeStyle="black"){
			ctx.save();
			ctx.fillStyle = fillStyle; 
			ctx.beginPath();
			ctx.rect(x,y,width,height);
			ctx.closePath();
			ctx.lineWidth = lineWidth;
			ctx.strokeStyle = strokeStyle;
			ctx.stroke();
			ctx.fill();
			ctx.restore();
		},
		
		// Draw Triangle
		drawTriangle(ctx, x, y, size, fillStyle="black", lineWidth=0, strokeStyle="black"){
			ctx.save();
			ctx.fillStyle = fillStyle;
 			ctx.beginPath();
 			ctx.moveTo(x, y);
 			ctx.lineTo(x + size/2, y - size);
  			ctx.lineTo(x - size/2, y - size);
 			ctx.closePath();
			ctx.lineWidth = lineWidth;
			ctx.strokeStyle = strokeStyle;
 			ctx.stroke();
			ctx.fill();
			ctx.restore();
		},
		
		// Draw Diamond
		drawDiamond(ctx, x, y, size, fillStyle="black", lineWidth=0, strokeStyle="black"){
			ctx.save();
			ctx.fillStyle = fillStyle;
 			ctx.beginPath();
 			ctx.moveTo(x, y);
 			ctx.lineTo(x + size/2, y - (size * (2/3)));
 			ctx.lineTo(x, y - (size * (3/2)));
  			ctx.lineTo(x - size/2, y - (size * (2/3)));
 			ctx.closePath();
			ctx.lineWidth = lineWidth;
			ctx.strokeStyle = strokeStyle;
 			ctx.stroke();
			ctx.fill();
			ctx.restore();
		},
		
		// Draw X
		drawX(ctx, x, y, size, lineWidth=1, strokeStyle="black"){
			ctx.save();
 			ctx.beginPath();
 			ctx.moveTo(x - size/2, y + size/2);
 			ctx.lineTo(x + size/2, y - size/2);
  			ctx.moveTo(x + size/2, y + size/2);
 			ctx.lineTo(x - size/2, y - size/2);
 			ctx.closePath();
			ctx.lineWidth = lineWidth;
			ctx.strokeStyle = strokeStyle;
 			ctx.stroke();
			ctx.restore();
		},
		
		// Trasnition Colors
		colorTransition(cCurrent, cStart, cEnd)
		{
			let colorChange = cCurrent;
			// Check for loop
			if (cEnd != -1)
				// Buffer to have whole color
				if (colorChange == cEnd + 45)
					colorChange = cStart;
				// Purple to Red
				else if (colorChange > cEnd)
					if (colorChange > 600)
						colorChange = 0;
					
			colorChange++;	
			return colorChange;	
		},
		
		// Export Canvas
		doExport()
		{
			const data = canvas.toDataURL(); 
			const newWindow = window.open();
			newWindow.document.body.innerHTML = `<iframe src="${data}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`;
		}
	};
	
	if (window)
	{
		window["celLIB"] = celLIB;
	}
	else
	{
		throw "'window' is not defined!";
	}
})();