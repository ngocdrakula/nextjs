import runMidldleware from '../../../middleware/mongodb';
import conversationController from '../../../controllers/conversation';
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
      const { page, pageSize = 100, name, from = user._id } = req.query;
      const fromId = user.mode == MODE.admin ? from : user._id;
      const query = { $or: [{ 'leader.user': fromId }, { 'member.user': fromId }] };
      const skip = Number(page * pageSize) || 0;
      const limit = Number(pageSize) || 0;
      const populateName = {};
      if (name) populateName.match = { name: new RegExp(name, "i") };
      if (!fromId) throw ({ path: 'from' })
      const queryNew = {
        $or: [
          { 'leader.user': fromId, 'leader.seen': false },
          { 'member.user': fromId, 'member.seen': false }
        ]
      };
      const totalNew = await conversationController.getlist(queryNew).countDocuments();
      const conversations = await conversationController.getlist(query)
        .populate({ path: 'leader.user', select: 'name mode avatar', match: { name: new RegExp(name, "i") } })
        .populate({ path: 'member.user', select: 'name mode avatar', match: { name: new RegExp(name, "i") } })
        .populate({ path: 'messages', perDocumentLimit: 1, options: { sort: { createdAt: -1 }, limit: 1 } });
      let totalms = 0;
      const cons = conversations.filter(c => {
        totalms += c.messages.length;
        if (c.leader.user?._id && c.leader.user._id != fromId) {
          c.member.user = { _id: fromId, name: user.name };
          return true;
        }
        if (c.member.user?._id && c.member.user._id != fromId) {
          c.leader.user = { _id: fromId, name: user.name };
          return true;
        }
        return false
      });
      const data = cons.slice(skip, skip + limit);
      return res.status(200).send({
        success: true,
        data,
        total: cons.length,
        totalms,
        totalNew,
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
  } else {
    return res.status(422).send({
      success: false,
      message: 'Phương thức không được hỗ trợ',
      messages: lang?.message?.error?.method
    });
  }
};

export default runMidldleware(handler);
