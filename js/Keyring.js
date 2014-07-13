function Keyring(keyList) {
	return {
		names: new Array(),
		list: new Array(),
		add: function(namedArray) {
			for(var i = 0; i < namedArray.length; i++) {
				var newKey = new Key(namedArray[i]);
				this.list[i] = newKey;
				this.names[i] = namedArray[i];
			}
		},
		set: function(keyName, keyState) {
			var keyNum = this.names.indexOf(keyName);
			
			if(keyNum != -1) {
				if(keyState == 'down') {
					this.list[keyNum].down();
				} else if(keyState == 'up') {
					this.list[keyNum].up();
				}
			}
			//console.log("Change "+ keyName +" ("+ keyNum +") to "+keyState);
		},
		getStatus: function(keyName) {
			var keyNum = this.names.indexOf(keyName);
			
			return this.list[keyNum].isDown;
		},
		getInt: function(keyName) {
			var keyNum = this.names.indexOf(keyName);
			
			if(this.list[keyNum].isDown) {
				return 1;
			}
			return 0;
		},
	}
}