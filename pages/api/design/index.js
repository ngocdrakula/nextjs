import runMidldleware from '../../../middleware/mongodb';
import designController from '../../../controllers/design';
import layoutController from '../../../controllers/layout';
import userController from '../../../controllers/user';
import lang, { langConcat } from '../../../lang.config';
import uploader, { cleanFiles } from '../../../middleware/multer';
import jwt from '../../../middleware/jwt'

const handler = async (req, res) => {
  if (req.method == 'GET') {
    try {
      const bearerToken = req.headers['authorization'];
      if (!bearerToken) throw ({ path: 'token' });
      const user = jwt.verify(bearerToken);
      if (!user?._id) throw ({ ...user, path: 'token' });
      const { page, pageSize, name } = req.query;
      const query = { author: user._id };
      const skip = Number(page * pageSize) || 0;
      const limit = Number(pageSize) || 0;
      if (name) query.name = name;
      const total = await designController.getlist(query).countDocuments();
      const list = await designController.getlist(query).skip(skip).limit(limit);
      return res.status(200).send({
        success: true,
        data: list,
        total,
        page: Number(page) || 0,
        pageSize: Number(pageSize) || 0,
        query,
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
      const contentType = req.headers['content-type'];
      const bearerToken = req.headers['authorization'];
      if (!bearerToken) throw ({ path: 'token' })
      if (!contentType || contentType.indexOf('multipart/form-data') == -1)
        throw ({ path: 'content-type', contentType });
      const user = jwt.verify(bearerToken);
      if (!user?._id) throw ({ ...user, path: 'token' });
      const { body: { name, layoutId, areas }, files, err } = await uploader(req);
      if (err || !files.length) throw ({ path: 'files' });
      if (!name || !areas || !layoutId) {
        if (!name) throw ({ path: 'name', files })
        if (!areas) throw ({ path: 'areas', files })
        throw ({ path: 'layoutId', files })
      }
      try {
        const layout = await layoutController.get(layoutId);
        if (!layout) throw ({ path: '_id', files });
      } catch (err) {
        if (err.path == '_id') throw ({ path: 'layout', files });
        throw ({ err, files })
      }
      try {
        const areasParser = JSON.parse(areas);
      } catch (err) {
        throw ({ path: 'areas', files });
      }
      const designCreated = await designController.create({ name, layout: layoutId, areas: JSON.parse(areas), author: user._id, image: files[0] });
      return res.status(201).send({
        success: true,
        data: designCreated,
        message: 'Thêm thành công',
        messages: lang?.message?.success?.created
      });
    } catch (e) {
      if (e.files) await cleanFiles(e.files);
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
      if (e.path == 'content-type') {
        return res.status(400).send({
          success: false,
          headerContentType: false,
          contentType: e.contentType,
          aceptedOnly: 'multipart/form-data',
          message: 'Header không được chấp nhận',
          messages: lang?.message?.error?.header_not_acepted
        });
      }
      if (e.path == 'files') {
        return res.status(400).send({
          success: false,
          upload: false,
          field: 'files',
          message: 'Upload không thành công',
          messages: lang?.message?.error?.upload_failed,
        });
      }
      if (e.path == 'name') {
        return res.status(400).send({
          success: false,
          validation: false,
          field: 'name',
          message: 'Tên thiết kế không được để trống',
          messages: langConcat(lang?.resources?.designName, lang?.message?.error?.validation?.required)
        });
      }
      if (e.path == 'layoutId') {
        return res.status(400).send({
          success: false,
          validation: false,
          field: 'layoutId',
          message: 'Id không gian không được để trống',
          messages: langConcat(lang?.resources?.layoutId, lang?.message?.error?.validation?.required)
        });
      }
      if (e.path == 'layout') {
        return res.status(400).send({
          success: false,
          exist: false,
          field: 'layout',
          message: "Không gian không tồn tại",
          messages: langConcat(lang?.resources?.layout, lang?.message?.error?.validation?.not_exist),
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
      if (!user?.mode) throw ({ ...user, path: 'token' });
      const { _ids } = req.query;
      if (!_ids) throw ({ path: '_ids' });
      const query = {
        _id: { $in: _ids.split(",") }
      };
      await designController.removeMany(query);
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
          message: "Danh sách thiết kế phải là một mảng id",
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

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};

export default runMidldleware(handler);
