import runMidldleware from '../../../middleware/mongodb';
import userController from '../../../controllers/user';
import industryController from '../../../controllers/industry';
import lang, { langConcat } from '../../../lang.config';
import uploader, { cleanFiles } from '../../../middleware/multer';
import jwt from '../../../middleware/jwt';
import bcrypt from '../../../middleware/bcrypt';
import { MODE, nonAccentVietnamese } from '../../../utils/helper';

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
        message: 'Máy chủ không phản hồi',
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
      if (user?._id != id && user?.mode != MODE.admin) throw ({ ...user, path: 'token' });
      const {
        body: {
          email, password, newpassword, name, phone, industry, address,
          hotline, fax, representative, position, mobile, re_email, website, introduce,
          product, contact, enabled, avatar, image,
          nameEN, positionEN, representativeEN, addressEN, introduceEN, contactEN, productEN,
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
        if (password) {
          if (!newpassword || password == newpassword || newpassword.length < 8) throw ({ path: 'newpassword' })
          const loged = await bcrypt.compare(password, currentUser.password);
          if (loged || (user.mode == MODE.admin && currentUser.mode != MODE.admin)) {
            const hash = await bcrypt.create(newpassword);
            currentUser.password = hash;
          }
          else throw ({ path: 'password' })
        }
        if (email) {
          try {
            const matchUser = await userController.find({ email });
            if (matchUser && matchUser._id + "" != currentUser._id) throw ({ path: 'email' });
          }
          catch (e) { throw ({ path: 'email' }); };
          currentUser.email = email;
        }
        if (name) currentUser.name = name;
        if (name) currentUser.names.vn = name;
        if (name) currentUser.search = nonAccentVietnamese(name);
        if (name) currentUser.searchs.vn = nonAccentVietnamese(name);
        if (nameEN) currentUser.names.en = nameEN;
        if (nameEN) currentUser.searchs.en = nonAccentVietnamese(nameEN);
        if (phone) currentUser.phone = phone;
        if (hotline) currentUser.hotline = hotline;
        if (fax) currentUser.fax = fax;
        if (representative) currentUser.representative = representative;
        if (representative) currentUser.representatives.vn = representative;
        if (representativeEN) currentUser.representatives.en = representativeEN;
        if (position) currentUser.position = position;
        if (position) currentUser.positions.vn = position;
        if (positionEN) currentUser.positions.en = positionEN;
        if (mobile) currentUser.mobile = mobile;
        if (re_email) currentUser.re_email = re_email;
        if (website) currentUser.website = website;
        if (introduce) currentUser.introduce = introduce;
        if (introduce) currentUser.introduces.vn = introduce;
        if (introduceEN) currentUser.introduces.en = introduceEN;
        if (product) currentUser.product = product;
        if (product) currentUser.products.vn = product;
        if (productEN) currentUser.products.en = productEN;
        if (address) currentUser.address = address;
        if (address) currentUser.addresss.vn = address;
        if (addressEN) currentUser.addresss.en = addressEN;
        if (contact) currentUser.contact = contact;
        if (contact) currentUser.contacts.vn = contact;
        if (contactEN) currentUser.contacts.en = contactEN;
        if (enabled) currentUser.enabled = !(enabled == 'false');
        if (industry) {
          try {
            const currentIndustry = await industryController.get(industry);
            if (!currentIndustry) throw ({ path: 'industry' });
            currentUser.industry = [industry];
          }
          catch (e) { throw ({ path: 'industry' }); };
        }
        const userUpdated = await (await currentUser.save()).populate('industry').execPopulate();
        let token = null;
        if (user._id = id && (email || name)) {
          const { _id, email, name, names, createdAt, mode } = userUpdated;
          token = jwt.create({ _id, email, name, names, createdAt, mode });
        }
        return res.status(200).send({
          success: true,
          data: userUpdated,
          token,
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
          messages: langConcat(lang?.resources?.email, lang?.message?.error?.validation?.exist),
        });
      }
      if (e.path == 'industry') {
        return res.status(400).send({
          success: false,
          exist: true,
          field: e.path,
          message: "Ngành nghề không tồn tại",
          messages: langConcat(lang?.resources?.industry, lang?.message?.error?.validation?.exist),
        });
      }
      if (e.path == '_id') {
        return res.status(400).send({
          success: false,
          exist: true,
          field: e.path,
          message: "Tài khoản không tồn tại",
          messages: langConcat(lang?.resources?.user, lang?.message?.error?.validation?.exist),
        });
      }
      if (e.path == 'phone') {
        return res.status(400).send({
          success: false,
          require: true,
          field: e.path,
          message: "Số điện thoại là bắt buộc",
          messages: langConcat(lang?.resources?.phone, lang?.message?.error?.validation?.required),
        });
      }
      if (e.path == 'representative') {
        return res.status(400).send({
          success: false,
          require: true,
          field: e.path,
          message: "Người đại diện là bắt buộc",
          messages: langConcat(lang?.resources?.representative, lang?.message?.error?.validation?.required),
        });
      }
      if (e.path == 'position') {
        return res.status(400).send({
          success: false,
          require: true,
          field: e.path,
          message: "Chức vụ là bắt buộc",
          messages: langConcat(lang?.resources?.position, lang?.message?.error?.validation?.required),
        });
      }
      if (e.path == 'mobile') {
        return res.status(400).send({
          success: false,
          require: true,
          field: e.path,
          message: "Số điện thoại người đại diện là bắt buộc",
          messages: langConcat(lang?.resources?.mobile, lang?.message?.error?.validation?.required),
        });
      }
      if (e.path == 're_email') {
        return res.status(400).send({
          success: false,
          require: true,
          field: e.path,
          message: "Email người đại diện là bắt buộc",
          messages: langConcat(lang?.resources?.re_email, lang?.message?.error?.validation?.required),
        });
      }
      if (e.path == 'password') {
        return res.status(400).send({
          success: false,
          require: true,
          field: e.path,
          message: "Mật khẩu hiện tại không chính xác",
          messages: langConcat(lang?.resources?.password, lang?.message?.error?.validation.incorrect),
        });
      }
      if (e.path == 'newpassword') {
        return res.status(400).send({
          success: false,
          require: true,
          field: e.path,
          message: "Mật khẩu mới không đúng định dạng",
          messages: langConcat(lang?.resources?.password, lang?.message?.error?.validation.format),
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
          message: "Người dùng không tồn tại hoặc đã bị xóa",
          messages: langConcat(lang?.resources?.user, lang?.message?.error?.validation?.not_exist),
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

