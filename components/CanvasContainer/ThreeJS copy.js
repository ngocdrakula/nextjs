import React, { Component } from 'react';
import { connect } from 'react-redux';
import types from '../../redux/types';
import { deg, PI, sin, tanD } from '../../utils/helper';
const hpw = 9 / 16;
const infinitWidth = 200000, infinitHeight = 200000;

class ThreeJS extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true
        };
        this.areas = [];
        this.mouse = {};
    }
    componentDidMount() {
        this.handleInit();
        window.addEventListener('resize', this.handleResize);
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }
    componentDidUpdate() {
        this.props.handleLoading(true);
        this.handleLoader();
    }
    handleInit = () => {
        const { layout } = this.props;
        const { horizontal, vertical, cameraFov, areas, images } = layout;

        this.mouse = new THREE.Vector3();
        this.appCanvas = document.getElementById("roomCanvas");
        this.ctx = this.appCanvas.getContext("2d");
        this.background = new Image();
        this.background.src = "/api/images/" + images[0];
        this.transparent = new Image();
        this.transparent.src = "/api/images/" + images[1];
        this.background.onload = this.handleRender;
        this.transparent.onload = this.handleRender;

        this.matt = new Image();
        this.matt.src = "/api/images/" + images[2];
        this.matt.onload = () => {
            this.rate = (window.innerWidth - (window.innerHeight + 16 >= window.innerWidth * hpw ? 0 : 16)) / 1600;

            const aspect = (1600 - horizontal * 2) / (900 - vertical * 2);
            this.areas = areas.map((area, index) => {
                const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
                renderer.setClearColor(0xffffff, 0);
                renderer.setSize(1600 * this.rate, 900 * this.rate);
                renderer.shadowMap.enabled = false;
                renderer.shadowMapSoft = false;
                const scene = new THREE.Scene();
                scene.background = new THREE.Texture(this.background);
                scene.background.minFilter = THREE.LinearFilter;
                scene.background.needsUpdate = true;
                const camera = new THREE.PerspectiveCamera(cameraFov, aspect, .1, 20000);
                camera.focus = 10;
                camera.position.set(0, 0, 100);
                camera.setViewOffset(
                    1600 - horizontal * 2,
                    900 - vertical * 2,
                    -horizontal * 2,
                    -vertical * 2,
                    1600,
                    900
                );
                const { x, y, z, _x, _y, _z, scaleX, scaleY, hoverArea } = area;
                const areaGroup = new THREE.Group();
                areaGroup.position.set(x, y, z);
                areaGroup.rotation.set(deg(_x), deg(_y), deg(_z));
                areaGroup.scale.set(scaleX / 1000, scaleY / 1000, 1);
                scene.add(areaGroup);

                const group = new THREE.Group();

                areaGroup.add(group);
                const canvas = document.createElement('canvas');
                const hoverCanvas = document.createElement('canvas');
                const smoothCanvas = document.createElement('canvas');
                const mattCanvas = document.createElement('canvas');
                const surfCanvas = document.createElement('canvas');

                const width = 1600;
                const height = 900;

                if ("canvasInit") {
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(this.background, 0, 0, width, height);
                }
                if ("hoverCanvasInit") {
                    hoverCanvas.width = width;
                    hoverCanvas.height = height;
                    const ctx = hoverCanvas.getContext('2d');
                    ctx.fillStyle = "rgba(0, 130, 232, 0.3)";
                    ctx.fillRect(0, 0, width, height);
                    const hoverImage = ctx.getImageData(0, 0, width, height);
                    for (let x = 0; x < width; x++) {
                        for (let y = 0; y < height; y++) {
                            let i = (x + y * width) * 4;
                            const inner = this.pointInPolygon({ x: x * this.rate, y: y * this.rate }, hoverArea);
                            if (!inner) hoverImage.data[i + 3] = 0;
                        }
                    };
                    ctx.putImageData(hoverImage, 0, 0);
                }
                // if ("mattCanvasInit") {
                mattCanvas.width = width;
                mattCanvas.height = height;
                const mattCtx = mattCanvas.getContext('2d');
                mattCtx.drawImage(this.matt, 0, 0, width, height);
                const mattImage = mattCtx.getImageData(0, 0, width, height);
                let j = 0;
                for (let x = 0; x < width; x++) {
                    for (let y = 0; y < height; y++) {
                        let i = (x + y * width) * 4;
                        const inner = this.pointInPolygon({ x: x * this.rate, y: y * this.rate }, hoverArea);
                        if (inner) {
                            // mattImage.data[i] = Math.floor(mattImage.data[i] / 2);
                            // mattImage.data[i + 1] = Math.floor(mattImage.data[i + 1] / 2);
                            // mattImage.data[i + 2] = Math.floor(mattImage.data[i + 2] / 2);
                            mattImage.data[i + 3] = 0;
                        }
                        else mattImage.data[i + 3] = 0;
                    }
                };
                mattCtx.putImageData(mattImage, 0, 0);
                // }
                if ("smoothCanvasInit") {
                    smoothCanvas.width = width;
                    smoothCanvas.height = height;
                    const ctx = smoothCanvas.getContext('2d');
                    ctx.drawImage(this.background, 0, 0, width, height);
                    const smoothImage = ctx.getImageData(0, 0, width, height);
                    for (let x = 0; x < width; x++) {
                        for (let y = 0; y < height; y++) {
                            let i = (x + y * width) * 4;
                            const inner = this.pointInPolygon({ x: x * this.rate, y: y * this.rate }, hoverArea);
                            if (!inner) smoothImage.data[i + 3] = 0;
                            else smoothImage.data[i + 3] = 128;
                        }
                    };
                    ctx.putImageData(smoothImage, 0, 0);
                }
                if ("surfCanvasInit") {
                    surfCanvas.width = width;
                    surfCanvas.height = height;
                    const ctx = surfCanvas.getContext('2d');
                    ctx.drawImage(this.background, 0, 0, width, height);
                    const surfImage = ctx.getImageData(0, 0, width, height);
                    let j = 0;
                    for (let x = 0; x < width; x++) {
                        for (let y = 0; y < height; y++) {
                            let i = (x + y * width) * 4;
                            const inner = this.pointInPolygon({ x: x * this.rate, y: y * this.rate }, hoverArea);
                            if (inner) surfImage.data[i + 3] = 176;
                            else surfImage.data[i + 3] = 0;
                        }
                    };
                    ctx.putImageData(surfImage, 0, 0);
                }
                if (index === 2) {
                    document.body.appendChild(canvas);
                    // // document.body.appendChild(smoothCanvas);
                    // // document.body.appendChild(mattCanvas);
                    document.body.appendChild(renderer.domElement);
                }

                return ({ renderer, scene, camera, group, area, canvas, hoverCanvas, smoothCanvas, mattCanvas, surfCanvas, mattImage });
            });

            this.handleLoader();
        }
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
        this.handleRender();
    }
    handleLoader = (index) => {
        const { layout, areaIndex } = this.props;
        const { areas } = layout;
        if (areaIndex + 1) {
            const { renderer, camera, scene, group, canvas, mattImage } = this.areas[areaIndex];
            const { products, grout = 2, color = 0xffffff, hoverArea, width, height, rotate, _x, _y, _z } = areas[areaIndex];
            if (products && products[0]) {
                group.clear();
                if (rotate + 1) group.rotation.set(0, 0, deg(45));
                // renderer.setClearColor(color, 1);
                const [p1, p2 = p1] = products;
                let count = 0;
                const productWidth = p1.size.width, productHeight = p1.size.height;
                const texture = new THREE.TextureLoader().load("/api/images/" + p1.image, () => { count++; addMesh() });
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                texture.wrapS = texture.wrapT = 1001;
                texture.encoding = THREE.sRGBEncoding;
                texture.encoding = 3000;
                texture.flipY = true;
                // texture.minFilter = THREE.LinearFilter;
                // texture.magFilter = THREE.NearestFilter;
                texture.minFilter = 1008;
                texture.magFilter = 1006;
                texture.needsUpdate = true;
                texture.anisotropy = 16;
                texture.opacity = 1;
                texture.unpackAlignment = 4;
                texture.format = 1023;
                texture.mapping = 300;

                texture.type = 1009;
                const texture2 = new THREE.TextureLoader().load("/api/images/" + p2.image, () => { count++; addMesh() });
                texture2.wrapS = texture2.wrapT = THREE.RepeatWrapping;
                texture2.needsUpdate = true;
                texture2.anisotropy = 16;

                const addMesh = () => {
                    if (count < 2) return;
                    const material = new THREE.MeshBasicMaterial({
                        map: texture,
                        color: new THREE.Color(0xffffff),
                        // opacity: p1.front.rate,
                        opacity: 1,
                        transparent: true,
                    });
                    const mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(1, 1), material);
                    mesh.scale.set(productWidth, productHeight)

                    const background = new THREE.Mesh(
                        new THREE.PlaneBufferGeometry(1, 1),
                        new THREE.MeshBasicMaterial({ color: new THREE.Color(color), })
                    );
                    background.position.set(0, -0.02, 0)
                    background.scale.set(productWidth + grout * 2, productHeight + grout * 2);

                    const groupTitle = new THREE.Group();
                    groupTitle.rotation.set(deg(_x), deg(_y), deg(_z));
                    groupTitle.add(background);
                    groupTitle.add(mesh)

                    const maxX = productWidth / 2 + 2 + (productWidth + grout) * Math.ceil(width / (productWidth + grout));
                    const maxY = productHeight / 2 + 2 + (productHeight + grout) * Math.ceil(height / (productHeight + grout));
                    let i = 0;
                    for (let x = -maxX; x < maxX; x += productWidth + grout) {
                        for (let y = -maxY; y < maxY; y += productHeight + grout) {
                            const groupClone = groupTitle.clone();
                            groupClone.position.set(x, y, 0);
                            group.add(groupClone);
                            i++
                        }
                    };
                    console.log(i, group)
                    renderer.render(scene, camera);

                    const canvasWidth = 1600;
                    const canvasHeight = 900;
                    canvas.width = canvasWidth;
                    canvas.height = canvasHeight;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(renderer.domElement, 0, 0, canvasWidth, canvasHeight);
                    const imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
                    for (let x = 0; x < canvasWidth; x++) {
                        for (let y = 0; y < canvasHeight; y++) {
                            let i = (x + y * canvasWidth) * 4;
                            const inner = this.pointInPolygon({ x: x * this.rate, y: y * this.rate }, hoverArea);
                            if (!inner) imageData.data[i + 3] = 0;
                        }
                    };
                    ctx.putImageData(imageData, 0, 0);
                    this.handleRender();
                }
            }
        }
    }
    handleRender = () => {
        const { layout } = this.props;
        const { areas } = layout;
        const { width, height } = this.appCanvas;
        this.ctx.drawImage(this.background, 0, 0, width, height);
        this.areas.map(({ canvas, mattCanvas, smoothCanvas, surfCanvas, hover, hoverCanvas }, index) => {
            if (areas[index].products && areas[index].products[0]) {
                this.ctx.drawImage(canvas, 0, 0, width, height);
                // const type = areas[index].products[0].front.type;
                // this.ctx.drawImage(surfCanvas, 0, 0, width, height);
                // if (type === 2) this.ctx.drawImage(smoothCanvas, 0, 0, width, height);
                // if (type === 3) this.ctx.drawImage(surfCanvas, 0, 0, width, height);
            }
            if (hover) this.ctx.drawImage(hoverCanvas, 0, 0, width, height);
        });
        this.ctx.drawImage(this.transparent, 0, 0, width, height);
        this.props.handleLoading(false);
    }
    onMouseMove = (e) => {
        const x = e.pageX, y = e.pageY;
        const { layout } = this.props;
        const { areas } = layout;
        let i = 0, selected = false;
        while (i < areas.length && !selected) {
            const hoverArea = areas[i].hoverArea;
            selected = this.pointInPolygon({ x, y }, hoverArea);
            if (!selected) i++;
        };
        if (selected && this.index !== i) {
            this.index = i;
            e.target.style.cursor = 'url("/icons/brush.png") 18 46, pointer';
            e.target.title = 'Change ' + areas[i].type;
            this.areas.map((area, index) => {
                if (index === i) area.hover = true;
                else area.hover = false;
            });
            this.handleRender();
        } else if (!selected && this.index + 1) {
            this.index = -1;
            e.target.style.cursor = 'unset';
            e.target.title = '';
            this.areas.map(area => area.hover = false);
            this.handleRender();
        }
        this.handleRenderInfo({ x, y, i });
    }
    onMouseLeave = (e) => {
        e.target.style.cursor = 'unset';
        e.target.title = '';
        this.handleRender();
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
        const { dispatch, areaIndex } = this.props;
        if (this.index !== areaIndex && this.index < this.areas.length) {
            dispatch({
                type: types.SELECT_AREA,
                payload: this.index
            });
        } else if (this.index === areaIndex) {
            const { layout } = this.props;
            const area = layout?.areas[this.index];
            this.mouse.x = e.pageX, this.mouse.y = e.pageY;
            if (area && area.customRotate) {
            } else if (area && area.custom) {

            }
        }
    }
    handleRotateItem = () => {
        const { layout, areaIndex } = this.props;
        projector.unprojectVector(vector, camera);
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
        console.log(this.props.layout)
        return (
            <canvas
                id="roomCanvas"
                className="room-canvas"
                style={{ cursor: 'unset' }}
                width={1600}
                height={900}
                onMouseMove={this.onMouseMove}
                onMouseLeave={this.onMouseLeave}
                onClick={this.onSelect}
            />
        );
    }
}

export default connect(({ app: { layout, areaIndex } }) => ({ layout, areaIndex }))(React.memo(ThreeJS))