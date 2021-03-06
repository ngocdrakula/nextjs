import runMidldleware from '../../../middleware/mongodb';
import userController from '../../../controllers/user';
import notificationController from '../../../controllers/notification';
import lang, { langConcat } from '../../../lang.config';
import bcrypt from '../../../middleware/bcrypt';
import jwt from '../../../middleware/jwt';
import { MODE, nonAccentVietnamese } from '../../../utils/helper';
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
                password: hash, email,
                name, names: { vn: name, en: name },
                search, searchs: { vn: nonAccentVietnamese(name), en: nonAccentVietnamese(name) },
                address, addresss: { vn: address, en: address },
                representative, representatives: { vn: representative, en: representative },
                position, positions: { vn: position, en: position },
                product, products: { vn: product, en: product },
                phone, mode: MODE.visitor, mobile, website, verify: false,

            };
            const userCreated = await userController.create(userInfo);
            const { createdAt, _id } = userCreated;
            const tokenVerify = jwt.create({ _id, limit: '1000 years' });
            await registerSuccess({ email, password, token: tokenVerify });
            await registerNotification({ email, name });
            await notificationController.create({ title: 'register', message: `${email} v???a ????ng k?? th??nh vi??n` })
            const token = jwt.create({ email, createdAt, _id, name, names, mode: MODE.visitor });
            return res.status(201).send({
                success: true,
                token,
                data: { email, createdAt, _id, name, names, mode: MODE.visitor },
                message: '????ng k?? th??nh c??ng',
            });
        } catch (e) {
            if (e.path == 'email') {
                return res.status(400).send({
                    success: false,
                    required: true,
                    field: 'email',
                    message: "Email kh??ng ???????c ????? tr???ng",
                    messages: langConcat(lang?.resources?.email, lang?.message?.error?.validation?.required),
                });
            }
            if (e.path == 'name') {
                return res.status(400).send({
                    success: false,
                    required: true,
                    field: 'name',
                    message: "T??n kh??ng ???????c ????? tr???ng",
                    messages: langConcat(lang?.resources?.name, lang?.message?.error?.validation?.required),
                });
            }
            if (e.path == 'password') {
                return res.status(400).send({
                    success: false,
                    required: true,
                    field: 'password',
                    message: "M???t kh???u kh??ng ???????c ????? tr???ng",
                    messages: langConcat(lang?.resources?.password, lang?.message?.error?.validation?.required),
                });
            }
            if (e.path == 'user') {
                return res.status(400).send({
                    success: false,
                    exist: true,
                    field: 'email',
                    message: "Email ???? t???n t???i",
                    messages: langConcat(lang?.resources?.email, lang?.message?.error?.validation?.exist),
                });
            }
            return res.status(500).send({
                success: false,
                message: 'M??y ch??? kh??ng ph???n h???i',
                messages: lang?.message?.error?.server,
                error: e,
            });
        }
    } else {
        return res.status(422).send({
            success: false,
            message: 'Ph????ng th???c kh??ng ???????c h??? tr???',
            messages: lang?.message?.error?.method
        });
    }
};

export default runMidldleware(handler);

