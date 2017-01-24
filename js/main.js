(function () {

	"use strict";
	var camera, scene, renderer, effect;
	var light1, light2;

	var mesh;
	var spheres = [];

	var mouseX = 0, mouseY = 0;

	var windowHalfX, windowHalfY;

	var controls;

	var world;
	var items;
	var bodies = [];
	var meshes = [];

	window.addEventListener('load', function () {
		initPhysics();
		init();
		setInterval(oimoLoop, 1/60*1000);
		animate();
	}, false);

	function initPhysics() {
		OIMO.WORLD_SCALE = 1;
		OIMO.INV_SCALE = 1;
		// world = new OIMO.World({timestep: 1/60, iterations: 8, broadphase: 2, info: false});
		world = new OIMO.World(1/60, 2, 8, false);

		world.gravity.init(0, -9.8, 0);
		world.worldscale(100);
	}

	function init() {

		camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1100);
		controls = new THREE.DeviceOrientationControls(camera);

		scene = new THREE.Scene();
		// scene.background = textureCube;

		light1 = new THREE.SpotLight(0xffffff, 1);
		light1.castShadow = true;
		light1.position.set(0, 200, 140);
		light1.rotation.set(Math.PI, 1, 0);
		scene.add(light1);
		scene.add(new THREE.CameraHelper(light1.shadow.camera));

		// light2 = new THREE.AmbientLight(0xffffff, 0.2);
		// scene.add(light2);

		// bg
		var geometry = new THREE.SphereGeometry(500, 16, 8);
		geometry.scale(-1, 1, 1);
		var material = new THREE.MeshBasicMaterial({
			map: new THREE.TextureLoader().load('images/bg.jpg')
		});
		var mesh = new THREE.Mesh(geometry, material);
		scene.add(mesh);

		var p = Math.PI;

		items = [
			// type     size                                 pos            rot        scale    color   move
			['box', [200, 50],                           [-20, 200, -200], [0, 0, 0], [1, 1, 1], 'black', false],
			['sphere', [20, 16, 16, 2*p, 2*p, p, p/*, p/3, 2*p/3, p/6, p/3 */], [-40, 0, -200], [0, 0, 0], [1, 1, 1], 'white', true],
			['sphere', [20, 16, 16, 2*p, 2*p, p, p],                     [40, 0, -200], [0, 0, 0], [1, 1, 1], 'white', true],
			['box', [50, 20],                           [-20, -20, -200], [0, 0, 0], [1, 1, 1], '#eee293', true],
			['box', [20, 20],                                [20, 0, -200], [0, 0, 0], [1, 1, 1], '#eee293', true],
			['box', [20, 20],                           [20, 0, -200], [0, 0, 0], [1, 1, 1], '#eee293', true],
		];

		for (var i = 0; i < items.length; i += 1) {
			add1(items[i], i);
		}

		renderer = new THREE.WebGLRenderer();
		renderer.shadowMap.enabled = true;
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize(window.innerWidth, window.innerHeight);
		document.getElementById('canvases').appendChild(renderer.domElement);

		effect = new THREE.StereoEffect( renderer );
		effect.setSize( window.innerWidth, window.innerHeight );

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

	function add1(arr, i) {
		var geometry, size;
		switch (arr[0]) {
			case 'sphere':
				geometry = new THREE.SphereGeometry(arr[1][0], arr[1][1], arr[1][2], arr[1][3], arr[1][4], arr[1][5], arr[1][6]);
				size = [arr[1][0], arr[1][0], arr[1][0]];
			break;
			case 'box':
				geometry = new THREE.PlaneGeometry(arr[1][0], arr[1][1]);
				size = [arr[1][0], 1, arr[1][1]];
			break;
		}
		var mesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({color: arr[5]}));
		mesh.position.set(arr[2][0], arr[2][1], arr[2][2]);
		mesh.rotation.set(arr[3][0], arr[3][1], arr[3][2]);
		mesh.scale.set(arr[4][0], arr[4][1], arr[4][2]);
		meshes.push(mesh);
		// body
		bodies.push(new OIMO.Body({type: arr[0], size: size, pos: [arr[2][0], arr[2][1], arr[2][2]], move: arr[6], world: world, name: i.toString(), density: 1}));
		scene.add(mesh);
		var yFromCenter = arr[0] === 'sphere' ? arr[1][0] : arr[1][1] / 2;
		if (i !== 0) {
			new OIMO.Link({
				world: world,
				type: 'jointDistance',
				body1: '0',
				body2: i.toString(),
				collision: true,
				pos1: [0, arr[2][0], 0],
				pos2: [0, yFromCenter, 0],
				axe1: [1, 0, 0],
				axe2: [1, 0, 0],
				min: 150,
				max: 200,
				limite: null,
				spring: [9, 0.2],
				motor: null,
				name: 'joint'
			});
		}
	}

	function oimoLoop() {
		world.step();
		var body, mesh;
		for (var i = 0; i < meshes.length; i += 1) {
			body = bodies[i];
			mesh = meshes[i];

			mesh.position.copy(body.getPosition());
			mesh.quaternion.copy(body.getQuaternion());
		}
		document.getElementById("info").innerHTML = world.performance.show();
	}

	function animate() {

		requestAnimationFrame( animate );

		render();

	}

	function render() {

		// var timer = 0.0001 * Date.now();
		// camera.position.x += ( mouseX - camera.position.x ) * .05;
		// camera.position.y += ( - mouseY - camera.position.y ) * .05;
		// camera.lookAt( scene.position );

		if (location.hostname === 'martyboggs.github.io')
			controls.update();
		renderer.render(scene, camera);
		effect.render( scene, camera );

	}

}());
