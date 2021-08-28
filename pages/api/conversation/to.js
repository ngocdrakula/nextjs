import runMidldleware from '../../../middleware/mongodb';
import conversationController from '../../../controllers/conversation';
import messageController from '../../../controllers/message';
import lang, { langConcat } from '../../../lang.config';
import jwt from '../../../middleware/jwt'

const handler = async (req, res) => {
  if (req.method == 'GET') {
    try {
      const bearerToken = req.headers['authorization'];
      if (!bearerToken) throw ({ path: 'token' });
      const user = jwt.verify(bearerToken);
      if (!user?._id) throw ({ ...user, path: 'token' });
      const { to } = req.query;
      if (!to) throw ({ path: 'to' })
      const query = { $or: [{ 'leader.user': user._id, 'member.user': to }, { 'member.user': user._id, 'leader.user': to }] }
      const currentConversation = await conversationController.find(query)
        .populate({ path: 'leader.user', select: 'name mode' })
        .populate({ path: 'member.user', select: 'name mode' })
        .populate({ path: 'messages', options: { sort: { createdAt: -1 }, limit: 10 } })
        .populate({ path: 'messages.author', });
      if (!currentConversation) throw ({ path: 'to' })
      return res.status(200).send({
        success: true,
        data: currentConversation,
      });
    } catch (error) {
      if (error.path == 'to')
        return res.status(404).send({
          success: false,
          message: 'Không tồn tại cuộc hội thoại',
          messages: lang?.message?.error?.server,
          error: error,
        });
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
