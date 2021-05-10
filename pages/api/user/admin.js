import runMidldleware from '../../../middleware/mongodb';
import userController from '../../../controllers/user';
import lang, { langConcat } from '../../../lang.config';
import { compare } from '../../../middleware/bcrypt';
import jwt from '../../../middleware/jwt';

const handler = async (req, res) => {
    if (req.method == 'POST') {
        try {
            const { username, password } = req.body;
            if (!username || !password) throw ({ path: !username ? 'username' : 'password', required: true });
            const user = await userController.find({ username, mode: true });
            if (!user) throw ({ path: 'user' });
            const result = await compare(password, user.password);
            if (!result) throw ({ path: 'user' });
            const token = jwt.create({ username, mode: user.mode });
            return res.status(201).send({
                success: true,
                token,
                message: 'Đăng nhập thành công',
            });
        } catch (e) {
            if (e.path == 'username' || e.path == 'password') {
                return res.status(400).send({
                    success: false,
                    required: false,
                    field: e.path,
                    message: 'Thông tin đăng nhập không được để trống',
                });
            }
            if (e.path == 'user') {
                return res.status(400).send({
                    success: false,
                    loged: false,
                    message: "Sai tên đăng nhập hoặc mật khẩu",
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

