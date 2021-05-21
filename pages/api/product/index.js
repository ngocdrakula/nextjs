import runMidldleware from '../../../middleware/mongodb';
import productController from '../../../controllers/product';
import sizeController from '../../../controllers/size';
import frontController from '../../../controllers/front';
import roomController from '../../../controllers/room';
import lang, { langConcat } from '../../../lang.config';
import uploader, { cleanFiles } from '../../../middleware/multer';
import jwt from '../../../middleware/jwt'

const handler = async (req, res) => {
  if (req.method == 'GET') {
    try {
      const { page, pageSize, name, sizeId, frontId, roomId, type, enabled } = req.query;
      const query = {};
      const skip = Number(page * pageSize) || 0;
      const limit = Number(pageSize) || 0;
      if (name) query.name = new RegExp(name, "i");
      if (enabled !== undefined) query.enabled = (enabled == "true");
      if (sizeId) query.size = sizeId;
      if (frontId) query.front = frontId;
      if (roomId) query.room = roomId;
      if (type) query.type = type;
      const total = await productController.getlist(query).countDocuments();
      const list = await productController.getlist(query).skip(skip).limit(limit).populate('size').populate('front');
      return res.status(200).send({
        success: true,
        data: list,
        total,
        page: Number(page) || 0,
        pageSize: Number(pageSize) || 0,
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
      if (!user?.mode) throw ({ ...user, path: 'token' });
      const { body: { name, sizeId, frontId, roomId, enabled, type }, files, err } = await uploader(req);
      if (err || !files.length) throw ({ path: 'files' });
      if (!name || !sizeId || !frontId || !roomId) {
        if (!name) throw ({ path: 'name', files })
        if (!sizeId) throw ({ path: 'sizeId', files })
        if (!roomId) throw ({ path: 'roomId', files })
        throw ({ path: 'frontId', files })
      }
      try {
        const size = await sizeController.get(sizeId);
        if (!size) throw ({ path: '_id', files });
      } catch (err) {
        if (err.path == '_id') throw ({ path: 'size', files });
        throw ({ err, files })
      }
      try {
        const front = await frontController.get(frontId);
        if (!front) throw ({ path: '_id', files });
      } catch (err) {
        if (err.path == '_id') throw ({ path: 'front', files });
        throw ({ err, files })
      }
      try {
        const room = await roomController.get(roomId);
        if (!room) throw ({ path: '_id', files });
      } catch (err) {
        if (err.path == '_id') throw ({ path: 'room', files });
        throw ({ err, files })
      }
      if (!type) throw ({ path: 'type', files });

      const matchProduct = await productController.find({ name }).populate('size').populate('front');
      if (matchProduct) throw ({ path: 'product', files, matchProduct })
      const productCreated = await (await productController.create({ name, size: sizeId, front: frontId, room: roomId, image: files[0], enabled, type })).populate('size').populate('front').execPopulate();
      return res.status(201).send({
        success: true,
        data: productCreated,
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
          message: 'Tên sản phẩm không được để trống',
          messages: langConcat(lang?.resources?.productName, lang?.message?.error?.validation?.required)
        });
      }
      if (e.path == 'sizeId') {
        return res.status(400).send({
          success: false,
          validation: false,
          field: 'sizeId',
          message: 'Id kích thước không được để trống',
          messages: langConcat(lang?.resources?.sizeId, lang?.message?.error?.validation?.required)
        });
      }
      if (e.path == 'frontId') {
        return res.status(400).send({
          success: false,
          validation: false,
          field: 'frontId',
          message: 'Id kiểu bề mặt không được để trống',
          messages: langConcat(lang?.resources?.frontId, lang?.message?.error?.validation?.required)
        });
      }
      if (e.path == 'roomId') {
        return res.status(400).send({
          success: false,
          validation: false,
          field: 'roomId',
          message: 'Id kiểu bề mặt không được để trống',
          messages: langConcat(lang?.resources?.roomId, lang?.message?.error?.validation?.required)
        });
      }
      if (e.path == 'type') {
        return res.status(400).send({
          success: false,
          validation: false,
          field: 'type',
          message: 'Loại sản phẩm không được để trống',
        });
      }
      if (e.path == 'size') {
        return res.status(400).send({
          success: false,
          exist: false,
          field: 'size',
          message: "Không gian không tồn tại",
          messages: langConcat(lang?.resources?.size, lang?.message?.error?.validation?.not_exist),
        });
      }
      if (e.path == 'front') {
        return res.status(400).send({
          success: false,
          exist: false,
          field: 'front',
          message: "Kiểu bề mặt không tồn tại",
          messages: langConcat(lang?.resources?.front, lang?.message?.error?.validation?.not_exist),
        });
      }
      if (e.path == 'room') {
        return res.status(400).send({
          success: false,
          exist: false,
          field: 'room',
          message: "Kiểu bề mặt không tồn tại",
          messages: langConcat(lang?.resources?.room, lang?.message?.error?.validation?.not_exist),
        });
      }
      if (e.path == 'product') {
        return res.status(400).send({
          success: false,
          exist: true,
          current: e.matchProduct,
          message: "Tên hoặc mã sản phẩm đã tồn tại",
          messages: langConcat(lang?.resources?.productName, lang?.message?.error?.validation?.exist),
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
      await productController.removeMany(query);
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
          message: "Danh sách sản phẩm phải là một mảng id",
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
