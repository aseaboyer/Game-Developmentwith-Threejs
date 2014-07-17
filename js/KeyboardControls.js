
console.log('keys add');
function KeyboardControls(o, options) {
	this.object = o;
	options = options || {};
	this.domElement = options.domElement || document;
	this.moveSpeed = options.moveSpeed || 1;
	
	this.domElement.addEventListener( 'keydown', this.onKeyDown.bind(this), false );
	this.domElement.addEventListener( 'keyup', this.onKeyUp.bind(this), false );
}

KeyboardControls.prototype = {
	update: function() {
		if (this.moveForward)	this.object.translateZ(-this.moveSpeed);
		if (this.moveBackward)	this.object.translateZ( this.moveSpeed);
		if (this.moveLeft)		this.object.translateX(-this.moveSpeed);
		if (this.moveRight)		this.object.translateX( this.moveSpeed);
	},
	onKeyDown: function (event) {
		switch (event.keyCode) {
			case 38: // up
			case 87: this.moveForward = true; break; // W
			
			case 37: // left
			case 65: this.moveLeft = true; break; // A
			
			case 40: // down
			case 83: this.moveBackward = true; break; // S
			
			case 39: // right
			case 68: this.moveRight = true; break; // D
		}
	},
	onKeyUp: function (event) {
		switch (event.keyCode) {
			case 38: // up
			case 87: this.moveForward = false; break; // W
			
			case 37: //  left
			case 65: this.moveLeft = false; break; // A
			
			case 40: // down
			case 83: this.moveBackward = false; break; // S
			
			case 39: // right 
			case 68: this.moveRight = false; break; // D
		}
	}
};