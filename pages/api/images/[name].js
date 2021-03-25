const http = require('http');
const fs = require('fs');

export default async function images(req, res) {
    if (process.env.HOST == 'localhost') {
        try {
            const file = fs.readFileSync(process.env.FOLDER_UPLOAD + "/" + req.query.name);
            return res.end(file, 'binary');
        }
        catch {
            res.status(404).send();
        }
    }
    return new Promise(resolve => {
        http.get(process.env.CLOUD_URL_ORIGIN + req.query.name, function (response) {
            if (response.statusCode == 200) {
                res.status(200);
                response.pipe(res);
            }
            else {
                return res.status(404).send();
            }
        });
    })
}