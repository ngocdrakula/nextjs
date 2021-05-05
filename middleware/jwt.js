import jwt from 'jsonwebtoken';

export const secret = 'visualizerjwtsecret';
export const expiresIn = 24 * 60 * 60;

export const create = data => jwt.sign(data, secret, { expiresIn });

export const get = (bearerToken) => bearerToken && bearerToken.split(' ')[1];

export const verify = bearerToken => {
    try {
        const user = jwt.verify(get(bearerToken), secret);
        return user
    } catch (err) {
        return err
    }
};

export default { create, get, verify }