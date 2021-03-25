import React, { Component } from 'react';
import { connect } from 'react-redux';
import { PI } from '../utils/helper';


class CanvasContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true
        };
        this.mesh = null;
        this.floorWidth = 1000;
        this.floorHeight = 1000;
        this.width = 600;
        this.height = 600;
    }
    componentDidMount() {
        this.handleInit()
        this.timeout = setTimeout(() => this.handleLoader(), 1000);
        window.addEventListener('resize', this.handleResize);
    }
    componentWillUnmount() {
        clearTimeout(this.timeout)
        window.removeEventListener('resize', this.handleResize);
    }
    handleInit = () => {
        this.scene = new THREE.Scene();
        this.scene.bacground = new THREE.Texture("../img/room_background.png");
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, .1, 500);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setClearColor(0xdddddd);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMapSoft = true;
        this.camera.position.set(0, 0, 30);
        this.camera.lookAt(this.scene.position);
        const ambient = new THREE.AmbientLight(0x404040);
        this.scene.add(ambient);
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
        this.scene.add(light);

        this.renderer.domElement.className = "room-canvas";
        document.getElementById("webGL-container").append(this.renderer.domElement);

        this.image = document.createElement('img');
        this.canvas = document.createElement('canvas');
        this.canvas.style.backgroundColor = "#FFFFFF";
        this.ctx = this.canvas.getContext("2d");
    }
    handleResize = () => {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    handleLoader = () => {
        const { grout } = this.props;
        this.canvas.width = this.width + grout;
        this.canvas.height = this.height + grout;

        this.ctx.fillStyle = this.color || "#FFFFFF";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.image.onload = (e) => {
            console.log(e, this)
            this.scene.remove(this.mesh)
            this.ctx.drawImage(this.image, grout / 2, grout / 2, this.width, this.height);
            const imageGrout = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
            const groundTexture = new THREE.Texture(imageGrout);
            groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
            groundTexture.needsUpdate = true;
            groundTexture.repeat.set(this.floorWidth / this.canvas.width, this.floorHeight / this.canvas.height);
            groundTexture.anisotropy = 32;
            groundTexture.encoding = THREE.sRGBEncoding;
            const groundMaterial = new THREE.MeshStandardMaterial({
                map: groundTexture,
                roughness: .5
            });
            this.mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(20, 20, 5, 5), groundMaterial);
            // this.mesh.position.y = 0;
            this.mesh.receiveShadow = true;
            this.mesh.rotation.set(-PI / 3, 0, 0);
            this.scene.add(this.mesh);
            console.log(this.scene.children);
            this.handleRender();
        };
        this.image.src = "/icons/square.png";
    }
    handleRender = () => {
        this.renderer.render(this.scene, this.camera);
    }
    render() {
        const { loading } = this.props;
        return (
            <div id="webGL-container" className="room-canvas-container">
                <canvas id="roomCanvas" className="room-canvas" width={1600} height={900} style={{ cursor: 'unset', background: '#dddddd' }} />
                <div id="loadAnimationContainer" style={!loading ? { display: 'none' } : {}}>
                    <p>Applying Tiles</p>
                    <div className="circles marginLeft">
                        <span className="circle_1 circle">
                        </span>
                        <span className="circle_2 circle">
                        </span>
                        <span className="circle_3 circle">
                        </span>
                    </div>
                </div>
            </div >
        )
    }
}
const mStP = ({ app: { areas = [], grout = 2, layoutSelected } }) => ({ areas, grout, layoutSelected });

export default connect(mStP)(CanvasContainer)