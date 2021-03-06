import multer from 'multer';
import path from 'path';
import fs from 'fs';


const diskStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, process.env.FOLDER_UPLOAD);
    },
    filename: (req, file, callback) => {
        const match = ["image/png", "image/jpeg", "image/gif", "image/x-icon"];
        if (match.indexOf(file.mimetype) == -1) {
            const errorMess = "This type file is not allowed";
            return callback(errorMess, null);
        }
        const rd1 = Math.floor(Math.random() * 10000), rd2 = Math.floor(Math.random() * 10000);
        const filename = Date.now() + "_" + rd1 + "_" + rd2 + path.extname(file.originalname).toLowerCase();
        callback(null, filename);
    }
});
const multerUpload = multer({
    storage: diskStorage,
    limits: { fileSize: process.env.FILE_SIZE_LIMIT }
});

export const multerDestroys = (files) => {
    files.map(file => {
        try {
            fs.unlinkSync(process.env.FOLDER_UPLOAD + "/" + file);
        } catch (err) { }
    });
    return true
}

export const cleanFiles = async (files) => {
    return new Promise(resolve => {
        return resolve(multerDestroys(files));
    });
}

export default async (req) => {
    return new Promise(resolve => {
        multerUpload.array("files", 5)(req, {}, err => {
            if (err || !req.files) {
                return resolve({ err, body: req.body, files: [] });
            }
            const files = req.files.map(({ filename }) => filename);
            return resolve({ err, body: req.body, files });
        });
    });
}