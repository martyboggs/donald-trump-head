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
	var bodies = [];
	var meshes = [];

	window.addEventListener('load', function () {
		initPhysics();
		init();
		setInterval(oimoLoop, 1/60*1000);
		animate();
	}, false);

	function initPhysics() {
		world = new OIMO.World(1 / 60, 2, 8, false);
		world.gravity = new OIMO.Vec3(0, -9.8, 0);
		world.worldscale(100);
	}

	function init() {

		camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1100);

		controls = new THREE.DeviceOrientationControls(camera);

		// var textureCube = new THREE.CubeTextureLoader()
		// 	.setPath('images/background/')
		// 	.load(['negx.jpg', 'posx.jpg', 'negy.jpg', 'posy.jpg', 'negz.jpg', 'posz.jpg']);

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

		// eye1
		var geometry = new THREE.SphereGeometry(20, 16, 16);
		var mesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({color: 'white'}));
		mesh.position.set(-40, 0, -200);
		meshes.push(mesh);
		bodies.push(new OIMO.Body({type:'sphere', size: [20, 20, 20], pos:[-40, 0, -200], move: false, world: world}));
		scene.add(mesh);

		// eye2
		var geometry = new THREE.SphereGeometry(20, 16, 16);
		var mesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({color: 'white'}));
		mesh.position.set(40, 0, -200);
		meshes.push(mesh);
		bodies.push(new OIMO.Body({type:'sphere', size: [20, 20, 20], pos:[40, 0, -200], move: false, world: world}));
		scene.add(mesh);

		renderer = new THREE.WebGLRenderer();
		renderer.shadowMap.enabled = true;
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

		controls.update();
		// renderer.render(scene, camera);
		effect.render( scene, camera );

	}

}());
