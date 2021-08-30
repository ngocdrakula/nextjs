import runMidldleware from '../../../middleware/mongodb';
import userController from '../../../controllers/user';
import industryController from '../../../controllers/industry';
import lang from '../../../lang.config';
import jwt from '../../../middleware/jwt';
import bcrypt from '../../../middleware/bcrypt';
import { MODE } from '../../../utils/helper';

const handler = async (req, res) => {
    if (req.method == 'GET') {
        try {
            const { page, pageSize, enabled, mode, name, industry, sort } = req.query;
            const query = {};
            if (enabled) query.enabled = (enabled == "true");
            if (mode != undefined) query.mode = Number(mode);
            if (industry) query.industry = { $in: industry.split(',') };
            if (name) query.name = new RegExp(name, "i");
            const sortObj = {};
            if (sort == 'name') sortObj.name = 1;
            else if (sort == 'namereverse') sortObj.name = -1;
            else sortObj.createdAt = -1;
            const skip = Number(page * pageSize) || 0;
            const limit = Number(pageSize) || 0;
            const total = await userController.getlist(query).countDocuments();
            const list = await userController.getlist(query).populate('industry').skip(skip).sort(sortObj).limit(limit);
            return res.status(200).send({
                success: true,
                data: list,
                total,
                query,
                page: Number(page) || 0,
                pageSize: Number(pageSize) || 0
            });
        } catch (error) {
            return res.status(500).send({
                success: false,
                message: error.message,
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
                product, contact, mode, enabled
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
                email, name, phone, mode, address, industry: [industry],
                hotline, fax, representative, position, mobile, re_email, website, introduce,
                product, contact, enabled
            };
            const userCreated = await userController.create(userInfo);
            const { _id } = userCreated;
            const token = jwt.create({ email, _id, name, mode });
            return res.status(201).send({
                success: true,
                token,
                data: { email, _id, name, mode },
                message: 'Tạo tài khoản thành công',
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
            if (e.path == 'email' || e.path == 'password') {
                return res.status(400).send({
                    success: false,
                    required: false,
                    field: e.path,
                    message: 'Thông tin đăng ký không được để trống',
                });
            }
            if (e.path == 'user') {
                return res.status(400).send({
                    field: 'email',
                    success: false,
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
                    message: "Danh sách sản phẩm phải là một mảng id",
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

