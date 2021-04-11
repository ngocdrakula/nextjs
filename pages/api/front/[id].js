import connectDB from '../../../middleware/mongodb';
import frontController from '../../../controllers/front';
import lang, { langConcat } from '../../../lang.config';
import jwt from '../../../middleware/jwt';

const handler = async (req, res) => {
  if (req.method === 'GET') {
    try {
      const { id } = req.query;
      const currentFront = await frontController.get(id);
      if (!currentFront) throw ({ path: '_id' });
      return res.status(201).send({
        success: true,
        data: currentFront,
      });
    } catch (e) {
      if (e.path === '_id')
        return res.status(400).send({
          success: false,
          exist: false,
          message: "Bề mặt không tồn tại hoặc đã bị xóa",
          messages: langConcat(lang?.resources?.front, lang?.message?.error?.validation?.not_exist),
        });
      return res.status(500).send({
        success: false,
        message: error.message,
        messages: lang?.message?.error?.server,
        error: e,
      });
    }
  } else if (req.method === 'PUT') {
    try {
      const bearerToken = req.headers['authorization'];
      if (!bearerToken) throw ({ path: 'token' });
      const user = jwt.verify(bearerToken);
      if (!user || !user._id) throw ({ ...user, path: 'token' });
      const { name, rate } = req.body;
      try {
        if (name) {
          const matchFront = await frontController.find({ name });
          if (matchFront) throw ({ path: 'name', matchFront });
        }
        const params = {};
        if (name) params.name = name;
        if (rate !== undefined) params.rate = Number(rate) || 0;
        const currentFront = await frontController.update(req.query.id, params);
        return res.status(200).send({
          success: true,
          data: currentFront,
          message: 'Cập nhật thành công',
          messages: lang?.message?.success?.updated
        });
      } catch (error) {
        throw error
      }
    } catch (e) {
      if (e.path === 'token') {
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
          message: e.name === 'TokenExpiredError' ? 'Token hết hạn' : 'Token sai định dạng',
          messages: e.name === 'TokenExpiredError' ? lang?.message?.error?.tokenExpired : lang?.message?.error?.tokenError
        });
      }
      if (e.path === 'name') {
        return res.status(400).send({
          success: false,
          exist: true,
          current: e.matchFront,
          message: "Tên bề mặt đã tồn tại",
          messages: langConcat(lang?.resources?.frontName, lang?.message?.error?.validation?.exist),
        });
      }
      if (e.path === '_id') {
        return res.status(400).send({
          success: false,
          exist: false,
          message: "Bề mặt không tồn tại hoặc đã bị xóa",
          messages: langConcat(lang?.resources?.front, lang?.message?.error?.validation?.not_exist),
        });
      }
      return res.status(500).send({
        success: false,
        message: 'Máy chủ không phản hồi',
        messages: lang?.message?.error?.server,
        error: e.err,
      });
    }
  } else if (req.method === 'DELETE') {
    try {
      const bearerToken = req.headers['authorization'];
      if (!bearerToken) throw ({ path: 'token' })
      const user = jwt.verify(bearerToken);
      if (!user || !user._id) throw ({ ...user, path: 'token' });
      const currentFront = await frontController.get(req.query.id);
      if (!currentFront) throw ({ path: '_id' });
      currentFront.remove();
      return res.status(200).send({
        success: true,
        data: null,
        message: 'Xóa thành công',
        messages: lang?.message?.success?.deleted
      });
    } catch (e) {
      if (e.path === 'token') {
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
          message: e.name === 'TokenExpiredError' ? 'Token hết hạn' : 'Token sai định dạng',
          messages: e.name === 'TokenExpiredError' ? lang?.message?.error?.tokenExpired : lang?.message?.error?.tokenError
        });
      }
      if (e.path === '_id')
        return res.status(400).send({
          success: false,
          exist: false,
          message: "Bề mặt không tồn tại hoặc đã bị xóa",
          messages: langConcat(lang?.resources?.front, lang?.message?.error?.validation?.not_exist),
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

export default connectDB(handler);

