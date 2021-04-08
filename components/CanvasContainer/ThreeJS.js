import React, { Component } from 'react';
import { connect } from 'react-redux';
import room1 from '../../datas/room1';
import product1 from '../../datas/product1';
import { deg, PI, sin, tanD } from '../../utils/helper';
import areas from '../../datas/areas';
const hpw = 9 / 16;
const co = {
    w: 13.9,
    h: 13.9,
    x: 0,
    y: 2.8,
    z: 21,
    _x: -90.7,
    _y: 0,
    _z: 0,
    cx: 0,
    cy: 5,
    cz: 30,
    _cx: 0,
    _cy: 5,
    _cz: 0
};

class ThreeJS extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true
        };
        this.mesh = null;
    }
    componentDidMount() {
        this.appCanvas = document.getElementById("roomCanvas");
        this.image = document.createElement('img');
        this.canvas = document.createElement('canvas');
        this.canvas.style.backgroundColor = "#FFFFFF";
        this.ctx = this.canvas.getContext("2d");

        this.handleInit();
        this.handleGuiInit();

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
        const aspect = (1600 - (0 * 2)) / (900 - (-163 * 2));
        this.camera = new THREE.PerspectiveCamera(areas.cameraFov, aspect, .1, 20000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true, canvas: this.appCanvas });
        this.renderer.setClearColor(0xffffff);
        const width = window.innerWidth - (window.innerHeight + 16 >= window.innerWidth * hpw ? 0 : 16)
        this.renderer.setSize(width, width * hpw);
        this.renderer.shadowMap.enabled = false;
        this.renderer.shadowMapSoft = false;
        this.camera.position.set(0, 0, 100);
        this.camera.setViewOffset(1600 - (0 * 2), 900 - (-163 * 2), 0 * 2, -(-163) * 2, 1600, 900)
        // this.camera.lookAt(new THREE.Vector3(0, 5, 0));
        const group = new THREE.Group();
        group.position.set(-32.1, -16.5, 0);
        group.scale.set(13.9 / 1000, 13.9 / 1000, 1);
        if(group){
            const mesh1 = new THREE.Mesh(
                new THREE.PlaneGeometry(200000, 200000),
                new THREE.MeshBasicMaterial({color: new THREE.Color(0xff0000), transparent: true, })
            );
            group.add(mesh1)
        }
        this.scene.add(group)
        if (0) {
            const ambient = new THREE.AmbientLight(0x404040);
            this.scene.add(ambient);
            const light = new THREE.SpotLight(0xffffff);
            light.castShadow = false;
            light.shadow.camera.near = 8;
            light.shadow.camera.far = 20000;
            light.shadow.camera.fov = .5;
            light.shadow.mapSize.width = 1024 * 4;
            light.shadow.mapSize.height = 1024 * 4;
            light.shadow.focus = 2;
            light.position.set(100, 1000, 100);
            light.name = 'Spot Light';
            this.scene.add(light);
            const glossyTexture = new THREE.TextureLoader().load(areas.images[1]);
            glossyTexture.minFilter = THREE.LinearFilter;
            glossyTexture.wrapS = glossyTexture.wrapT = THREE.RepeatWrapping;
            glossyTexture.anisotropy = 32;
            glossyTexture.needsUpdate = true;
            const glossyZ = 20;
            const gHeight = (this.camera.position.z - glossyZ) * 2 * tanD(areas.cameraFov / 2);
            const glossyMesh = new THREE.Mesh(
                new THREE.PlaneGeometry(gHeight / hpw, gHeight, 2, 2),
                new THREE.MeshBasicMaterial({
                    map: glossyTexture,
                    opacity: 1,
                    transparent: true,
                })
            );
            glossyMesh.position.set(0, 5, glossyZ);
            this.scene.add(glossyMesh);
        }
        const transTexture = new THREE.TextureLoader().load(areas.images[0]);
        transTexture.minFilter = THREE.LinearFilter;
        transTexture.wrapS = transTexture.wrapT = THREE.RepeatWrapping;
        transTexture.anisotropy = 32;
        transTexture.needsUpdate = true;
        const transZ = this.camera.position.z - 5;
        const tHeight = (this.camera.position.z - transZ) * 2 * tanD(areas.cameraFov / 2);
        const transMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(tHeight / hpw, tHeight, 2, 2),
            new THREE.MeshBasicMaterial({ map: transTexture, transparent: true, })
        );
        transMesh.position.set(0, 5, transZ);
        // this.scene.add(transMesh);

        this.handleLoader();
    }
    handleGuiInit = () => {
        window.onload = () => {
            const gui = new dat.GUI();
            const width = gui.add(co, 'w', 10.0, 50.0);
            width.onChange(this.handleLoader);
            const height = gui.add(co, 'h', 10.0, 50.0);
            height.onChange(this.handleLoader);
            const x = gui.add(co, 'x', -50.0, 50.0);
            x.onChange(this.handleLoader);
            const y = gui.add(co, 'y', -50.0, 50.0);
            y.onChange(this.handleLoader);
            const z = gui.add(co, 'z', -50.0, 50.0);
            z.onChange(this.handleLoader);
            const _x = gui.add(co, '_x', -180, 180);
            _x.onChange(this.handleLoader);
            const _y = gui.add(co, '_y', -180, 180);
            _y.onChange(this.handleLoader);
            const _z = gui.add(co, '_z', -180, 180);
            _z.onChange(this.handleLoader);
            const cy = gui.add(co, 'cy', -50.0, 50.0);
            cy.onChange(this.handleRender);
            const _cy = gui.add(co, '_cy', -50.0, 50.0);
            _cy.onChange(this.handleRender);
            const cz = gui.add(co, 'cz', -50.0, 50.0);
            cz.onChange(this.handleRender);
            const _cz = gui.add(co, '_cz', -50.0, 50.0);
            _cz.onChange(this.handleRender);
        }
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
            const face = areas.surfaces[0];
            this.texture.repeat.set(co.w * 500 / this.canvas.width, co.h * 500 / this.canvas.height);
            this.texture.anisotropy = 32;
            this.texture.encoding = THREE.sRGBEncoding;
            this.texture.minFilter = THREE.LinearFilter;
            if (!this.mesh) {
                this.material = new THREE.MeshBasicMaterial({
                    map: this.texture,
                    // opacity: 0.4,
                    transparent: true,
                });
                this.material.needsUpdate = true;
                this.mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(co.w, co.h, 2, 2), this.material);
                this.mesh.receiveShadow = true;
                this.scene.add(this.mesh);
            }
            else {
                this.mesh.material.map = this.texture;
                this.mesh.geometry = new THREE.PlaneBufferGeometry(co.w, co.h, 2, 2);
            }
            this.mesh.position.set(co.x, co.y, co.z);
            this.mesh.rotation.set(deg(co._x), deg(co._y), deg(co._z));
            this.handleRender();
        };
        this.image.src = product1.file;
    }
    handleRender = () => {
        console.log(this.scene, this.camera)
        this.renderer.render(this.scene, this.camera);
    }
    render() {
        return (
            <canvas
                id="roomCanvas"
                className="room-canvas"
                style={{ cursor: 'unset', background: '#dddddd' }}
            // onMouseMove={e => console.log(e)}
            // onClick={e => console.log('clicl', e)}
            />
        );
    }
}
const mStP = ({ app: {
    // areas = [],
    grout = 2,
    layoutSelected = {},
    groutColor = '#FFF'
} }) => ({ areas: areas, grout: 24, layoutSelected, groutColor });

export default connect(mStP)(React.memo(ThreeJS))