import runMidldleware from '../../../middleware/mongodb';
import conversationController from '../../../controllers/conversation';
import lang, { langConcat } from '../../../lang.config';
import jwt from '../../../middleware/jwt'

const handler = async (req, res) => {
  if (req.method == 'GET') {
    try {
      const bearerToken = req.headers['authorization'];
      if (!bearerToken) throw ({ path: 'token' });
      const user = jwt.verify(bearerToken);
      if (!user?._id) throw ({ ...user, path: 'token' });
      const { page, pageSize, name, to } = req.query;
      const query = { $or: [{ 'leader.user': user._id }, { 'member.user': user._id }] };
      const skip = Number(page * pageSize) || 0;
      const limit = Number(pageSize) || 0;
      const queryNew = { $or: [{ 'leader.user': user._id, 'leader.seen': false }, { 'member.user': user._id, 'member.seen': false }] };
      const totalNew = await conversationController.getlist(queryNew).countDocuments();
      const total = await conversationController.getlist(query).countDocuments();
      const conversations = await conversationController.getlist(query)
        .populate({ path: 'leader.user', select: 'name mode' })
        .populate({ path: 'member.user', select: 'name mode' })
        .populate({ path: 'messages', options: { sort: { createdAt: -1 }, limit: 1 } })
        .skip(skip).limit(limit);
      return res.status(200).send({
        success: true,
        data: conversations,
        total,
        totalNew,
        page: Number(page) || 0,
        pageSize: Number(pageSize) || 0,
        query,
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
