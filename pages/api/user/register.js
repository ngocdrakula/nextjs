import runMidldleware from '../../../middleware/mongodb';
import userController from '../../../controllers/user';
import industryController from '../../../controllers/industry';
import lang, { langConcat } from '../../../lang.config';
import bcrypt from '../../../middleware/bcrypt';
import jwt from '../../../middleware/jwt';
import { MODE } from '../../../utils/helper';

const handler = async (req, res) => {
    if (req.method == 'POST') {
        try {
            const {
                email, password, name, phone, mode, industry, address,
                hotline, fax, representative, position, mobile, re_email, website, introduce,
                product, contact
            } = req.body;
            if (!email || !password) throw ({ path: !email ? 'email' : 'password', required: true });
            if (mode != MODE.visitor && mode != MODE.exhibitor) throw ({ path: 'mode', required: true });
            if (!industry) throw ({ path: 'industry', required: true });
            const user = await userController.find({ email });
            if (user) throw ({ path: 'user' });
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
                product, contact
            };
            const userCreated = await userController.create(userInfo);
            const { _id } = userCreated;
            const token = jwt.create({ email, _id, name, mode });
            return res.status(201).send({
                success: true,
                token,
                data: { email, _id, name, mode },
                message: 'Đăng ký thành công',
            });
        } catch (e) {
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
                    success: false,
                    exist: true,
                    message: "Email đã tồn tại",
                });
            }
            if (e.path == 'industry') {
                return res.status(400).send({
                    success: false,
                    exist: true,
                    message: "Ngành nghề là bắt buộc",
                });
            }
            if (e.path == '_id') {
                return res.status(400).send({
                    success: false,
                    exist: true,
                    message: "Ngành nghề không tồn tại",
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

