import runMidldleware from '../../../middleware/mongodb';
import settingController from '../../../controllers/setting';
import lang, { langConcat } from '../../../lang.config';
import jwt from '../../../middleware/jwt';

const handler = async (req, res) => {
  if (req.method == 'GET') {
    try {
      const settings = await settingController.getlist({});
      return res.status(201).send({
        success: true,
        data: settings?.[0] || null,
      });
    } catch (e) {
      return res.status(500).send({
        success: false,
        message: e.message,
        messages: lang?.message?.error?.server,
        error: e,
      });
    }
  } else if (req.method == 'POST') {
    try {
      const bearerToken = req.headers['authorization'];
      if (!bearerToken) throw ({ path: 'token' });
      const user = jwt.verify(bearerToken);
      if (!user?.mode) throw ({ ...user, path: 'token' });
      const { title, header, body, footer, logo } = req.body;
      try {
        const settings = await settingController.getlist({});
        if (settings?.length) {
          const setting = settings[0];
          if (title !== undefined) setting.title = title;
          if (header !== undefined) setting.header = header;
          if (body !== undefined) setting.body = body;
          if (footer !== undefined) setting.footer = footer;
          if (logo !== undefined) setting.logo = logo;
          const settingUpdated = await setting.save();
          return res.status(200).send({
            success: true,
            data: settingUpdated,
            message: 'Cập nhật thành công',
            messages: lang?.message?.success?.updated
          });
        }
        else {
          const settingCreated = await settingController.create({ title, header, body, footer, logo });
          return res.status(200).send({
            success: true,
            data: settingCreated,
            message: 'Tạo mới thành công',
            messages: lang?.message?.success?.created
          });
        }
      } catch (error) {
        if (error.path == "_id") throw ({ path: 'setting', files });
        throw error
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
      if (e.path == 'setting') {
        return res.status(400).send({
          success: false,
          exist: false,
          message: "Không thể chỉnh sửa hoặc tạo mới",
          messages: langConcat(lang?.resources?.setting, lang?.message?.error?.validation?.not_exist),
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

