import multer from 'multer';
import path from 'path';


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
        callback(null, file.originalname.toLowerCase());
    }
});
const multerUpload = multer({
    storage: diskStorage,
    limits: { fileSize: process.env.FILE_SIZE_LIMIT }
});

export default async (req) => {
    return new Promise(resolve => {
        multerUpload.single("file")(req, {}, err => {
            if (err || !req.file) {
                return resolve({ err, file: null });
            }
            return resolve({ err, file: req.file });
        });
    });
}