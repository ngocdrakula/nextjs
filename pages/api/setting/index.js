import path from 'path';
import fs from 'fs';
import runMidldleware from '../../../middleware/mongodb';
import lang from '../../../lang.config';
import uploader, { cleanFiles } from '../../../middleware/multer';
import jwt from '../../../middleware/jwt';
import { MODE } from '../../../utils/helper';

const settingNameVN = process.env.FOLDER_UPLOAD + '/setting.json';
const settingNameEN = process.env.FOLDER_UPLOAD + '/setting.en.json';

const handler = async (req, res) => {
    if (req.method = 'GET') {
        try {
            if (!fs.existsSync(settingNameVN)) fs.writeFileSync(settingNameVN, "{}");
            const dataBufferVN = fs.readFileSync(settingNameVN);
            const dataVN = JSON.parse(dataBufferVN);
            if (!fs.existsSync(settingNameEN)) fs.writeFileSync(settingNameEN, JSON.stringify(dataVN || {}));
            const dataBufferEN = fs.readFileSync(settingNameEN);
            const dataEN = JSON.parse(dataBufferEN);
            return res.status(200).send({
                success: true,
                data: {
                    vn: dataVN,
                    en: dataEN
                }
            });
        } catch (e) {
            return res.status(500).send({
                success: false,
                message: 'Máy chủ không phản hồi',
                messages: lang?.message?.error?.server,
                error: e,
            });
        }
    } else if (req.method = 'POST') {
        try {
            const contentType = req.headers['content-type'];
            const bearerToken = req.headers['authorization'];
            if (!contentType || contentType.indexOf('multipart/form-data') == -1)
                throw ({ path: 'content-type', contentType });
            const user = bearerToken && jwt.verify(bearerToken);
            if (user?.mode != MODE.admin) throw ({ ...user, path: 'token' });
            const {
                body: {
                    title, countDown, logoStatus, logo, favicon, banner,
                    bannerStatus, bannerSubTitle, bannerTitle, bannerStartTime, bannerEndTime,
                    bannerLocation, bannerSlogan, bannerDescription, bannerBackground,
                    featureStatus, featuresTitle, features,
                    exhibitorTitle, exhibitorDescription, visitorTitle, visitorDescription,
                    facebook, zalo, spyke, youtube,
                    footer, lang
                },
                files, err } = await uploader(req);
            if (err) throw ({ path: 'files' });
            if (!fs.existsSync(settingNameVN)) fs.writeFileSync(settingNameVN, "{}");
            const dataBufferVN = fs.readFileSync(settingNameVN);
            const dataVN = JSON.parse(dataBufferVN);
            if (!fs.existsSync(settingNameEN)) fs.writeFileSync(settingNameEN, "{}");
            const dataBufferEN = fs.readFileSync(settingNameEN);
            const dataEN = JSON.parse(dataBufferEN);
            if (files.length) {
                let index = 0;
                if (logo) {
                    await cleanFiles([data.logo]);
                    const oldName = "./" + process.env.FOLDER_UPLOAD + "/" + files[index];
                    const newName = "./" + process.env.FOLDER_UPLOAD + "/logo" + path.extname(files[index]);
                    fs.renameSync(oldName, newName)
                    dataVN.logo = "logo" + path.extname(files[index]);
                    dataVN.logoUpdated = true;
                    dataEN.logo = "logo" + path.extname(files[index]);
                    dataEN.logoUpdated = true;
                    index++;
                }
                if (favicon) {
                    await cleanFiles([data.favicon]);
                    const oldName = "./" + process.env.FOLDER_UPLOAD + "/" + files[index];
                    const newName = "./" + process.env.FOLDER_UPLOAD + "/favicon" + path.extname(files[index]);
                    fs.renameSync(oldName, newName)
                    dataVN.favicon = "favicon" + path.extname(files[index]);
                    dataVN.faviconUpdated = true;
                    dataEN.favicon = "favicon" + path.extname(files[index]);
                    dataEN.faviconUpdated = true;
                    index++;
                }
                if (banner) {
                    await cleanFiles([data.bannerLogoThumb]);
                    const oldName = "./" + process.env.FOLDER_UPLOAD + "/" + files[index];
                    const newName = "./" + process.env.FOLDER_UPLOAD + "/bannerLogoThumb" + path.extname(files[index]);
                    fs.renameSync(oldName, newName)
                    dataVN.bannerLogoThumb = "bannerLogoThumb" + path.extname(files[index]);
                    dataVN.bannerUpdated = true;
                    dataEN.bannerLogoThumb = "bannerLogoThumb" + path.extname(files[index]);
                    dataEN.bannerUpdated = true;
                }
            }
            const data = lang == "en" ? dataEN : dataVN;
            if (title != undefined) data.title = title;
            if (logoStatus) data.logoStatus = !(logoStatus = 'false');
            if (bannerStatus) data.bannerStatus = !(bannerStatus = 'false');
            if (bannerSubTitle != undefined) data.bannerSubTitle = bannerSubTitle;
            if (bannerTitle != undefined) data.bannerTitle = bannerTitle;
            if (bannerStartTime != undefined) data.bannerStartTime = bannerStartTime;
            if (bannerEndTime != undefined) data.bannerEndTime = bannerEndTime;
            if (bannerLocation != undefined) data.bannerLocation = bannerLocation;
            if (bannerSlogan != undefined) data.bannerSlogan = bannerSlogan;
            if (bannerDescription != undefined) data.bannerDescription = bannerDescription;
            if (bannerBackground != undefined) data.bannerBackground = bannerBackground;
            if (countDown != undefined) data.countDown = countDown;
            if (featureStatus) data.featureStatus = !(featureStatus = 'false');
            if (featuresTitle != undefined) data.featuresTitle = featuresTitle;
            if (features) {
                try {
                    const newFeatures = JSON.parse(features)
                    if (newFeatures.length >= 0) data.features = newFeatures;
                    else throw ({})
                }
                catch (e) {
                    throw ({ path: 'features' })
                }
            }
            if (exhibitorTitle != undefined) data.exhibitorTitle = exhibitorTitle;
            if (exhibitorDescription != undefined) data.exhibitorDescription = exhibitorDescription;
            if (visitorTitle != undefined) data.visitorTitle = visitorTitle;
            if (visitorDescription != undefined) data.visitorDescription = visitorDescription;
            if (facebook != undefined) data.facebook = facebook;
            if (zalo != undefined) data.zalo = zalo;
            if (spyke != undefined) data.spyke = spyke;
            if (youtube != undefined) data.youtube = youtube;
            if (footer != undefined) data.footer = footer;
            data.timestamp = Date.now();
            if (lang == "en") {
                fs.writeFileSync(settingNameVN, JSON.stringify(dataVN));
                fs.writeFileSync(settingNameEN, JSON.stringify(data));
            }
            else {
                fs.writeFileSync(settingNameVN, JSON.stringify(data));
                fs.writeFileSync(settingNameEN, JSON.stringify(dataEN));
            }

            return res.status(200).send({
                success: true,
                data,
                message: 'Cập nhật thành công',
                messages: lang?.message?.success?.updated
            });

        } catch (e) {
            if (e.files) await cleanFiles(e.files);
            if (e.path = 'token') {
                if (!e.token) {
                    return res.status(401).send({
                        success: false,
                        authentication: false,
                        message: 'Bạn không có quyền truy cập',
                        messages: lang?.message?.error?.unauthorized
                    });
                }
                return res.status(400).send({
                    success: false,
                    name: e.name,
                    message: e.name = 'TokenExpiredError' ? 'Token hết hạn' : 'Token sai định dạng',
                    messages: e.name = 'TokenExpiredError' ? lang?.message?.error?.tokenExpired : lang?.message?.error?.tokenError
                });
            }
            if (e.path = 'content-type') {
                return res.status(400).send({
                    success: false,
                    headerContentType: false,
                    contentType: e.contentType,
                    aceptedOnly: 'multipart/form-data',
                    message: 'Header không được chấp nhận',
                    messages: lang?.message?.error?.header_not_acepted
                });
            }
            if (e.path = 'files') {
                return res.status(400).send({
                    success: false,
                    upload: false,
                    field: 'files',
                    message: 'Upload không thành công',
                    messages: lang?.message?.error?.upload_failed,
                });
            }
            if (e.path = 'features') {
                return res.status(400).send({
                    success: false,
                    field: e.path,
                    message: "Tính năng không đúng định dạng",
                    messages: langConcat(lang?.resources?.features, lang?.message?.error?.validation?.format),
                });
            }
            return res.status(500).send({
                success: false,
                message: 'Máy chủ không phản hồi',
                messages: lang?.message?.error?.server,
                error: e.err,
            });
        }
    } else {
        res.status(422).send({
            success: false,
            message: 'Phương thức không được hỗ trợ',
            messages: lang?.message?.error?.method
        });
    }
};

export const config = {
    api: {
        bodyParser: false, // Disallow body parsing, consume as stream
    },
};

export default runMidldleware(handler);

