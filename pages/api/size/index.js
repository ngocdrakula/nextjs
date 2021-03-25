import connectDB from '../../../middleware/mongodb';
import sizeController from '../../../controllers/size';
import lang, { langConcat } from '../../../lang.config';

const handler = async (req, res) => {
  if (req.method === 'GET') {
    try {
      const { page, pageSize } = req.query;
      const query = {};
      const skip = Number(page * pageSize) || 0;
      const limit = Number((page + 1) * pageSize) || 0;
      const total = await sizeController.getlist(query).countDocuments();
      const list = await sizeController.getlist(query).skip(skip).limit(limit);
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
  } else if (req.method === 'POST') {
    try {
      const { width, height } = req.body;
      if (!width || !height) throw ({ path: !width ? 'width' : 'height', required: true });
      if (!(width > 0) || !(height > 0)) throw ({ path: !(width > 0) ? 'width' : 'height' })
      const size = { width: Number(width), height: Number(height) };
      const matchSize = await sizeController.find(size);
      if (matchSize) throw ({ path: 'size', matchSize })
      const sizeCreated = await sizeController.create(size);
      return res.status(201).send({
        success: true,
        data: sizeCreated,
        message: 'Thêm thành công',
        messages: lang?.message?.success?.created
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
      if (e.path === "width" || e.path === "height") {
        if (path.required) {
          return res.status(400).send({
            success: false,
            required: false,
            field: e.path,
            message: 'Kích thước không được để trống',
            messages: langConcat(lang?.resources?.[field], lang?.message?.error?.validation?.required),
          });
        }
        return res.status(400).send({
          success: false,
          format: false,
          field: e.path,
          message: "Kích thước không đúng định dạng",
          messages: langConcat(lang?.resources?.size, lang?.message?.error?.validation?.format),
        });
      }
      if (e.path === 'size') {
        return res.status(400).send({
          success: false,
          exist: true,
          current: e.matchSize,
          message: "Kích thước đã tồn tại",
          messages: langConcat(lang?.resources?.size, lang?.message?.error?.validation?.exist),
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

export default connectDB(handler);

