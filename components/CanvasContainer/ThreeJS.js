import React, { Component } from 'react';
import { connect } from 'react-redux';
import types from '../../redux/types';
import { deg, PI, sin, tanD } from '../../utils/helper';
const hpw = 9 / 16;
const infinitWidth = 200000, infinitHeight = 200000;
const WIDTH = 1600, HEIGHT = 900;

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
    componentDidUpdate(prevProps) {
        const { layout, areaIndex, handleLoading } = this.props;
        const { layout: prevLayout } = prevProps;
        const { areas } = layout;
        const { areas: prevAreas } = prevLayout;
        if (areaIndex + 1 && areaIndex < areas.length) {
            const currentArea = areas[areaIndex];
            const prevArea = prevAreas[areaIndex];
            if (currentArea.products) {
                if (currentArea.products !== prevArea.products) {
                    handleLoading(true);
                    this.handleLoader(areaIndex);
                }
                else if (currentArea.grout !== prevArea.grout) {
                    handleLoading(true);
                    this.handleLoader(areaIndex);
                }
                else if (currentArea.skewType !== prevArea.skewType) {
                    handleLoading(true);
                    this.handleLoader(areaIndex);
                }
                else if (currentArea.skewValue !== prevArea.skewValue) {
                    handleLoading(true);
                    this.handleLoader(areaIndex);
                }
                else if (currentArea.color !== prevArea.color) {
                    handleLoading(true);
                    this.changeColor(areaIndex, currentArea.color);
                }
                else if (currentArea.rotate !== prevArea.rotate) {
                    handleLoading(true);
                    this.changeRotate(areaIndex, currentArea.rotate);
                }
            }
        }
    }
    handleInit = () => {
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        const { layout, dispatch } = this.props;
        const { horizontal, vertical, cameraFov, areas, images } = layout;
        this.appCanvas = document.getElementById("roomCanvas");
        this.ctx = this.appCanvas.getContext("2d");
        this.background = new Image();
        this.background.src = "/api/images/" + images[0];
        this.transparent = new Image();
        this.transparent.src = "/api/images/" + images[1];
        this.matt = new Image();
        this.matt.src = "/api/images/" + images[2];
        let count = 0;
        this.background.onload = () => { count++; if (count > 2) onload() };
        this.transparent.onload = () => { count++; if (count > 2) onload() };
        this.matt.onload = () => { count++; if (count > 2) onload() };
        const onload = () => {
            this.rate = (window.innerWidth - (window.innerHeight + 16 >= window.innerWidth * hpw ? 0 : 16)) / WIDTH;

            const aspect = (WIDTH - horizontal * 2) / (HEIGHT - vertical * 2);
            this.areas = areas.map((area, index) => {
                const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
                renderer.setClearColor(0xffffff, 1);
                renderer.setSize(WIDTH * this.rate, HEIGHT * this.rate);
                renderer.shadowMap.enabled = false;
                renderer.shadowMapSoft = false;
                const scene = new THREE.Scene();
                const camera = new THREE.PerspectiveCamera(cameraFov, aspect, .1, 20000);
                camera.focus = 10;
                camera.position.set(0, 0, 100);
                camera.setViewOffset(
                    WIDTH - horizontal * 2,
                    HEIGHT - vertical * 2,
                    -horizontal * 2,
                    -vertical * 2,
                    WIDTH,
                    HEIGHT
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
                const mattCanvas = document.createElement('canvas');
                const smoothCanvas = document.createElement('canvas');
                const surfCanvas = document.createElement('canvas');

                if ("canvasInit") {
                    canvas.width = WIDTH;
                    canvas.height = HEIGHT;
                }
                if ("hoverCanvasInit") {
                    hoverCanvas.width = WIDTH;
                    hoverCanvas.height = HEIGHT;
                    const ctx = hoverCanvas.getContext('2d');
                    ctx.fillStyle = "rgba(0, 130, 232, 0.3)";
                    ctx.fillRect(0, 0, WIDTH, HEIGHT);
                    const hoverImage = ctx.getImageData(0, 0, WIDTH, HEIGHT);
                    for (let x = 0; x < WIDTH; x++) {
                        for (let y = 0; y < HEIGHT; y++) {
                            let i = (x + y * WIDTH) * 4;
                            const inner = this.pointInPolygon({ x: x * this.rate, y: y * this.rate }, hoverArea);
                            if (!inner) hoverImage.data[i + 3] = 0;
                        }
                    };
                    ctx.putImageData(hoverImage, 0, 0);
                }
                if ("mattCanvasInit") {
                    mattCanvas.width = WIDTH;
                    mattCanvas.height = HEIGHT;
                    const ctx = mattCanvas.getContext('2d');
                    ctx.drawImage(this.matt, 0, 0, WIDTH, HEIGHT);
                    const mattImage = ctx.getImageData(0, 0, WIDTH, HEIGHT);
                    for (let x = 0; x < WIDTH; x++) {
                        for (let y = 0; y < HEIGHT; y++) {
                            let i = (x + y * WIDTH) * 4;
                            const inner = this.pointInPolygon({ x: x * this.rate, y: y * this.rate }, hoverArea);
                            if (inner) {
                                const tg = (mattImage.data[i + 0] + mattImage.data[i + 1] + mattImage.data[i + 2]);
                                mattImage.data[i + 0] *= 0;
                                mattImage.data[i + 1] *= 0;
                                mattImage.data[i + 2] *= 0;
                                mattImage.data[i + 3] = Math.floor(255 - tg / 3);
                            }
                            else mattImage.data[i + 3] = 0;
                        }
                    };
                    ctx.putImageData(mattImage, 0, 0);
                }
                if ("smoothCanvasInit") {
                    smoothCanvas.width = WIDTH;
                    smoothCanvas.height = HEIGHT;
                    const ctx = smoothCanvas.getContext('2d');
                    ctx.drawImage(this.background, 0, 0, WIDTH, HEIGHT);
                    const smoothImage = ctx.getImageData(0, 0, WIDTH, HEIGHT);
                    for (let x = 0; x < WIDTH; x++) {
                        for (let y = 0; y < HEIGHT; y++) {
                            let i = (x + y * WIDTH) * 4;
                            const inner = this.pointInPolygon({ x: x * this.rate, y: y * this.rate }, hoverArea);
                            if (inner) {
                                const tg = (smoothImage.data[i + 0] + smoothImage.data[i + 1] + smoothImage.data[i + 2]);
                                smoothImage.data[i + 0] *= 0;
                                smoothImage.data[i + 1] *= 0;
                                smoothImage.data[i + 2] *= 0;
                                smoothImage.data[i + 3] = Math.floor(255 - tg / 3);
                            }
                            else smoothImage.data[i + 3] = 0;
                        }
                    };
                    ctx.putImageData(smoothImage, 0, 0);
                }
                if ("surfCanvasInit") {
                    surfCanvas.width = WIDTH;
                    surfCanvas.height = HEIGHT;
                    const ctx = surfCanvas.getContext('2d');
                    ctx.drawImage(this.background, 0, 0, WIDTH, HEIGHT);
                    const surfImage = ctx.getImageData(0, 0, WIDTH, HEIGHT);
                    for (let x = 0; x < WIDTH; x++) {
                        for (let y = 0; y < HEIGHT; y++) {
                            let i = (x + y * WIDTH) * 4;
                            const inner = this.pointInPolygon({ x: x * this.rate, y: y * this.rate }, hoverArea);
                            if (inner) {
                                const tg = (surfImage.data[i + 0] + surfImage.data[i + 1] + surfImage.data[i + 2]);
                                surfImage.data[i + 0] = 0;
                                surfImage.data[i + 1] = 0;
                                surfImage.data[i + 2] = 0;
                                surfImage.data[i + 3] = Math.floor(255 - tg / 3);
                            }
                            else surfImage.data[i + 3] = 0;
                        }
                    };
                    ctx.putImageData(surfImage, 0, 0);
                }
                return ({ renderer, scene, camera, group, area, canvas, hoverCanvas, smoothCanvas, mattCanvas, surfCanvas });
            });
            dispatch({ type: types.PROGRESS_UPDATE });
            this.handleRender();
        }
    }
    handleLoader = (index) => {
        const { layout } = this.props;
        const { areas } = layout;
        const { renderer, group } = this.areas[index];
        const {
            products,
            grout = 2,
            color = 0xffffff,
            width, height,
            rotate, skewType, skewValue
        } = areas[index];
        const [p1, p2] = products;
        group.clear();
        if (rotate + 1) group.rotation.set(0, 0, deg(rotate));
        renderer.setClearColor(color, 1);
        let count = 0;
        const productWidth = p1.size.width, productHeight = p1.size.height;
        const texture = new THREE.TextureLoader().load("/api/images/" + p1.image, () => { count++; if (count === products.length) addMesh() });
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.wrapS = texture.wrapT = 1001;
        // texture.encoding = THREE.sRGBEncoding;
        texture.encoding = 3000;
        texture.flipY = true;
        texture.format = 1023;
        texture.generateMipmaps = true;
        texture.magFilter = 1006;
        texture.mapping = 300;
        texture.minFilter = 1008;
        texture.needsUpdate = true;
        texture.anisotropy = 16;
        texture.opacity = 1;
        texture.unpackAlignment = 4;
        texture.type = 1009;
        let texture2 = null;
        if (p2) {
            texture2 = new THREE.TextureLoader().load("/api/images/" + p2.image, () => { count++; if (count === products.length) addMesh() });
            texture2.wrapS = texture2.wrapT = THREE.RepeatWrapping;
            texture2.needsUpdate = true;
            texture2.anisotropy = 16;
        }
        const addMesh = () => {
            const material = new THREE.MeshBasicMaterial({
                map: texture,
            });
            const mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(1, 1), material);
            mesh.scale.set(productWidth, productHeight);
            mesh.userData.product = p1;
            const groupTitle = new THREE.Group();
            groupTitle.add(mesh);

            const material2 = new THREE.MeshBasicMaterial(texture2 ? { map: texture2 } : { color: new THREE.Color(color) });
            const mesh2 = new THREE.Mesh(new THREE.PlaneBufferGeometry(1, 1), material2);
            mesh2.scale.set(productWidth, productHeight);
            mesh2.product = p2;
            const groupTitle2 = new THREE.Group();
            groupTitle2.add(mesh2);

            const maxX = productWidth / 2 + 2 + grout / 2 + (productWidth + grout) * Math.ceil(width * 2 / (productWidth + grout));
            const maxY = productHeight / 2 + 2 + grout / 2 + (productHeight + grout) * Math.ceil(height * 2 / (productHeight + grout));
            let i;
            for (let x = -maxX; x < maxX; x += productWidth + grout) {
                let j;
                for (let y = -maxY; y < maxY; y += productHeight + grout) {
                    let groupClone;
                    if (i === j || skewType !== 1) {
                        groupClone = groupTitle.clone();
                    }
                    else groupClone = groupTitle2.clone();
                    groupClone.position.set(x, y, 0);
                    group.add(groupClone);
                    if (skewType === 2 && j) {
                        if (!skewValue) skewValue = 1 / 2;
                        groupClone.position.set(x + (productHeight + grout) * skewValue, y, 0);
                    }
                    else if (skewType === 3 && i) {
                        if (!skewValue) skewValue = 1 / 2;
                        groupClone.position.set(x, y + (productHeight + grout) * skewValue, 0);
                    }
                    j = !j;
                }
                i = !i;
            };
            this.handleDraw(index);
            this.handleRender();
        }
    }
    changeRotate = (index, rotate) => {
        this.areas[index].group.rotation.set(0, 0, deg(rotate));
        this.handleDraw(index);
    }
    changeColor = (index, color) => {
        const { renderer } = this.areas[index];
        renderer.setClearColor(color, 1);
        this.handleDraw(index);

    }
    handleDraw = (index) => {
        const { layout: { areas } } = this.props;
        const { hoverArea, } = areas[index];
        const { renderer, camera, scene, canvas } = this.areas[index];
        renderer.render(scene, camera);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(renderer.domElement, 0, 0, WIDTH, HEIGHT);
        const imageData = ctx.getImageData(0, 0, WIDTH, HEIGHT);
        for (let x = 0; x < WIDTH; x++) {
            for (let y = 0; y < HEIGHT; y++) {
                let i = (x + y * WIDTH) * 4;
                const inner = this.pointInPolygon({ x: x * this.rate, y: y * this.rate }, hoverArea);
                if (!inner) imageData.data[i + 3] = 0;
            }
        };
        ctx.putImageData(imageData, 0, 0);
        this.handleRender()
    }
    handleRender = () => {
        const { layout: { areas } } = this.props;
        this.ctx.drawImage(this.background, 0, 0, WIDTH, HEIGHT);
        this.areas.map(({ canvas, mattCanvas, smoothCanvas, surfCanvas, hover, hoverCanvas }, index) => {
            if (areas[index].products) {
                this.ctx.drawImage(canvas, 0, 0, WIDTH, HEIGHT);
                const type = areas[index].products[0].front.type;
                if (type === 1) this.ctx.drawImage(mattCanvas, 0, 0, WIDTH, HEIGHT);
                if (type === 2) this.ctx.drawImage(smoothCanvas, 0, 0, WIDTH, HEIGHT);
                if (type === 3) this.ctx.drawImage(surfCanvas, 0, 0, WIDTH, HEIGHT);
            }
            if (hover && !areas[index].custom && !areas[index].customRotate) this.ctx.drawImage(hoverCanvas, 0, 0, WIDTH, HEIGHT);
        });
        this.ctx.drawImage(this.transparent, 0, 0, WIDTH, HEIGHT);
        console.log(this.areas)
        this.props.handleLoading(false);
    }
    handleResize = () => {
        this.rate = (window.innerWidth - (window.innerHeight + 16 >= window.innerWidth * hpw ? 0 : 16)) / WIDTH;
        this.handleRender();
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
        if (this.index < this.areas.length && this.index !== areaIndex) {
            dispatch({
                type: types.SELECT_AREA,
                payload: this.index
            });
        } else if (this.index === areaIndex) {
            const { layout } = this.props;
            const area = layout?.areas[this.index];
            const rect = this.appCanvas.getBoundingClientRect();
            this.mouse.x = ((e.clientX - rect.left) / (rect.right - rect.left)) * 2 - 1;
            this.mouse.y = - ((e.clientY - rect.top) / (rect.bottom - rect.top)) * 2 + 1;

            if (area && (area.customRotate || area.custom)) {
                this.handleCustom(area.customRotate, area.custom);
            }
            else {
                dispatch({
                    type: types.SELECT_AREA,
                    payload: this.index
                });
            }
        }
    }
    handleCustom = (customRotate, custom) => {
        if (this.areas[this.index]) {
            const { group, camera } = this.areas[this.index];
            this.raycaster.setFromCamera(this.mouse, camera);
            const intersects = this.raycaster.intersectObjects(group.children, true);
            const mesh = intersects[0]?.object;
            if (mesh) {
                const { layout: { areas } } = this.props;
                const area = areas[this.index];
                if (area && area.product) {
                    if (custom && area.product._id !== mesh.userData.product?._id) {
                        mesh.userData.oldProduct = mesh.userData.product;
                        mesh.userData.product = area.product
                        mesh.material = mesh.material.clone();
                        // const productWidth = mesh.userData.product.size.width;
                        // const productHeight = mesh.userData.product.size.height;
                        // mesh.scale.set(productWidth, productHeight);
                        // mesh.position.z = -0.01;
                        mesh.material.map = new THREE.TextureLoader().load("/api/images/" + mesh.userData.product.image, () => { this.handleDraw(this.index) });
                    }
                    else if (customRotate) {
                        mesh.rotation.set(0, 0, mesh.rotation._z + deg(90));

                    }
                    else if (custom && mesh.userData.oldProduct) {
                        mesh.userData.product = mesh.userData.oldProduct;
                        mesh.userData.oldProduct = area.product
                        mesh.material = mesh.material.clone();
                        // const productWidth = mesh.userData.product.size.width;
                        // const productHeight = mesh.userData.product.size.height;
                        // mesh.scale.set(productWidth, productHeight);
                        // mesh.position.z = 0;
                        mesh.material.map = new THREE.TextureLoader().load("/api/images/" + mesh.userData.product.image, () => { this.handleDraw(this.index) });
                    }
                    this.handleDraw(this.index)
                }
                else if (customRotate) {
                    mesh.rotation.set(0, 0, mesh.rotation.z + deg(90));
                    this.handleDraw(this.index)
                }
                else {
                    const { dispatch } = this.props;
                    dispatch({ type: types.NO_TITLE_SELECTED });
                }
            }
        }
    }
    handleRotateItem = () => {
        const { layout, areaIndex } = this.props;
        projector.unprojectVector(vector, camera);
    }
    render() {
        return (
            <canvas
                id="roomCanvas"
                className="room-canvas"
                style={{ cursor: 'unset' }}
                width={WIDTH}
                height={HEIGHT}
                onMouseMove={this.onMouseMove}
                onMouseLeave={this.onMouseLeave}
                onClick={this.onSelect}
            />
        );
    }
}

export default connect(({ app: { layout, areaIndex } }) => ({ layout, areaIndex }))(React.memo(ThreeJS))