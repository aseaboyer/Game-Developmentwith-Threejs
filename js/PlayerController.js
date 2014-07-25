function PlayerController(playerObject, cameraObject, options) {
	this.player = playerObject;
	this.camera = cameraObject;
	this.attackSpeed = 1000;
	this.lastAttack = Date.now();
	options = options || {};
	this.domElement = options.domElement || document;
	this.moveSpeed = options.moveSpeed || 2;
	this.minSpeed = options.minSpeed || 1;
	this.maxSpeed = options.maxSpeed || 3;
	this.cameraOffset = new THREE.Vector3(
		playerObject.position.x + cameraObject.position.x,
		playerObject.position.y + cameraObject.position.y,
		playerObject.position.z + cameraObject.position.z
		);
	
	this.domElement.addEventListener( 'keydown', this.onKeyDown.bind(this), false );
	this.domElement.addEventListener( 'keyup', this.onKeyUp.bind(this), false );
}

PlayerController.prototype = {
	update: function() {
		this.move();

		// Move the camera and point it at the player
	/*	this.camera.position.set(this.player.position.x + this.cameraOffset.x,
								this.player.position.y + this.cameraOffset.y,
								this.player.position.z + this.cameraOffset.z);
    	this.camera.lookAt(this.player.position);*/
	},
	move: function() {
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
			this.player.translateZ( newZ );
			this.player.translateX( newX );
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

		console.log( Date.now() +' vs ' + (this.lastAttack + this.attackSpeed) );

		if( Date.now() >= (this.lastAttack + this.attackSpeed) ) {
			console.log( 'can attack' );
/*
			var newCoin = new CoinThrown( this.player.position, targetLocation ); // pass it the start and destination vector points

			return newCoin;
			*/
			return true;
		}

		console.log( 'CAN NOT attack!!!!!' );
		return null;
	},
	registerAttack: function( targetLocation ) {
			this.lastAttack = Date.now();
	},
};