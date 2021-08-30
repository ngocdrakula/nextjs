import runMidldleware from '../../../middleware/mongodb';
import productController from '../../../controllers/product';
import industryController from '../../../controllers/industry';
import categoryController from '../../../controllers/category';
import userController from '../../../controllers/user';
import lang, { langConcat } from '../../../lang.config';
import uploader, { cleanFiles } from '../../../middleware/multer';
import jwt from '../../../middleware/jwt';
import { MODE } from '../../../utils/helper'

const handler = async (req, res) => {
  if (req.method == 'GET') {
    try {
      const { page, pageSize, name, description, categoryId, exbihitorId, industryId, enabled, sort } = req.query;
      const query = {};
      const skip = Number(page * pageSize) || 0;
      const limit = Number(pageSize) || 0;
      const sortObj = {};
      if (sort == 'name') sortObj.name = 1;
      if (sort == 'namereverse') sortObj.name = -1;
      if (name) query.name = new RegExp(name, "i");
      if (enabled != undefined) query.enabled = (enabled == "true");
      if (description) query.description = new RegExp(description, "i");
      if (categoryId) query.category = categoryId;
      if (exbihitorId) query.exbihitor = exbihitorId;
      if (industryId) query.industry = industryId;
      const total = await productController.getlist(query).countDocuments();
      const list = await productController.getlist(query).skip(skip).limit(limit).sort(sortObj).populate('industry').populate('category');
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
      if (user?.mode != MODE.exhibitor && user?.mode != MODE.admin) throw ({ ...user, path: 'token' });
      const { body: { name, categoryId, exbihitorId = user._id, industryId, enabled, description }, files, err } = await uploader(req);
      if (err || !files.length) throw ({ path: 'files' });
      if (!name || !industryId || !description) {
        if (!name) throw ({ path: 'name', files })
        if (!industryId) throw ({ path: 'industry', files })
        throw ({ path: 'description', files })
      }
      // if (!categoryId) throw ({ path: 'category', files })
      // try {
      //   const category = await categoryController.get(categoryId);
      //   if (!category) throw ({ path: '_id', files });
      // } catch (err) {
      //   if (err.path == '_id') throw ({ path: 'category', files });
      //   throw ({ err, files })
      // }
      if (user.mode == MODE.admin) {
        try {
          if (!exbihitorId) throw ({ path: '_id', files })
          const exbihitor = await userController.get(exbihitorId);
          if (!exbihitor) throw ({ path: '_id', files });
        } catch (err) {
          if (err.path == '_id') throw ({ path: 'exbihitor', files });
          throw ({ err, files })
        }
      }
      try {
        const industry = await industryController.get(industryId);
        if (!industry) throw ({ path: '_id', files });
      } catch (err) {
        if (err.path == '_id') throw ({ path: 'industry', files });
        throw ({ err, files })
      }
      const matchProduct = await productController.find({ name }).populate('category').populate('exbihitor').populate('industry');
      if (matchProduct) throw ({ path: 'product', files, matchProduct });
      const productCreated = await (await productController.create({
        name,
        image: files[0],
        description,
        // category: categoryId,
        exbihitor: exbihitorId,
        industry: industryId,
        enabled: !(enabled == 'false')
      })).populate('category').populate('exbihitor').populate('industry').execPopulate();
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
      if (e.path == 'industryId') {
        return res.status(400).send({
          success: false,
          validation: false,
          field: 'industryId',
          message: 'Id ngành nghề không được để trống',
          messages: langConcat(lang?.resources?.industryId, lang?.message?.error?.validation?.required)
        });
      }
      if (e.path == 'categoryId') {
        return res.status(400).send({
          success: false,
          validation: false,
          field: 'categoryId',
          message: 'Id chuyên mục không được để trống',
          messages: langConcat(lang?.resources?.categoryId, lang?.message?.error?.validation?.required)
        });
      }
      if (e.path == 'exbihitor') {
        return res.status(400).send({
          success: false,
          validation: false,
          field: 'exbihitor',
          message: 'Id tài khoản không được để trống',
          messages: langConcat(lang?.resources?.exbihitorId, lang?.message?.error?.validation?.required)
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
      if (e.path == 'industry') {
        return res.status(400).send({
          success: false,
          exist: false,
          field: 'industry',
          message: "Không gian không tồn tại",
          messages: langConcat(lang?.resources?.industry, lang?.message?.error?.validation?.not_exist),
        });
      }
      if (e.path == 'category') {
        return res.status(400).send({
          success: false,
          exist: false,
          field: 'category',
          message: "Kiểu bề mặt không tồn tại",
          messages: langConcat(lang?.resources?.category, lang?.message?.error?.validation?.not_exist),
        });
      }
      if (e.path == 'exbihitor') {
        return res.status(400).send({
          success: false,
          exist: false,
          field: 'exbihitor',
          message: "Kiểu bề mặt không tồn tại",
          messages: langConcat(lang?.resources?.exbihitor, lang?.message?.error?.validation?.not_exist),
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
