import runMidldleware from '../../../middleware/mongodb';
import userController from '../../../controllers/user';
import notificationController from '../../../controllers/notification';
import lang, { langConcat } from '../../../lang.config';
import jwt from '../../../middleware/jwt';
import bcrypt from '../../../middleware/bcrypt';
import { downloadImageFromUrl, getDataFromUrl } from '../../../middleware/cloneHelper';
import { MODE, nonAccentVietnamese } from '../../../utils/helper';
import { registerNotification, registerSocialSuccess } from '../../../middleware/mailer';

const handler = async (req, res) => {
    if (req.method == 'POST') {
        try {
            const { accessToken, image } = req.body;
            if (!accessToken) throw ({ path: 'accessToken' });
            const info = await getDataFromUrl("https://graph.facebook.com/me?fields=id,email,first_name,last_name&access_token=" + accessToken)
            if (!info) throw ({ path: 'accessToken' });
            const { id, first_name, last_name, picture = image } = info;
            const email = info.email || (id + "@fb.com");
            const name = first_name || last_name;
            const user = await userController.find({ $or: [{ email }, { id }] });
            if (user) {
                if (!user.enabled) throw ({ path: 'enabled' })
                const { _id, email, name, names, createdAt, mode } = user;
                const token = jwt.create({ _id, email, name, names, createdAt, mode });
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
                name, names: { vn: name, en: name },
                search, searchs: { vn: nonAccentVietnamese(name), en: nonAccentVietnamese(name) },
                email, avatar, password, mode: MODE.visitor, id,
            });
            if (email?.includes('@')) await registerSocialSuccess({ email, social: 'Facebook' });
            await registerNotification({ email, name, social: 'Facebook' });
            await notificationController.create({ title: 'register', message: `${email} vừa đăng ký thành viên` })
            const token = jwt.create({ _id: userCreated._id, email, name, names: userCreated.names, createdAt: userCreated.createdAt, mode: MODE.visitor });
            return res.status(200).send({
                success: true,
                token,
                info,
                message: 'Tạo tài khoản thành công',
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
