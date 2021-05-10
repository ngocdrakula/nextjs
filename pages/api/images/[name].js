import http from 'http';
import path from 'path';
import sharp from 'sharp';
import fs from 'fs';

export default async function images(req, res) {
    const { width, height, name } = req.query;
    if (process.env.HOST_NAME == 'production' || process.env.HOST_NAME == 'localhost') {
        try {
            const file = fs.readFileSync(process.env.FOLDER_UPLOAD + "/" + name);
            res.writeHead(200, { 'Content-Type': 'image/jpeg' });
            if (Number(width) && Number(height)) {
                const thumbnailFolder = `./${process.env.FOLDER_UPLOAD}/thumbnail/`;
                const cropedPath = `${thumbnailFolder + path.basename(name, path.extname(name))}-${width}-${height + path.extname(name)}`;
                if (!fs.existsSync(cropedPath)) {
                    if (!fs.existsSync(thumbnailFolder)) fs.mkdirSync(thumbnailFolder);
                    await sharp(file).resize(Number(width), Number(height)).toFile(cropedPath);
                }
                const imageCroped = fs.readFileSync(cropedPath);
                return res.end(imageCroped);
            }
            return res.end(file);
        }
        catch (e) {
            return res.status(404).send();
        }
    }
    return new Promise(resolve => {
        http.get(process.env.CLOUD_URL_ORIGIN + name, function (response) {
            if (response.statusCode == 200) {
                res.status(200);
                return response.pipe(res);
            }
            else {
                return res.status(404).send();
            }
        });
    })
}