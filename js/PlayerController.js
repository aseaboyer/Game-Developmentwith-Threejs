function PlayerController(playerObject, cameraObject, options) {
	this.player = playerObject;
	this.camera = cameraObject;
	this.attackSpeed = 1000;
	this.lastAttack = Date.now();
	options = options || {};
	this.domElement = options.domElement || document;
	this.moveSpeed = options.moveSpeed || 100;
	this.minSpeed = options.minSpeed || 1;
	this.maxSpeed = options.maxSpeed || 3;
	this.cameraOffset = new THREE.Vector3(
		playerObject.position.x + cameraObject.position.x,
		playerObject.position.y + cameraObject.position.y,
		playerObject.position.z + cameraObject.position.z
		);
	this.playersRay = new THREE.Raycaster(); // don't recreate each movement cycle

	this.purse = new Purse( 100, 20 );
	
	this.domElement.addEventListener( 'keydown', this.onKeyDown.bind(this), false );
	this.domElement.addEventListener( 'keyup', this.onKeyUp.bind(this), false );
}

PlayerController.prototype = {
	update: function( delta, cam, enemies ) {
		this.move(delta, cam, enemies);

		// Move the camera and point it at the player
	/*	this.camera.position.set(this.player.position.x + this.cameraOffset.x,
								this.player.position.y + this.cameraOffset.y,
								this.player.position.z + this.cameraOffset.z);
    	this.camera.lookAt(this.player.position);*/
	},
	move: function( delta, cam, enemies ) {
		var currentPos = this.player.position;
		var move = {
			count: 0,
			vert: 0,
			horz: 0,
		};
		if (this.moveForward) {
			move.count++;
			move.vert--;
			//this.player.translateZ(-this.moveSpeed);
		}
		if (this.moveBackward) {
			move.count++;
			move.vert++;
			//this.player.translateZ( this.moveSpeed);
		}
		if (this.moveLeft) {
			move.count++;
			move.horz--;
			//this.player.translateX(-this.moveSpeed);
		}
		if (this.moveRight) {
			move.count++;
			move.horz++;
			//this.player.translateX( this.moveSpeed);
		}

		if(move.count != 0) { // no movement, do nothing
			var angle = 0;
			if( move.count == 1 || move.count == 3 ) { // orthogonal movement
				if ( move.vert == 1 ) {
					angle = 0;
				} else if ( move.horz == 1 ) {
					angle = 90;
				} else if ( move.vert == -1 ) {
					angle = 180;
				} else if ( move.horz == -1 ) {
					angle = 270;
				}
			} else { // diagonal movement

				if ( move.vert == 1 && move.horz == 1 ) {
					angle = 45;
				} else if ( move.vert == -1 && move.horz == 1 ) {
					angle = 135;
				} else if ( move.vert == -1 && move.horz == -1 ) {
					angle = 225; // WORKING
				} else if ( move.vert == 1 && move.horz == -1 ) {
					angle = 315;
				}

				// console.log('Angle: '+angle);
				// We should instead us a rolling angle type movement scheme as in, swinging from north to east isn't instant.
				// This is interesting, because it may reward stopping with precision while rewards running with speed
			}

			var newZ = this.moveSpeed * Math.cos(angle * (Math.PI / 180));
			var newX = this.moveSpeed * Math.sin(angle * (Math.PI / 180));

			var playerZDiff = newZ + this.player.position.z;
			var playerXDiff = newX + this.player.position.x;
			var travelTo = new THREE.Vector3(playerXDiff, this.player.position.y, playerZDiff);
			this.player.lookAt( travelTo );

			// should check a raycast for impacts!
			this.playersRay.set( this.player.position, travelTo );
		//	console.log(this.playersRay); // @aseaboyer - not sure what the deal is here!
			//var movementImpacts = this.playersRay.intersectObjects(enemies);
			
		/*	if (movementImpacts.length) {
				console.log(movementImpacts.length);
			}*/

			this.player.translateZ( delta * this.moveSpeed );
			//this.player.translateZ( newZ );
			//this.player.translateX( newX );
		}
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
	},
	validAttack: function( targetLocation ) {
		//console.log('player Attacks to: ' );
		//console.log( targetLocation );

		//console.log( Date.now() +' vs ' + (this.lastAttack + this.attackSpeed) );

		if( (Date.now() >= (this.lastAttack + this.attackSpeed)) && (this.purse.current > 1) ) {
			//console.log( 'can attack' );
/*
			var newCoin = new CoinThrown( this.player.position, targetLocation ); // pass it the start and destination vector points

			return newCoin;
			*/
			return true;
		}

		//console.log( 'CAN NOT attack!!!!!' );
		return null;
	},
	registerAttack: function( targetLocation ) {
		this.lastAttack = Date.now();
		this.purse.remove(1);
	},
	attack: function( targetLocation ) { // This is how we should do this
		if(this.validAttack()) {
			this.registerAttack();
		}
	},
	damage: function( dmg ) { // This is how we should do this
		this.purse.remove( dmg );
	},
};