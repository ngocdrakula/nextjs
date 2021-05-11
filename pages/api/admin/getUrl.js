import https from 'https';
import http from 'http';
import runMidldleware from '../../../middleware/mongodb';

const handler = async (req, res) => {
    const { url } = req.query;
    try {
        const options = {
            timeout: 10000
        };
        if (!(url + "").search("https"))
            return new Promise(resolve => {
                const request = https.request(url, options, function (response) {
                    if (response.statusCode == 200) {
                        res.writeHead(200, response.headers)
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
                request.setTimeout(10000, function () {
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
                request.setTimeout(10000, function () {
                    return res.status(404).send();
                });
            })
        return res.status(404).send();
    } catch (e) {
        return res.status(404).send();
    }
}

export default runMidldleware(handler);
