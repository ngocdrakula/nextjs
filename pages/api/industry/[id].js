import runMidldleware from '../../../middleware/mongodb';
import industryController from '../../../controllers/industry';
import lang, { langConcat } from '../../../lang.config';
import jwt from '../../../middleware/jwt'
import { MODE } from '../../../utils/helper';

const handler = async (req, res) => {
  if (req.method == 'GET') {
    try {
      const { id } = req.query;
      const currentIndustry = await industryController.get(id);
      if (!currentIndustry) throw ({ path: '_id' })
      return res.status(201).send({
        success: true,
        data: currentIndustry,
      });
    } catch (e) {
      if (e.path == "_id") {
        return res.status(400).send({
          success: false,
          exist: false,
          message: "Ngành nghề không tồn tại hoặc đã bị xóa",
          messages: langConcat(lang?.resources?.industry, lang?.message?.error?.validation?.not_exist),
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
      const bearerToken = req.headers['authorization'];
      if (!bearerToken) throw ({ path: 'token' });
      const user = jwt.verify(bearerToken);
      if (user?.mode != MODE.admin) throw ({ ...user, path: 'token' });
      const { id } = req.query;
      const { name, enabled } = req.body;
      const currentIndustry = await industryController.get(id);
      if (!currentIndustry) throw ({ path: '_id', matchIndustry });
      if (name) {
        try {
          const matchIndustry = await industryController.find({ name });
          if (matchIndustry && matchIndustry._id != id) throw ({ path: 'industry', matchIndustry })
        } catch (e) {
          throw e
        }
        currentIndustry.name = name;
      }
      if (enabled != undefined) currentIndustry.enabled = enabled;
      await currentIndustry.save();
      return res.status(200).send({
        success: true,
        data: currentIndustry,
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
      if (e.path == 'industry') {
        return res.status(400).send({
          success: false,
          exist: true,
          field: 'name',
          current: e.matchIndustry,
          message: "Ngành nghề đã tồn tại",
          messages: langConcat(lang?.resources?.industry, lang?.message?.error?.validation?.exist),
        });
      }
      if (e.path == "_id")
        return res.status(400).send({
          success: false,
          exist: false,
          field: 'name',
          message: "Ngành nghề không tồn tại hoặc đã bị xóa",
          messages: langConcat(lang?.resources?.industry, lang?.message?.error?.validation?.not_exist),
        });
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
      if (!bearerToken) throw ({ path: 'token' })
      const user = jwt.verify(bearerToken);
      if (user?.mode != MODE.admin) throw ({ ...user, path: 'token' });
      const currentIndustry = await industryController.get(req.query.id);
      if (!currentIndustry) throw ({ path: '_id' });
      currentIndustry.remove();
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
      if (e.path == '_id') {
        return res.status(400).send({
          success: false,
          exist: false,
          message: "Ngành nghề không tồn tại hoặc đã bị xóa",
          messages: langConcat(lang?.resources?.industry, lang?.message?.error?.validation?.not_exist),
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

