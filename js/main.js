var container, stats, clock;
var camera, scene, renderer;
var player, playerController;
var enemies = new Array();
var projector;
var selectable = new Array();
var enemies = new Array();
var ground;
var coins = new Array();

function init() {

	container = document.createElement( 'div' );
	document.body.appendChild( container );

	var info = document.createElement( 'div' );
	info.style.position = 'absolute';
	info.style.top = '10px';
	info.style.width = '100%';
	info.style.textAlign = 'center';
	info.innerHTML = '<a href="http://threejs.org" target="_blank">three.js</a> - orthographic view';
	container.appendChild( info );

	camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, - 500, 1000 );
	camera.position.x = 200;
	camera.position.y = 100;
	camera.position.z = 200;

	scene = new THREE.Scene();

	// Grid
	var size = 500, step = 50;

	var geometry = new THREE.Geometry();

	for ( var i = - size; i <= size; i += step ) {

		geometry.vertices.push( new THREE.Vector3( - size, 0, i ) );
		geometry.vertices.push( new THREE.Vector3(   size, 0, i ) );

		geometry.vertices.push( new THREE.Vector3( i, 0, - size ) );
		geometry.vertices.push( new THREE.Vector3( i, 0,   size ) );

	}

	var material = new THREE.LineBasicMaterial( { color: 0x000000, opacity: 0.2 } );

	var line = new THREE.Line( geometry, material );
	line.type = THREE.LinePieces;
	scene.add( line );


	var player_geometry = new THREE.BoxGeometry( 50, 50, 50 );

	var playerMatSetting = { color: 0x669933, shading: THREE.FlatShading, overdraw: 0.5 };
	var player_material = new THREE.MeshLambertMaterial( playerMatSetting );

	player = new THREE.Mesh( player_geometry, player_material );
	selectable.push(player);

	scene.add( player );

	clock = new THREE.Clock();
/*
	// Ground

	var groundMaterial = new THREE.MeshLambertMaterial( 
			{ color: 0x006600, shading: THREE.FlatShading, overdraw: 0.5 } );
	
	var groundMesh = new THREE.Geometry();
	groundMesh.vertices.push( new THREE.Vector3( 500, 1, 500 ) );
	groundMesh.vertices.push( new THREE.Vector3( 500, 1, -500 ) );
	groundMesh.vertices.push( new THREE.Vector3( -500, 1, -500 ) );
	groundMesh.vertices.push( new THREE.Vector3( -500, 1, 500 ) );
	groundMesh.faces.push( new THREE.Face3( 0, 1, 2 ));
	groundMesh.faces.push( new THREE.Face3( 1, 2, 3 ));
	groundMesh.computeBoundingSphere();
	groundMesh.computeFaceNormals();
	groundMesh.computeVertexNormals();

	ground = new THREE.Line( groundMesh, groundMaterial);
	scene.add( ground ); // @aseaboyer - what if only the ground was in the selectable array?!?
	console.log( groundMesh );
	
	// add a Terrain Generator
	//var terrain = new Terrain( terrainMatrix ); // a better way to store the terrain
	//scene.add( terrain ); // suspended for now, work on the interactions
*/
	// Enemies

	var enemyGeometry = new THREE.BoxGeometry( 50, 50, 50 );
	var material = new THREE.MeshLambertMaterial( { color: 0xffffff, shading: THREE.FlatShading, overdraw: 0.5 } );

	for ( var i = 0; i < 5; i ++ ) {

		var enemy = new THREE.Mesh( enemyGeometry, material );

		enemy.position.x = Math.floor( ( Math.random() * 1000 - 500 ) / 50 ) * 50 + 25;
		enemy.position.y = 0;
		enemy.position.z = Math.floor( ( Math.random() * 1000 - 500 ) / 50 ) * 50 + 25;

		scene.add( enemy );
	//	enemies.push( new EnemyController( enemy ) ); // pass a camera offset?
		enemies.push(enemy);
	}
	
	// Lights

	var ambientLight = new THREE.AmbientLight( 0x404040 );
	scene.add( ambientLight );

	var directionalLight = new THREE.DirectionalLight( Math.random() * 0xffffff );
	directionalLight.position.x = Math.random() - 0.5;
	directionalLight.position.y = Math.random() - 0.5;
	directionalLight.position.z = Math.random() - 0.5;
	directionalLight.position.normalize();
	scene.add( directionalLight );

	var directionalLight = new THREE.DirectionalLight( Math.random() * 0xffffff );
	directionalLight.position.x = Math.random() - 0.5;
	directionalLight.position.y = Math.random() - 0.5;
	directionalLight.position.z = Math.random() - 0.5;
	directionalLight.position.normalize();
	scene.add( directionalLight );

	renderer = new THREE.CanvasRenderer();
	renderer.setClearColor( 0xf0f0f0 );
	renderer.setSize( window.innerWidth, window.innerHeight );

	container.appendChild( renderer.domElement );

	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	container.appendChild( stats.domElement );

	window.addEventListener( 'resize', onWindowResize, false );

	projector = new THREE.Projector();

	playerController = new PlayerController( player, camera ); // pass a camera offset?
	cameraController = new CameraController( camera );
	cameraController.setTarget(player);
	cameraController.setOffset( camera.position.x, camera.position.y, camera.position.z );

    //createPlayer();
    //createEnemies();
    createClickEvents();

}

function createClickEvents() {
	renderer.domElement.addEventListener('mousedown', function(event) {
		event.preventDefault();

		var vector = new THREE.Vector3(
				renderer.devicePixelRatio * (event.pageX - this.offsetLeft) / this.width * 2 - 1,
				- renderer.devicePixelRatio * (event.pageY - this.offsetTop) / this.height * 2 + 1,
				0.5
			);

		var raycaster = projector.pickingRay( vector, camera );
		var intersects = raycaster.intersectObjects(enemies);
		
		if (intersects.length) {
			var canAttack = playerController.validAttack(); // check if the player can attack
			if( canAttack ) {
				playerController.registerAttack(); // let the player controller know we are going to execute on the attack

				// add the projectile to the scene
				var coin = new THREE.Mesh(
					new THREE.CylinderGeometry(10, 10, 5, 8, 8, false), 
					new THREE.MeshNormalMaterial());
				coin.position = new THREE.Vector3( player.position.x, player.position.y, player.position.z );
				coin.overdraw = true;

				coinController = new CoinThrown( coin, player.position, intersects[0].object.position ); // pass a camera offset?
				coins.push(coinController);
				coin.lookAt(intersects[0].object.position);

				scene.add(coin);
			}
		}
	}, false);
}

function onWindowResize() {

	camera.left = window.innerWidth / - 2;
	camera.right = window.innerWidth / 2;
	camera.top = window.innerHeight / 2;
	camera.bottom = window.innerHeight / - 2;

	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}

//

function animate() {

	requestAnimationFrame( animate );

	render();
	stats.update();

}

function render() {
	clockDelta = clock.getDelta();

	playerController.update(clockDelta);

	cameraController.update(); // update the camera position in space now.

	var coinCount = coins.length; // for each coins, update their position
	for (i = 0; i < coinCount; i++) { 
		var updateResponse = coins[i].update(clockDelta, enemies);

		if(updateResponse == 'destroy') {
			coins.splice(i, 1);
			//console.log('Remove the coin at '+ i);
			i--; // catch the count up
			coinCount--; // update the coin count as well
		}
	}

	renderer.render( scene, camera );

}