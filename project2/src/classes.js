import * as utils from './utils.js';

class Sprite{
	constructor(cX=0, cY=0, fwd={x:1,y:0}, translateSpeed=0, color="black")
	{
		this.cX = cX;
		this.cY = cY;
		this.fwd = fwd;
		this.translateSpeed = translateSpeed;
		this.color = color;
	}
	// Move Sprite
	move(){
		this.cX += this.fwd.x * this.translateSpeed;
		this.cY += this.fwd.y * this.translateSpeed;
		
		this.fX += this.fwd.x * this.translateSpeed;
		this.fY += this.fwd.y * this.translateSpeed;
	}
	
	// X Bounce
	reflectX(){
		this.fwd.x *= -1;
	}

	// Y Bounce
	reflectY(){
		this.fwd.y *= -1;
	}
}

class BarSprite extends Sprite{
	constructor(cX=0, cY=0, fX=0, fY=0, size=0, fwd={x:1,y:0}, translateSpeed=0, color="black"){
		super(cX, cY, fwd, translateSpeed, color);
		this.fX = fX;
		this.fY = fY;
		this.size = size;
	}
		
	// Draw Bar
	draw(ctx){
		ctx.save();
		ctx.lineWidth = this.size;
		ctx.strokeStyle = this.color;
		ctx.beginPath();
		ctx.moveTo(this.cX, this.cY);
		ctx.lineTo(this.fX, this.fY);
		ctx.closePath();
		ctx.stroke();
		ctx.restore();
	}
}

class CircleSprite extends Sprite{
	constructor(cX=0, cY=0, size=1, fwd={x:1,y:0}, translateSpeed=0, color="black"){
		super(cX, cY, fwd, translateSpeed, color)
		this.size = size;
		//this.rotateSpeed = rotateSpeed;
	}
	
	draw(ctx, audio){
		ctx.save();
		ctx.globalAlpha = 0.5;
		for (let i = 0; i < audio.length; i++) {
			let percent = audio[i] / 255;
			let circleRadius = percent * this.size;

	
			// Outer
			ctx.beginPath();
			ctx.fillStyle = utils.makeColor(0, 18, 81, .10 - percent/10.0);
			ctx.arc(this.cX, this.cY, circleRadius * 1.5, 0, 2 * Math.PI, false);
			ctx.fill();
			ctx.closePath();
			
			// Middle
			ctx.beginPath();
			ctx.fillStyle = utils.makeColor(19, 56, 190, .34 - percent/3.0);
			ctx.arc(this.cX, this.cY, circleRadius, 0, 2 * Math.PI, false);
			ctx.fill();
			ctx.closePath();
			
			// Center
			ctx.save();
			ctx.beginPath();
			ctx.fillStyle = utils.makeColor(0, 219, 255, .5 - percent/5.0);
			ctx.arc(this.cX, this.cY, circleRadius * 0.50, 0, 2 * Math.PI, false);
			ctx.fill();
			ctx.closePath();
			ctx.restore();
		}
		ctx.restore();
	}	
}

class RectSprite extends Sprite{
	constructor(cX=0, cY=0, width=1, height=1, fwd={x:0,y:1}, translateSpeed=0, color="black", lineWidth=0, lineColor="white"){
		super(cX, cY, fwd, translateSpeed, color)
		this.width = width;
		this.height = height;
		this.lineWidth = lineWidth;
		this.lineColor = lineColor;
	}
	// Draw Rectangle
	draw(ctx){
		ctx.save();
		ctx.fillStyle = this.color; 
		ctx.beginPath();
		ctx.rect(this.cX,this.cY,this.width,this.height);
		ctx.closePath();
		ctx.lineWidth = this.lineWidth;
		ctx.strokeStyle = this.lineColor;
		ctx.stroke();
		ctx.fill();
		ctx.restore();
	}
}


export {Sprite, BarSprite, CircleSprite, RectSprite};
	

