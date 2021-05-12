import runMidldleware from '../../../middleware/mongodb';
import userController from '../../../controllers/user';
import lang, { langConcat } from '../../../lang.config';
import bcrypt from '../../../middleware/bcrypt';
import jwt from '../../../middleware/jwt';

const handler = async (req, res) => {
    if (req.method == 'POST') {
        try {
            const { username, password, name } = req.body;
            if (!username || !password) throw ({ path: !username ? 'username' : 'password', required: true });
            const user = await userController.find({ username });
            if (user) throw ({ path: 'user' });
            const hash = await bcrypt.create(password);
            const userCreated = await userController.create({ username, password: hash, name });
            const { _id } = userCreated;
            const token = jwt.create({ username, _id, name });
            return res.status(201).send({
                success: true,
                token,
                data: { username, _id, name },
                message: 'Đăng ký thành công',
            });
        } catch (e) {
            if (e.path == 'username' || e.path == 'password') {
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
                    message: "Tên tài khoản đã tồn tại",
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

