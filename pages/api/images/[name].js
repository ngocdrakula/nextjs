const http = require('http');
const fs = require('fs');

export default async function images(req, res) {
    const { width, height, name } = req.query;
    if (process.env.HOST_NAME == 'production' || process.env.HOST_NAME == 'localhost') {
        try {
            const file = fs.readFileSync(process.env.FOLDER_UPLOAD + "/" + name);
            return res.end(file, 'binary');
        }
        catch {
            res.status(404).send();
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