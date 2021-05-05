import connectDB from '../../../middleware/mongodb';
import productController from '../../../controllers/product';
import sizeController from '../../../controllers/size';
import frontController from '../../../controllers/front';
import lang, { langConcat } from '../../../lang.config';
import uploader, { cleanFiles } from '../../../middleware/multer';
import jwt from '../../../middleware/jwt'

const handler = async (req, res) => {
  if (req.method == 'GET') {
    try {
      const { id } = req.query;
      const currentProduct = await productController.get(id);
      if (!currentProduct) throw ({ path: '_id' })
      return res.status(201).send({
        success: true,
        data: currentProduct,
      });
    } catch (e) {
      if (e.path == "_id") {
        return res.status(400).send({
          success: false,
          exist: false,
          message: "Sản phẩm không tồn tại hoặc đã bị xóa",
          messages: langConcat(lang?.resources?.product, lang?.message?.error?.validation?.not_exist),
        });
      }
      return res.status(500).send({
        success: false,
        message: e.message,
        messages: lang?.message?.error?.server,
        error: e,
      });
    }
  } else if (req.method == 'POST') {
    try {
      const contentType = req.headers['content-type'];
      const bearerToken = req.headers['authorization'];
      if (!bearerToken) throw ({ path: 'token' });
      if (!contentType || contentType.indexOf('multipart/form-data') == -1)
        throw ({ path: 'content-type', contentType });
      const user = jwt.verify(bearerToken);
      if (!user || !user.mode) throw ({ ...user, path: 'token' });
      const { body: { name, code, sizeId, frontId, outSide, enabled }, files, err } = await uploader(req);
      if (err) throw ({ path: 'files' });
      try {
        const currentProduct = await productController.get(req.query.id);
        if (!currentProduct) throw ({ path: '_id', files });
        if (sizeId) {
          try {
            const size = await sizeController.get(sizeId);
            if (!size) throw ({ path: '_id' })
            currentProduct.size = sizeId;
          } catch (err) {
            if (err.path == '_id') throw ({ path: 'size', files });
            throw ({ err, files })
          }
        }
        if (frontId) {
          try {
            const front = await frontController.get(frontId);
            if (!front) throw ({ path: '_id' })
            currentProduct.front = frontId;
          } catch (err) {
            if (err.path == '_id') throw ({ path: 'front', files });
            throw ({ err, files })
          }
        }
        if (name || code) {
          const matchProduct = await productController.find({ $or: [{ name }, { code }] });
          if (matchProduct) {
            if (matchProduct.name == name) throw ({ path: 'name', files });
            throw ({ path: 'code', files });
          }
          else {
            if (name) currentProduct.name = name;
            else currentProduct.code = code;
          }
        }
        if (outSide != undefined) {
          currentProduct.outSide = (outSide == "true")
        }
        if (enabled != undefined) {
          currentProduct.enabled = (enabled == "true");
        }
        if (files.length) {
          await cleanFiles([currentProduct.image]);
          currentProduct.image = files[0];
        }
        const productUpdated = await (await currentProduct.save()).populate('size').populate('front').execPopulate();
        return res.status(200).send({
          success: true,
          data: productUpdated,
          message: 'Cập nhật thành công',
          messages: lang?.message?.success?.updated
        });
      } catch (error) {
        if (error.path == "_id") throw ({ path: 'product', files });
        throw error
      }
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
      if (e.path == 'size') {
        return res.status(400).send({
          success: false,
          exist: false,
          field: 'size',
          message: "Không gian không tồn tại hoặc đã bị xóa",
          messages: langConcat(lang?.resources?.size, lang?.message?.error?.validation?.not_exist),
        });
      }
      if (e.path == 'front') {
        return res.status(400).send({
          success: false,
          exist: false,
          field: 'front',
          message: "Kiểu bề mặt không tồn tại hoặc đã bị xóa",
          messages: langConcat(lang?.resources?.front, lang?.message?.error?.validation?.not_exist),
        });
      }
      if (e.path == 'product') {
        return res.status(400).send({
          success: false,
          exist: false,
          message: "Sản phẩm không tồn tại hoặc đã bị xóa",
          messages: langConcat(lang?.resources?.product, lang?.message?.error?.validation?.not_exist),
        });
      }
      if (e.path == 'name') {
        return res.status(400).send({
          success: false,
          exist: true,
          field: 'name',
          message: 'Tên sản phẩm đã tồn tại',
          messages: langConcat(lang?.resources?.productName, lang?.message?.error?.validation?.exist)
        });
      }
      if (e.path == 'code') {
        return res.status(400).send({
          success: false,
          exist: true,
          field: 'code',
          message: 'Mã sản phẩm đã tồn tại',
          messages: langConcat(lang?.resources?.productCode, lang?.message?.error?.validation?.exist)
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
      if (!user || !user.mode) throw ({ ...user, path: 'token' });
      const currentProduct = await productController.get(req.query.id);
      if (!currentProduct) throw ({ path: '_id' });
      cleanFiles([currentProduct.image])
      currentProduct.remove();
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
          message: "Sản phẩm không tồn tại hoặc đã bị xóa",
          messages: langConcat(lang?.resources?.product, lang?.message?.error?.validation?.not_exist),
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
    res.status(422).send({
      success: false,
      message: 'Phương thức không được hỗ trợ, vui lòng đổi sang phương thức POST',
      messages: lang?.message?.error?.method
    });
  } else {
    res.status(422).send({
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

export default connectDB(handler);

