import cloudinary from 'cloudinary';
import path from 'path';


cloudinary.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});
export const cloudUploader = async (file) => {
    return await new Promise(resolve => {
        cloudinary.v2.uploader.upload(
            file.path,
            { public_id: process.env.CLOUD_PATH + path.parse(file.filename).name },
            (err, result) => {
                if (result) {
                    return resolve(file.filename);
                }
                return resolve(null);
            })
    });
}
export const cloudDestroyer = async (file) => {
    return await new Promise(resolve => {
        cloudinary.v2.uploader.destroy(
            process.env.CLOUD_PATH + file,
            (err, result) => {
                if (result) {
                    return resolve(true);
                }
                return resolve(false);
            })
    });
}
export const cloudDestroys = async (files, callback) => {
    let clean = true;
    for (const file of files) {
        const cleanFile = await cloudDestroyer(file);
        if (!cleanFile) clean = false;
    }
    return callback(clean);
}

export default async (files, callback) => {
    const cloudFiles = [];
    for (const file of files) {
        const cloudFile = await cloudUploader(file);
        console.log(cloudFile)
        cloudFiles.push(cloudFile);
    }
    return callback(cloudFiles);
}