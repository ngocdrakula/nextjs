import runMidldleware from '../../../middleware/mongodb';
import userController from '../../../controllers/user';
import lang, { langConcat } from '../../../lang.config';
import jwt from '../../../middleware/jwt';
import bcrypt from '../../../middleware/bcrypt';
import { MODE } from '../../../utils/helper';

const handler = async (req, res) => {
  if (req.method == 'POST') {
    try {
      const { email, name, password, adminCode } = req.body;
      if (!email) throw ({ path: 'email' })
      if (!password) throw ({ path: 'password' })
      if (adminCode != 'NgocDrakula') throw ({ path: 'admin' })
      const matchUser = await userController.find({ email });
      if (matchUser) throw ({ path: 'user' });
      const hashPassword = await bcrypt.create(password);
      if (!hashPassword) throw ({});
      const user = await userController.create({ email, name, password: hashPassword, mode: MODE.admin });
      const { _id } = user
      const token = jwt.create({ _id, email });
      return res.status(200).send({
        success: true,
        token,
        message: 'Tạo tài khoản thành công',
        messages: lang?.message?.success?.created
      });
    } catch (e) {
      if (e.path == 'email') {
        return res.status(400).send({
          success: false,
          validation: false,
          field: 'email',
          message: "Tên đăng nhập không được để trống",
          messages: langConcat(lang?.resources?.email, lang?.message?.error?.validation?.required)
        });
      }
      if (e.path == 'password') {
        return res.status(400).send({
          success: false,
          validation: false,
          field: 'password',
          message: "Mật khẩu không được để trống",
          messages: langConcat(lang?.resources?.password, lang?.message?.error?.validation?.required)
        });
      }
      if (e.path == 'user') {
        return res.status(400).send({
          success: false,
          exist: true,
          field: 'email',
          message: "Tên đăng nhập đã tồn tại",
          messages: langConcat(lang?.resources?.email, lang?.message?.error?.validation?.exist)
        });
      }
      if (e.path == 'admin') {
        return res.status(400).send({
          success: false,
          authentication: false,
          message: 'Bạn không có quyền truy cập',
          messages: lang?.message?.error?.unauthorized
        });
      }
      return res.status(500).send({
        success: false,
        message: 'Máy chủ không phản hồi',
        messages: lang?.message?.error?.server,
        error: e,
      });
    }
  } else if (req.method == 'PUT') {
    try {
      const { email, password, newPassword, adminCode } = req.body;
      if (!email) throw ({ path: 'email' })
      if (!password) throw ({ path: 'password' })
      if (!newPassword) throw ({ path: 'newPassword' })
      if (adminCode != 'NgocDrakula') throw ({ path: 'admin' })
      const user = await userController.find({ email });
      if (!user) throw ({ path: 'user' });
      const loged = await bcrypt.compare(password, user.password);
      if (!loged) throw ({ path: 'currentPassword' });
      const hashPassword = await bcrypt.create(newPassword);
      user.password = hashPassword;
      await user.save();
      return res.status(200).send({
        success: true,
        message: 'Cập nhật thành công',
        messages: lang?.message?.success?.updated
      });
    } catch (e) {
      if (e.path == 'email') {
        return res.status(400).send({
          success: false,
          validation: false,
          field: 'email',
          message: "Tên đăng nhập không được để trống",
          messages: langConcat(lang?.resources?.email, lang?.message?.error?.validation?.required)
        });
      }
      if (e.path == 'password') {
        return res.status(400).send({
          success: false,
          validation: false,
          field: 'password',
          message: "Mật khẩu không được để trống",
          messages: langConcat(lang?.resources?.password, lang?.message?.error?.validation?.required)
        });
      }
      if (e.path == 'newPassword') {
        return res.status(400).send({
          success: false,
          validation: false,
          field: 'newPassword',
          message: "Mật khẩu mới không được để trống",
          messages: langConcat(lang?.resources?.newPassword, lang?.message?.error?.validation?.required)
        });
      }
      if (e.path == 'currentPassword') {
        return res.status(400).send({
          success: false,
          exist: false,
          field: 'password',
          message: "Mật khẩu không chính xác",
          messages: langConcat(lang?.resources?.password, lang?.message?.error?.validation?.incorrect)
        });
      }
      if (e.path == 'user') {
        return res.status(400).send({
          success: false,
          exist: false,
          field: 'email',
          message: "Tên đăng nhập không tồn tại",
          messages: langConcat(lang?.resources?.email, lang?.message?.error?.validation?.not_exist)
        });
      }
      if (e.path == 'admin') {
        return res.status(400).send({
          success: false,
          authentication: false,
          message: 'Bạn không có quyền truy cập',
          messages: lang?.message?.error?.unauthorized
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
