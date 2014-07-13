function Key(keyName) {
	return {
		key: keyName,
		isDown: false,
		down: function() {
			this.isDown = true;
		},
		up: function() {
			this.isDown = false;
		},
	}
}