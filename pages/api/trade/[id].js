import runMidldleware from '../../../middleware/mongodb';
import tradeController from '../../../controllers/trade';
import lang, { langConcat } from '../../../lang.config';
import jwt from '../../../middleware/jwt';
import { MODE } from '../../../utils/helper';

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
        message: e.message,
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
      const { link, deadline, enabled } = req.body;
      const currentTrade = await tradeController.get(id);
      console.log(currentTrade)
      if (!currentTrade || (!currentTrade.enabled && user.mode != MODE.admin)) throw ({ path: '_id' });
      if (user.mode != MODE.admin && user._id != currentTrade.leader && user._id != currentTrade.member) {
        throw ({ ...user, path: 'token' });
      }
      if (link != undefined) {
        currentTrade.link = link;
      }
      if (enabled != undefined) {
        currentTrade.enabled = enabled
      }
      if (deadline) {
        if (!(new Date(deadline)).getTime()) throw ({ path: 'deadline' })
        currentTrade.deadline = deadline;
      }
      console.log(currentTrade)
      const productUpdated = await (await currentTrade.save())
        .populate({ path: 'leader', select: 'name email' })
        .populate({ path: 'member', select: 'name email' })
        .execPopulate();
      return res.status(200).send({
        success: true,
        data: productUpdated,
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
          message: "Thời gian giao thương không đúng định dạng ngày",
        });
      }
      if (e.path == '_id') {
        return res.status(400).send({
          success: false,
          exist: false,
          message: "Lịch giao thương không tồn tại hoặc đã bị xóa",
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
      if (user.mode != MODE.admin && user._id != currentTrade.leader && user._id != currentTrade.member) {
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

