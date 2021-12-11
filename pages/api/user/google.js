import runMidldleware from '../../../middleware/mongodb';
import userController from '../../../controllers/user';
import notificationController from '../../../controllers/notification';
import lang from '../../../lang.config';
import jwt from '../../../middleware/jwt';
import bcrypt from '../../../middleware/bcrypt';
import { downloadImageFromUrl, getDataFromUrl } from '../../../middleware/cloneHelper';
import { MODE, nonAccentVietnamese } from '../../../utils/helper';
import { registerNotification, registerSocialSuccess } from '../../../middleware/mailer';

const handler = async (req, res) => {
    if (req.method == 'POST') {
        try {
            const { accessToken } = req.body;
            if (!accessToken) throw ({ path: 'accessToken' });
            const info = await getDataFromUrl("https://www.googleapis.com/oauth2/v1/userinfo?access_token=" + accessToken)
            if (!info) throw ({ path: 'accessToken' });
            const { email, name, picture } = info;
            const user = await userController.find({ email });
            if (user) {
                if (!user.enabled) throw ({ path: 'enabled' })
                const { _id, email, name, createdAt, mode } = user;
                const token = jwt.create({ _id, email, name, createdAt, mode });
                return res.status(200).send({
                    success: true,
                    token,
                    message: 'Đăng nhập thành công',
                    messages: lang?.message?.success?.loged
                });
            }
            const password = await bcrypt.create(`${Math.random() * 1000000}`);
            const avatar = picture && (await downloadImageFromUrl(picture))
            const userCreated = await userController.create({
                name, email, avatar, password, mode: MODE.visitor, search: nonAccentVietnamese(name)
            })
            await registerSocialSuccess({ email, social: 'Google' });
            await registerNotification({ email, name, social: 'Google' });
            await notificationController.create({ title: 'register', message: `${email} vừa đăng ký thành viên` })
            const token = jwt.create({ _id: userCreated._id, email, name, createdAt: userCreated.createdAt, mode: MODE.visitor });
            return res.status(200).send({
                success: true,
                token,
                message: 'Đăng nhập thành công',
                created: true,
                messages: lang?.message?.success?.loged
            });
        } catch (e) {
            if (e.path == 'accessToken') {
                return res.status(400).send({
                    success: false,
                    field: 'enabled',
                    message: 'Tài khoản của bạn đã bị khóa',
                    messages: lang?.message?.error?.not_allow
                });
            }
            if (e.path == 'accessToken') {
                return res.status(400).send({
                    success: false,
                    validation: false,
                    field: 'accessToken',
                    message: "Token không được để trống",
                    messages: langConcat(lang?.resources?.accessToken, lang?.message?.error?.validation?.required),
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
