function Loot( object, value ) {
	this.object = object;
	this.value = value;
}

Loot.prototype = {
	pickup: function() {
		scene.remove(this.object);

		return this.value;
	},

	// Does the above need to be two different things?
}