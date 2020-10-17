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
	
	// Draw Circles
	draw(ctx){
		ctx.save();
		ctx.fillStyle = this.color;
		ctx.beginPath();
		//ctx.translate(this.cX, this.cY)
		//ctx.rotate(this.rotateSpeed);
		//ctx.arc(0, 0, this.size, 0, Math.PI * 2, false);
		ctx.arc(this.cX, this.cY, this.size, 0, Math.PI * 2, false);
		ctx.closePath();
		ctx.fill();
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
	

