function CoinThrown( theObject, startPos, targetPos ) {
	this.object = theObject;
	this.startPos = startPos;
	this.targetPos = targetPos;
	this.speed = 200;
	this.rotSpeed = 3;
	this.lifeTime = 3500;
	this.spawned = Date.now();
	this.leadingRay = new THREE.Raycaster(); // don't recreate each movement cycle
}

CoinThrown.prototype = {
	update: function( delta, hitlist ) {
		var moveThisCycle = delta * this.speed;

		// Move the coin towards target
		if(Date.now() >= this.spawned + this.lifeTime) {
			//console.log('coin expired');
			scene.remove( this.object );
			return 'destroy';
		}

		// check if the next move will impact
		var nextPosition = new THREE.Vector3( 0, 0, 1 ); // moveThisCycle as the z value isn't returning, ever
		this.leadingRay.set(this.object.position, nextPosition);
		// Test if we intersect with any obstacle mesh
		var collisions = this.leadingRay.intersectObjects(hitlist);
		if(collisions.length) {
			if(collisions[0].distance < moveThisCycle ) {
				console.log("Bullet speed: "+moveThisCycle+" hits @ "+ collisions[0].distance);
				//@aseaboyer - deal damage if we can deal damage, everything needs a life meter/script (@PlayerController is a bad manager for this reason?)
			} else {
			//	console.log("Bullet found a target distance @ "+collisions[0].distance);
			}
		}

		this.object.translateZ( moveThisCycle );

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