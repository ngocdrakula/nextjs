import runMidldleware from '../../../middleware/mongodb';
import userController from '../../../controllers/user';
import industryController from '../../../controllers/industry';
import lang, { langConcat } from '../../../lang.config';
import jwt from '../../../middleware/jwt';
import bcrypt from '../../../middleware/bcrypt';
import { MODE, nonAccentVietnamese } from '../../../utils/helper';

const handler = async (req, res) => {
    if (req.method == 'GET') {
        try {
            if (req.query.search) {
                const list = await userController.getlist();
                for (let user of list) {
                    user.search = nonAccentVietnamese(user.name);
                    user.searchs = {
                        vn: nonAccentVietnamese(user.names.vn),
                        en: nonAccentVietnamese(user.names.en)
                    };
                    await user.save();
                }
                return res.status(200).send({
                    success: true,
                    data: list,
                });
            }
            const { page, pageSize = 100, enabled, mode, name, industry, sort, lang } = req.query;
            const query = {};
            if (enabled) query.enabled = !(enabled == "false");
            if (mode != undefined) query.mode = Number(mode);
            if (industry) query.industry = { $in: industry.split(',') };
            if (name) {
                if (lang == "en") {
                    query["searchs.en"] = { $in: nonAccentVietnamese(name).split(" ").filter(i => i).map(i => new RegExp(i, "i")) };
                }
                else {
                    query.search = { $in: nonAccentVietnamese(name).split(" ").filter(i => i).map(i => new RegExp(i, "i")) };
                }
            }
            const sortObj = {};
            if (sort == 'name') {
                if (lang == "en") { sortObj[searchs.en] = 1; }
                else { sortObj.name = 1; }
            }
            else if (sort == 'namereverse') {
                if (lang == "en") { sortObj[searchs.en] = -1; }
                else { sortObj.name = -1; }
            }
            else sortObj.createdAt = -1;
            const skip = Number(page * pageSize) || 0;
            const limit = Number(pageSize) || 0;
            const total = await userController.getlist(query).countDocuments();
            const list = await userController.getlist(query).populate('industry').skip(skip).sort(sortObj).limit(limit);
            const now = new Date();
            now.setDate(now.getDate() - 30);
            const queryNew = { createdAt: { $gte: now } }
            const totalNew = await userController.getlist(queryNew).countDocuments();
            return res.status(200).send({
                success: true,
                data: list,
                total,
                totalNew,
                query,
                page: Number(page) || 0,
                pageSize: Number(pageSize) || 0
            });
        } catch (error) {
            return res.status(500).send({
                success: false,
                message: 'Máy chủ không phản hồi',
                messages: lang?.message?.error?.server,
                error: error,
            });
        }
    } else if (req.method == 'POST') {
        try {
            const bearerToken = req.headers['authorization'];
            const user = bearerToken && jwt.verify(bearerToken);
            if (user?.mode != MODE.admin) throw ({ path: 'token' });
            const {
                email, password, name, phone, industry, address,
                hotline, fax, representative, position, mobile, re_email, website, introduce,
                product, contact, mode, enabled,
                nameEN, positionEN, representativeEN, addressEN, introduceEN, contactEN, productEN,
            } = req.body;
            if (!email) throw ({ path: 'email', required: true });
            if (!password) throw ({ path: 'password', required: true });
            if (!name) throw ({ path: 'name', required: true });
            if (!phone) throw ({ path: 'phone', required: true });
            if (!industry) throw ({ path: 'industry', required: true });
            if (mode == MODE.exhibitor) {
                if (!address) throw ({ path: 'address', required: true });
                if (!representative) throw ({ path: 'representative', required: true });
                if (!position) throw ({ path: 'position', required: true });
                if (!mobile) throw ({ path: 'mobile', required: true });
                if (!re_email) throw ({ path: 're_email', required: true });
            }
            const userCurrent = await userController.find({ email });
            if (userCurrent) throw ({ path: 'user' });
            const hash = await bcrypt.create(password);
            try {
                const currentIndustry = await industryController.get(industry);
                if (!currentIndustry) throw ({ path: '_id' })
            }
            catch (e) { throw ({ path: '_id' }); };
            const userInfo = {
                password: hash,
                email, phone, mode, industry: [industry],
                name, names: { vn: name, en: nameEN || name },
                address, addresss: { vn: address, en: addressEN || address },
                search: nonAccentVietnamese(name), searchs: { vn: nonAccentVietnamese(name), en: nonAccentVietnamese(nameEN || name) },
                hotline, fax, mobile, re_email, website,
                representative, representatives: { vn: representative, en: representativeEN || representative },
                position, positions: { vn: position, en: positionEN || position },
                introduce, introduces: { vn: introduce, en: introduceEN || introduce },
                product, products: { vn: product, en: productEN || product },
                contact, contacts: { vn: contact, en: contactEN || contact },
                enabled
            };
            const userCreated = await userController.create(userInfo);
            const { _id, names } = userCreated;
            const token = jwt.create({ email, _id, name, names, mode });
            return res.status(201).send({
                success: true,
                token,
                data: { email, _id, name, names, mode },
                message: 'Tạo tài khoản thành công',
                messages: lang?.message?.success?.created
            });
        } catch (e) {
            console.log(e)
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
            if (e.path == 'email') {
                return res.status(400).send({
                    success: false,
                    required: false,
                    field: e.path,
                    message: 'Email không được để trống',
                    messages: langConcat(lang?.resources?.email, lang?.message?.error?.validation?.required),
                });
            }
            if (e.path == 'password') {
                return res.status(400).send({
                    success: false,
                    required: false,
                    field: e.path,
                    message: 'Mật khẩu không được để trống',
                    messages: langConcat(lang?.resources?.password, lang?.message?.error?.validation?.required),
                });
            }
            if (e.path == 'user') {
                return res.status(400).send({
                    field: 'email',
                    success: false,
                    exist: true,
                    message: "Email đã tồn tại",
                    messages: langConcat(lang?.resources?.email, lang?.message?.error?.validation?.exist),
                });
            }
            if (e.path == 'industry') {
                return res.status(400).send({
                    success: false,
                    require: true,
                    field: e.path,
                    message: "Ngành nghề là bắt buộc",
                    messages: langConcat(lang?.resources?.industry, lang?.message?.error?.validation?.required),
                });
            }
            if (e.path == '_id') {
                return res.status(400).send({
                    success: false,
                    exist: true,
                    field: e.path,
                    message: "Ngành nghề không tồn tại",
                    messages: langConcat(lang?.resources?.industry, lang?.message?.error?.validation?.not_exist),
                });
            }
            if (e.path == 'phone') {
                return res.status(400).send({
                    success: false,
                    require: true,
                    field: e.path,
                    message: "Số điện thoại là bắt buộc",
                    messages: langConcat(lang?.resources?.phone, lang?.message?.error?.validation?.required),
                });
            }
            if (e.path == 'representative') {
                return res.status(400).send({
                    success: false,
                    require: true,
                    field: e.path,
                    message: "Người đại diện là bắt buộc",
                    messages: langConcat(lang?.resources?.representative, lang?.message?.error?.validation?.required),
                });
            }
            if (e.path == 'position') {
                return res.status(400).send({
                    success: false,
                    require: true,
                    field: e.path,
                    message: "Chức vụ người đại diện là bắt buộc",
                    messages: langConcat(lang?.resources?.position, lang?.message?.error?.validation?.required),
                });
            }
            if (e.path == 'mobile') {
                return res.status(400).send({
                    success: false,
                    require: true,
                    field: e.path,
                    message: "Số điện thoại người đại diện là bắt buộc",
                    messages: langConcat(lang?.resources?.mobile, lang?.message?.error?.validation?.required),
                });
            }
            if (e.path == 're_email') {
                return res.status(400).send({
                    success: false,
                    require: true,
                    field: e.path,
                    message: "Email người đại diện là bắt buộc",
                    messages: langConcat(lang?.resources?.re_email, lang?.message?.error?.validation?.required),
                });
            }
            return res.status(500).send({
                success: false,
                message: 'Máy chủ không phản hồi',
                messages: lang?.message?.error?.server,
                error: e,
            });
        }
    } else if (req.method == 'DELETE') {
        try {
            const bearerToken = req.headers['authorization'];
            if (!bearerToken) throw ({ path: 'token' });
            const user = jwt.verify(bearerToken);
            if (user?.mode != MODE.admin) throw ({ ...user, path: 'token' });
            const { _ids } = req.query;
            if (!_ids) throw ({ path: '_ids' });
            const query = {
                _id: { $in: _ids.split(",") }
            };
            await userController.removeMany(query);
            return res.status(200).send({
                success: true,
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
            if (e.path == '_ids') {
                return res.status(400).send({
                    success: false,
                    required: false,
                    message: "Danh sách người dùng không đúng định dạng",
                    messages: langConcat(lang?.resources?.userList, lang?.message?.error?.validation?.format),
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
        return res.status(422).send({
            success: false,
            message: 'Phương thức không được hỗ trợ',
            messages: lang?.message?.error?.method
        });
    }
};

export default runMidldleware(handler);

