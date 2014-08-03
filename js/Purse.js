function Purse( max, start, object ) {
	this.owner = object;
	this.max = max;
	this.current = start;
	this.gui = {};
}

Purse.prototype = {
	remove: function( amt ) {
		this.current -= amt;
		console.log("Purse at: "+this.current)
		if(this.current <= 0 ) {
			console.log("Reciever is dead!");
			this.death(amt);
		}
		this.updateGUI();
	},
	earn: function( amt ) {
		this.current += amt;
		console.log("Purse at: " + this.current)
		if(this.current > this.max ) {
			this.current = this.max
			//console.log("Player is maxed!!");
		}
		this.updateGUI();
	},
	setGUI: function( guiOBJ ) {
		this.gui = guiOBJ;
		this.updateGUI();
	},
	updateGUI: function() {
		this.gui.innerHTML = this.current;
	},
	alert: function(msg) {
		console.log("Purse hit: "+msg)
	},
	death: function(amt) {
		if(this.owner) {
			
			/*
			var newLoot = new Loot((this.max + amt)); // new loot worth the max health and last damage dealt (figure out the rest later)

			var lootItem = new THREE.Mesh(
				new THREE.CylinderGeometry(10, 10, 5, 8, 8, false), 
				new THREE.MeshNormalMaterial());
			lootItem.position = new THREE.Vector3( player.position.x, player.position.y, player.position.z );
			lootItem.overdraw = true;

			coinController = new CoinThrown( lootItem, player.position, intersects[0].object.position ); // pass a camera offset?
			loots.push(lootItem);
			lootItem.lookAt(intersects[0].object.position);

			scene.add(lootItem);
			*/

			scene.remove(this.owner); // later this should play the death animation, or message the enemyAI
		}
	},
}