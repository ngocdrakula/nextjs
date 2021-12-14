import runMidldleware from '../../../middleware/mongodb';
import industryController from '../../../controllers/industry';
import lang, { langConcat } from '../../../lang.config';
import jwt from '../../../middleware/jwt'
import { MODE } from '../../../utils/helper';

const handler = async (req, res) => {
  if (req.method == 'GET') {
    try {
      const { page, pageSize = 100, enabled, name, lang } = req.query;
      const query = {};
      if (enabled) query.enabled = !(enabled == "false");
      if (name) {
        if (lang) {
          query["names." + (lang == "en" ? "en" : "vn")] = new RegExp(name, "i");
        }
        else {
          query.name = new RegExp(name, "i");
        }
      }
      const skip = Number(page * pageSize) || 0;
      const limit = Number(pageSize) || 0;
      const total = await industryController.getlist(query).countDocuments();
      const list = await industryController.getlist(query).skip(skip).limit(limit);
      return res.status(200).send({
        success: true,
        data: list,
        total,
        page: Number(page) || 0,
        pageSize: Number(pageSize) || 0
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
      if (user?.mode != MODE.admin) throw ({ ...user, path: 'token' });
      const { nameVN, nameEN } = req.body;
      if (!nameVN) throw ({ path: 'nameVN', required: true });
      if (!nameEN) throw ({ path: 'nameEN', required: true });
      try {
        const matchIndustry = await industryController.find({ $or: [{ 'names.vn': nameVN }, { 'names.en': nameEN }] });
        if (matchIndustry) throw ({ path: 'industry', matchIndustry, field: matchIndustry.names.vn == nameVN ? 'nameVN' : 'nameEN' });
      }
      catch (e) {
        if (e.path == 'industry') throw (e)
      }
      const industryCreated = await industryController.create({ name: nameVN, names: { nameVN, nameEN } });
      return res.status(201).send({
        success: true,
        data: industryCreated,
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
      if (e.path == 'nameVN') {
        return res.status(400).send({
          success: false,
          required: true,
          field: 'nameVN',
          message: "Tên ngành nghề không được để trống",
          messages: langConcat(lang?.resources?.industryName, lang?.message?.error?.validation?.required),
        });
      }
      if (e.path == 'nameEN') {
        return res.status(400).send({
          success: false,
          required: true,
          field: 'nameEN',
          message: "Tên ngành nghề không được để trống",
          messages: langConcat(lang?.resources?.industryName, lang?.message?.error?.validation?.required),
        });
      }
      if (e.path == 'industry') {
        return res.status(400).send({
          success: false,
          exist: true,
          field: e.field,
          current: e.matchIndustry,
          message: "Ngành nghề đã tồn tại",
          messages: langConcat(lang?.resources?.industry, lang?.message?.error?.validation?.exist),
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
      await industryController.removeMany(query);
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
          message: "Danh sách ngành nghề không đúng định dạng",
          messages: langConcat(lang?.resources?.industryList, lang?.message?.error?.validation?.format),
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

