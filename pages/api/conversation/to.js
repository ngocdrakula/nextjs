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
      const { to, from = user._id } = req.query;
      if (!to) throw ({ path: 'to' })
      const fromId = user.mode == MODE.admin ? from : user._id;
      if (!from) throw ({ path: 'from' })
      const query = { $or: [{ 'leader.user': fromId, 'member.user': to }, { 'member.user': fromId, 'leader.user': to }] }
      const currentConversation = await conversationController.find(query)
        .populate({ path: 'leader.user', select: 'name mode avatar' })
        .populate({ path: 'member.user', select: 'name mode avatar' })
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
          message: 'Cuộc hội thoại không tồn tại',
          messages: langConcat(lang?.resources?.conversation, lang?.message?.error?.validation?.not_exist),
          error: error,
        });
      return res.status(500).send({
        success: false,
        message: 'Máy chủ không phản hồi',
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
