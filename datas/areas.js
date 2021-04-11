const areas = {
    _id: 1,
    name: "Phòng khách 1",
    type: "livingroom",
    images: ["/temps/3.tranparent.png", "/temps/3.bong.png", "/temps/3.no.png"],
    faces: [
        {
            gX: -32.1,
            gY: -16.8,
            gZ: 0,
            g_X: 0,
            g_Y: 0,
            g_Z: 0,
            width: 5000,
            height: 5000,
            scaleX: 13.9,
            scaleY: 13.9,
            hoverArea: [
                { x: 247, y: 0 },
                { x: 1303, y: 0 },
                { x: 1303, y: 566 },
                { x: 236, y: 566 },
                { x: 247, y: 0 }
            ],
            type: 'wall'
        },
        {
            gX: 29.9,
            gY: -16.8,
            gZ: 0,
            g_X: 0,
            g_Y: -87.5,
            g_Z: 0,
            width: 4000,
            height: 4000,
            scaleX: 13.9,
            scaleY: 13.9,
            hoverArea: [
                { x: 1303, y: 0 },
                { x: 1600, y: 0 },
                { x: 1600, y: 571 },
                { x: 1303, y: 430 },
                { x: 1303, y: 0 }
            ],
            type: 'wall'
        },
        {
            gX: -32.1,
            gY: -16.5,
            gZ: 0,
            g_X: -90.7,
            g_Y: 0,
            g_Z: 0,
            width: 5000,
            height: 5000,
            scaleX: 13.9,
            scaleY: 13.9,
            hoverArea: [
                { x: 230, y: 566 },
                { x: 1082, y: 566 },
                { x: 1209, y: 801 },
                { x: 1600, y: 812 },
                { x: 1600, y: 900 },
                { x: 0, y: 900 },
                { x: 0, y: 677 }
            ],
            type: 'floor'
        }
    ],
    cameraFov: 40,
    viewVerticalOffset: -163,
    viewHorizontalOffset: 0
}

const co = {
    w: 13.9,
    h: 13.9,
    x: 0,
    y: 10.3,
    z: 12.8,
    _x: 0,
    _y: 0,
    _z: 0
};
export default areas