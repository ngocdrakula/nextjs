import runMidldleware from '../../../middleware/mongodb';
import categoryController from '../../../controllers/category';
import lang, { langConcat } from '../../../lang.config';
import jwt from '../../../middleware/jwt'

const handler = async (req, res) => {
  if (req.method == 'GET') {
    try {
      const { page, pageSize, enabled, name } = req.query;
      const query = {};
      if (name) query.name = new RegExp(name, "i");
      if (enabled != undefined) query.enabled = (enabled == "true");
      const skip = Number(page * pageSize) || 0;
      const limit = Number(pageSize) || 0;
      const total = await categoryController.getlist(query).countDocuments();
      const list = await categoryController.getlist(query).skip(skip).limit(limit);
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
        message: error.message,
        messages: lang?.message?.error?.server,
        error: error,
      });
    }
  } else if (req.method == 'POST') {
    try {
      const bearerToken = req.headers['authorization'];
      if (!bearerToken) throw ({ path: 'token' })
      const user = jwt.verify(bearerToken);
      if (user?.mode != MODE.exhibitor && user?.mode != MODE.admin) throw ({ ...user, path: 'token' });
      const { name, index } = req.body;
      if (!name) throw ({ path: 'name' })
      try {
        const matchFront = await categoryController.find({ name });
        if (matchFront) throw ({ path: 'category', matchFront });
        const categoryCreated = await categoryController.create({ name, index: Number(index) || 0 });
        return res.status(201).send({
          success: true,
          data: categoryCreated,
          message: 'Thêm thành công',
          messages: lang?.message?.success?.created
        });

      } catch (error) {
        throw error
      }
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
          validation: false,
          field: 'name',
          message: 'Tên chuyên mục không được để trống',
          messages: langConcat(lang?.resources?.categoryName, lang?.message?.error?.validation?.required),
        });
      }
      if (e.path == 'category')
        return res.status(400).send({
          success: false,
          exist: true,
          current: e.matchFront,
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
  } else {
    return res.status(422).send({
      success: false,
      message: 'Phương thức không được hỗ trợ',
      messages: lang?.message?.error?.method
    });
  }
};

export default runMidldleware(handler);

