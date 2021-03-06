import runMidldleware from '../../../middleware/mongodb';
import userController from '../../../controllers/user';
import lang, { langConcat } from '../../../lang.config';
import jwt from '../../../middleware/jwt';
import bcrypt from '../../../middleware/bcrypt';
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
                user.code = newCode;
                const expired = Date.now() + 10 * 60 * 1000;
                user.expired = expired;
                await user.save();
                const reseted = await resetPassword({ email, name: user.name, code: newCode, expired });
                const { success, error } = reseted;
                if (!success) throw ({ path: 'send', error })
                return res.status(200).send({
                    success: true,
                    message: 'Vui lòng kiểm tra email để lấy mã bảo mật',
                    messages: lang?.message?.success?.check_email,
                });
            } else if (code == user.code && user.expired > Date.now()) {
                if (!password) throw ({ path: 'password' })
                user.code = 0;
                user.password = await bcrypt.create(password);
                await user.save();
                const { _id, createdAt, name, names, mode } = user;
                const token = jwt.create({ email, _id, createdAt, name, names, mode });
                return res.status(200).send({
                    success: true,
                    message: 'Đặt lại mật khẩu thành công',
                    messages: lang?.message?.success?.reset_password,
                    token
                });
            } else throw ({ path: 'code' })
        } catch (e) {
            if (e.path == 'email') {
                return res.status(400).send({
                    success: false,
                    field: 'email',
                    message: "Email không được để trống",
                    messages: langConcat(lang?.resources?.email, lang?.message?.error?.validation?.required),
                });
            }
            if (e.path == 'password') {
                return res.status(400).send({
                    success: false,
                    field: 'password',
                    message: "Mật khẩu không được để trống",
                    messages: langConcat(lang?.resources?.password, lang?.message?.error?.validation?.required),
                });
            }
            if (e.path == 'user') {
                return res.status(400).send({
                    success: false,
                    field: 'user',
                    message: "Người dùng không tồn tại",
                    messages: langConcat(lang?.resources?.user, lang?.message?.error?.validation?.not_exist),
                });
            }
            if (e.path == 'code') {
                return res.status(400).send({
                    success: false,
                    field: 'code',
                    message: "Mã bảo mật không chính xác",
                    messages: langConcat(lang?.resources?.code, lang?.message?.error?.validation?.incorrect),
                });
            }
            if (e.path == 'send') {
                return res.status(400).send({
                    success: false,
                    field: 'send',
                    message: "Không thể gửi mã bảo mật tới email này",
                    messages: lang?.message?.error?.send_email,
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
