import runMidldleware from '../../../middleware/mongodb';
import userController from '../../../controllers/user';
import industryController from '../../../controllers/industry';
import lang, { langConcat } from '../../../lang.config';
import uploader, { cleanFiles } from '../../../middleware/multer';
import jwt from '../../../middleware/jwt';
import bcrypt from '../../../middleware/bcrypt';
import { MODE } from '../../../utils/helper';

const handler = async (req, res) => {
  if (req.method == 'GET') {
    try {
      const { id } = req.query;
      const currentUser = await userController.get(id).populate('industry');
      if (!currentUser) throw ({ path: '_id' });
      return res.status(201).send({
        success: true,
        data: currentUser,
      });
    } catch (e) {
      if (e.path == "_id") {
        return res.status(400).send({
          success: false,
          exist: false,
          message: "Người dùng không tồn tại hoặc đã bị xóa",
          messages: langConcat(lang?.resources?.user, lang?.message?.error?.validation?.not_exist),
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
      const { id } = req.query;
      const contentType = req.headers['content-type'];
      const bearerToken = req.headers['authorization'];
      if (!contentType || contentType.indexOf('multipart/form-data') == -1)
        throw ({ path: 'content-type', contentType });
      const user = bearerToken && jwt.verify(bearerToken);
      if (user?.mode != MODE.exhibitor && user?.mode != MODE.admin) throw ({ ...user, path: 'token' });
      const {
        body: {
          email, password, newpassword, name, phone, industry, address,
          hotline, fax, representative, position, mobile, re_email, website, introduce,
          product, contact, enabled, avatar, image
        },
        files, err } = await uploader(req);
      if (err) throw ({ path: 'files' });
      try {
        const currentUser = await userController.get(id);
        if (!currentUser) throw ({ path: '_id', files });
        if (files.length) {
          if (avatar) {
            await cleanFiles([currentUser.avatar]);
            currentUser.avatar = files[0];
            if (image) {
              await cleanFiles([currentUser.image]);
              currentUser.image = files[1];
            }
          } else if (image) {
            await cleanFiles([currentUser.image]);
            currentUser.image = files[0];
          }
        }
        if (password && newpassword && password != newpassword) {
          const loged = await bcrypt.compare(password, currentUser.password);
          if (loged || user.mode === MODE.admin) {
            const hash = await bcrypt.create(newpassword);
            currentUser.password = hash;
          }
          else throw ({ path: 'password' })
        }
        if (email && user.mode == MODE.admin) {
          try {
            const matchUser = await userController.find({ email });
            if (matchUser && matchUser._id + "" != currentUser._id) throw ({ path: 'email' });
          }
          catch (e) { throw ({ path: 'email' }); };
          currentUser.email = email;
        }
        if (name) currentUser.name = name;
        if (phone) currentUser.phone = phone;
        if (hotline) currentUser.hotline = hotline;
        if (fax) currentUser.fax = fax;
        if (representative) currentUser.representative = representative;
        if (position) currentUser.position = position;
        if (mobile) currentUser.mobile = mobile;
        if (re_email) currentUser.re_email = re_email;
        if (website) currentUser.website = website;
        if (introduce) currentUser.introduce = introduce;
        if (product) currentUser.product = product;
        if (address) currentUser.address = address;
        if (contact) currentUser.contact = contact;
        if (enabled) currentUser.enabled = !(enabled == 'false');
        if (industry) {
          try {
            const currentIndustry = await industryController.get(industry);
            if (!currentIndustry) throw ({ path: 'industry' });
            currentUser.industry = [industry];
          }
          catch (e) { throw ({ path: 'industry' }); };
        }
        const userUpdated = (await currentUser.save()).populate('industry');
        return res.status(200).send({
          success: true,
          data: userUpdated,
          message: 'Cập nhật thành công',
          messages: lang?.message?.success?.updated
        });
      } catch (error) {
        if (error.path == "_id") throw ({ path: 'user', files });
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
      if (e.path == 'email') {
        return res.status(400).send({
          success: false,
          field: e.path,
          exist: true,
          message: "Email đã tồn tại",
        });
      }
      if (e.path == 'industry') {
        return res.status(400).send({
          success: false,
          require: true,
          field: e.path,
          message: "Ngành nghề là bắt buộc",
        });
      }
      if (e.path == '_id') {
        return res.status(400).send({
          success: false,
          exist: true,
          field: e.path,
          message: "Tài khoản không tồn tại",
        });
      }
      if (e.path == 'industry') {
        return res.status(400).send({
          success: false,
          exist: true,
          field: e.path,
          message: "Ngành nghề không tồn tại",
        });
      }
      if (e.path == 'phone') {
        return res.status(400).send({
          success: false,
          require: true,
          field: e.path,
          message: "Số điện thoại là bắt buộc",
        });
      }
      if (e.path == 'representative') {
        return res.status(400).send({
          success: false,
          require: true,
          field: e.path,
          message: "Người đại diện là bắt buộc",
        });
      }
      if (e.path == 'position') {
        return res.status(400).send({
          success: false,
          require: true,
          field: e.path,
          message: "Chức vụ người đại diện là bắt buộc",
        });
      }
      if (e.path == 'mobile') {
        return res.status(400).send({
          success: false,
          require: true,
          field: e.path,
          message: "Số điện thoại người đại diện là bắt buộc",
        });
      }
      if (e.path == 're_email') {
        return res.status(400).send({
          success: false,
          require: true,
          field: e.path,
          message: "Email người đại diện là bắt buộc",
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
      if (user?.mode != MODE.admin) throw ({ ...user, path: 'token' });
      const userCurrent = await userController.get(req.query.id);
      if (!userCurrent) throw ({ path: '_id' });
      cleanFiles([userCurrent.image, userCurrent.image])
      userCurrent.remove();
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
          message: "Tài khoản tồn tại hoặc đã bị xóa",
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

export default runMidldleware(handler);

