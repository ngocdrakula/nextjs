import runMidldleware from '../../../middleware/mongodb';
import conversationController from '../../../controllers/conversation';
import messageController from '../../../controllers/message';
import lang, { langConcat } from '../../../lang.config';
import jwt from '../../../middleware/jwt'
import { MODE } from '../../../utils/helper';

const handler = async (req, res) => {
  if (req.method == 'POST') {
    try {
      const bearerToken = req.headers['authorization'];
      if (!bearerToken) throw ({ path: 'token' })
      const user = jwt.verify(bearerToken);
      if (!user?._id) throw ({ ...user, path: 'token' });
      const { to, message, from = user._id } = req.body;
      const fromId = user.mode == MODE.admin ? from : user._id;
      if (!to || !message) throw ({ path: !to ? 'to' : 'message' });
      const query = {
        $or: [
          { 'leader.user': fromId, 'member.user': to },
          { 'leader.user': to, 'member.user': fromId }
        ]
      }
      const newMessage = await messageController.create({ author: fromId, content: message });
      const currentConversation = await conversationController.find(query)
        .populate({ path: 'messages', options: { limit: 1, sort: { createdAt: -1 } } });
      if (currentConversation) {
        if (currentConversation.leader.user == fromId) {
          currentConversation.member.seen = false;
        }
        else currentConversation.leader.seen = false;
        currentConversation.messages.push(newMessage._id);
        await currentConversation.save();
        const io = req.app.get('socket.io');
        io.emit(fromId, { type: "send", to: to });
        io.emit(to, { type: "new", to: fromId });
        return res.status(200).send({
          success: true,
          data: newMessage,
          conversationId: currentConversation._id,
          message: 'Cập nhật thành công',
          messages: lang?.message?.success?.updated
        });
      }
      else {
        const newConversation = {
          leader: { user: user._id, seen: true },
          member: { user: to, seen: false },
          messages: [newMessage._id]
        }
        const conversationCreated = await (await conversationController.create(newConversation))
          .populate({ path: 'leader.user', select: 'name mode avatar' })
          .populate({ path: 'member.user', select: 'name mode avatar' })
          .populate({ path: 'messages', options: { $sort: { createdAt: -1 }, limit: 1 } })
          .populate({ path: 'messages.author', }).execPopulate();
        const io = req.app.get('socket.io');
        io.emit(user._id, { type: "send", to: to });
        io.emit(to, { type: "new", to: user._id });
        return res.status(201).send({
          success: true,
          data: newMessage,
          conversationCreated,
          conversationId: conversationCreated._id,
          message: 'Thêm thành công',
          messages: lang?.message?.success?.created
        });
      }
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
      if (e.path == 'message') {
        return res.status(400).send({
          success: false,
          validation: false,
          field: 'message',
          message: 'Tin nhắn không được để trống',
          messages: langConcat(lang?.resources?.message, lang?.message?.error?.validation?.required)
        });
      }
      if (e.path == 'to') {
        return res.status(400).send({
          success: false,
          validation: false,
          field: 'to',
          message: 'Người dùng không tồn tại',
          messages: langConcat(lang?.resources?.user, lang?.message?.error?.validation?.not_exist)
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
