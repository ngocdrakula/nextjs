import runMidldleware from '../../../middleware/mongodb';
import userController from '../../../controllers/user';
import lang, { langConcat } from '../../../lang.config';
import jwt from '../../../middleware/jwt';
import bcrypt from '../../../middleware/bcrypt';
import { MODE } from '../../../utils/helper';

const handler = async (req, res) => {
    if (req.method == 'POST') {
        try {
            const { email, password, mode } = req.body;
            if (!email) throw ({ path: 'email' })
            if (!password) throw ({ path: 'password' })
            const user = await userController.find({ email, enabled: true });
            if (!user) throw ({ path: 'user' });
            const loged = await bcrypt.compare(password, user.password);
            if (!loged) throw ({ path: 'user' });
            if (mode === MODE.visitor && user.mode === MODE.exhibitor) throw ({ path: 'exhibitor' });
            if (mode === MODE.exhibitor && user.mode === MODE.visitor) throw ({ path: 'visitor' });
            const { _id, name, createdAt } = user;
            const token = jwt.create({ _id, email, name, createdAt, mode: user.mode });
            return res.status(200).send({
                success: true,
                token,
                message: 'Đăng nhập thành công',
                messages: lang?.message?.success?.loged
            });
        } catch (e) {
            if (e.path == 'email') {
                return res.status(400).send({
                    success: false,
                    validation: false,
                    field: 'email',
                    message: "Email không được để trống",
                    messages: langConcat(lang?.resources?.email, lang?.message?.error?.validation?.required),
                });
            }
            if (e.path == 'password') {
                return res.status(400).send({
                    success: false,
                    validation: false,
                    field: 'password',
                    message: "Mật khẩu không được để trống",
                    messages: langConcat(lang?.resources?.password, lang?.message?.error?.validation?.required),
                });
            }
            if (e.path == 'user') {
                return res.status(400).send({
                    success: false,
                    loged: false,
                    message: "Email hoặc mật khẩu không chính xác",
                    messages: langConcat(lang?.resources?.emailOrPassword, lang?.message?.error?.validation?.incorrect),
                });
            }
            if (e.path == 'visitor') {
                return res.status(400).send({
                    success: false,
                    loged: false,
                    field: 'mode',
                    message: "Vui lòng đăng nhập ở khu vực người mua",
                    messages: lang?.message?.error?.loginVisitor,
                });
            }
            if (e.path == 'exhibitor') {
                return res.status(400).send({
                    success: false,
                    loged: false,
                    field: 'mode',
                    message: "Vui lòng đăng nhập ở khu vực nhà trưng bày",
                    messages: lang?.message?.error?.loginExhibitor,
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

export default runMidldleware(handler);
