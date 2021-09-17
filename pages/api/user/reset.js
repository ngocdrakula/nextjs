import runMidldleware from '../../../middleware/mongodb';
import userController from '../../../controllers/user';
import lang, { langConcat } from '../../../lang.config';
import jwt from '../../../middleware/jwt';
import bcrypt from '../../../middleware/bcrypt';
import { MODE } from '../../../utils/helper';
import { resetPassword } from '../../../middleware/mailer';

const handler = async (req, res) => {
    if (req.method == 'POST') {
        try {
            const { email, code, password } = req.body;
            if (!email) throw ({ path: 'email' })
            const user = await userController.find({ email, enabled: true });
            if (!user) throw ({ path: 'user' });
            if (!code) {
                const newCode = Math.floor(Math.random() * 900000) + 100000;
                console.log(newCode)
                user.code = newCode;
                await user.save();
                const reseted = await resetPassword({ email, name: user.name, code: newCode });
                const { success, info, error } = reseted;
                if (!success) throw ({ path: 'send', error })
                return res.status(200).send({
                    success: true,
                    message: 'Vui lòng kiểm tra email để mấy mã bảo mật',
                    info
                });
            } else if (code == user.code) {
                if (!password) throw ({ path: 'password' })
                user.code = 0;
                user.password = await bcrypt.create(password);
                await user.save();
                const { _id, name, mode } = user;
                const token = jwt.create({ email, _id, name, mode });
                return res.status(200).send({
                    success: true,
                    message: 'Đặt lại mật khẩu thành công',
                    token
                });
            } else throw ({ path: 'code' })
        } catch (e) {
            console.log(e)
            if (e.path == 'email') {
                return res.status(400).send({
                    success: false,
                    field: 'email',
                    message: "Email đăng nhập không được để trống",
                });
            }
            if (e.path == 'password') {
                return res.status(400).send({
                    success: false,
                    field: 'password',
                    message: "Mật khẩu không được để trống",
                });
            }
            if (e.path == 'user') {
                return res.status(400).send({
                    success: false,
                    field: 'password',
                    message: "Không tìm thấy tài khoản nào",
                });
            }
            if (e.path == 'code') {
                return res.status(400).send({
                    success: false,
                    field: 'code',
                    message: "Mã bảo mật không chính xác",
                });
            }
            if (e.path == 'send') {
                return res.status(400).send({
                    success: false,
                    field: 'send',
                    message: "Không thể gửi mã bảo mật tới email này",
                    error: e.error
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
