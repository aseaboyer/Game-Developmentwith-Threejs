function Player() {
	return {
		gameObject: {},
		loc: {
			x: 15,
			y: 15,
		},
		size: {
			x: 25,
			y: 25,
		},
		update: function() {
			//console.log(keys.name[1]);
			var dir = {
				x: ( (keys.getInt('d')) - (keys.getInt('a')) ),
				y: ( (keys.getInt('s')) - (keys.getInt('w')) ),
			};
			this.loc.x += (dir.x * game.time.delta);
			this.loc.y += (dir.y * game.time.delta);
			//console.log(dir.horz + " , " + dir.vert);
		},
		speed: 120,
		draw: function(context) {
			context.fillStyle = "#ff00ff";
			context.fillRect(this.loc.x - (this.size.x * .5), this.loc.y - (this.size.y * .5),
				this.size.x, this.size.x);
		},
		translate: function(diff) {
			console.log("Moving the player like so:");
			console.log(diff);
		},
	}
}