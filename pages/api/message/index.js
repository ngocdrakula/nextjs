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
      const { page, pageSize, to } = req.query;
      if (!to) throw ({ path: 'to' })
      const query = { $or: [{ 'leader.user': user._id, 'member.user': to }, { 'member.user': user._id, 'leader.user': to }] }
      const currentConversation = await conversationController.find(query)
        .populate({ path: 'leader.user', select: 'name' })
        .populate({ path: 'member.user', select: 'name' })
        .populate({ path: 'messages', options: { $sort: { createdAt: -1 }, limit: 10 } })
        .populate({ path: 'messages.author', })
      return res.status(200).send({
        success: true,
        data: currentConversation,
        total: currentConversation,
        page: Number(page) || 0,
        pageSize: Number(pageSize) || 0,
      });
    } catch (error) {
      if (error.path == 'to')
        return res.status(500).send({
          success: false,
          message: error.message,
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
  }
  else if (req.method == 'POST') {
    try {
      const bearerToken = req.headers['authorization'];
      if (!bearerToken) throw ({ path: 'token' })
      const user = jwt.verify(bearerToken);
      if (!user?._id) throw ({ ...user, path: 'token' });
      const { to, message } = req.body;
      if (!to || !message) throw ({ path: !to ? 'to' : 'message' });
      const query = {
        $or: [
          { 'leader.user': user._id, 'member.user': to },
          { 'leader.user': to, 'member.user': user._id }
        ]
      }
      const newMessage = await messageController.create({ author: user._id, content: message });
      try {
        const currentConversation = await conversationController.find(query)
          .populate({ path: 'messages', options: { limit: 1 } });
        if (currentConversation) {
          if (currentConversation.leader.user == user._id) {
            currentConversation.member.seen = false;
          }
          else currentConversation.leader.seen = false;
          currentConversation.messages.push(newMessage._id);
          await currentConversation.save();
          return res.status(200).send({
            success: true,
            data: newMessage,
            conversationId: currentConversation._id,
            message: 'Lưu thành thành công',
            messages: lang?.message?.success?.created
          });
        }
      }
      catch (e) { }
      const newConversation = {
        leader: { user: user._id, seen: true },
        member: { user: to, seen: false },
        messages: [newMessage._id]
      }
      const conversationCreated = await (await conversationController.create(newConversation))
        .populate({ path: 'leader.user', select: 'name mode' })
        .populate({ path: 'member.user', select: 'name mode' })
        .populate({ path: 'messages', options: { $sort: { createdAt: -1 }, limit: 1 } })
        .populate({ path: 'messages.author', }).execPopulate();
      console.log(conversationCreated)
      return res.status(201).send({
        success: true,
        data: newMessage,
        conversationCreated,
        message: 'Thêm thành công',
        messages: lang?.message?.success?.created
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
  } else {
    return res.status(422).send({
      success: false,
      message: 'Phương thức không được hỗ trợ',
      messages: lang?.message?.error?.method
    });
  }
};

export default runMidldleware(handler);
