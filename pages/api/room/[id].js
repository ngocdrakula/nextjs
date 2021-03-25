import connectDB from '../../../middleware/mongodb';
import roomController from '../../../controllers/room';
import lang, { langConcat } from '../../../lang.config';

const handler = async (req, res) => {
  if (req.method === 'GET') {
    try {
      const { id } = req.query;
      const currentRoom = await roomController.get(id);
      if (!currentRoom) throw ({ path: '_id' })
      return res.status(201).send({
        success: true,
        data: currentRoom,
      });
    } catch (error) {
      if (error.path === "_id") {
        return res.status(400).send({
          success: false,
          exist: false,
          message: "Không gian không tồn tại hoặc đã bị xóa",
          messages: langConcat(lang?.resources?.room, lang?.message?.error?.validation?.not_exist),
        });
      }
      return res.status(500).send({
        success: false,
        message: error.message,
        messages: lang?.message?.error?.server,
        error: error,
      });
    }
  } else if (req.method === 'PUT') {
    try {
      const bearerToken = req.headers['authorization'];
      if (!bearerToken) throw ({ path: 'token' });
      const user = jwt.verify(bearerToken);
      if (!user || !user._id) throw ({ ...user, path: 'token' });
      const { name } = req.body;
      if (!name) throw ({ path: 'name' })
      const matchRoom = await roomController.find({ name });
      if (matchRoom) throw ({ path: 'room', matchRoom })
      const roomUpdated = await roomController.update(req.query.id, { name });
      return res.status(200).send({
        success: true,
        data: roomUpdated,
        message: 'Cập nhật thành công',
        messages: lang?.message?.success?.updated
      });
    } catch (e) {
      if (e.path === 'token') {
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
          message: e.name === 'TokenExpiredError' ? 'Token hết hạn' : 'Token sai định dạng',
          messages: e.name === 'TokenExpiredError' ? lang?.message?.error?.tokenExpired : lang?.message?.error?.tokenError
        });
      }
      if (e.path === 'name') {
        return res.status(400).send({
          success: false,
          validation: false,
          field: 'name',
          message: 'Tên không gian không được để trống',
          messages: langConcat(lang?.resources?.roomName, lang?.message?.error?.validation?.required),
        });
      }
      if (e.path === 'room') {
        return res.status(400).send({
          success: false,
          exist: true,
          current: e.matchRoom,
          message: "Tên không gian đã tồn tại",
          messages: langConcat(lang?.resources?.roomName, lang?.message?.error?.validation?.exist),
        });
      }
      return res.status(500).send({
        success: false,
        message: 'Máy chủ không phản hồi',
        messages: lang?.message?.error?.server,
        error: e.err,
      });
    }
  } else if (req.method === 'DELETE') {
    try {
      const bearerToken = req.headers['authorization'];
      if (!bearerToken) throw ({ path: 'token' })
      const user = jwt.verify(bearerToken);
      if (!user || !user._id) throw ({ ...user, path: 'token' });
      const currentRoom = await roomController.get(req.query.id);
      if (!currentRoom) throw ({ path: '_id' });
      currentRoom.remove();
      return res.status(200).send({
        success: true,
        data: null,
        message: 'Xóa thành công',
        messages: lang?.message?.success?.deleted
      });
    } catch (e) {
      if (e.path === 'token') {
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
          message: e.name === 'TokenExpiredError' ? 'Token hết hạn' : 'Token sai định dạng',
          messages: e.name === 'TokenExpiredError' ? lang?.message?.error?.tokenExpired : lang?.message?.error?.tokenError
        });
      }
      if (e.path === '_id') {
        return res.status(400).send({
          success: false,
          exist: false,
          message: "Không gian không tồn tại hoặc đã bị xóa",
          messages: langConcat(lang?.resources?.room, lang?.message?.error?.validation?.not_exist),
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

export default connectDB(handler);

