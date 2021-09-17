import runMidldleware from '../../../middleware/mongodb';
import livestreamController from '../../../controllers/livestream';
import lang, { langConcat } from '../../../lang.config';
import jwt from '../../../middleware/jwt';
import { MODE } from '../../../utils/helper';

const handler = async (req, res) => {
  if (req.method == 'GET') {
    try {
      const { id } = req.query;
      const currentLivestream = await livestreamController.get(id).populate({ path: 'user', select: 'name email' })
      if (!currentLivestream) throw ({ path: '_id' })
      return res.status(200).send({
        success: true,
        data: currentLivestream
      });
    } catch (e) {
      if (e.path == "_id") {
        return res.status(400).send({
          success: false,
          exist: false,
          message: "Cuộc hội thoại không tồn tại hoặc đã bị xóa",
          messages: langConcat(lang?.resources?.livestream, lang?.message?.error?.validation?.not_exist),
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
      const { link, description, title, enabled, embed } = req.body;
      const currentLivestream = await livestreamController.get(id);
      if (!currentLivestream) throw ({ path: '_id' });
      if (user?.mode != MODE.admin && currentLivestream?.author != user._id) throw ({ ...user, path: 'token' });
      if (link) currentLivestream.link = link;
      if (enabled != undefined) currentLivestream.enabled = enabled;
      if (description) currentLivestream.description = description;
      if (title != undefined) currentLivestream.title = title;
      if (embed != undefined) currentLivestream.embed = embed;
      const livestreamUpdated = await currentLivestream.save();
      return res.status(200).send({
        success: true,
        data: livestreamUpdated,
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
      if (e.path == '_id') {
        return res.status(400).send({
          success: false,
          exist: false,
          message: "Livestream không tồn tại hoặc đã bị xóa",
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
      const currentLivestream = await livestreamController.get(req.query.id);
      if (!currentLivestream) throw ({ path: '_id' });
      if (user?.mode != MODE.admin && currentLivestream?.author != user._id) throw ({ ...user, path: 'token' });
      currentLivestream.remove();
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
          message: "Livestream không tồn tại hoặc đã bị xóa",
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

