import runMidldleware from '../../../middleware/mongodb';
import tradeController from '../../../controllers/trade';
import userController from '../../../controllers/user';
import lang, { langConcat } from '../../../lang.config';
import jwt from '../../../middleware/jwt';
import { MODE } from '../../../utils/helper';
import { tradeSuccess } from '../../../middleware/mailer';

const handler = async (req, res) => {
  if (req.method == 'GET') {
    try {
      const bearerToken = req.headers['authorization'];
      if (!bearerToken) throw ({ path: 'token' });
      const user = jwt.verify(bearerToken);
      if (!user?._id) throw ({ ...user, path: 'token' });
      const { id } = req.query;
      const currentTrade = await tradeController.get(id)
        .populate({ path: 'leader', select: 'name email' })
        .populate({ path: 'member', select: 'name email' })
      if (!currentTrade) throw ({ path: '_id' })
      if (user.mode != MODE.admin && currentTrade.leader._id != user._id && currentTrade.member._id != user._id) {
        throw ({ path: 'token' });
      }
      return res.status(200).send({
        success: true,
        data: currentTrade
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
      if (e.path == "_id") {
        return res.status(400).send({
          success: false,
          exist: false,
          message: "Cuộc hội thoại không tồn tại hoặc đã bị xóa",
          messages: langConcat(lang?.resources?.trade, lang?.message?.error?.validation?.not_exist),
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
    try {
      const bearerToken = req.headers['authorization'];
      if (!bearerToken) throw ({ path: 'token' });
      const user = jwt.verify(bearerToken);
      if (!user?._id) throw ({ ...user, path: 'token' });
      const { id } = req.query;
      const { content, deadline, approved, fromEmail, fromName, toEmail, toName } = req.body;
      const currentTrade = await (await tradeController.get(id))
        .populate({ path: 'leader.user', select: 'email' })
        .populate({ path: 'member.user', select: 'email' })
        .execPopulate();
      if (!currentTrade) throw ({ path: '_id' });
      const oldApproved = currentTrade.approved;
      if (user.mode != MODE.admin && user._id != currentTrade.leader.user._id && user._id != currentTrade.member.user._id) {
        throw ({ ...user, path: 'token' });
      }
      if (content != undefined) currentTrade.content = content;
      if (user.mode == MODE.admin && approved != undefined) {
        currentTrade.approved = approved;
      }
      if (fromEmail) currentTrade.leader.email = fromEmail;
      if (fromName) currentTrade.leader.name = fromName;
      if (toEmail) currentTrade.member.email = toEmail;
      if (toName) currentTrade.member.name = toName;
      if (deadline) {
        if (!(new Date(deadline)).getTime()) throw ({ path: 'deadline' })
        currentTrade.deadline = deadline;
      }
      const tradeUpdated = await (await currentTrade.save()).execPopulate();
      if (!oldApproved && tradeUpdated.approved) {
        const member = await userController.get(currentTrade.member.user);
        await tradeSuccess({
          email: member.email,
          fromEmail: tradeUpdated.member.email,
          fromName: tradeUpdated.member.name,
          toEmail: tradeUpdated.leader.email,
          toName: tradeUpdated.leader.name,
          deadline, content
        });
      }
      return res.status(200).send({
        success: true,
        data: tradeUpdated,
        message: 'Cập nhật thành công',
        messages: lang?.message?.success?.updated
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
      if (e.path == 'deadline') {
        return res.status(400).send({
          success: false,
          exist: false,
          field: 'deadline',
          message: "Thời gian giao thương không đúng định dạng",
          messages: langConcat(lang?.resources?.deadline, lang?.message?.error?.validation?.format),
        });
      }
      if (e.path == '_id') {
        return res.status(400).send({
          success: false,
          exist: false,
          message: "Lịch giao thương không tồn tại hoặc đã bị xóa",
          messages: langConcat(lang?.resources?.trade, lang?.message?.error?.validation?.not_exist),
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
      if (!user?._id) throw ({ ...user, path: 'token' });
      const currentTrade = await tradeController.get(req.query.id);
      if (!currentTrade) throw ({ path: '_id' });
      if (user.mode != MODE.admin && user._id != currentTrade.leader.user && user._id != currentTrade.member.user) {
        throw ({ ...user, path: 'token' });
      }
      currentTrade.remove();
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
          message: "Lịch giao thương không tồn tại hoặc đã bị xóa",
          messages: langConcat(lang?.resources?.trade, lang?.message?.error?.validation?.not_exist),
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


export default runMidldleware(handler);

