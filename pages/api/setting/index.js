import path from 'path';
import fs from 'fs';
import runMidldleware from '../../../middleware/mongodb';
import lang, { langConcat } from '../../../lang.config';
import uploader, { cleanFiles } from '../../../middleware/multer';
import jwt from '../../../middleware/jwt';
import { MODE } from '../../../utils/helper';
const settingName = 'setting.json'

const handler = async (req, res) => {
    if (req.method == 'GET') {
        try {
            if (!fs.existsSync(settingName)) fs.writeFileSync(settingName, "{}");
            const dataBuffer = fs.readFileSync(settingName);
            const data = JSON.parse(dataBuffer);
            return res.status(200).send({
                success: true,
                data,
            });
        } catch (e) {
            return res.status(500).send({
                success: false,
                message: e.message,
                messages: lang?.message?.error?.server,
                error: e,
            });
        }
    } else if (req.method == 'POST') {
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
                    bannerLocation, bannerSlogan, bannerDescription, bannerBackground, featuresTitle, features,
                    exhibitorTitle, exhibitorDescription, visitorTitle, visitorDescription
                },
                files, err } = await uploader(req);
            if (err) throw ({ path: 'files' });
            if (!fs.existsSync(settingName)) fs.writeFileSync(settingName, "{}");
            const dataBuffer = fs.readFileSync(settingName);
            const data = JSON.parse(dataBuffer);
            if (files.length) {
                let index = 0;
                if (logo) {
                    await cleanFiles([data.logo]);
                    const oldName = "./" + process.env.FOLDER_UPLOAD + "/" + files[index];
                    const newName = "./" + process.env.FOLDER_UPLOAD + "/logo" + path.extname(files[index]);
                    fs.renameSync(oldName, newName)
                    data.logo = "logo" + path.extname(files[index]);
                    data.logoUpdated = true;
                    index++;
                }
                if (favicon) {
                    await cleanFiles([data.favicon]);
                    const oldName = "./" + process.env.FOLDER_UPLOAD + "/" + files[index];
                    const newName = "./" + process.env.FOLDER_UPLOAD + "/favicon" + path.extname(files[index]);
                    fs.renameSync(oldName, newName)
                    data.favicon = "favicon" + path.extname(files[index]);
                    data.faviconUpdated = true;
                    index++;
                }
                if (banner) {
                    await cleanFiles([data.bannerLogoThumb]);
                    const oldName = "./" + process.env.FOLDER_UPLOAD + "/" + files[index];
                    const newName = "./" + process.env.FOLDER_UPLOAD + "/bannerLogoThumb" + path.extname(files[index]);
                    fs.renameSync(oldName, newName)
                    data.bannerLogoThumb = "bannerLogoThumb" + path.extname(files[index]);
                    data.bannerUpdated = true;
                }
            }
            if (title !== undefined) data.title = title;
            if (logoStatus) data.logoStatus = !(logoStatus == 'false');
            if (countDown !== undefined) data.countDown = countDown;
            if (bannerStatus) data.bannerStatus = !(bannerStatus == 'false');
            if (bannerSubTitle !== undefined) data.bannerSubTitle = bannerSubTitle;
            if (bannerTitle !== undefined) data.bannerTitle = bannerTitle;
            if (bannerStartTime !== undefined) data.bannerStartTime = bannerStartTime;
            if (bannerEndTime !== undefined) data.bannerEndTime = bannerEndTime;
            if (bannerLocation !== undefined) data.bannerLocation = bannerLocation;
            if (bannerSlogan !== undefined) data.bannerSlogan = bannerSlogan;
            if (bannerDescription !== undefined) data.bannerDescription = bannerDescription;
            if (bannerBackground !== undefined) data.bannerBackground = bannerBackground;
            if (featuresTitle !== undefined) data.featuresTitle = featuresTitle;
            if (features !== undefined) data.features = features;
            if (exhibitorTitle !== undefined) data.exhibitorTitle = exhibitorTitle;
            if (exhibitorDescription !== undefined) data.exhibitorDescription = exhibitorDescription;
            if (visitorTitle !== undefined) data.visitorTitle = visitorTitle;
            if (visitorDescription !== undefined) data.visitorDescription = visitorDescription;

            fs.writeFileSync(settingName, JSON.stringify(data));

            return res.status(401).send({
                success: true,
                data,
                message: 'Cập nhật thành công',
                messages: lang?.message?.success?.updated
            });

        } catch (e) {
            if (e.files) await cleanFiles(e.files);
            if (e.path == 'token') {
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
                    message: e.name == 'TokenExpiredError' ? 'Token hết hạn' : 'Token sai định dạng',
                    messages: e.name == 'TokenExpiredError' ? lang?.message?.error?.tokenExpired : lang?.message?.error?.tokenError
                });
            }
            if (e.path == 'content-type') {
                return res.status(400).send({
                    success: false,
                    headerContentType: false,
                    contentType: e.contentType,
                    aceptedOnly: 'multipart/form-data',
                    message: 'Header không được chấp nhận',
                    messages: lang?.message?.error?.header_not_acepted
                });
            }
            if (e.path == 'files') {
                return res.status(400).send({
                    success: false,
                    upload: false,
                    field: 'files',
                    message: 'Upload không thành công',
                    messages: lang?.message?.error?.upload_failed,
                });
            }
            if (e.path == 'email') {
                return res.status(400).send({
                    success: false,
                    field: e.path,
                    exist: true,
                    message: "Email đã tồn tại",
                });
            }
            if (e.path == 'industry') {
                return res.status(400).send({
                    success: false,
                    require: true,
                    field: e.path,
                    message: "Ngành nghề là bắt buộc",
                });
            }
            if (e.path == '_id') {
                return res.status(400).send({
                    success: false,
                    exist: true,
                    field: e.path,
                    message: "Tài khoản không tồn tại",
                });
            }
            if (e.path == 'industry') {
                return res.status(400).send({
                    success: false,
                    exist: true,
                    field: e.path,
                    message: "Ngành nghề không tồn tại",
                });
            }
            if (e.path == 'phone') {
                return res.status(400).send({
                    success: false,
                    require: true,
                    field: e.path,
                    message: "Số điện thoại là bắt buộc",
                });
            }
            if (e.path == 'representative') {
                return res.status(400).send({
                    success: false,
                    require: true,
                    field: e.path,
                    message: "Người đại diện là bắt buộc",
                });
            }
            if (e.path == 'position') {
                return res.status(400).send({
                    success: false,
                    require: true,
                    field: e.path,
                    message: "Chức vụ người đại diện là bắt buộc",
                });
            }
            if (e.path == 'mobile') {
                return res.status(400).send({
                    success: false,
                    require: true,
                    field: e.path,
                    message: "Số điện thoại người đại diện là bắt buộc",
                });
            }
            if (e.path == 're_email') {
                return res.status(400).send({
                    success: false,
                    require: true,
                    field: e.path,
                    message: "Email người đại diện là bắt buộc",
                });
            }
            return res.status(500).send({
                success: false,
                message: 'Máy chủ không phản hồi',
                messages: lang?.message?.error?.server,
                error: e.err,
            });
        }
    } else if (req.method == 'DELETE') {
        try {
            const bearerToken = req.headers['authorization'];
            if (!bearerToken) throw ({ path: 'token' })
            const user = jwt.verify(bearerToken);
            if (user?.mode != MODE.admin) throw ({ ...user, path: 'token' });
            const userCurrent = await userController.get(req.query.id);
            if (!userCurrent) throw ({ path: '_id' });
            cleanFiles([userCurrent.image, userCurrent.image])
            userCurrent.remove();
            return res.status(200).send({
                success: true,
                data: null,
                message: 'Xóa thành công',
                messages: lang?.message?.success?.deleted
            });
        } catch (e) {
            if (e.path == 'token') {
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
                    message: e.name == 'TokenExpiredError' ? 'Token hết hạn' : 'Token sai định dạng',
                    messages: e.name == 'TokenExpiredError' ? lang?.message?.error?.tokenExpired : lang?.message?.error?.tokenError
                });
            }
            if (e.path == '_id') {
                return res.status(400).send({
                    success: false,
                    exist: false,
                    message: "Tài khoản tồn tại hoặc đã bị xóa",
                    messages: langConcat(lang?.resources?.product, lang?.message?.error?.validation?.not_exist),
                });
            }
            return res.status(500).send({
                success: false,
                message: 'Máy chủ không phản hồi',
                messages: lang?.message?.error?.server,
                error: e,
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

