import runMidldleware from '../../../middleware/mongodb';
import categoryController from '../../../controllers/category';
import lang, { langConcat } from '../../../lang.config';
import jwt from '../../../middleware/jwt'
import { MODE } from '../../../utils/helper';

const handler = async (req, res) => {
  if (req.method == 'GET') {
    try {
      const { page, pageSize = 100, enabled, exhibitor, name, setIndex } = req.query;
      if (setIndex) {
        const list = await categoryController.getlist({});
        let i = 1;
        for (let category of list) {
          category.index = i;
          await category.save();
          i++;
        }
        return res.status(200).send({
          success: true,
          total: i - 1,
        });
      }
      const query = {};
      if (name) query.name = new RegExp(name, "i");
      if (exhibitor) query.exhibitor = exhibitor;
      if (enabled) query.enabled = !(enabled == "false");
      const skip = Number(page * pageSize) || 0;
      const limit = Number(pageSize) || 0;
      const total = await categoryController.getlist(query).countDocuments();
      const list = await categoryController.getlist(query).skip(skip).limit(limit).sort({ index: -1 });
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
        message: error?.message,
        messages: lang?.message?.error?.server,
        error: error,
      });
    }
  } else if (req.method == 'POST') {
    try {
      const bearerToken = req.headers['authorization'];
      if (!bearerToken) throw ({ path: 'token' })
      const user = jwt.verify(bearerToken);
      if (!user || (user.mode != MODE.exhibitor && user.mode != MODE.admin)) throw ({ ...user, path: 'token' });
      const { nameVN, nameEN, enabled, exhibitor = user._id, index } = req.body;
      if (user.mode == MODE.exhibitor && exhibitor != user._id) throw ({ ...user, path: 'token' });
      if (!nameVN) throw ({ path: 'nameVN' });
      if (!nameEN) throw ({ path: 'nameEN' });
      try {
        const matchCategory = await categoryController.find({ name: nameVN, exhibitor: exhibitor || user._id });
        if (matchCategory) throw ({ path: 'category', matchCategory });
      } catch (error) {
        throw error
      }
      let newIndex = 0;
      if (index >= 0) {
        if (index == 0) {
          try {
            const lastItem = await categoryController.find({ exhibitor: exhibitor || user._id }).sort({ index: -1 });
            newIndex = lastItem.index + 1;
          } catch (e) {
            newIndex = 1;
          }
        }
        else {
          try {
            const list = await categoryController.getlist({ exhibitor: exhibitor || user._id }).skip(index - 1).limit(2).sort({ index: -1 });
            const beforeIndex = list[0]?.index || 1;
            const afterIndex = list[1]?.index || 0;
            newIndex = (beforeIndex + afterIndex) / 2;
          } catch { }
        }
      }
      else {
        try {
          const lastItem = await categoryController.find({ exhibitor: exhibitor || user._id }).sort({ index: -1 });
          newIndex = (lastItem?.index || 0) + 1;
        }
        catch { };
      }
      const categoryCreated = await categoryController.create({ name: nameVN, names: { vn: nameVN, en: nameEN }, enabled, exhibitor: exhibitor || user._id, index: newIndex });
      return res.status(201).send({
        success: true,
        data: categoryCreated,
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
      if (e.path == 'nameVN' || e.path == 'nameEN') {
        return res.status(400).send({
          success: false,
          validation: false,
          field: e.path,
          message: 'Tên chuyên mục không được để trống',
          messages: langConcat(lang?.resources?.categoryName, lang?.message?.error?.validation?.required),
        });
      }
      if (e.path == 'category')
        return res.status(400).send({
          success: false,
          exist: true,
          current: e.matchCategory,
          field: 'nameVN',
          message: "Tên chuyên mục đã tồn tại",
          messages: langConcat(lang?.resources?.categoryName, lang?.message?.error?.validation?.exist),
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
      if (!bearerToken) throw ({ path: 'token' });
      const user = jwt.verify(bearerToken);
      if (user?.mode != MODE.exhibitor && user?.mode != MODE.admin) throw ({ ...user, path: 'token' });
      const { _ids } = req.query;
      if (!_ids) throw ({ path: '_ids' });
      const query = {
        _id: { $in: _ids.split(",") },
      };
      if (user.mode != MODE.admin) query.exhibitor = user._id;
      await categoryController.removeMany(query);
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
          message: "Danh sách chuyên mục không đúng định dạng",
          messages: langConcat(lang?.resources?.categoryList, lang?.message?.error?.validation?.format),
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

