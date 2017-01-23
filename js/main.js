(function () {

	"use strict";
	var camera, scene, renderer, effect;

	var mesh, lightMesh;
	var spheres = [];

	var directionalLight, pointLight;

	var mouseX = 0, mouseY = 0;

	var windowHalfX, windowHalfY;

	var controls;

	window.addEventListener('load', function () {
		init();
		animate();
	}, false);

	function init() {

		camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1100);

		controls = new THREE.DeviceOrientationControls(camera);

		// var textureCube = new THREE.CubeTextureLoader()
		// 	.setPath('images/background/')
		// 	.load(['negx.jpg', 'posx.jpg', 'negy.jpg', 'posy.jpg', 'negz.jpg', 'posz.jpg']);

		scene = new THREE.Scene();
		// scene.background = textureCube;




		var geometry = new THREE.SphereGeometry( 500, 16, 8 );
		geometry.scale( - 1, 1, 1 );

		var material = new THREE.MeshBasicMaterial( {
			map: new THREE.TextureLoader().load('images/bg.jpg')
		} );

		var mesh = new THREE.Mesh( geometry, material );
		scene.add( mesh );

		var geometry = new THREE.BoxGeometry( 100, 100, 100, 4, 4, 4 );
		var material = new THREE.MeshBasicMaterial( { color: 0xff00ff, side: THREE.BackSide, wireframe: true } );
		var mesh = new THREE.Mesh( geometry, material );
		scene.add( mesh );

		//

		renderer = new THREE.WebGLRenderer();
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize(window.innerWidth, window.innerHeight);
		document.getElementById('canvases').appendChild(renderer.domElement);

		effect = new THREE.StereoEffect( renderer );
		effect.setSize( window.innerWidth, window.innerHeight );

		//

		window.addEventListener( 'resize', onWindowResize, false );
		document.addEventListener( 'mousemove', onDocumentMouseMove, false );

	}

	function onWindowResize() {

		windowHalfX = window.innerWidth / 2;
		windowHalfY = window.innerHeight / 2;

		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

		renderer.setSize( window.innerWidth, window.innerHeight );

		effect.setSize( window.innerWidth, window.innerHeight );

	}

	function onDocumentMouseMove( event ) {

		mouseX = ( event.clientX - windowHalfX ) * 10;
		mouseY = ( event.clientY - windowHalfY ) * 10;

	}

	//

	function animate() {

		requestAnimationFrame( animate );

		render();

	}

	function render() {

		// var timer = 0.0001 * Date.now();
		// camera.position.x += ( mouseX - camera.position.x ) * .05;
		// camera.position.y += ( - mouseY - camera.position.y ) * .05;
		// camera.lookAt( scene.position );

		controls.update();
		renderer.render(scene, camera);
		effect.render( scene, camera );

	}


	// var pauseScreen = document.createElement('div');
	// pauseScreen.className = pauseScreen.id = 'overlay';
	// pauseScreen.innerHTML = '<h1>Three.js World</h1><h3>Donald Trump\'s Fat Head</h3>click to play';
	// document.getElementById('canvases').insertBefore(pauseScreen, renderer.domElement);

	// var gameUI = document.createElement('div');
	// gameUI.className = gameUI.id = 'ui';
	// gameUI.innerHTML = '<div>Score:&nbsp; <span id="score">0</span></div><div>Deaths:&nbsp; <span id="deaths">0</span></div>';
	// document.getElementById('canvases').insertBefore(gameUI, renderer.domElement);

}());
