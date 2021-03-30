import React, { Component } from 'react';
import { connect } from 'react-redux';
import ThreeJS from './ThreeJS';


class CanvasContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true
        };
        this.mesh = null;
        this.floorWidth = 5000;
        this.floorHeight = 5000;
    }
    componentDidMount() {
        this.appCanvas = document.getElementById("roomCanvas");
        this.image = document.createElement('img');
        // document.body.appendChild(this.image);
        // this.image.style.position = 'fixed';
        // this.image.style.top = '0px'
        this.canvas = document.createElement('canvas');
        this.canvas.style.backgroundColor = "#FFFFFF";
        this.ctx = this.canvas.getContext("2d");

        this.handleInit();
        window.addEventListener('resize', this.handleResize);
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }
    componentDidUpdate() {
        this.handleLoader();
    }
    handleInit = () => {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.TextureLoader().load(areas.images[1]);
        this.scene.background.minFilter = THREE.LinearFilter;
        this.camera = new THREE.PerspectiveCamera(areas.cameraFov, 16 / 9, .1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true, canvas: this.appCanvas });
        this.renderer.setClearColor(0xffffff);
        const width = window.innerWidth - (window.innerHeight + 16 >= window.innerWidth * hpw ? 0 : 16)
        this.renderer.setSize(width, width * hpw);
        this.renderer.shadowMap.enabled = false;
        this.renderer.shadowMapSoft = false;
        this.camera.position.set(0, 5, 30);
        this.camera.lookAt(new THREE.Vector3(0, 5, 0));
        if (0) {
            const ambient = new THREE.AmbientLight(0x404040);
            this.scene.add(ambient);
            const light = new THREE.SpotLight(0xffffff);
            light.castShadow = false;
            light.shadow.camera.near = 8;
            light.shadow.camera.far = 2000;
            light.shadow.camera.fov = .5;
            light.shadow.mapSize.width = 1024 * 4;
            light.shadow.mapSize.height = 1024 * 4;
            light.shadow.focus = 2;
            light.position.set(100, 1000, 100);
            light.name = 'Spot Light';
            this.scene.add(light);
        }
        const glossyTexture = new THREE.TextureLoader().load(areas.images[1]);
        glossyTexture.minFilter = THREE.LinearFilter;
        glossyTexture.wrapS = glossyTexture.wrapT = THREE.RepeatWrapping;
        glossyTexture.anisotropy = 32;
        glossyTexture.needsUpdate = true;
        const glossyZ = 20;
        const gHeight = (this.camera.position.z - glossyZ) * 2 * tanD(areas.cameraFov / 2);
        console.log(gHeight)
        const glossyMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(gHeight / hpw, gHeight, 1, 1),
            new THREE.MeshBasicMaterial({
                map: glossyTexture,
                roughness: .5,
                opacity: .7,
                transparent: true,
            })
        );
        glossyMesh.position.set(0, 5, glossyZ);
        // this.scene.add(glossyMesh);

        const transTexture = new THREE.TextureLoader().load(areas.images[0]);
        transTexture.minFilter = THREE.LinearFilter;
        transTexture.wrapS = transTexture.wrapT = THREE.RepeatWrapping;
        transTexture.anisotropy = 32;
        transTexture.needsUpdate = true;
        const transZ = 20;
        const tHeight = (this.camera.position.z - transZ) * 2 * tanD(areas.cameraFov / 2);
        console.log(tHeight)
        const transMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(tHeight / hpw, tHeight, 1, 1),
            new THREE.MeshBasicMaterial({
                map: transTexture,
                roughness: .5,
                transparent: true,
            })
        );
        transMesh.position.set(0, 5, transZ);
        this.scene.add(transMesh);

        this.handleLoader();
    }
    handleResize = () => {
        this.camera.updateProjectionMatrix();
        const width = window.innerWidth - (window.innerHeight + 16 >= window.innerWidth * hpw ? 0 : 16)
        this.renderer.setSize(width, width * hpw);
        this.handleLoader();
    }
    handleLoader = () => {
        const { grout, groutColor } = this.props;
        this.canvas.width = product1.width + grout;
        this.canvas.height = product1.height + grout;
        this.handleRender();
        this.image.onload = () => {
            this.ctx.fillStyle = groutColor;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.drawImage(this.image, 0, grout, product1.width, product1.height);
            const image = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
            this.texture = new THREE.Texture(image);
            this.texture.wrapS = this.texture.wrapT = THREE.RepeatWrapping;
            this.texture.needsUpdate = true;
            this.texture.repeat.set(this.floorWidth / this.canvas.width, this.floorHeight / this.canvas.height);
            this.texture.anisotropy = 32;
            this.texture.encoding = THREE.sRGBEncoding;
            this.texture.minFilter = THREE.LinearFilter;
            if (!this.mesh) {
                this.material = new THREE.MeshBasicMaterial({
                    map: this.texture,
                    roughness: .5,
                    opacity: 0.4,
                    transparent: true,
                });
                this.material.needsUpdate = true;
                this.mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(25, 25, 5, 5), this.material);
                this.mesh.position.set(0, 0, 0);
                this.mesh.receiveShadow = true;
                this.mesh.rotation.set(-PI / 2.1, 0, 0);
                this.scene.add(this.mesh);
            }
            else {
                this.mesh.material.map = this.texture;
            }
            console.log(this.mesh)
            this.handleRender();
        };
        this.image.src = product1.file;
    }
    handleRender = () => {
        this.renderer.render(this.scene, this.camera);
    }
    getImageFromUrl = (url, callback) => {
        const img = document.createElement('img');
        const that = this;
        img.onload = function (e) {
            const Texture = new THREE.Texture(this);
            Texture.wrapS = Texture.wrapT = THREE.RepeatWrapping;
            Texture.needsUpdate = true;
            Texture.anisotropy = 32;
            Texture.encoding = THREE.LinearEncoding;
            Texture.minFilter = THREE.LinearFilter;
            callback(Texture);
        }
        img.src = url;
    }
    render() {
        const { loading } = this.props;
        return (
            <div id="container" className="room-canvas-container" style={{}}>
                <canvas id="roomCanvas" className="room-canvas" style={{ cursor: 'unset', background: '#dddddd' }} />
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
                <ThreeJS />
            </div>
        )
    }
}
const mStP = ({ app: {
    areas = [],
    grout = 2,
    layoutSelected = {},
    groutColor = '#FFF'
} }) => ({ areas, grout, layoutSelected, groutColor });

export default connect(mStP)(CanvasContainer)