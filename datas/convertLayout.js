export const convertLayout = (room) => {
    const { surfaces } = room;
    const newRoom = {};
    newRoom.cameraFov = surfaces[0].cameraFov;
    newRoom.vertical = surfaces[0].viewVerticalOffset;
    newRoom.horizontal = surfaces[0].viewHorizontalOffset;
    newRoom.areas = surfaces.map(face => {
        return ({
            x: Number(face[1]),
            y: Number(face[2]),
            z: Number(face[3]),
            _x: Number(face[4]),
            _y: Number(face[5]),
            _z: Number(face[6]),
            width: Number(face[7]),
            height: Number(face[8]),
            scaleX: Number(face[9]),
            scaleY: Number(face[10]),
            hoverArea: face[11].map(m => {
                return { x: Number(m[0]), y: Number(m[1]) }
            }),
            type: face[176]
        })
    })
    return (newRoom);
}