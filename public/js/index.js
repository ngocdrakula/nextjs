const PI = Math.PI, sin = Math.sin, cos = Math.cos, floorWidth = 1000, floorHeight = 1000;
let SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
let scene, camera, renderer, mesh;
const
    image = document.createElement('img'),
    canvas = document.createElement('canvas'),
    _control = {
        grout: 2,
        width: 200,
        height: 200
    };
function animate() {
    renderer.render(scene, camera);
}
window.onload = function () {
    init();
    animate();
    window.addEventListener('resize', (function () {
        SCREEN_WIDTH = window.innerWidth;
        SCREEN_HEIGHT = window.innerHeight;
        camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
        camera.updateProjectionMatrix();
        renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    }));
}
function init() {
    scene = new THREE.Scene();
    scene.bacground = new THREE.Texture("../img/room_background.png");
    camera = new THREE.PerspectiveCamera(45, SCREEN_WIDTH / SCREEN_HEIGHT, .1, 500);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor(0xdddddd);
    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    renderer.shadowMap.enabled = true;
    renderer.shadowMapSoft = true;
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 30;
    camera.lookAt(scene.position);
    const ambient = new THREE.AmbientLight(0x404040);
    scene.add(ambient);
    const light = new THREE.SpotLight(0xffffff);
    light.castShadow = true;
    light.shadow.camera.near = 8;
    light.shadow.camera.far = 2000;
    light.shadow.camera.fov = .5;
    light.shadow.mapSize.width = 1024 * 4;
    light.shadow.mapSize.height = 1024 * 4;
    light.shadow.focus = 2;
    light.position.set(1000, 1000, 1000)
    light.name = 'Spot Light';
    scene.add(light);
    creatAllShape();
    document.getElementById("webGL-container").append(renderer.domElement);
    const gui = new dat.GUI();
    const grout = gui.add(_control, 'grout', 2, 24);
    grout.onChange(creatAllShape);
    const width = gui.add(_control, 'width', 200, 600);
    width.onChange(creatAllShape);
    const height = gui.add(_control, 'height', 200, 600);
    height.onChange(creatAllShape);
}
function creatAllShape() {
    canvas.width = _control.width + _control.grout;
    canvas.height = _control.height + _control.grout;
    canvas.style.backgroundColor = "#FFFFFF";
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#FFFFFF"
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    image.onload = function (e) {
        scene.remove(mesh)
        ctx.drawImage(this, _control.grout / 2, _control.grout / 2, _control.width, _control.height);
        const imageGrout = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const groundTexture = new THREE.Texture(imageGrout);
        groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
        groundTexture.needsUpdate = true;
        groundTexture.repeat.set(floorWidth / canvas.width, floorHeight / canvas.height);
        groundTexture.anisotropy = 32;
        groundTexture.encoding = THREE.sRGBEncoding;
        const groundMaterial = new THREE.MeshStandardMaterial({
            map: groundTexture,
            roughness: .5
        });
        mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(20, 20, 5, 5), groundMaterial);
        // mesh.position.y = 0;
        mesh.receiveShadow = true;
        mesh.rotation.set(-PI / 3, 0, 0)
        scene.add(mesh);
        console.log(scene.children);
        animate();
    };
    image.src = "../img/wall.png";
}