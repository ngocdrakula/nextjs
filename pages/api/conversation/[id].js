import runMidldleware from '../../../middleware/mongodb';
import conversationController from '../../../controllers/conversation';
import lang, { langConcat } from '../../../lang.config';
import jwt from '../../../middleware/jwt';

const handler = async (req, res) => {
  if (req.method == 'GET') {
    try {
      const bearerToken = req.headers['authorization'];
      if (!bearerToken) throw ({ path: 'token' });
      const user = jwt.verify(bearerToken);
      if (!user?._id) throw ({ ...user, path: 'token' });
      const { page, pageSize, id } = req.query;
      const skip = Number(page * pageSize) || 0;
      const limit = Number(pageSize) || 0;
      const currentConversation = await conversationController.get(id)
        .populate({ path: 'leader.user', select: 'name mode' })
        .populate({ path: 'member.user', select: 'name mode' })
        .populate({ path: 'messages', options: { $sort: { createdAt: -1 }, skip, limit } })
        .populate({ path: 'messages.author', })
      if (!currentConversation) throw ({ path: '_id' });
      if (currentConversation.leader.user._id == user._id) {
        currentConversation.leader.seen = true;
      }
      else if (currentConversation.member.user._id == user._id) {
        currentConversation.member.seen = true;
      }
      else throw ({ path: 'token' });
      await currentConversation.save();
      return res.status(201).send({
        success: true,
        data: currentConversation,
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
          messages: langConcat(lang?.resources?.conversation, lang?.message?.error?.validation?.not_exist),
        });
      }
      return res.status(500).send({
        success: false,
        message: e.message,
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

