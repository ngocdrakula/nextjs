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