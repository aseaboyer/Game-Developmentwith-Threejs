var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");
var requestAnimationFrame =
	window.requestAnimationFrame || 
	window.mozRequestAnimationFrame ||
	window.webkitRequestAnimationFrame || 
	window.msRequestAnimationFrame;

var player = new Player();

var keys = new Keyring();
	keys.add(new Array('w','a','s','d'));

var game = {
	canvas: {},
	context: {},
	contextOffset: {
		x: 0,
		y: 0,
		change: function() {
		
		},
	},
	font: 'Roboto Condensed', // default game font name
	phase: "menu",
	phases: [ "load game", "menu", "load level", "play", "win", "lost" ], // for ref. @aseaboyer
	debug: false,
	camera: {
		xScale: 1,
		yScale: 1,
		xSkew: 0,
		ySkew: 0,
		xTranslate: 0,
		yTranslate: 0,
	},
	time: {
		last: 0,
		current: 0,
		delta: 0,
		delta: 0,
		init: function() {
			var d = new Date();
			this.current = d.getTime();
			this.last = this.current;
		},
		update: function() {
			var d = new Date();
			if(this.last == 0) {
				this.last = d.getTime()
			} else {
				this.last = this.current;
			}
			this.current = d.getTime();
			var diff = this.current - this.last;
			this.delta = diff * 0.1; // For now, it should be the portion of the second, something along the lines of 0.016
		},
	},
	target: { // may be an array later
		set: false,
		editable: true,
		visible: false,
		start: {
			x: 0,
			y: 0,
		},
		end: {
			x: 0,
			y: 0,
		},
		size: 25,
		setTarget: function(newX, newY, playerLoc ) {
			if(this.editable) {
				this.end.x = newX;
				this.end.y = newY;
				
				this.start.x = playerLoc.x;
				this.start.y = playerLoc.y;
				
				this.visible = true;
				
			//	console.log("Target is now set at: ");
			//	console.log(this.loc);
			}
		},
		getTarget: function() {
			return this.end;
		},
		draw: function(ctx) {
			if(this.visible) {
				var halfWay = halfwayPoint(this.start.x, this.start.y, this.end.x, this.end.y);
				
				// draw the line
				ctx.lineWidth = 2;
				ctx.beginPath();
				//ctx.moveTo(this.start.x,this.start.y);
				ctx.moveTo(halfWay.x,halfWay.y);
				ctx.lineTo(this.end.x,this.end.y);
				ctx.stroke();
				
				// draw the target
				ctx.lineWidth = 0;
				ctx.fillStyle = "#ffcccc";
				ctx.fillRect(this.end.x - (this.size*0.5), this.end.y - (this.size*0.5), 
					this.size, this.size);
			}
		},
	},
	init: function(canvas) {
		this.canvas = canvas;
		this.context = canvas.getContext("2d");
		
		this.time.init();
		
		context.font = '20pt '+this.font;
		
		this.update();
	},
	update: function() {
		this.time.update();
		
		//console.log(this.font);
		//context.font = '20pt '+this.font;
		//context.textAlign = 'center';
		context.fillStyle = '#990000';
		context.fillText('Hello World!', 100, 100);
	},
	draw: function(context) {
		context.clearRect(0, 0, this.context.canvas.height, this.context.canvas.width);
		
		context.setTransform(
			this.camera.xScale,
			this.camera.xSkew,
			this.camera.ySkew,
			this.camera.yScale,
			this.camera.xTranslate,
			this.camera.yTranslate
		);
		// handle rotations: context.rotate()
		
		this.target.draw(context);
		player.draw(context);
		this.cursor.draw(context);
		
		// draw background and things above
		context.setTransform(
			1,
			0,
			0,
			1,
			0,
			0
		);
		
		// move camera, there are properties within the game object that will work better,
		// but need to be updated with logic
		//context.translate(player.loc.x,player.loc.y);
		// right now the bug is that the rectangle doesn't clear at all with the move!
	},
	cursor: {
		x: 0,
		y: 0,
		size: 25,
		draw: function(context) {
			context.fillStyle = "#33ffff";
			context.fillRect(this.x - (this.size*0.5), this.y - (this.size*0.5), this.size, this.size);
		},
	},
};

function start() {
	game.init(canvas);
	requestAnimationFrame(animate);
}
function animate() {
    game.update();
    player.update();
	
    game.draw(context);
	
	requestAnimationFrame(animate);
}

window.onload = function() {
	start();
	//game.start(canvas);
}

function halfwayPoint(x1, y1, x2, y2) {
	var halfPt = {};
		halfPt.x = (x1+x2)/2;
		halfPt.y = (y1+y2)/2;
	//console.log(halfPt);
	return halfPt;
}

canvas.addEventListener('mousemove', function(e) {
    game.cursor.x = e.clientX - canvas.offsetLeft;
    game.cursor.y = e.clientY - canvas.offsetTop;
}, false);
canvas.addEventListener('mouseup', function(e) {
    game.target.setTarget(game.cursor.x, game.cursor.y, player.loc); // use add target, which will make decisions on things like limiting the number of targets
}, false);

// create a keys watch list with a human readable string value system
document.addEventListener('keypress', function(e) {
	var key = e.keyCode || e.which;
	var keychar = String.fromCharCode(key);
	
	//console.log('keydown: '+keychar);
	if(keychar == "P" || keychar == "p") {
		var d = document.getElementById("debug-window");
		if (game.debug) {
			console.log("Turn off debugging");
			game.debug = false;
			d.style.display = 'none';
		} else {
			console.log("Turn on debugging");
			game.debug = true;
			d.style.display = 'block';
		}
	}
	if(keychar == "W" || keychar == "w") { // up
		keys.set('w', 'down');
	}
	if(keychar == "A" || keychar == "a") { // left
		keys.set('a', 'down');
	}
	if(keychar == "S" || keychar == "s") { // down
		keys.set('s', 'down');
	}
	if(keychar == "D" || keychar == "d") { // right
		keys.set('d', 'down');
	}
	
}, false);
document.addEventListener('keyup', function(e) {
	var key = e.keyCode || e.which;
	var keychar = String.fromCharCode(key);
	
	if(keychar == "W" || keychar == "w") { // up
		keys.set('w', 'up');
	}
	if(keychar == "A" || keychar == "a") { // left
		keys.set('a', 'up');
	}
	if(keychar == "S" || keychar == "s") { // down
		keys.set('s', 'up');
	}
	if(keychar == "D" || keychar == "d") { // right
		keys.set('d', 'up');
	}
	
}, false);