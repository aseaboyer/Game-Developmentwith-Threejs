function CoinThrown( theObject, startPos, targetPos ) {
	this.object = theObject;
	this.startPos = startPos;
	this.targetPos = targetPos;
}

CoinThrown.prototype = {
	update: function() {
		// Move the coin towards target

	},
	setTarget: function(newTarget) {
		this.target = newTarget;
	},
	setOffset: function( newX, newY, newZ ) {
		this.offset = new THREE.Vector3( newX, newY, newZ );
	},
}