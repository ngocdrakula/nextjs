import bcrypt from 'bcrypt';

const saltRounds = 10;

export const compare = async (password, hash) => {
    return new Promise(resolve => {
        bcrypt.compare(password, hash, (err, result) => resolve(result));
    })
}
export const create = async (password) => {
    return new Promise(resolve => {
        bcrypt.hash(password, saltRounds, function (err, hash) {
            if (err) return resolve();
            return resolve(hash)
        });

    })
}
export default { compare, create }