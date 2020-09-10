"use strict";
console.log("celLIB.js loaded");

(function(){
	let celLIB = 
	{
		getRandomColor()
		{
			const getByte = _ => 55 + Math.round(Math.random() * 200);		
			return `rgba(${getByte()},${getByte()},${getByte()},.8)`;
		},
	
		getRandomInt(min, max) 
		{
			return Math.floor(Math.random() * (max - min + 1)) + min;
		},
		
		dtr(degrees){
			return degrees * (Math.PI/180);
		},
		
		cls(ctx){
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.fillRect(0,0,canvas.width,canvas.height);
			clearTimeout();
		},
		
		drawCircle(ctx, cX, cY, cSize, fillStyle="black", lineWidth=0)
		{
			ctx.save();
			ctx.fillStyle = fillStyle;
			ctx.beginPath();
			ctx.arc(cX,cY,cSize,0,Math.PI * 2, false);
			ctx.closePath();
			ctx.lineWidth = lineWidth;
			ctx.fill();
			ctx.restore();
		},
		
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