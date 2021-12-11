export const PI = Math.PI;
export const deg = (a) => a * PI / 180;
export const sin = Math.sin;
export const sinD = (a) => Math.sin(deg(a));
export const cos = Math.cos;
export const cosD = (a) => Math.cos(deg(a));
export const tan = Math.tan;
export const tanD = (a) => Math.tan(deg(a));
export const weekday = ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];

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
    const now = new Date();
    const nY = now.getFullYear();
    const nM = now.getMonth();
    const nD = now.getDate();
    const nH = now.getHours();
    const nP = now.getMinutes();
    const time = new Date(timeString);
    const tY = time.getFullYear();
    const tM = time.getMonth();
    const tD = time.getDate();
    const tDay = time.getDay();
    const tH = time.getHours();
    const tP = time.getMinutes();
    const tS = time.getSeconds();
    const At = [];
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
    let thickness = (Date.parse(now) - Date.parse(time)) / 1000;
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
        Second: tS < 10 ? "0" + tS : tS,
        Week: weekday[tDay]
    }
    return (At);
}
export const formatTime = (timeString, format) => {
    if (timeString) {
        const timeObject = getTime(timeString)[4];
        let newTimeString = format.replace(/YYYY/g, timeObject.Year);
        newTimeString = newTimeString.replace(/YY/g, timeObject.Year % 100);
        newTimeString = newTimeString.replace(/MM/g, timeObject.Month);
        newTimeString = newTimeString.replace(/DD/g, timeObject.Day);
        newTimeString = newTimeString.replace(/HH/g, timeObject.Hour);
        newTimeString = newTimeString.replace(/II/g, timeObject.Minute);
        newTimeString = newTimeString.replace(/SS/g, timeObject.Second);
        newTimeString = newTimeString.replace(/Week/g, timeObject.Week);
        return (newTimeString)
    }
    else {
        return ("");
    }
}
export const setCookie = (name, value, days) => {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}
export const getCookie = (name) => {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}
export const deleteCookie = (name) => {
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}
export const nonAccentVietnamese = (str) => {
    if (!str) return (str);
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    // Some system encode vietnamese combining accent as individual utf-8 characters
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng 
    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư
    return str;
}