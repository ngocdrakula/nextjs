import runMidldleware from '../../../middleware/mongodb';
import contactController from '../../../controllers/contact';
import lang, { langConcat } from '../../../lang.config';
import jwt from '../../../middleware/jwt'
import { MODE } from '../../../utils/helper';

const handler = async (req, res) => {
  if (req.method == 'GET') {
    try {
      const bearerToken = req.headers['authorization'];
      if (!bearerToken) throw ({ path: 'token' })
      const user = jwt.verify(bearerToken);
      if (user?.mode != MODE.admin) throw ({ ...user, path: 'token' });
      const { page, pageSize = 100, read, name } = req.query;
      const query = {};
      if (name) {
        query.$and = [{
          $or: [{ name: new RegExp(name, "i") }, { email: new RegExp(name, "i") }, { title: new RegExp(name, "i") }]
        }];
        if (read) query.$and.push({ read: !(read == "false") })
      }
      else if (read) query.read = !(read == "false");
      const skip = Number(page * pageSize) || 0;
      const limit = Number(pageSize) || 100;
      const total = await contactController.getlist(query).countDocuments();
      const list = await contactController.getlist(query).skip(skip).limit(limit);
      return res.status(200).send({
        success: true,
        data: list,
        total,
        page: Number(page) || 0,
        pageSize: Number(pageSize) || 100
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
      const { email, name, title, message } = req.body;
      if (!email) throw ({ path: 'email', required: true });
      if (!name) throw ({ path: 'name', required: true });
      if (!title) throw ({ path: 'title', required: true });
      if (!message) throw ({ path: 'message', required: true });
      const contactCreated = await contactController.create({ email, name, title, message });
      return res.status(201).send({
        success: true,
        data: contactCreated,
        message: 'Th??m th??nh c??ng',
        messages: lang?.message?.success?.created
      });
    } catch (e) {
      if (e.path == 'name') {
        return res.status(400).send({
          success: false,
          exist: true,
          field: 'name',
          message: "T??n kh??ng ???????c ????? tr???ng",
          messages: langConcat(lang?.resources?.name, lang?.message?.error?.validation?.exist),
        });
      }
      if (e.path == 'email') {
        return res.status(400).send({
          success: false,
          exist: true,
          field: 'email',
          message: "Email kh??ng ???????c ????? tr???ng",
          messages: langConcat(lang?.resources?.email, lang?.message?.error?.validation?.exist),
        });
      }
      if (e.path == 'title') {
        return res.status(400).send({
          success: false,
          exist: true,
          field: 'title',
          message: "Ti??u ????? kh??ng ???????c ????? tr???ng",
          messages: langConcat(lang?.resources?.title, lang?.message?.error?.validation?.exist),
        });
      }
      if (e.path == 'message') {
        return res.status(400).send({
          success: false,
          exist: true,
          field: 'message',
          message: "Tin nh???n kh??ng ???????c ????? tr???ng",
          messages: langConcat(lang?.resources?.message, lang?.message?.error?.validation?.exist),
        });
      }
      return res.status(500).send({
        success: false,
        message: 'M??y ch??? kh??ng ph???n h???i',
        messages: lang?.message?.error?.server,
        error: e,
      });
    }
  } else if (req.method == 'DELETE') {
    try {
      const bearerToken = req.headers['authorization'];
      if (!bearerToken) throw ({ path: 'token' });
      const user = jwt.verify(bearerToken);
      if (user?.mode != MODE.admin) throw ({ ...user, path: 'token' });
      const { _ids } = req.query;
      if (!_ids) throw ({ path: '_ids' });
      const query = {
        _id: { $in: _ids.split(",") }
      };
      await contactController.removeMany(query);
      return res.status(200).send({
        success: true,
        message: 'X??a th??nh c??ng',
        messages: lang?.message?.success?.deleted
      });
    } catch (e) {
      if (e.path == 'token') {
        if (!e.token) {
          return res.status(401).send({
            success: false,
            authentication: false,
            message: 'B???n kh??ng c?? quy???n truy c???p',
            messages: lang?.message?.error?.unauthorized
          });
        }
        return res.status(400).send({
          success: false,
          name: e.name,
          message: e.name == 'TokenExpiredError' ? 'Token h???t h???n' : 'Token sai ?????nh d???ng',
          messages: e.name == 'TokenExpiredError' ? lang?.message?.error?.tokenExpired : lang?.message?.error?.tokenError
        });
      }
      if (e.path == '_ids') {
        return res.status(400).send({
          success: false,
          required: false,
          message: "Danh s??ch tin nh???n kh??ng ???????c ????? tr???ng",
          messages: langConcat(lang?.resources?.messageList, lang?.message?.error?.validation?.exist),
        });
      }
      return res.status(500).send({
        success: false,
        message: 'M??y ch??? kh??ng ph???n h???i',
        messages: lang?.message?.error?.server,
        error: e,
      });
    }
  } else {
    return res.status(422).send({
      success: false,
      message: 'Ph????ng th???c kh??ng ???????c h??? tr???',
      messages: lang?.message?.error?.method
    });
  }
};

export default runMidldleware(handler);

