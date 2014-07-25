function CameraController(cameraObject, options) {
	this.camera = cameraObject;
	this.target = null;
	this.offset = new THREE.Vector3(0,0,0);
	options = options || {};
}

CameraController.prototype = {
	update: function() {
		// Move the camera and point it at the target
		if(this.target != null) {
			this.camera.position.set(this.target.position.x + this.offset.x,
									this.target.position.y + this.offset.y,
									this.target.position.z + this.offset.z);
	    	this.camera.lookAt(this.target.position);
	    }
	},
	setTarget: function(newTarget) {
		this.target = newTarget;
	},
	setOffset: function( newX, newY, newZ ) {
		this.offset = new THREE.Vector3( newX, newY, newZ );
	},
}