import runMidldleware from '../../../middleware/mongodb';
import contactController from '../../../controllers/contact';
import lang, { langConcat } from '../../../lang.config';
import jwt from '../../../middleware/jwt'
import { MODE } from '../../../utils/helper';

const handler = async (req, res) => {
  if (req.method == 'GET') {
    try {
      const bearerToken = req.headers['authorization'];
      if (!bearerToken) throw ({ path: 'token' })
      const user = jwt.verify(bearerToken);
      if (user?.mode != MODE.admin) throw ({ ...user, path: 'token' });
      const { page, pageSize, read, name, email } = req.query;
      const query = {};
      if (read) query.read = !(read == "false");
      if (email) query.email = email;
      if (name) query.name = name;
      const skip = Number(page * pageSize) || 0;
      const limit = Number(pageSize) || 100;
      const total = await contactController.getlist(query).countDocuments();
      const list = await contactController.getlist(query).skip(skip).limit(limit);
      return res.status(200).send({
        success: true,
        data: list,
        total,
        page: Number(page) || 0,
        pageSize: Number(pageSize) || 100
      });
    } catch (error) {
      return res.status(500).send({
        success: false,
        message: error.message,
        messages: lang?.message?.error?.server,
        error: error,
      });
    }
  } else if (req.method == 'POST') {
    try {
      const { email, name, title, message } = req.body;
      if (!email) throw ({ path: 'email', required: true });
      if (!name) throw ({ path: 'name', required: true });
      if (!title) throw ({ path: 'title', required: true });
      if (!message) throw ({ path: 'message', required: true });
      const contactCreated = await contactController.create({ email, name, title, message });
      return res.status(201).send({
        success: true,
        data: contactCreated,
        message: 'Thêm thành công',
        messages: lang?.message?.success?.created
      });
    } catch (e) {
      if (e.path == 'name') {
        return res.status(400).send({
          success: false,
          exist: true,
          field: 'name',
          message: "Vui lòng điền đầy đủ thông tin",
          messages: langConcat(lang?.resources?.name, lang?.message?.error?.validation?.exist),
        });
      }
      if (e.path == 'email') {
        return res.status(400).send({
          success: false,
          exist: true,
          field: 'email',
          message: "Vui lòng điền đầy đủ thông tin",
          messages: langConcat(lang?.resources?.email, lang?.message?.error?.validation?.exist),
        });
      }
      if (e.path == 'title') {
        return res.status(400).send({
          success: false,
          exist: true,
          field: 'title',
          message: "Vui lòng điền đầy đủ thông tin",
          messages: langConcat(lang?.resources?.title, lang?.message?.error?.validation?.exist),
        });
      }
      if (e.path == 'message') {
        return res.status(400).send({
          success: false,
          exist: true,
          field: 'message',
          message: "Vui lòng điền đầy đủ thông tin",
          messages: langConcat(lang?.resources?.message, lang?.message?.error?.validation?.exist),
        });
      }
      return res.status(500).send({
        success: false,
        message: 'Máy chủ không phản hồi',
        messages: lang?.message?.error?.server,
        error: e,
      });
    }
  } else if (req.method == 'DELETE') {
    try {
      const bearerToken = req.headers['authorization'];
      if (!bearerToken) throw ({ path: 'token' });
      const user = jwt.verify(bearerToken);
      if (user?.mode != MODE.admin) throw ({ ...user, path: 'token' });
      const { _ids } = req.query;
      if (!_ids) throw ({ path: '_ids' });
      const query = {
        _id: { $in: _ids.split(",") }
      };
      await contactController.removeMany(query);
      return res.status(200).send({
        success: true,
        message: 'Xóa thành công',
        messages: lang?.message?.success?.deleted
      });
    } catch (e) {
      if (e.path == 'token') {
        if (!e.token) {
          return res.status(401).send({
            success: false,
            authentication: false,
            message: 'Bạn không có quyền truy cập',
            messages: lang?.message?.error?.unauthorized
          });
        }
        return res.status(400).send({
          success: false,
          name: e.name,
          message: e.name == 'TokenExpiredError' ? 'Token hết hạn' : 'Token sai định dạng',
          messages: e.name == 'TokenExpiredError' ? lang?.message?.error?.tokenExpired : lang?.message?.error?.tokenError
        });
      }
      if (e.path == '_ids') {
        return res.status(400).send({
          success: false,
          required: false,
          message: "Danh sách tin nhắn không được để trống",
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

