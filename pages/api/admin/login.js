import runMidldleware from '../../../middleware/mongodb';
import userController from '../../../controllers/user';
import lang, { langConcat } from '../../../lang.config';
import jwt from '../../../middleware/jwt';
import bcrypt from '../../../middleware/bcrypt';

const handler = async (req, res) => {
  if (req.method == 'POST') {
    try {
      const { username, password } = req.body;
      if (!username) throw ({ path: 'username' })
      if (!password) throw ({ path: 'password' })
      const user = await userController.find({ username, mode: true });
      if (!user) throw ({ path: 'user' });
      const loged = await bcrypt.compare(password, user.password);
      if (!loged) throw ({ path: 'user' });
      const { _id } = user;
      const token = jwt.create({ _id, username, mode: true });
      return res.status(200).send({
        success: true,
        token,
        message: 'Đăng nhập thành công',
        messages: lang?.message?.success?.loged
      });
    } catch (e) {
      if (e.path == 'username') {
        return res.status(400).send({
          success: false,
          validation: false,
          field: 'username',
          message: "Tên đăng nhập không được để trống",
          messages: langConcat(lang?.resources?.username, lang?.message?.error?.validation?.required),
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
          message: "Tên đăng nhập hoặc mật khẩu không chính xác",
          messages: langConcat(lang?.resources?.usernameOrPassword, lang?.message?.error?.validation?.incorrect),
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
