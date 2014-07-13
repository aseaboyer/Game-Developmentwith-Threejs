function CoinThrown() {
	return {
		loc: {
			x: 0,
			y: 0,
		},
		spawn: {
			x: 0,
			y: 0,
		},
		move: {
			x: 0,
			y: 0,
			angle: 0.
		},
		speed: 5,
		update: function() {
			// change position
		},
		draw: function(context) {
			context.fillStyle = "#ff00ff";
			context.fillRect(this.loc.x, this.loc.y, 25, 25);
		},
	}
}