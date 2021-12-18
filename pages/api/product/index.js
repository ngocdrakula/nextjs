import runMidldleware from '../../../middleware/mongodb';
import productController from '../../../controllers/product';
import categoryController from '../../../controllers/category';
import userController from '../../../controllers/user';
import lang, { langConcat } from '../../../lang.config';
import uploader, { cleanFiles } from '../../../middleware/multer';
import jwt from '../../../middleware/jwt';
import { MODE } from '../../../utils/helper'

const handler = async (req, res) => {
  if (req.method == 'GET') {
    try {
      const { page, pageSize = 100, name, description, categoryId, exhibitorId, enabled, setIndex } = req.query;
      if (setIndex) {
        const list = await productController.getlist({});
        let i = 1;
        for (let product of list) {
          if (!product.exhibitor) await product.remove();
          else {
            product.index = i;
            await product.save();
          }
          i++;
        }
        return res.status(200).send({
          success: true,
          total: i - 1,
        });
      }
      const query = {};
      const skip = Number(page * pageSize) || 0;
      const limit = Number(pageSize) || 0;
      if (name) query.name = new RegExp(name, "i");
      if (enabled) query.enabled = !(enabled == "false");
      if (description) query.description = new RegExp(description, "i");
      if (categoryId) query.category = categoryId;
      if (exhibitorId) query.exhibitor = exhibitorId;
      const total = await productController.getlist(query).countDocuments();
      const list = await productController.getlist(query).skip(skip).limit(limit).sort({ index: -1 });
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
        message: 'Máy chủ không phản hồi',
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
      if (user?.mode != MODE.exhibitor && user?.mode != MODE.admin) throw ({ ...user, path: 'token' });
      const { body: { nameVN, nameEN, categoryId, exhibitorId = user._id, enabled, descriptionVN, descriptionEN, index }, files, err } = await uploader(req);
      if (err || !files.length) throw ({ path: 'files' });

      if (!nameVN || !nameEN || !categoryId || !descriptionVN || !descriptionEN) {
        if (!nameVN) throw ({ path: 'nameVN', files })
        if (!nameEN) throw ({ path: 'nameEN', files })
        if (!categoryId) throw ({ path: 'categoryId', files })
        if (!descriptionVN) throw ({ path: 'descriptionVN', files })
        throw ({ path: 'descriptionEN', files })
      }
      if (user.mode == MODE.admin) {
        try {
          if (!exhibitorId) throw ({ path: '_id', files })
          const exhibitor = await userController.get(exhibitorId);
          if (!exhibitor) throw ({ path: '_id', files });
        } catch (err) {
          if (err.path == '_id') throw ({ path: 'exhibitor', files });
          throw ({ err, files })
        }
      }
      try {
        const category = await categoryController.get(categoryId);
        if (!category) throw ({ path: '_id', files });
      } catch (err) {
        if (err.path == '_id') throw ({ path: 'category', files });
        throw ({ err, files })
      }
      const matchProduct = await productController.find({ name: nameVN, exhibitor: exhibitorId, category: categoryId });
      if (matchProduct) throw ({ path: 'product', files, matchProduct });
      let newIndex = 0;
      if (index >= 0) {
        if (index == 0) {
          try {
            const lastItem = await productController.find({ exhibitor: exhibitorId }).sort({ index: -1 });
            newIndex = lastItem.index + 1;
          } catch {
            newIndex = 1;
          }
        }
        else {
          try {
            const list = await productController.getlist({ exhibitor: exhibitorId }).skip(index - 1).limit(2).sort({ index: -1 });
            const beforeIndex = list[0]?.index || 1;
            const afterIndex = list[1]?.index || 0;
            newIndex = (beforeIndex + afterIndex) / 2;
          } catch {
          }
        }
      }
      else {
        try {
          const lastItem = await productController.find({ exhibitor: exhibitorId }).sort({ index: -1 });
          newIndex = (lastItem?.index || 0) + 1;
        }
        catch { };
      }
      const productCreated = await (await productController.create({
        name: nameVN,
        names: { vn: nameVN, en: nameEN },
        image: files[0],
        description: descriptionVN,
        descriptions: { vn: descriptionVN, en: descriptionEN },
        exhibitor: exhibitorId,
        category: categoryId,
        enabled: !(enabled == 'false'),
        index: newIndex
      })).execPopulate();
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
      if (e.path == 'nameVN' || e.path == 'nameEN') {
        return res.status(400).send({
          success: false,
          validation: false,
          field: e.path,
          message: 'Tên sản phẩm không được để trống',
          messages: langConcat(lang?.resources?.productName, lang?.message?.error?.validation?.required)
        });
      }
      if (e.path == 'descriptionVN' || e.path == 'descriptionEN') {
        return res.status(400).send({
          success: false,
          validation: false,
          field: e.path,
          message: 'Mô tả sản phẩm không được để trống',
          messages: langConcat(lang?.resources?.description, lang?.message?.error?.validation?.required)
        });
      }
      if (e.path == 'categoryId') {
        return res.status(400).send({
          success: false,
          validation: false,
          field: 'categoryId',
          message: 'Chuyên mục không được để trống',
          messages: langConcat(lang?.resources?.category, lang?.message?.error?.validation?.required)
        });
      }
      if (e.path == 'exhibitorId') {
        return res.status(400).send({
          success: false,
          validation: false,
          field: 'exhibitor',
          message: 'Người dùng không tồn tại',
          messages: langConcat(lang?.resources?.user, lang?.message?.error?.validation?.not_exist)
        });
      }
      if (e.path == 'category') {
        return res.status(400).send({
          success: false,
          exist: false,
          field: 'category',
          message: "Chuyên mục không tồn tại",
          messages: langConcat(lang?.resources?.category, lang?.message?.error?.validation?.not_exist),
        });
      }
      if (e.path == 'product') {
        return res.status(400).send({
          success: false,
          exist: true,
          current: e.matchProduct,
          field: 'name',
          message: "Tên sản phẩm đã tồn tại",
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
          message: "Danh sách sản phẩm không đúng định dạng",
          messages: langConcat(lang?.resources?.productList, lang?.message?.error?.validation?.format),
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
