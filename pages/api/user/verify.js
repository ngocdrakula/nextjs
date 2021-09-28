import runMidldleware from '../../../middleware/mongodb';
import userController from '../../../controllers/user';
import lang from '../../../lang.config';
import jwt from '../../../middleware/jwt';
import { verifySuccess } from '../../../middleware/mailer';

const handler = async (req, res) => {
    if (req.method == 'POST') {
        try {
            const { token } = req.body;
            if (!token) throw ({ path: 'token' });
            const user = token && jwt.verify('Token: ' + token); 
            if (!user?._id) throw ({ path: 'token' });
            const currentUser = await userController.get(user._id);
            if (!currentUser || !currentUser.enabled) throw ({ path: 'user' });
            const { verify, email, name, mode, _id, createdAt } = currentUser;
            if (verify) throw ({ path: 'token' }); 
            currentUser.verify = true;
            await currentUser.save();
            await verifySuccess({ email });
            const tokenLogin = jwt.create({ _id, email, name, createdAt, mode });
            return res.status(201).send({
                success: true,
                token: tokenLogin,
                data: { email, createdAt, _id, name, mode },
                message: 'Xác thực tài khoản thành công',
            });
        } catch (e) {
            if (e.path == 'token') {
                return res.status(400).send({
                    success: false,
                    exist: true,
                    field: 'token',
                    message: "Mã xác thực tài khoản không chính xác hoặc đã hết hạn",
                });
            }
            if (e.path == 'user') {
                return res.status(400).send({
                    success: false,
                    exist: true,
                    field: 'user',
                    message: "Tài khoản không tồn tại hoặc đã bị khóa",
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

