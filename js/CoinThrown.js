function CoinThrown( theObject, startPos, targetPos ) {
	this.object = theObject;
	this.startPos = startPos;
	this.targetPos = targetPos;
	this.speed = 200;
	this.rotSpeed = 3;
	this.lifeTime = 3500;
	this.spawned = Date.now();
}

CoinThrown.prototype = {
	update: function( delta, hitlist ) {
		// Move the coin towards target
		if(Date.now() >= this.spawned + this.lifeTime) {
			//console.log('coin expired');
			scene.remove( this.object );
			return 'destroy';
		}

		this.object.translateZ( delta * this.speed );

		// @ASeaboyer!!! Forecast the impact, verify if it hits an enemy (needs enemy list if thrown by player, player if thrown by enemy)


		this.object.rotation.z += ( delta * this.speed ); // rotate it on a safe local axis

		return null;
	},
	setTarget: function(newTarget) {
		this.target = newTarget;
	},
	setOffset: function( newX, newY, newZ ) {
		this.offset = new THREE.Vector3( newX, newY, newZ );
	},
}