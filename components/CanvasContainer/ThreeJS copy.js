import React, { Component } from 'react';
import { connect } from 'react-redux';
import product1 from '../../datas/product1';
import { deg, PI, sin, tanD } from '../../utils/helper';
import areas from '../../datas/areas';
import product2 from '../../datas/product2';
const hpw = 9 / 16;
const infinitWidth = 100000, infinitHeight = 100000;

class ThreeJS extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true
        };
        this.faces = [];
    }
    componentDidMount() {
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
        this.appCanvas = document.getElementById("roomCanvas");
        this.appCanvas.width = 1600;
        this.appCanvas.height = 900;
        this.ctx = this.appCanvas.getContext("2d");
        this.background = new Image();
        this.background.src = areas.images[1];
        this.transparent = new Image();
        this.transparent.src = areas.images[0];
        this.background.onload = this.handleRender;
        this.transparent.onload = this.handleRender;
        this.handleInitAreas();
    }
    handleInitAreas = () => {
        const { viewHorizontalOffset, viewVerticalOffset, cameraFov } = areas;

        this.rate = (window.innerWidth - (window.innerHeight + 16 >= window.innerWidth * hpw ? 0 : 16)) / 1600;

        const aspect = (1600 - viewHorizontalOffset * 2) / (900 - viewVerticalOffset * 2);
        this.faces = areas.faces.map((face, index) => {
            const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
            renderer.setClearColor(0xffffff, 0);
            renderer.setSize(1600 * this.rate, 900 * this.rate);
            renderer.shadowMap.enabled = false;
            renderer.shadowMapSoft = false;
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(cameraFov, aspect, .1, 20000);
            camera.focus = 10;
            camera.position.set(0, 0, 100);
            camera.setViewOffset(
                1600 - viewHorizontalOffset * 2,
                900 - viewVerticalOffset * 2,
                -viewHorizontalOffset * 2,
                -viewVerticalOffset * 2,
                1600,
                900
            );
            const { gX, gY, gZ, g_X, g_Y, g_Z, scaleX, scaleY } = face
            const areaGroup = new THREE.Group();
            areaGroup.position.set(gX, gY, gZ);
            areaGroup.rotation.set(deg(g_X), deg(g_Y), deg(g_Z));
            areaGroup.scale.set(scaleX / 1000, scaleY / 1000, 1);

            const { grout, groutColor } = this.props;
            const image = new Image();
            // image.src = index - 1 ? product1.file : product2.file;
            image.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = (product1.width + grout) * 5;
                canvas.height = (product1.height + grout) * 5;
                const ctx = canvas.getContext('2d');
                ctx.fillStyle = groutColor;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(image, 0, grout * 5, product1.width * 5, product1.height * 5);
                const texture = new THREE.Texture(ctx.getImageData(0, 0, canvas.width, canvas.height));
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                texture.needsUpdate = true;
                texture.repeat.set(face.width * 600 / canvas.width, face.height * 600 / canvas.height);
                texture.anisotropy = 16;
                // texture.encoding = THREE.sRGBEncoding;   
                texture.minFilter = THREE.LinearFilter;
                const material = new THREE.MeshBasicMaterial({
                    map: texture,
                    opacity: 1,
                    transparent: true,
                });
                material.needsUpdate = true;
                const mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(infinitWidth, infinitHeight), material);
                mesh.receiveShadow = true;
                areaGroup.add(mesh);
                areaGroup.userData.oldId = areaGroup.userData.id;
                areaGroup.userData.id = areaGroup.userData.id + 1 || 1;
                this.handleLoader();
            };
            const group = new THREE.Group();
            areaGroup.add(group);
            scene.add(areaGroup);
            const canvas = document.createElement('canvas');
            const hoverCanvas = document.createElement('canvas');

            if ("hoverCanvasInit") {
                const width = 1600;
                const height = 900;
                hoverCanvas.width = width;
                hoverCanvas.height = height;
                const ctx = hoverCanvas.getContext('2d');
                ctx.fillStyle = "rgba(0, 130, 232, 0.3)";
                ctx.fillRect(0, 0, width, height);
                const hoverImage = ctx.getImageData(0, 0, width, height);
                for (let x = 0; x < width; x++) {
                    for (let y = 0; y < height; y++) {
                        let i = (x + y * width) * 4;
                        const inner = this.pointInPolygon({ x: x * this.rate, y: y * this.rate }, face.hoverArea);
                        if (!inner) hoverImage.data[i + 3] = 0;
                    }
                };
                ctx.putImageData(hoverImage, 0, 0);
            }

            return ({ renderer, scene, camera, areaGroup, face, canvas, hoverCanvas });
        });

        this.handleLoader();
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
        this.rate = (window.innerWidth - (window.innerHeight + 16 >= window.innerWidth * hpw ? 0 : 16)) / 1600;
        this.handleLoader();
    }
    handleLoader = () => {
        const { areas } = this.props;
        this.faces.map(({ renderer, camera, scene, areaGroup, canvas }, index) => {
            const face = areas.faces[index];
            const change = 1;
            if (face.products && change) {
                areaGroup.clear();
                renderer.setClearColor(groutColor, .5);
                const [p1, p2] = face.products;

                const texture = new THREE.TextureLoader().load(p1.file, this.handleRender);
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                texture.needsUpdate = true;
                texture.anisotropy = 16;
                const material = new THREE.MeshBasicMaterial({
                    map: texture,
                    opacity: 1,
                    transparent: true,
                });
                const mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(p1.width, p1.height), material);
                mesh.receiveShadow = true;

                const texture2 = new THREE.TextureLoader().load(p2 ? p2.file : p1.file, this.handleRender);
                texture2.wrapS = texture2.wrapT = THREE.RepeatWrapping;
                texture2.needsUpdate = true;
                texture2.anisotropy = 16;
                const material2 = new THREE.MeshBasicMaterial({
                    map: texture2,
                    opacity: 1,
                    transparent: true,
                });
                const mesh2 = new THREE.Mesh(new THREE.PlaneBufferGeometry(p2.width, p2.height), material2);
                mesh2.receiveShadow = true;

                const maxX = infinitWidth / 2 / 5;
                const maxY = infinitHeight / 2 / 5;
                let i = 0;
                for (let x = -maxX; x < maxX; x += p1.width + grout) {
                    for (let y = -maxY; y < maxY; y += p1.height + grout) {
                        const cloneMesh = mesh.clone();
                        cloneMesh.position.set(x, y, 0);
                        areaGroup.add(cloneMesh);
                        i++;
                    }
                };

                renderer.render(scene, camera);

                const width = 1600;
                const height = 900;
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(renderer.domElement, 0, 0, width, height);
                const imageData = ctx.getImageData(0, 0, width, height);
                for (let x = 0; x < width; x++) {
                    for (let y = 0; y < height; y++) {
                        let i = (x + y * width) * 4;
                        const inner = this.pointInPolygon({ x: x * this.rate, y: y * this.rate }, face.hoverArea);
                        if (inner) imageData.data[i + 3] = 255;
                        else imageData.data[i + 3] = 0;
                    }
                };
                ctx.putImageData(imageData, 0, 0);
                this.faces[index].image = canvas;
                this.faces[index].changed = true;
            }
        });
        this.handleRender();
    }
    handleRender = () => {
        const { width, height } = this.appCanvas;
        this.ctx.drawImage(this.background, 0, 0, width, height);
        this.faces.map(({ image, canvas, hover, hoverCanvas }) => {
            if (image) this.ctx.drawImage(canvas, 0, 0, width, height);
            if (hover) this.ctx.drawImage(hoverCanvas, 0, 0, width, height);
        });
        this.ctx.drawImage(this.transparent, 0, 0, width, height);
    }
    onMouseMove = (e) => {
        const x = e.pageX, y = e.pageY;
        let i = 0, selected = false;
        while (i < areas.faces.length && !selected) {
            const hoverArea = areas.faces[i].hoverArea;
            selected = this.pointInPolygon({ x, y }, hoverArea);
            if (!selected) i++;
        };
        if (selected && this.index !== i) {
            this.index = i;
            e.target.style.cursor = 'url("/icons/brush.png") 18 46, pointer';
            e.target.title = 'Change ' + areas.faces[i].type;
            this.faces.map((face, index) => {
                if (index === i) face.hover = true;
                else face.hover = false;
            });
            this.handleLoader();
        } else if (!selected && this.index !== null) {
            this.index = null;
            e.target.style.cursor = 'unset';
            e.target.title = '';
            this.faces.map(face => face.hover = false);
            this.handleLoader();
        }
        this.handleRenderInfo({ x, y, i });
    }
    onMouseLeave = (e) => {
        e.target.style.cursor = 'unset';
        e.target.title = '';
        this.handleLoader();
    }
    pointInPolygon({ x, y }, polygon) {
        let inside = false;
        for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
            const xi = this.rate * polygon[i].x, yi = this.rate * polygon[i].y;
            const xj = this.rate * polygon[j].x, yj = this.rate * polygon[j].y;

            const intersect = ((yi > y) != (yj > y))
                && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
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
                style={{ cursor: 'unset' }}
                onMouseMove={this.onMouseMove}
                onMouseLeave={this.onMouseLeave}
                onClick={this.onSelect}
            />
        );
    }
}
const mStP = ({ app: {
    // areas = [],
    grout = 2,
    layoutSelected = {},
    groutColor = 'rgb(255,255,255)'
} }) => ({ areas: areas, grout: 24, layoutSelected, groutColor });

export default connect(mStP)(React.memo(ThreeJS))