(function () {
	var camera, scene, renderer, effect;

	var mesh, lightMesh;
	var spheres = [];

	var directionalLight, pointLight;

	var mouseX = 0, mouseY = 0;

	var windowHalfX, windowHalfY;

	var controls;

	document.addEventListener( 'mousemove', onDocumentMouseMove, false );

	init();
	animate();

	function init() {

		camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 100000);
		camera.position.z = 3200;

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

	}

	function onWindowResize() {

		windowHalfX = window.innerWidth / 2;
		windowHalfY = window.innerHeight / 2;

		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

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
		effect.render( scene, camera );

	}


	var pauseScreen = document.createElement('div');
	pauseScreen.className = pauseScreen.id = 'overlay';
	pauseScreen.innerHTML = '<h1>Three.js World</h1><h3>Donald Trump\'s Fat Head</h3>click to play';
	document.getElementById('canvases').insertBefore(pauseScreen, renderer.domElement);

	var gameUI = document.createElement('div');
	gameUI.className = gameUI.id = 'ui';
	gameUI.innerHTML = '<div>Score:&nbsp; <span id="score">0</span></div><div>Deaths:&nbsp; <span id="deaths">0</span></div>';
	document.getElementById('canvases').insertBefore(gameUI, renderer.domElement);

// 	var scene = new THREE.Scene();
// 	var camera = new THREE.PerspectiveCamera(60, 2, 0.001, 500);
// 	var renderer = new THREE.WebGLRenderer({alpha: true});
// 	renderer.setSize(660, 330);
// 	renderer.shadowMap.enabled = true;
// 	var light1 = new THREE.DirectionalLight(0xffffff, 0.00001, 0, Math.PI);
// 	light1.castShadow = true;
// 	light1.shadow.camera.left = -20;
// 	light1.shadow.camera.right = 20;
// 	light1.shadow.camera.top = 200;
// 	light1.shadow.camera.near = 1;
// 	light1.shadow.camera.far = 1000;
// 	light1.shadow.mapSize.width = 4048;
// 	light1.shadow.mapSize.height = 4048;
// 	light1.position.set(-74, 103, 80);
// 	scene.add(light1);
// 	var light3 = new THREE.PointLight(0xffffff, 1, 0, Math.PI);
// 	light3.position.set(-38, 300, 82);
// 	scene.add(light3);
// 	var light2 = new THREE.AmbientLight(0xffffff, 0.5);
// 	scene.add(light2);
// 	scene.fog = new THREE.FogExp2('#a0bdff', 0.018);
// 	renderer.setClearColor(scene.fog.color);

// 	// hide cursor, lock pointer
// 	renderer.domElement.onclick = function () {
// 		renderer.domElement.requestPointerLock = renderer.domElement.requestPointerLock || renderer.domElement.mozRequestPointerLock;
// 		renderer.domElement.requestPointerLock();
// 	};
// 	document.addEventListener('pointerlockchange', changeCallback, false);
// 	document.addEventListener('mozpointerlockchange', changeCallback, false);
// 	document.addEventListener('webkitpointerlockchange', changeCallback, false);
// 	function changeCallback(e) {
// 		if (document.pointerLockElement === renderer.domElement ||
// 		document.mozPointerLockElement === renderer.domElement ||
// 		document.webkitPointerLockElement === renderer.domElement) {
// 			document.addEventListener('mousemove', moveCallback, false);
// 			document.getElementById('overlay').style.display = 'none';
// 		} else {
// 			document.removeEventListener('mousemove', moveCallback, false);
// 			document.getElementById('overlay').style.display = 'flex';
// 		}
// 	}
// 	camera.position.y = 97;
// 	camera.position.x = -7;
// 	camera.position.z = -7;
// 	camera.rotation.order = 'ZYX';
// 	var sounds = {
// 		// jump: new Howl({src: ['sounds/jump.wav']}),
// 		// coin: new Howl({src: ['sounds/coin.wav']}),
// 		// hit: new Howl({src: ['sounds/hit.wav']}),
// 		// climb: new Howl({src: ['sounds/climb.wav'], loop: true, sounding: false}),
// 	};

// 	var q = new THREE.Quaternion(); // create once and reuse
// 	var lastPos = Object.assign({}, camera.position);
// 	var platformMaterial = new THREE.MeshLambertMaterial({color: 'violet'});
// 	var coins = [];
// 	var keyboard = new THREEx.KeyboardState();
// 	var velY = 0;
// 	var onGround = true;
// 	var jumpAllowed = false;
// 	var holdingRope = false;
// 	var distanceFell = 0;
// 	var collided = false;
// 	var won = false;
// 	var score = 0;
// 	var deaths = 0;
// 	var dead = false;
// 	var deadTimer = 120;
// 	var hitHead = false;

// 	// var composer = new THREE.EffectComposer( renderer );
// 	// composer.addPass( new THREE.RenderPass( scene, camera ) );

// 	// var effect = new THREE.ShaderPass( THREE.DotScreenShader );
// 	// effect.uniforms[ 'scale' ].value = 1;
// 	// composer.addPass( effect );

// 	// var effect = new THREE.ShaderPass( THREE.RGBShiftShader );
// 	// effect.uniforms[ 'amount' ].value = 0.15;
// 	// effect.renderToScreen = true;
// 	// composer.addPass( effect );


// 	// start oimo loop
// 	// parameters
// 	var dt = 1/60;
// 	var ToRad = Math.PI / 180;
// 	var info = document.getElementById("info");

// 	var sceneBg = new THREE.Mesh(new THREE.BoxGeometry(50, 50, 50), new THREE.MultiMaterial([
// 		// sceneBgMaterial,
// 		// sceneBgMaterial,
// 		// sceneBgMaterial2,
// 		// sceneBgMaterial2,
// 		// sceneBgMaterial,
// 		// sceneBgMaterial,
// 	]));
// 	sceneBg.position.set(0, 25, 0);
// 	// scene.add(sceneBg);




// 	function init() {
// 		renderer = new THREE.WebGLRenderer();
// 		renderer.setPixelRatio( window.devicePixelRatio );
// 		container.appendChild( renderer.domElement );

// 		effect = new THREE.StereoEffect( renderer );
// 		effect.setSize( window.innerWidth, window.innerHeight );

// 		//

// 		window.addEventListener( 'resize', onWindowResize, false );
// 	}


// 	function render() {



// 		requestAnimationFrame(render);
// 		renderer.render(scene, camera);
// 	}
// 	render();


// 	function scoreAdd(num) {
// 		score += num;
// 		document.getElementById('score').innerHTML = score;
// 	}
// 	function deathsAdd(num) {
// 		deaths += num;
// 		document.getElementById('deaths').innerHTML = deaths;
// 	}
}());
