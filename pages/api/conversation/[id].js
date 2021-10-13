import runMidldleware from '../../../middleware/mongodb';
import conversationController from '../../../controllers/conversation';
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
      const { page, pageSize = 100, id, read, from = user._id } = req.query;
      const fromId = user.mode == MODE.admin ? from : user._id;
      const skip = Number(page * pageSize) || 0;
      const limit = Number(pageSize) || 1;
      const currentConversation = await conversationController.get(id)
        .populate({ path: 'leader.user', select: 'name mode avatar' })
        .populate({ path: 'member.user', select: 'name mode avatar' })
        .populate({ path: 'messages', options: { sort: { createdAt: -1 }, skip, limit } })
        .populate({ path: 'messages.author', })
      if (!currentConversation) throw ({ path: '_id' });
      if (currentConversation.leader.user._id == fromId) {
        if (read) {
          currentConversation.leader.seen = true;
          await currentConversation.save();
        }
      }
      else if (currentConversation.member.user._id == fromId) {
        if (read) {
          currentConversation.member.seen = true;
          await currentConversation.save();
        }
      }
      else throw ({ path: 'token' });
      return res.status(201).send({
        success: true,
        data: currentConversation,
        currentPage: Number(page) || 0,
        pageSize: Number(pageSize) || 1
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

