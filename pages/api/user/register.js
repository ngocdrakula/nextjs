import runMidldleware from '../../../middleware/mongodb';
import userController from '../../../controllers/user';
import notificationController from '../../../controllers/notification';
import lang, { langConcat } from '../../../lang.config';
import bcrypt from '../../../middleware/bcrypt';
import jwt from '../../../middleware/jwt';
import { MODE } from '../../../utils/helper';
import { registerNotification, registerSuccess } from '../../../middleware/mailer';

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
                representative, position, mobile, website, product, verify: false
            };
            const userCreated = await userController.create(userInfo);
            const { createdAt, _id } = userCreated;
            const tokenVerify = jwt.create({ _id, limit: '1000 years' });
            await registerSuccess({ email, password, token: tokenVerify });
            await registerNotification({ email, name });
            await notificationController.create({ title: 'register', message: `${email} vừa đăng ký thành viên` })
            const token = jwt.create({ email, createdAt, _id, name, mode: MODE.visitor });
            return res.status(201).send({
                success: true,
                token,
                data: { email, createdAt, _id, name, mode: MODE.visitor },
                message: 'Đăng ký thành công',
            });
        } catch (e) {
            if (e.path == 'email') {
                return res.status(400).send({
                    success: false,
                    required: true,
                    field: 'email',
                    message: "Email không được để trống",
                    messages: langConcat(lang?.resources?.email, lang?.message?.error?.validation?.required),
                });
            }
            if (e.path == 'name') {
                return res.status(400).send({
                    success: false,
                    required: true,
                    field: 'name',
                    message: "Tên không được để trống",
                    messages: langConcat(lang?.resources?.name, lang?.message?.error?.validation?.required),
                });
            }
            if (e.path == 'password') {
                return res.status(400).send({
                    success: false,
                    required: true,
                    field: 'password',
                    message: "Mật khẩu không được để trống",
                    messages: langConcat(lang?.resources?.password, lang?.message?.error?.validation?.required),
                });
            }
            if (e.path == 'user') {
                return res.status(400).send({
                    success: false,
                    exist: true,
                    field: 'email',
                    message: "Email đã tồn tại",
                    messages: langConcat(lang?.resources?.email, lang?.message?.error?.validation?.exist),
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

