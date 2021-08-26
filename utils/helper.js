export const PI = Math.PI;
export const deg = (a) => a * PI / 180;
export const sin = Math.sin;
export const sinD = (a) => Math.sin(deg(a));
export const cos = Math.cos;
export const cosD = (a) => Math.cos(deg(a));
export const tan = Math.tan;
export const tanD = (a) => Math.tan(deg(a));

export const createFormData = (data) => {
    const { files = [], imageType, ...body } = data;
    const formData = new FormData();
    for (const file of files) {
        formData.append('files', file, file.name || `File-${Math.floor(Math.random() * 10000)}.${imageType || 'png'}`);
    }
    for (const field in body) {
        formData.append(field, body[field]);
    }
    return formData;
};

export const getThumbnail = (product, maxSize = 100) => {
    const rate = product.size.width / product.size.height;
    return product.image
        + "?width=" + (rate > 1 ? maxSize : Math.floor(maxSize * rate))
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

export const convertLayoutClient = (surfaces) => {
    const newRoom = {};
    newRoom.cameraFov = Number(surfaces[0]?.cameraFov) || 0;
    newRoom.vertical = Number(surfaces[0]?.viewVerticalOffset) || 0;
    newRoom.horizontal = Number(surfaces[0]?.viewHorizontalOffset) || 0;
    const areas = surfaces.map(face => {
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
    });
    newRoom.areas = JSON.stringify(areas)
    return (newRoom);
}
export const getQuery = (url) => {
    if (typeof url !== "string") return ({})
    const queryStringAll = url?.split('#');
    if (!queryStringAll[0]) return ({})
    const queryString = queryStringAll[0].split('?');
    if (!queryString[1]) return ({})
    const queryArray = queryString[1].split('&');
    const query = {};
    queryArray.map(item => {
        const queryItem = item.split('=');
        if (queryItem[0]) query[queryItem[0]] = queryItem[1];
    });
    return query
}
export const MODE = {
    visitor: 0,
    exhibitor: 1,
    admin: 2
}
export const FORM = {
    visitor: 0,
    exhibitor: 1,
    admin: 2
}
export const getTime = (timeString) => {
    var now = new Date();
    var nY = now.getFullYear();
    var nM = now.getMonth();
    var nD = now.getDate();
    var nH = now.getHours();
    var nP = now.getMinutes();
    var time = new Date(timeString);
    var tY = time.getFullYear();
    var tM = time.getMonth();
    var tD = time.getDate();
    var tDay = time.getDay();
    var tH = time.getHours();
    var tP = time.getMinutes();
    var tS = time.getSeconds();
    var weekday = ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
    var At = [];
    if (nY > tY) {
        At[0] = `${tD < 10 ? "0" + tD : tD} tháng ${(tM + 1) < 10 ? "0" + (tM + 1) : (tM + 1)} năm ${tY}`;
    }
    else {
        if (nM > tM) {
            At[0] = `${tD < 10 ? "0" + tD : tD} tháng ${(tM + 1) < 10 ? "0" + (tM + 1) : (tM + 1)}`;
        }
        else {
            if (nD > tD + 6) {
                At[0] = `${tD < 10 ? "0" + tD : tD} tháng ${(tM + 1) < 10 ? "0" + (tM + 1) : (tM + 1)} lúc ${tH < 10 ? "0" + tH : tH}:${tP < 10 ? "0" + tP : tP}`;
            }
            else {
                if (nD > tD + 1) {
                    At[0] = `${weekday[tDay]}`;
                }
                else {
                    if (nD > tD) {
                        At[0] = `Hôm qua`;
                    }
                    else {
                        if (nH > tH) {
                            At[0] = `${nH - tH} giờ`;
                        }
                        else {
                            if (nP > tP) {
                                At[0] = `${nP - tP} phút`;
                            }
                            else {
                                At[0] = `Vừa xong`;
                            }
                        }
                    }
                }
            }
        }
    }
    var thickness = (Date.parse(now) - Date.parse(time)) / 1000;
    if (thickness < 60) {
        At[1] = 'Vừa xong';
    }
    else {
        thickness = thickness / 60;
        if (thickness < 60) {
            At[1] = Math.floor(thickness) + ' phút trước';
        }
        else {
            thickness = thickness / 60;
            if (thickness < 24) {
                At[1] = Math.floor(thickness) + ' giờ trước';
            }
            else {
                thickness = thickness / 24;
                if (thickness < 30) {
                    At[1] = Math.floor(thickness) + ' ngày trước';
                }
                else {
                    thickness = thickness / 30;
                    if (thickness < 12) {
                        At[1] = Math.floor(thickness) + ' tháng trước';
                    }
                    else {
                        thickness = thickness * 30 / 365;
                        At[1] = Math.floor(thickness) + ' năm trước';
                    }
                }
            }
        }
    }
    At[2] = `${weekday[tDay]}, ${tD < 10 ? "0" + tD : tD} tháng ${(tM + 1) < 10 ? "0" + (tM + 1) : tM + 1} năm ${tY} lúc ${tH < 10 ? "0" + tH : tH}:${tP < 10 ? "0" + tP : tP}:${tS < 10 ? "0" + tS : tS}`
    At[3] = `${tH < 10 ? "0" + tH : tH}:${tP < 10 ? "0" + tP : tP}${((tD - nD) || (tM - nM) || (tY - nY)) ? ", " + (tD < 10 ? "0" + tD : tD) + "/" + ((tM + 1) < 10 ? "0" + (tM + 1) : (tM + 1)) : ""}${(tY - nY) ? "/" + tY : ""}`;
    At[4] = {
        Year: tY,
        Month: (tM + 1) < 10 ? "0" + (tM + 1) : tM + 1,
        Day: tD < 10 ? "0" + tD : tD,
        Hour: tH < 10 ? "0" + tH : tH,
        Minute: tP < 10 ? "0" + tP : tP,
        Secon: tS < 10 ? "0" + tS : tS
    }
    return (At);
}
export const formatTime = (timeString, format) => {
    if (timeString) {
        var timeObject = getTime(timeString)[4];
        var newTimeString = format.replace(/YYYY/g, timeObject.Year);
        newTimeString = newTimeString.replace(/MM/g, timeObject.Month);
        newTimeString = newTimeString.replace(/DD/g, timeObject.Day);
        newTimeString = newTimeString.replace(/HH/g, timeObject.Hour);
        newTimeString = newTimeString.replace(/II/g, timeObject.Minute);
        newTimeString = newTimeString.replace(/SS/g, timeObject.Secon);
        return (newTimeString)
    }
    else {
        return ("");
    }
}