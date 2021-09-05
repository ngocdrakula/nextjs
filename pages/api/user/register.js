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
            const { email, password, name, phone, address,
                representative, position, mobile, website, product } = req.body;
            if (!email) throw ({ path: 'email', required: true });
            if (!password) throw ({ path: 'password', required: true });
            if (!name) throw ({ path: 'name', required: true });
            const user = await userController.find({ email });
            if (user) throw ({ path: 'user' });
            const hash = await bcrypt.create(password);
            const userInfo = {
                password: hash, email, name, phone, mode: MODE.visitor, address,
                representative, position, mobile, website, product,
            };
            const userCreated = await userController.create(userInfo);
            const { _id } = userCreated;
            const token = jwt.create({ email, _id, name, mode: MODE.visitor });
            return res.status(201).send({
                success: true,
                token,
                data: { email, _id, name, mode: MODE.visitor },
                message: 'Đăng ký thành công',
            });
        } catch (e) {
            if (['email', 'name', 'password'].includes(e.path)) {
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
                    field: 'email',
                    message: "Email đã tồn tại",
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

