import runMidldleware from '../../../middleware/mongodb';
import layoutController from '../../../controllers/layout';
import roomController from '../../../controllers/room';
import lang, { langConcat } from '../../../lang.config';
import jwt from '../../../middleware/jwt'
import { downloadImageFromUrl, getDataFromUrl } from '../../../middleware/cloneHelper';
import { convertLayout } from '../../../utils/helper';

const handler = async (req, res) => {
  if (req.method == 'POST') {
    try {
      const bearerToken = req.headers['authorization'];
      if (!bearerToken) throw ({ path: 'token' })
      const user = jwt.verify(bearerToken);
      if (!user?.mode) throw ({ ...user, path: 'token' });
      const { name, roomId, enable, url, src } = req.body;
      if (!name || !roomId) throw ({ path: !name ? 'name' : 'roomId' });
      try {
        const room = await roomController.get(roomId);
        if (!room) throw ({ path: '_id' })
        const matchLayout = await layoutController.find({ name }).populate('room');
        if (matchLayout) throw ({ path: 'layout', matchLayout });
        const cloneLayout = await getDataFromUrl(url);
        if (!cloneLayout?.id) throw ({ path: 'url' });
        const { image, shadow, shadow_matt, surfaces } = cloneLayout;
        if (!image || !shadow || !surfaces) throw ({ path: 'url' });
        const images = [];
        const origin = await downloadImageFromUrl(src + shadow);
        if (!origin) throw ({ path: 'src' });
        images.push(origin);
        const transparent = await downloadImageFromUrl(src + image);
        images.push(transparent);
        if (shadow_matt) {
          const matt = await downloadImageFromUrl(src + shadow_matt);
          images.push(matt);
        } else {
          images.push(origin);
        }
        try {
          const test = convertLayout(JSON.parse(surfaces));
        }
        catch {
          throw ({ path: 'url' })
        }
        const layout = convertLayout(JSON.parse(surfaces));
        const { vertical, horizontal, cameraFov, areas } = layout
        const params = { name, room: roomId, images, vertical, horizontal, cameraFov, areas }
        const layoutCreated = await (await layoutController.create(params)).populate('room').execPopulate();
        return res.status(201).send({
          success: true,
          data: layoutCreated,
          message: 'Thêm thành công',
          messages: lang?.message?.success?.created
        });
      } catch (err) {
        if (err.path == '_id') throw ({ path: 'room' });
        throw ({ ...err })
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
      if (e.path == 'url') {
        return res.status(400).send({
          success: false,
          validation: false,
          field: 'url',
          message: 'Đường dẫn sai hoặc không đúng định dạng',
          messages: langConcat(lang?.resources?.layoutName, lang?.message?.error?.validation?.required)
        });
      }
      if (e.path == 'src') {
        return res.status(400).send({
          success: false,
          validation: false,
          field: 'src',
          message: 'Đường dẫn sai hoặc không đúng định dạng',
          messages: langConcat(lang?.resources?.layoutName, lang?.message?.error?.validation?.required)
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
        error: e,
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
