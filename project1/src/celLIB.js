console.log("lib loaded");

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

		drawRectangle(ctx, cX, cY, width, height, fillStyle="black", lineWidth=0, strokeStyle="black")
		{
			ctx.fillStyle = fillStyle; 
			ctx.save();
			ctx.beginPath();
			ctx.rect(cX,cY,width,height);
			ctx.closePath();
			ctx.fill();
			
			if(lineWidth > 0)
			{
				ctx.lineWidth = lineWidth;
				ctx.strokeStyle = strokeStyle;
				ctx.stroke();
			}
			ctx.restore();
		},
		
		drawCircle(ctx, cX, cY, cSize, fillStyle="black", lineWidth=0, strokeStyle="black")
		{
			ctx.save();
			ctx.beginPath();
			ctx.arc(cX, cY, cSize, 0, Math.PI * 2, false);
			ctx.closePath();
			ctx.fillStyle = fillStyle; 
			ctx.strokeStyle = strokeStyle;
			ctx.lineWidth = lineWidth;
			ctx.globalAlpha = 0.4;
			ctx.fill();
			ctx.stroke();
			ctx.restore();
		},
				
		drawLine(ctx, cX, cY, cXEnd, cYEnd, strokeStyle="black")
		{
			ctx.save();
			ctx.beginPath();
			ctx.moveTo(cX,cY);
			ctx.lineTo(cXEnd,cYEnd);
			ctx.closePath();
			ctx.strokeStyle = strokeStyle;
			ctx.stroke();
			ctx.restore();
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