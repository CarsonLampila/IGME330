class Sprite{
	constructor(cX=0, cY=0, fX=0, fY=0, size=1, fwd={x:1,y:0}, translateSpeed=0, rotateSpeed=0, color="black"){
		this.cX = cX;
		this.cY = cY;
		this.fX = fX;
		this.fY = fY;
		this.size = size;
		this.fwd = fwd;
		this.translateSpeed = translateSpeed;
		this.rotateSpeed = rotateSpeed;
		this.color = color;	
	}

	// Draw Bar
	drawBar(ctx){
		ctx.save();
		ctx.beginPath();
		ctx.lineWidth = this.size;
		ctx.strokeStyle = this.color;
		ctx.moveTo(this.cX, this.cY);
		ctx.lineTo(this.fX, this.fY);
		ctx.closePath();
		ctx.rotate(this.rotateSpeed);
		ctx.stroke();
		ctx.restore();
	}

	// Draw Circles
	drawCircle(ctx){
		ctx.save();
		ctx.fillStyle = this.color;
		ctx.beginPath();
		ctx.arc(this.cX, this.cY, this.size, 0, Math.PI * 2, false);
		ctx.closePath();
		ctx.rotate(this.rotateSpeed);
		ctx.fill();
		ctx.restore();
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
	
	// Rotate
	updateRotate(rotation){
		this.rotateSpeed = rotation;
	}
}

export {Sprite};

	

