import runMidldleware from '../../../middleware/mongodb';
import livestreamController from '../../../controllers/livestream';
import userController from '../../../controllers/user';
import lang, { langConcat } from '../../../lang.config';
import jwt from '../../../middleware/jwt'
import { MODE } from '../../../utils/helper';

const handler = async (req, res) => {
  if (req.method == 'GET') {
    try {
      const { page, pageSize = 100, title, author, enabled } = req.query;
      const query = {};
      if (title) query.title = new RegExp(title, "i");
      if (author) query.author = author;
      if (enabled) query.enabled = !(enabled == "false");
      const skip = Number(page * pageSize) || 0;
      const limit = Number(pageSize) || 0;
      const total = await livestreamController.getlist(query).countDocuments();
      const data = await livestreamController.getlist(query).skip(skip).limit(limit);
      return res.status(200).send({
        success: true,
        data,
        total,
        page: Number(page) || 0,
        pageSize: Number(pageSize) || 0,
        query: { title, author },
      });
    } catch (error) {
      return res.status(500).send({
        success: false,
        message: 'Máy chủ không phản hồi',
        messages: lang?.message?.error?.server,
        error: error,
      });
    }
  } else if (req.method == 'POST') {
    try {
      const bearerToken = req.headers['authorization'];
      if (!bearerToken) throw ({ path: 'token' })
      const user = jwt.verify(bearerToken);
      if (user?.mode != MODE.admin && user?.mode != MODE.exhibitor) throw ({ ...user, path: 'token' });
      const { author, description, link, title, embed } = req.body;
      if (!link) throw ({ path: 'link' });
      if (!description) throw ({ path: 'description' });
      if (user.mode == MODE.admin) {
        if (!author) throw ({ path: 'author' })
        try {
          const currentUser = userController.get(author);
          if (!currentUser) throw ({});
        }
        catch (e) {
          throw ({ path: 'author' })
        }
      }
      const livestreamCreated = await livestreamController.create({
        author: user.mode == MODE.admin ? author : user._id,
        description, link, title, embed
      })
      return res.status(201).send({
        success: true,
        data: livestreamCreated,
        message: 'Thêm thành công',
        messages: lang?.message?.success?.created
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
      if (e.path == 'link') {
        return res.status(400).send({
          success: false,
          validation: false,
          field: 'link',
          message: 'Liên kết không được để trống',
          messages: langConcat(lang?.resources?.link, lang?.message?.error?.validation?.required),
        });
      }
      if (e.path == 'author') {
        return res.status(400).send({
          success: false,
          validation: false,
          field: 'author',
          message: 'Người dùng không tồn tại',
          messages: langConcat(lang?.resources?.user, lang?.message?.error?.validation?.not_exist),
        });
      }
      if (e.path == 'description') {
        return res.status(400).send({
          success: false,
          validation: false,
          field: 'description',
          message: 'Mô tả không được để trống',
          messages: langConcat(lang?.resources?.description, lang?.message?.error?.validation?.not_exist),
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
      if (!bearerToken) throw ({ path: 'token' });
      const user = jwt.verify(bearerToken);
      if (user?.mode != MODE.admin && user?.mode != MODE.exhibitor) throw ({ ...user, path: 'token' });
      const { _ids } = req.query;
      if (!_ids) throw ({ path: '_ids' });
      const query = { _id: { $in: _ids.split(",") } };
      if (user.mode != MODE.admin) {
        query.author = user._id;
      }
      await livestreamController.removeMany(query);
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
          format: false,
          message: "Danh sách video trực tuyến không đúng định dạng",
          messages: langConcat(lang?.resources?.livestreamList, lang?.message?.error?.validation?.format),
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
