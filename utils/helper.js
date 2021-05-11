export const PI = Math.PI;
export const deg = (a) => a * PI / 180;
export const sin = Math.sin;
export const sinD = (a) => Math.sin(deg(a));
export const cos = Math.cos;
export const cosD = (a) => Math.cos(deg(a));
export const tan = Math.tan;
export const tanD = (a) => Math.tan(deg(a));

export const createFormData = (data) => {
    const { files = [], ...body } = data;
    const formData = new FormData();
    for (const file of files) {
        formData.append('files', file);
    }
    for (const field in body) {
        formData.append(field, body[field]);
    }
    return formData;
};
export const getThumbnail = (product, maxSize = 100) => {
    const rate = product.size.width / product.size.height;
    return product.image
        + "?width=" + (rate > 1 ? maxSize : Math.floor(maxSize / rate))
        + "&height=" + (rate > 1 ? Math.floor(maxSize / rate) : maxSize);
}
export const convertLayout = (surfaces) => {
    const newRoom = {};
    newRoom.cameraFov = Number(surfaces[0]?.cameraFov) || 0;
    newRoom.vertical = Number(surfaces[0]?.viewVerticalOffset) || 0;
    newRoom.horizontal = Number(surfaces[0]?.viewHorizontalOffset) || 0;
    newRoom.areas = surfaces.map(face => {
        return ({
            x: Number(face[1]) || 0,
            y: Number(face[2]) || 0,
            z: Number(face[3]) || 0,
            _x: Number(face[4]) || 0,
            _y: Number(face[5]) || 0,
            _z: Number(face[6]) || 0,
            width: Number(face[7]) || 0,
            height: Number(face[8]) || 0,
            scaleX: Number(face[9]) || 0,
            scaleY: Number(face[10]) || 0,
            hoverArea: face[11].map(m => {
                return { x: Number(m[0]) || 0, y: Number(m[1]) || 0 }
            }),
            type: face[176]
        })
    })
    return (newRoom);
}