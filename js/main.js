(function () {

	"use strict";
	var camera, scene, renderer, effect;
	var light1, light2;

	var mesh;
	var spheres = [];

	var mouseX = 0, mouseY = 0;

	var windowHalfX, windowHalfY;

	var controls;
	var textureLoader = new THREE.TextureLoader();
	var jsonLoader = new THREE.JSONLoader();

	var world;
	var items;
	var bodies = [];
	var meshes = [];

	window.addEventListener('load', function () {
		initPhysics();
		init();
		// setInterval(oimoLoop, 1/60*1000);
		animate();
	}, false);

	function initPhysics() {
		OIMO.WORLD_SCALE = 1;
		OIMO.INV_SCALE = 1;
		// world = new OIMO.World({timestep: 1/60, iterations: 8, broadphase: 2, info: false});
		world = new OIMO.World(1/60, 2, 8, false);

		world.gravity.init(0, -6, 0);
		world.worldscale(100);
	}

	function init() {

		camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1100);
		controls = new THREE.DeviceOrientationControls(camera);

		scene = new THREE.Scene();
		// scene.background = textureCube;

		light1 = new THREE.SpotLight(0xffffff, 1);
		light1.castShadow = true;
		light1.position.set(-13, 39, 41);
		light1.rotation.set(0, 0, 0);
		scene.add(light1);
		// scene.add(new THREE.CameraHelper(light1.shadow.camera));

		light2 = new THREE.AmbientLight(0xffffff, 0.14);
		scene.add(light2);

		// var gui = new dat.GUI();
		// gui.add(light1.position, 'x', -200, 400);
		// gui.add(light1.position, 'y', -200, 400);
		// gui.add(light1.position, 'z', -400, 400);
		// gui.add(light2, 'intensity', 0, 0.5);

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
			['box', [20, 5],                       [-2, 30, -30],       [0, 0, 0], [1, 1, 1], 'black', true],
			['hair', [3, 3, 3],                    [-1, -2, -35,   4],  [0, 0, 0], [8, 8, 8], 'black', true],
			['eye', [2, 2, 2, 0, 2*p, 0, p],  [-2, -4, -30,   18], [0, 0, 0], [1, 1, 1], 'white', true],
			['eye', [2, 2, 2, 0, 2*p, 0, p],     [2, -4, -30,    18], [0, 0, 0], [1, 1, 1], 'white', true],
			['face', [5, 5, 5, 0, p, 0, p],        [-12, -16, -30, 14], [0, 0, 0], [1, 1.3, 0.2], '#eee293', true],
			['face', [5, 5, 5, 0, p, 0, p],        [12, -16, -30,  14], [0, 0, 0], [1, 1.3, 0.2], '#eee293', true],
			['face', [3, 3, 3, 0, p, 0, p],        [0, -19, -30,   22], [0, 0, 0], [1, 1.3, 0.4], '#eee293', true],
			// ['cylinder', [40, 20],                [0, 40, -30, 13], [0, 0, 0], [1, 1, 1], '#eee293', true],
			// ['box', [50, 20],                     [-10, 60, -30, 8], [0, 0, 0], [1, 1, 1], '#eee293', true],
		];

		for (var i = 0; i < items.length; i += 1) {
			add(items[i], i);
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

	function add(arr, i) {
		var geometry, size;
		var pType = arr[0];
		var texture = false;
		var material = new THREE.MeshLambertMaterial({color: arr[5]});
		var mesh = new THREE.Object3D();
		var density = 1;
		switch (arr[0]) {
			case 'face':
				pType = 'box';
				geometry = new THREE.SphereGeometry(arr[1][0], 16, 16, arr[1][3], arr[1][4], arr[1][5], arr[1][6]);
				size = [2*arr[1][0]*arr[4][0], 2*arr[1][1]*arr[4][1], 2*arr[1][2]*arr[4][2]];
			break;
			case 'sphere':
				geometry = new THREE.SphereGeometry(arr[1][0], 16, 16, arr[1][3], arr[1][4], arr[1][5], arr[1][6]);
				size = [2*arr[1][0]*arr[4][0], 2*arr[1][1]*arr[4][1], 2*arr[1][2]*arr[4][2]];
			break;
			case 'hair':
				pType = 'box';
				jsonLoader.load('js/models/trumphair.json', function (geometry1, materials) {
					mesh.geometry = geometry1;
					mesh.material = new THREE.MultiMaterial(materials);
				});
				density = 0.06;
				size = [2*arr[1][0]*arr[4][0], arr[1][1]*arr[4][1], arr[1][2]*arr[4][2]];
			break;
			case 'eye':
				pType = 'sphere';
				console.log(arr[1][0], 16, 16, arr[1][3], arr[1][4], arr[1][5], arr[1][6]);
				geometry = new THREE.SphereGeometry(arr[1][0], 16, 16, arr[1][3], arr[1][4], arr[1][5], arr[1][6]);
				size = [arr[1][0]*arr[4][0], arr[1][1]*arr[4][1], arr[1][2]*arr[4][2]];
				texture = textureLoader.load('images/eye.jpg');
				material = new THREE.MeshLambertMaterial({map: texture});
			break;
			case 'box':
				geometry = new THREE.PlaneGeometry(arr[1][0], arr[1][1]);
				size = [arr[1][0], 1, arr[1][1]];
			break;
			case 'cylinder':
				geometry = new THREE.CylinderGeometry(arr[1][0], arr[1][0], arr[1][1]);
				size = [arr[1][0], arr[1][1]];
			break;
		}
		if (arr[0] === 'hair') console.log(geometry, material);
		mesh = new THREE.Mesh(geometry, material);
		mesh.position.set(arr[2][0], arr[2][1], arr[2][2]);
		mesh.rotation.set(arr[3][0], arr[3][1], arr[3][2]);
		mesh.scale.set(arr[4][0], arr[4][1], arr[4][2]);
		mesh.material.side = THREE.DoubleSide;
		meshes.push(mesh);
		// body
		bodies.push(new OIMO.Body({type: pType, size: size, pos: [arr[2][0], arr[2][1], arr[2][2]], move: arr[6], world: world, name: i.toString(), density: density}));
		scene.add(mesh);
		var yFromCenter = arr[0] === 'sphere' ? arr[1][0] : arr[1][1] / 2;
		if (i !== 0) {
			new OIMO.Link({
				world: world,
				type: 'jointDistance',
				body1: '0',
				body2: i.toString(),
				collision: true,
				pos1: [arr[2][0], 0, 0],
				pos2: [0, yFromCenter, 0],
				axe1: [0, 1, 0],
				axe2: [0, 1, 0],
				min: arr[2][3] - 50 <= 0 ? 0 : arr[2][3] - 50,
				max: arr[2][3],
				limite: null,
				spring: [4, 0.2], // frequency: 8 , damping: 0.1 (springy) 10 (not springy)
				motor: null,
				name: 'joint'
			});
		}
	}

	function oimoLoop() {

		world.step();

		var rot = bodies[0].getRotation();
		bodies[0].resetPosition(6 * Math.sin(osc), 30, -30);
		bodies[0].resetRotation(0, 0, 0);

		bodies[1].resetRotation(0, 0, 0);

		// eyeball alignment
		var pos2 = bodies[2].getPosition();
		bodies[3].resetPosition(pos2.x + 7, pos2.y, pos2.z);

		// faces
		bodies[4].resetRotation(0, 0, 0);
		bodies[5].resetRotation(0, 0, 0);
		bodies[6].resetRotation(0, 0, 0);

		osc += 0.02;

		var body, mesh;
		for (var i = 0; i < meshes.length; i += 1) {
			body = bodies[i];
			mesh = meshes[i];

			mesh.position.copy(body.getPosition());
			mesh.quaternion.copy(body.getQuaternion());
		}
		document.getElementById('info').innerHTML = world.performance.show();
	}

	var osc = 0;

	function animate() {
		oimoLoop();

		requestAnimationFrame( animate );
		render();
	}

	function render() {

		if (location.hostname === 'martyboggs.github.io')
			controls.update();
		renderer.render(scene, camera);
		effect.render( scene, camera );

	}

}());
