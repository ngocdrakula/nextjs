import runMidldleware from '../../../middleware/mongodb';
import categoryController from '../../../controllers/category';
import lang, { langConcat } from '../../../lang.config';
import jwt from '../../../middleware/jwt';
import { MODE } from '../../../utils/helper';

const handler = async (req, res) => {
  if (req.method == 'GET') {
    try {
      const { id } = req.query;
      const currentCategory = await categoryController.get(id);
      if (!currentCategory) throw ({ path: '_id' });
      return res.status(201).send({
        success: true,
        data: currentCategory,
      });
    } catch (e) {
      if (e.path == '_id')
        return res.status(400).send({
          success: false,
          exist: false,
          message: "Chuyên mục không tồn tại hoặc đã bị xóa",
          messages: langConcat(lang?.resources?.category, lang?.message?.error?.validation?.not_exist),
        });
      return res.status(500).send({
        success: false,
        message: error.message,
        messages: lang?.message?.error?.server,
        error: e,
      });
    }
  } else if (req.method == 'PUT') {
    try {
      const bearerToken = req.headers['authorization'];
      if (!bearerToken) throw ({ path: 'token' });
      const user = jwt.verify(bearerToken);
      if (user?.mode != MODE.exhibitor && user?.mode != MODE.admin) throw ({ ...user, path: 'token' });
      const { id } = req.query;
      const { name, exhibitor, enabled } = req.body;
      const currentCategory = await categoryController.get(id);
      if (name) {
        try {
          const matchCategory = await categoryController.find({ name, exhibitor: exhibitor || user._id });
          if (matchCategory) throw ({ path: 'name', matchCategory });
        } catch (e) {
          throw e
        }
        currentCategory.name = name;
      }
      if (enabled != undefined) currentCategory.enabled = enabled;
      await currentCategory.save();
      return res.status(200).send({
        success: true,
        data: currentCategory,
        message: 'Cập nhật thành công',
        messages: lang?.message?.success?.updated
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
      if (e.path == 'name') {
        return res.status(400).send({
          success: false,
          exist: true,
          field: 'name',
          current: e.matchCategory,
          message: "Tên chuyên mục đã tồn tại",
          messages: langConcat(lang?.resources?.categoryName, lang?.message?.error?.validation?.exist),
        });
      }
      if (e.path == '_id') {
        return res.status(400).send({
          success: false,
          exist: false,
          field: 'name',
          message: "Chuyên mục không tồn tại hoặc đã bị xóa",
          messages: langConcat(lang?.resources?.category, lang?.message?.error?.validation?.not_exist),
        });
      }
      return res.status(500).send({
        success: false,
        message: 'Máy chủ không phản hồi',
        messages: lang?.message?.error?.server,
        error: e.err,
      });
    }
  } else if (req.method == 'DELETE') {
    try {
      const bearerToken = req.headers['authorization'];
      if (!bearerToken) throw ({ path: 'token' })
      const user = jwt.verify(bearerToken);
      if (user?.mode != MODE.exhibitor && user?.mode != MODE.admin) throw ({ ...user, path: 'token' });
      const currentCategory = await categoryController.get(req.query.id);
      if (!currentCategory || (user.mode != MODE.admin && user._id != currentCategory.exhibitor)) throw ({ path: '_id' });
      currentCategory.remove();
      return res.status(200).send({
        success: true,
        data: null,
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
      if (e.path == '_id')
        return res.status(400).send({
          success: false,
          exist: false,
          message: "Chuyên mục không tồn tại hoặc đã bị xóa",
          messages: langConcat(lang?.resources?.category, lang?.message?.error?.validation?.not_exist),
        });
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

