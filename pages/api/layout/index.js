import runMidldleware from '../../../middleware/mongodb';
import layoutController from '../../../controllers/layout';
import roomController from '../../../controllers/room';
import lang, { langConcat } from '../../../lang.config';
import uploader, { cleanFiles } from '../../../middleware/multer';
import jwt from '../../../middleware/jwt'

const handler = async (req, res) => {
  if (req.method == 'GET') {
    try {
      const { page, pageSize, enabled } = req.query;
      const query = {};
      if (enabled) query.enabled = (enabled == "true");
      const skip = Number(page * pageSize) || 0;
      const limit = Number((page + 1) * pageSize) || 0;
      const total = await layoutController.getlist(query).countDocuments();
      const list = await layoutController.getlist(query).skip(skip).limit(limit).populate('room');
      return res.status(200).send({
        success: true,
        data: list,
        total,
        page: Number(page) || 0,
        pageSize: Number(pageSize) || 0
      });
    } catch (error) {
      return res.status(500).send({
        success: false,
        message: error.message,
        messages: lang?.message?.error?.server,
        error: error,
      });
    }
  } else if (req.method == 'POST') {
    try {
      const contentType = req.headers['content-type'];
      const bearerToken = req.headers['authorization'];
      if (!bearerToken) throw ({ path: 'token' })
      if (!contentType || contentType.indexOf('multipart/form-data') == -1)
        throw ({ path: 'content-type', contentType });
      const user = jwt.verify(bearerToken);
      if (!user || !user.mode) throw ({ ...user, path: 'token' });
      const { body, files, err } = await uploader(req);
      const { name, roomId, vertical, horizontal, cameraFov, areas } = body;
      if (err || !files.length) throw ({ path: 'files' })
      if (!name || !roomId) throw ({ path: !name ? 'name' : 'roomId', files });
      try {
        JSON.parse(areas);
      }
      catch (e) {
        throw ({ path: 'areas' })
      }
      try {
        const room = await roomController.get(roomId);
        if (!room) throw ({ path: '_id', files })
        const matchLayout = await layoutController.find({ name }).populate('room');
        if (matchLayout) throw ({ path: 'layout', files, matchLayout })
        const params = {
          name,
          room: roomId,
          images: files,
          vertical: Number(vertical) || 0,
          horizontal: Number(horizontal) || 0,
          cameraFov: Number(cameraFov) || 0,
          areas: JSON.parse(areas)
        }
        const layoutCreated = await (await layoutController.create(params)).populate('room').execPopulate();
        return res.status(201).send({
          success: true,
          data: layoutCreated,
          message: 'Thêm thành công',
          messages: lang?.message?.success?.created
        });
      } catch (err) {
        if (err.path == '_id') throw ({ path: 'room', files });
        throw ({ ...err, files })
      }
    } catch (e) {
      if (e.files) await cleanFiles(e.files);
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
      if (e.path == 'content-type') {
        return res.status(400).send({
          success: false,
          headerContentType: false,
          contentType: e.contentType,
          aceptedOnly: 'multipart/form-data',
          message: 'Header không được chấp nhận',
          messages: lang?.message?.error?.header_not_acepted
        });
      }
      if (e.path == 'files') {
        return res.status(400).send({
          success: false,
          upload: false,
          field: 'files',
          message: 'Upload không thành công',
          messages: lang?.message?.error?.upload_failed,
        });
      }
      if (e.path == 'name') {
        return res.status(400).send({
          success: false,
          validation: false,
          field: 'name',
          message: 'Tên kiểu bố trí không được để trống',
          messages: langConcat(lang?.resources?.layoutName, lang?.message?.error?.validation?.required)
        });
      }
      if (e.path == 'roomId') {
        return res.status(400).send({
          success: false,
          validation: false,
          field: 'roomId',
          message: 'Id không gian không được để trống',
          messages: langConcat(lang?.resources?.roomId, lang?.message?.error?.validation?.required)
        });
      }
      if (e.path == 'areas') {
        return res.status(400).send({
          success: false,
          validation: false,
          field: 'areas',
          message: 'Danh sách các mặt không phải là mảng',
        });
      }
      if (e.path == 'room') {
        return res.status(400).send({
          success: false,
          exist: false,
          field: 'room',
          message: "Không gian không tồn tại",
          messages: langConcat(lang?.resources?.front, lang?.message?.error?.validation?.not_exist),
        });
      }
      if (e.path == 'layout') {
        return res.status(400).send({
          success: false,
          exist: true,
          current: e.matchLayout,
          message: "Tên kiểu bố trí đã tồn tại",
          messages: langConcat(lang?.resources?.layoutName, lang?.message?.error?.validation?.exist),
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

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};

export default runMidldleware(handler);
