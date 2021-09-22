import runMidldleware from '../../../middleware/mongodb';
import tradeController from '../../../controllers/trade';
import userController from '../../../controllers/user';
import lang, { langConcat } from '../../../lang.config';
import jwt from '../../../middleware/jwt'
import { MODE } from '../../../utils/helper';
import { tradeNotification, tradeSuccess } from '../../../middleware/mailer';

const handler = async (req, res) => {
  if (req.method == 'GET') {
    try {
      const bearerToken = req.headers['authorization'];
      if (!bearerToken) throw ({ path: 'token' });
      const user = jwt.verify(bearerToken);
      if (!user?._id) throw ({ ...user, path: 'token' });
      const { page, pageSize, name, from, enabled } = req.query;
      const queryEnabled = {};
      if (enabled != undefined) queryEnabled.enabled = !(enabled == "true");
      const fromId = user.mode == MODE.admin ? from : user._id;
      const query = fromId ? { $or: [{ 'leader': fromId, approved: true, ...queryEnabled }, { 'member': fromId, approved: true, ...queryEnabled }] } : queryEnabled;
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
      const { to, deadline, link, from = user._id, approved, enabled } = req.body;
      const fromId = user.mode == MODE.admin ? from : user._id;
      if (fromId == to) throw ({ path: 'match' })
      if (!to) throw ({ path: 'to' });
      if (!deadline) throw ({ path: 'deadline' });
      if (!fromId) throw ({ path: 'from' });
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
      const tradeCreated = await (await tradeController.create({
        leader: fromId,
        member: to,
        deadline,
        link,
        enabled,
        approved: user.mode == MODE.admin ? approved : false
      }))
        .populate({ path: 'leader', select: 'name email mode' })
        .populate({ path: 'member', select: 'name email mode' })
        .execPopulate();
      await tradeSuccess({ mode: tradeCreated.leader.mode, email: tradeCreated.leader.email, name: tradeCreated.leader.name, company: tradeCreated.member.name, deadline, link });
      await tradeNotification({
        emailFrom: tradeCreated.leader.email,
        nameFrom: tradeCreated.leader.name,
        emailTo: tradeCreated.member.email,
        nameTo: tradeCreated.member.name,
        deadline, link
      });
      if (tradeCreated.member.mode !== MODE.exhibitor) {
        await tradeSuccess({ mode: tradeCreated.member.mode, email: tradeCreated.member.email, name: tradeCreated.member.name, company: tradeCreated.leader.name, deadline, link });
      }
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
      if (e.path == 'match') {
        return res.status(400).send({
          success: false,
          validation: false,
          field: 'from',
          message: 'Bạn không thể kết nối tới chính mình',
        });
      }
      if (e.path == 'from') {
        return res.status(400).send({
          success: false,
          validation: false,
          field: 'from',
          message: 'Người dùng không tồn tại',
        });
      }
      if (e.path == 'to') {
        return res.status(400).send({
          success: false,
          validation: false,
          field: 'to',
          message: 'Đối tác không tồn tại',
        });
      }
      if (e.path == 'deadline') {
        return res.status(400).send({
          success: false,
          validation: false,
          field: 'deadline',
          message: 'Lịch hẹn là bắt buộc',
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
      if (user.mode == MODE.admin) {
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
