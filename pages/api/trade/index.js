import runMidldleware from '../../../middleware/mongodb';
import tradeController from '../../../controllers/trade';
import userController from '../../../controllers/user';
import lang, { langConcat } from '../../../lang.config';
import jwt from '../../../middleware/jwt'
import { MODE } from '../../../utils/helper';

const handler = async (req, res) => {
  if (req.method == 'GET') {
    try {
      const bearerToken = req.headers['authorization'];
      if (!bearerToken) throw ({ path: 'token' });
      const user = jwt.verify(bearerToken);
      if (!user?._id) throw ({ ...user, path: 'token' });
      const { page, pageSize, name, from = user._id } = req.query;
      const fromId = user.mode == MODE.admin ? from : user._id;
      const query = fromId ? {} : { $or: [{ 'leader': fromId }, { 'member': fromId }] };
      const skip = Number(page * pageSize) || 0;
      const limit = Number(pageSize) || 0;
      const populateName = {};
      if (name) populateName.match = { $or: [{ name: new RegExp(name, "i") }, { email: new RegExp(name, "i") }] };
      const total = await tradeController.getlist(query)
        .populate({ path: 'leader', select: 'name email', ...populateName })
        .populate({ path: 'member', select: 'name email', ...populateName })
        .countDocuments();
      const data = await tradeController.getlist(query)
        .populate({ path: 'leader', select: 'name email', ...populateName })
        .populate({ path: 'member', select: 'name email', ...populateName })
        .skip(skip).limit(limit);
      return res.status(200).send({
        success: true,
        data,
        total,
        page: Number(page) || 0,
        pageSize: Number(pageSize) || 0,
        query: { name },
      });
    } catch (error) {
      if (error.path == 'token') {
        if (!error.token) {
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
      return res.status(500).send({
        success: false,
        message: error.message,
        messages: lang?.message?.error?.server,
        error: error,
      });
    }
  } else if (req.method == 'POST') {
    try {
      const bearerToken = req.headers['authorization'];
      if (!bearerToken) throw ({ path: 'token' })
      const user = jwt.verify(bearerToken);
      if (!user?._id) throw ({ ...user, path: 'token' });
      const { to, deadline, link, from = user._id } = req.body;
      const fromId = user.mode == MODE.admin ? from : user._id;
      if (!to) throw ({ path: 'to' });
      if (!deadline) throw ({ path: 'deadline' });
      if (!fromId) throw ({ path: 'fromId' });
      if (!new Date(deadline).getTime()) throw ({ path: 'deadline' });
      try {
        const fromUser = userController.get(fromId);
        if (!fromUser) throw ({});
      }
      catch (e) {
        throw ({ path: 'from' })
      }
      try {
        const toUser = userController.get(fromId);
        if (!toUser) throw ({});
      }
      catch (e) {
        throw ({ path: 'user' })
      }
      const tradeCreated = await (await tradeController.create({ leader: fromId, member: to, deadline, link }))
        .populate({ path: 'leader', select: 'name email' })
        .populate({ path: 'member', select: 'name email' });
      return res.status(201).send({
        success: true,
        data: tradeCreated,
        message: 'Thêm thành công',
        messages: lang?.message?.success?.created
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
      if (e.path == 'message') {
        return res.status(400).send({
          success: false,
          validation: false,
          field: 'message',
          message: 'Tin nhắn không được để trống',
          messages: langConcat(lang?.resources?.conversationName, lang?.message?.error?.validation?.required)
        });
      }
      if (e.path == 'to') {
        return res.status(400).send({
          success: false,
          validation: false,
          field: 'to',
          message: 'Id người nhận không được để trống',
          messages: langConcat(lang?.resources?.roomId, lang?.message?.error?.validation?.required)
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
      if (!bearerToken) throw ({ path: 'token' });
      const user = jwt.verify(bearerToken);
      if (!user?._id) throw ({ ...user, path: 'token' });
      const { _ids } = req.query;
      if (!_ids) throw ({ path: '_ids' });
      const query = {};
      if (user.mode != MODE.admin) {
        query._id = { $in: _ids.split(",") }
      } else {
        query.$or = [
          { _id: { $in: _ids.split(",") }, leader: user._id },
          { _id: { $in: _ids.split(",") }, member: user._id },
        ]
      }
      await tradeController.removeMany(query);
      return res.status(200).send({
        success: true,
        message: 'Xóa thành công',
        messages: lang?.message?.success?.deleted
      });
    } catch (e) {
      console.log(e)
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

export default runMidldleware(handler);
