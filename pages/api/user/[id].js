import runMidldleware from '../../../middleware/mongodb';
import userController from '../../../controllers/user';
import lang, { langConcat } from '../../../lang.config';
import uploader, { cleanFiles } from '../../../middleware/multer';
import jwt from '../../../middleware/jwt';

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
          password, newpassword, name, phone,
          hotline, fax, representative, position, mobile, re_email, website, introduce,
          product, contact
        },
        files, err } = await uploader(req);
      if (err) throw ({ path: 'files' });
      try {
        const currentUser = await userController.get(id);
        if (!currentUser) throw ({ path: '_id', files });
        if (files.length) {
          await cleanFiles([currentUser.image]);
          currentUser.image = files[0];
        }
        if (password && newpassword && password != newpassword) {
          const loged = await bcrypt.compare(password, user.password);
          if (loged) {
            const hash = await bcrypt.create(newpassword);
            currentUser.password = hash;
          }
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
        if (contact) currentUser.contact = contact;

        await currentUser.save();
        return res.status(200).send({
          success: true,
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
      if (e.path == 'user') {
        return res.status(400).send({
          success: false,
          exist: false,
          message: "Tài khoản không tồn tại hoặc đã bị xóa",
          messages: langConcat(lang?.resources?.user, lang?.message?.error?.validation?.not_exist),
        });
      }
      return res.status(500).send({
        success: false,
        message: 'Máy chủ không phản hồi',
        messages: lang?.message?.error?.server,
        error: e.err,
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

