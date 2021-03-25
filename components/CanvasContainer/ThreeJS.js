import React, { Component } from 'react';
import { connect } from 'react-redux';
import { PI } from '../../utils/helper';


class ThreeJS extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true
        };
        this.mesh = null;
        this.floorWidth = 10000;
        this.floorHeight = 10000;
        this.width = 600;
        this.height = 600;
    }
    componentDidMount() {
        this.handleInit();
        this.timeout = setTimeout(() => this.handleLoader(), 1000);
        window.addEventListener('resize', this.handleResize);
    }
    componentWillUnmount() {
        clearTimeout(this.timeout)
        window.removeEventListener('resize', this.handleResize);
    }
    componentDidUpdate() {
        this.handleLoader();
    }
    handleInit = () => {
        this.scene = new THREE.Scene();
        this.scene.bacground = new THREE.Texture("../img/room_background.png");
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, .1, 500);
        this.renderer = new THREE.WebGLRenderer({ antialias: true, canvas: document.getElementById("roomCanvas") });
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

        this.image = document.createElement('img');
        this.canvas = document.createElement('canvas');
        this.canvas.style.backgroundColor = "#FFFFFF";
    }
    handleResize = () => {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    handleLoader = () => {
        const { grout } = this.props;
        this.canvas.width = this.width + Number(grout);
        this.canvas.height = this.height + Number(grout);
        this.image.onload = (e) => {
            this.scene.remove(this.mesh)
            this.ctx = this.canvas.getContext("2d");
            this.ctx.fillStyle = this.color || "#FFFFFF";
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.drawImage(this.image, grout / 2, grout / 2, this.width, this.height);
            this.imageGrout = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
            this.groundTexture = new THREE.Texture(this.imageGrout);
            this.groundTexture.wrapS = this.groundTexture.wrapT = THREE.RepeatWrapping;
            this.groundTexture.needsUpdate = true;
            this.groundTexture.repeat.set(this.floorWidth / this.canvas.width, this.floorHeight / this.canvas.height);
            this.groundTexture.anisotropy = 32;
            this.groundTexture.encoding = THREE.sRGBEncoding;
            const groundMaterial = new THREE.MeshStandardMaterial({
                map: this.groundTexture,
                roughness: .5
            });
            this.mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(20, 20, 5, 5), groundMaterial);
            this.mesh.position.y = 0;
            this.mesh.receiveShadow = true;
            this.mesh.rotation.set(-PI / 3, 0, 0);
            this.scene.add(this.mesh);
            this.handleRender();
        };
        this.image.src = "/icons/2d.png";
    }
    handleRender = () => {
        this.renderer.render(this.scene, this.camera);
    }
    render() {
        console.log('render 2')
        return null
    }
}
const mStP = ({ app: { areas = [], grout = 2, layoutSelected } }) => ({ areas, grout, layoutSelected });

export default connect(mStP)(React.memo(ThreeJS))