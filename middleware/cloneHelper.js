import https from 'https';
import http from 'http';
import fs from 'fs';


export async function downloadImageFromUrl(url) {
    const rd1 = Math.floor(Math.random() * 10000), rd2 = Math.floor(Math.random() * 10000);
    const filename = Date.now() + "_" + rd1 + "_" + rd2 + ".png";
    const file = fs.createWriteStream(process.env.FOLDER_UPLOAD + "/" + filename);
    try {
        const options = {
            timeout: 10000
        };
        if (!(url + "").search("https"))
            return new Promise(resolve => {
                const request = https.get(url, options, function (response) {
                    if (response.statusCode === 200) {
                        response.pipe(file)
                            .on('close', () => resolve(filename))
                            .on('error', () => resolve(null));

                    }
                    else {
                        return (resolve(null))
                    }
                });
            })
        else if (!(url + "").search("http"))
            return new Promise(resolve => {
                const request = http.get(url, options, function (response) {
                    if (response.statusCode === 200) {
                        response.pipe(file)
                            .on('close', () => resolve(filename))
                            .on('error', () => resolve(null));
                    }
                    else {
                        return (resolve(null))
                    }
                });
            })
    } catch (e) { return (null) }
}

export async function getDataFromUrl(url) {
    try {
        const options = {
            timeout: 5000
        };
        if (!(url + "").search("https")) {
            return new Promise((resolve, reject) => {
                https.get(url, options, res => {
                    res.setEncoding('utf8');
                    let body = '';
                    res.on('data', chunk => body += chunk);
                    res.on('end', () => {
                        try {
                            const data = JSON.parse(body);
                            resolve(data)
                        }
                        catch { resolve(body) }
                    });
                }).on('error', reject);
            });
        }
        else if (!(url + "").search("http"))
            return new Promise((resolve, reject) => {
                http.get(url, options, res => {
                    res.setEncoding('utf8');
                    let body = '';
                    res.on('data', chunk => body += chunk);
                    res.on('end', () => {
                        try {
                            const data = JSON.parse(body);
                            resolve(data)
                        }
                        catch { resolve(body) }
                    });
                }).on('error', reject);
            });
    } catch (e) { }
}