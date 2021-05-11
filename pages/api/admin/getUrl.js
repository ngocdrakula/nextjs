import https from 'https';
import http from 'http';

export default async function getUrl(req, res) {
    const { url } = req.query;
    try {
        const options = {
            timeout: 3000
        };
        if (!(url + "").search("https"))
            return new Promise(resolve => {
                const request = https.request(url, options, function (response) {
                    if (response.statusCode == 200) {
                        res.writeHead(200, {
                            'Content-Type': response.headers['content-type'],
                            'Content-Length': response.headers['content-length']
                        })
                        return response.pipe(res);
                    }
                    else {
                        return res.status(404).send();
                    }
                });
                request.end();
                request.on('error', function (e) {
                    return res.status(404).send();
                });
                request.setTimeout(3000, function () {
                    return res.status(404).send();
                });
            })
        else if (!(url + "").search("http"))
            return new Promise(resolve => {
                const request = http.request(url, options, function (response) {
                    if (response.statusCode == 200) {
                        res.status(200);
                        return response.pipe(res);
                    }
                    else {
                        return res.status(404).send();
                    }
                });
                request.end();
                request.on('error', function (e) {
                    return res.status(404).send();
                });
                request.setTimeout(3000, function () {
                    return res.status(404).send();
                });
            })
        return res.status(404).send();
    } catch (e) {
        return res.status(404).send();
    }
}