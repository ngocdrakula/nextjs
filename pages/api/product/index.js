import connectDB from '../../../middleware/mongodb';
import productController from '../../../controllers/product';
import sizeController from '../../../controllers/size';
import frontController from '../../../controllers/front';
import lang, { langConcat } from '../../../lang.config';
import uploader, { cleanFiles } from '../../../middleware/multer';
import jwt from '../../../middleware/jwt'

const handler = async (req, res) => {
  if (req.method === 'GET') {
    try {
      const { page, pageSize, name, code, sizes, fronts, outSide } = req.query;
      const query = {};
      const skip = Number(page * pageSize) || 0;
      const limit = Number((page + 1) * pageSize) || 0;
      if (name) query.name = name;
      if (code) query.code = code;
      if (sizes) {
        try {
          const sizesParser = JSON.parse(sizes);
          query.size = {
            $in: sizesParser
          };
        } catch (e) { }
      }
      if (fronts) {
        try {
          const frontsParser = JSON.parse(fronts);
          query.front = {
            $in: frontsParser
          };
        } catch (e) { }
      }
      if (outSide !== undefined) {
        query.outSide = (!outSide || outSide === 'false') ? false : true;
      }
      const total = await productController.getlist(query).countDocuments();
      const list = await productController.getlist(query).skip(skip).limit(limit).populate('size').populate('front');
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
  } else if (req.method === 'POST') {
    try {
      const contentType = req.headers['content-type'];
      const bearerToken = req.headers['authorization'];
      if (!bearerToken) throw ({ path: 'token' })
      if (!contentType || contentType.indexOf('multipart/form-data') == -1)
        throw ({ path: 'content-type', contentType });
      const user = jwt.verify(bearerToken);
      if (!user || !user._id) throw ({ ...user, path: 'token' });
      const { body: { name, code, sizeId, frontId, outSide }, files, err } = await uploader(req); 
      if (err || !files.length) throw ({ path: 'files' });
      if (!name || !code || !sizeId || !frontId) {
        if (!name) throw ({ path: 'name', files })
        if (!code) throw ({ path: 'code', files })
        if (!sizeId) throw ({ path: 'sizeId', files })
        throw ({ path: 'frontId', files })
      }
      try {
        const size = await sizeController.get(sizeId);
        if (!size) throw ({ path: '_id', files });
      } catch (err) {
        if (err.path === '_id') throw ({ path: 'size', files });
        throw ({ err, files })
      }
      try {
        const front = await frontController.get(frontId);
        if (!front) throw ({ path: '_id', files });
      } catch (err) {
        if (err.path === '_id') throw ({ path: 'front', files });
        throw ({ err, files })
      }
      const matchProduct = await productController.find({ name, code }).populate('size').populate('front');
      if (matchProduct) throw ({ path: 'product', files, matchProduct })
      const productCreated = await (await productController.create({ name, code, size: sizeId, front: frontId, image: files[0], outSide: !([undefined, false, "0", "false", "null"].indexOf(outSide) + 1) })).populate('size').populate('front').execPopulate();
      return res.status(201).send({
        success: true,
        data: productCreated,
        message: 'Thêm thành công',
        messages: lang?.message?.success?.created
      });
    } catch (e) {
      if (e.files) await cleanFiles(e.files);
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
      if (e.path === 'content-type') {
        return res.status(400).send({
          success: false,
          headerContentType: false,
          contentType,
          aceptedOnly: 'multipart/form-data',
          message: 'Header không được chấp nhận',
          messages: lang?.message?.error?.header_not_acepted
        });
      }
      if (e.path === 'files') {
        return res.status(400).send({
          success: false,
          upload: false,
          field: 'files',
          message: 'Upload không thành công',
          messages: lang?.message?.error?.upload_failed,
        });
      }
      if (e.path === 'name') {
        return res.status(400).send({
          success: false,
          validation: false,
          field: 'name',
          message: 'Tên sản phẩm không được để trống',
          messages: langConcat(lang?.resources?.productName, lang?.message?.error?.validation?.required)
        });
      }
      if (e.path === 'code') {
        return res.status(400).send({
          success: false,
          validation: false,
          field: 'code',
          message: 'Mã sản phẩm không được để trống',
          messages: langConcat(lang?.resources?.productCode, lang?.message?.error?.validation?.required)
        });
      }
      if (e.path === 'sizeId') {
        return res.status(400).send({
          success: false,
          validation: false,
          field: 'sizeId',
          message: 'Id kích thước không được để trống',
          messages: langConcat(lang?.resources?.sizeId, lang?.message?.error?.validation?.required)
        });
      }
      if (e.path === 'frontId') {
        return res.status(400).send({
          success: false,
          validation: false,
          field: 'frontId',
          message: 'Id kiểu bề mặt không được để trống',
          messages: langConcat(lang?.resources?.frontId, lang?.message?.error?.validation?.required)
        });
      }
      if (e.path === 'outSize') {
        return res.status(400).send({
          success: false,
          validation: false,
          field: 'outSize',
          message: 'Loại sản phẩm không được để trống',
          messages: langConcat(lang?.resources?.outSize, lang?.message?.error?.validation?.required)
        });
      }
      if (e.path === 'size') {
        return res.status(400).send({
          success: false,
          exist: false,
          field: 'size',
          message: "Không gian không tồn tại",
          messages: langConcat(lang?.resources?.size, lang?.message?.error?.validation?.not_exist),
        });
      }
      if (e.path === 'front') {
        return res.status(400).send({
          success: false,
          exist: false,
          field: 'front',
          message: "Kiểu bề mặt không tồn tại",
          messages: langConcat(lang?.resources?.front, lang?.message?.error?.validation?.not_exist),
        });
      }
      if (e.path === 'product') {
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

export default connectDB(handler);
