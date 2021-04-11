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
        this.info = {};
        this.scenes = [];
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
        const aspect = (1600 - areas.viewHorizontalOffset * 2) / (900 - areas.viewVerticalOffset * 2);
        const width = window.innerWidth - (window.innerHeight + 16 >= window.innerWidth * hpw ? 0 : 16);
        this.rate = width / 1600;

        this.renderer = new THREE.WebGLRenderer({ antialias: true, canvas: this.appCanvas });
        this.renderer.setClearColor(0xffffff);
        this.renderer.setSize(width, width * hpw);
        this.renderer.shadowMap.enabled = false;
        this.renderer.shadowMapSoft = false;

        this.raycaster = new THREE.Raycaster();

        this.mouse = new THREE.Vector2();

        this.scenes = areas.faces.map((face, index) => {
            const scene = new THREE.Scene();
            if (!index) {
                scene.background = new THREE.TextureLoader().load(areas.images[1]);
                scene.background.minFilter = THREE.LinearFilter;
            }
            else scene.background = null;
            const camera = new THREE.PerspectiveCamera(areas.cameraFov, aspect, .1, 20000);
            camera.focus = 10;
            camera.position.set(0, 0, 100);
            camera.setViewOffset(
                1600 - areas.viewHorizontalOffset * 2,
                900 - areas.viewVerticalOffset * 2,
                -areas.viewHorizontalOffset * 2,
                -areas.viewVerticalOffset * 2,
                1600,
                900
            );
            const group = new THREE.Group();
            group.position.set(face.gX, face.gY, face.gZ);
            group.rotation.set(deg(face.g_X), deg(face.g_Y), deg(face.g_Z));
            group.scale.set(face.scaleX / 1000, face.scaleY / 1000, 1);
            if (group) {
                const child1 = new THREE.Group();
                group.add(child1);
                const child2 = new THREE.Group();
                group.add(child2);
                const mesh = new THREE.Mesh(
                    new THREE.PlaneGeometry(20000, 20000),
                    new THREE.MeshBasicMaterial({
                        color: new THREE.Color([0xff0000, 0x00ff00, 0x0000ff][index]),
                        transparent: true,
                        opacity: 0,
                        needsUpdate: true
                    }));
                group.add(mesh)
            }
            scene.add(group);
            if (!index) {
                const transTexture = new THREE.TextureLoader().load(areas.images[0]);
                transTexture.minFilter = THREE.LinearFilter;
                transTexture.wrapS = transTexture.wrapT = THREE.RepeatWrapping;
                transTexture.anisotropy = 16;
                transTexture.needsUpdate = true;
                const transMesh = new THREE.Mesh(
                    new THREE.PlaneGeometry(1600, 900, 2, 2),
                    new THREE.MeshBasicMaterial({ map: transTexture, transparent: false })
                );
                transMesh.position.set(0, 0, 0);
                transMesh.scale.set(0.0139, 0.0139, 1);
                scene.add(transMesh);
            }
            return { scene, camera };
        });
        this.handleLoader();
        this.fps = document.getElementById('fps');
        if (!this.fps) {
            this.fps = document.createElement('div');
            this.fps.id = "fps"
            document.getElementById('container').appendChild(this.fps);
        }
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
        this.scenes.map(({ camera }) => {
            camera.updateProjectionMatrix();
        });
        const width = window.innerWidth - (window.innerHeight + 16 >= window.innerWidth * hpw ? 0 : 16);
        this.rate = width / 1600;
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
            const face = areas.faces[0];
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
                // this.scenes.add(this.mesh);
            }
            else {
                this.mesh.material.map = this.texture;
                this.mesh.geometry = new THREE.PlaneBufferGeometry(co.w, co.h, 2, 2);
            }
            this.mesh.position.set(co.x, co.y, co.z);
            this.mesh.rotation.set(deg(co._x), deg(co._y), deg(co._z));
            this.handleRender();
        };
        // this.image.src = product1.file;
    }
    handleRender = () => {
        this.renderer.autoClear = true;
        this.scenes.map(({ scene, camera }, i) => { 
            this.raycaster.setFromCamera(this.mouse, camera);
            const intersects = this.raycaster.intersectObjects(scene.children);
            for (let i = 0; i < intersects.length; i++) {
                intersects[i].object.material.color.set(0xff0000);
            }
            this.renderer.render(scene, camera);
            if (!i) this.renderer.autoClear = false;
        })
    }
    onMouseMove = (e) => {
        const { pageX, pageY } = e;
        this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = - (e.clientY / window.innerHeight) * 2 + 1;
        let i = 0, selected = false;
        while (i < areas.faces.length && !selected) {
            const hoverArea = areas.faces[i].hoverArea;
            selected = this.pointInPolygon({ pageX, pageY }, hoverArea);
            i++;
        };
        if (selected && this.index !== i - 1) {
            this.index = i - 1;
            e.target.style.cursor = 'url("/icons/brush.png") 18 46, pointer';
            const currentSelect = this.scenes[i - 1]?.scene?.children[0]?.children[2];
            if (currentSelect) {
                // currentSelect.material.opacity = .5;
                console.log(currentSelect)
                this.handleLoader();
            }
        } else if (!selected && this.index !== null) {
            this.index = null;
            console.log('over')
            e.target.style.cursor = 'unset';
        }
        this.handleRenderInfo({ pageX, pageY, i });
    }
    pointInPolygon({ pageX, pageY }, polygon) {
        let inside = false;
        for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
            const xi = this.rate * polygon[i].x, yi = this.rate * polygon[i].y;
            const xj = this.rate * polygon[j].x, yj = this.rate * polygon[j].y;

            const intersect = ((yi > pageY) != (yj > pageY))
                && (pageX < (xj - xi) * (pageY - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }
        return inside;
    };
    onSelect = (e) => {

    }
    handleRenderInfo = (newInfo) => {
        this.info = { ...this.info, ...(newInfo || {}) };
        if (this.fps) {
            let info = '';
            Object.keys(this.info).map(i => {
                info += `${i}: ${this.info[i]}<br>`;
            });
            this.fps.innerHTML = info;
        }
    }
    render() {
        return (
            <canvas
                id="roomCanvas"
                className="room-canvas"
                style={{ cursor: 'unset', background: '#dddddd' }}
                onMouseMove={this.onMouseMove}
                onClick={this.onSelect}
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