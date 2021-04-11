import connectDB from '../../../middleware/mongodb';
import layoutController from '../../../controllers/layout';
import roomController from '../../../controllers/room';
import lang, { langConcat } from '../../../lang.config';
import uploader, { cleanFiles } from '../../../middleware/multer';
import jwt from '../../../middleware/jwt'

const handler = async (req, res) => {
  if (req.method === 'GET') {
    try {
      const { id } = req.query;
      const currentLayout = await layoutController.get(id);
      if (!currentLayout) throw ({ path: '_id' })
      return res.status(201).send({
        success: true,
        data: currentLayout,
      });
    } catch (e) {
      if (e.path === "_id") {
        return res.status(400).send({
          success: false,
          exist: false,
          message: "Kiểu bố trí không tồn tại hoặc đã bị xóa",
          messages: langConcat(lang?.resources?.layout, lang?.message?.error?.validation?.not_exist),
        });
      }
      return res.status(500).send({
        success: false,
        message: e.message,
        messages: lang?.message?.error?.server,
        error: e,
      });
    }
  } else if (req.method === 'POST') {
    try {
      const contentType = req.headers['content-type'];
      const bearerToken = req.headers['authorization'];
      if (!bearerToken) throw ({ path: 'token' });
      if (!contentType || contentType.indexOf('multipart/form-data') == -1)
        throw ({ path: 'content-type', contentType });
      const user = jwt.verify(bearerToken);
      if (!user || !user._id) throw ({ ...user, path: 'token' });
      const { body, files, err } = await uploader(req);
      const { name, images, roomId, vertical, horizontal, cameraFov, areas, enabled } = body;
      if (err) throw ({ path: 'files' });
      try {
        const currentLayout = await layoutController.get(req.query.id);
        if (!currentLayout) throw ({ path: '_id', files });
        if (roomId) {
          try {
            const room = await roomController.get(roomId);
            if (!room) throw ({ path: '_id' })
            currentLayout.room = roomId;
          } catch (err) {
            if (err.path === '_id') throw ({ path: 'room', files });
            throw ({ err, files })
          }
        }
        if (name) {
          const matchLayout = await layoutController.find({ name });
          if (matchLayout) {
            throw ({ path: 'name', files })
          }
          else currentLayout.name = name;
        }
        if (vertical) currentLayout.vertical = Number(vertical);
        if (horizontal) currentLayout.horizontal = Number(horizontal);
        if (cameraFov) currentLayout.cameraFov = Number(cameraFov);
        if (areas) {
          try {
            currentLayout.areas = JSON.parse(areas);
          }
          catch (e) {
            throw ({ path: 'areas' })
          }
        };
        if (enabled !== undefined) currentLayout.enabled = !(enabled !== 'false');
        if (images) {
          let imagesParser = [];
          try {
            imagesParser = JSON.parse(images);
            if (!imagesParser.length) throw ({ path: 'images', files })
          } catch (err) {
            throw ({ path: 'images', files })
          }
          let index = 0;
          const newImages = imagesParser.map(image => {
            if (image && image[0] === "-") {
              index++;
              return files[index - 1];
            }
            return image
          });
          for (const image of currentLayout.images) {
            if (imagesParser.indexOf(image) === -1) {
              await cleanFiles([image]);
            }
          }
          currentLayout.images = newImages;
        }
        else if (files.length) {
          await cleanFiles(files);
        }
        const layoutUpdated = await (await currentLayout.save()).populate('room').execPopulate();
        return res.status(201).send({
          success: true,
          data: layoutUpdated,
          message: 'Cập nhật thành công',
          messages: lang?.message?.success?.updated
        });
      } catch (error) {
        if (error.path === "_id") throw ({ path: 'layout', files });
        throw error
      }
    } catch (e) {
      if (e.files) await cleanFiles(e.files);
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
      if (e.path === 'content-type') {
        return res.status(400).send({
          success: false,
          headerContentType: false,
          contentType,
          aceptedOnly: 'multipart/form-data',
          message: 'Header không được chấp nhận',
          messages: lang?.message?.error?.header_not_acepted
        });
      }
      if (e.path === 'files') {
        return res.status(400).send({
          success: false,
          upload: false,
          field: 'files',
          message: 'Upload không thành công',
          messages: lang?.message?.error?.upload_failed,
        });
      }
      if (e.path === 'room') {
        return res.status(400).send({
          success: false,
          exist: false,
          field: 'room',
          message: "Không gian không tồn tại hoặc đã bị xóa",
          messages: langConcat(lang?.resources?.room, lang?.message?.error?.validation?.not_exist),
        });
      }
      if (e.path === 'layout') {
        return res.status(400).send({
          success: false,
          exist: false,
          message: "Kiểu bố trí không tồn tại hoặc đã bị xóa",
          messages: langConcat(lang?.resources?.layout, lang?.message?.error?.validation?.not_exist),
        });
      }
      if (e.path === 'name') {
        return res.status(400).send({
          success: false,
          exist: true,
          current: e.matchLayout,
          message: "Tên kiểu bố trí đã tồn tại",
          messages: langConcat(lang?.resources?.layoutName, lang?.message?.error?.validation?.exist),
        });
      }
      if (e.path === 'areas') {
        return res.status(400).send({
          success: false,
          validation: false,
          field: 'areas',
          message: 'Danh sách các mặt không phải là mảng',
        });
      }
      if (e.path === 'images') {
        return res.status(400).send({
          success: false,
          format: false,
          field: 'images',
          message: "Ảnh không đúng dạng stringfy của mảng",
          messages: langConcat(lang?.resources?.layoutImage, lang?.message?.error?.validation?.format),
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
      const currentLayout = await layoutController.get(req.query.id);
      if (!currentLayout) throw ({ path: '_id' });
      await cleanFiles(currentLayout.images)
      currentLayout.remove();
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
          message: "Kiểu bố trí không tồn tại hoặc đã bị xóa",
          messages: langConcat(lang?.resources?.layout, lang?.message?.error?.validation?.not_exist),
        });
      }
      return res.status(500).send({
        success: false,
        message: 'Máy chủ không phản hồi',
        messages: lang?.message?.error?.server,
        error: e,
      });
    }
  } else if (req.method === 'PUT') {
    res.status(422).send({
      success: false,
      message: 'Phương thức không được hỗ trợ, vui lòng đổi sang phương thức POST',
      messages: lang?.message?.error?.method
    });
  } else {
    res.status(422).send({
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

export default connectDB(handler);

