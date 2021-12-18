import runMidldleware from '../../../middleware/mongodb';
import livestreamController from '../../../controllers/livestream';
import userController from '../../../controllers/user';
import lang, { langConcat } from '../../../lang.config';
import jwt from '../../../middleware/jwt'
import { MODE } from '../../../utils/helper';

const handler = async (req, res) => {
  if (req.method == 'GET') {
    try {
      const { page, pageSize = 100, title, author, enabled, setIndex } = req.query;
      if (setIndex) {
        const list = await livestreamController.getlist({});
        let i = 1;
        for (let livestream of list) {
          livestream.index = i;
          await livestream.save();
          i++;
        }
        return res.status(200).send({
          success: true,
          total: i - 1,
        });
      }
      const query = {};
      if (title) query.title = new RegExp(title, "i");
      if (author) query.author = author;
      if (enabled) query.enabled = !(enabled == "false");
      const skip = Number(page * pageSize) || 0;
      const limit = Number(pageSize) || 0;
      const total = await livestreamController.getlist(query).countDocuments();
      const data = await livestreamController.getlist(query).skip(skip).limit(limit).sort({ index: -1 });
      return res.status(200).send({
        success: true,
        data,
        total,
        page: Number(page) || 0,
        pageSize: Number(pageSize) || 0,
        query: { title, author },
      });
    } catch (error) {
      return res.status(500).send({
        success: false,
        message: 'Máy chủ không phản hồi',
        messages: lang?.message?.error?.server,
        error: error,
      });
    }
  } else if (req.method == 'POST') {
    try {
      const bearerToken = req.headers['authorization'];
      if (!bearerToken) throw ({ path: 'token' })
      const user = jwt.verify(bearerToken);
      if (user?.mode != MODE.admin && user?.mode != MODE.exhibitor) throw ({ ...user, path: 'token' });
      const { author, titleVN, titleEN, descriptionVN, descriptionEN, link, embed, index } = req.body;
      if (!link) throw ({ path: 'link' });
      if (!titleVN) throw ({ path: 'titleVN' });
      if (!titleEN) throw ({ path: 'titleEN' });
      if (!descriptionVN) throw ({ path: 'descriptionVN' });
      if (!descriptionEN) throw ({ path: 'descriptionEN' });
      if (user.mode == MODE.admin) {
        if (!author) throw ({ path: 'author' })
        try {
          const currentUser = userController.get(author);
          if (!currentUser) throw ({});
        }
        catch (e) {
          throw ({ path: 'author' })
        }
      }
      let newIndex = 0;
      if (index >= 0) {
        if (index == 0) {
          try {
            const lastItem = await livestreamController.find({ author: user.mode == MODE.admin ? author : user._id }).sort({ index: -1 });
            newIndex = lastItem.index + 1;
          } catch (e) {
            newIndex = 1;
          }
        }
        else {
          try {
            const list = await livestreamController.getlist({ author: user.mode == MODE.admin ? author : user._id }).skip(index - 1).limit(2).sort({ index: -1 });
            const beforeIndex = list[0]?.index || 1;
            const afterIndex = list[1]?.index || 0;
            newIndex = (beforeIndex + afterIndex) / 2;
          } catch { }
        }
      }
      else {
        try {
          const lastItem = await livestreamController.find({ author: user.mode == MODE.admin ? author : user._id }).sort({ index: -1 });
          newIndex = (lastItem?.index || 0) + 1;
        }
        catch { };
      }
      const livestreamCreated = await livestreamController.create({
        author: user.mode == MODE.admin ? author : user._id,
        title: titleVN, titles: { vn: titleVN, en: titleEN },
        description: descriptionVN, descriptions: { vn: descriptionVN, en: descriptionEN },
        link, embed, index: newIndex
      })
      return res.status(201).send({
        success: true,
        data: livestreamCreated,
        message: 'Thêm thành công',
        messages: lang?.message?.success?.created
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
      if (e.path == 'link') {
        return res.status(400).send({
          success: false,
          validation: false,
          field: 'link',
          message: 'Liên kết không được để trống',
          messages: langConcat(lang?.resources?.link, lang?.message?.error?.validation?.required),
        });
      }
      if (e.path == 'author') {
        return res.status(400).send({
          success: false,
          validation: false,
          field: 'author',
          message: 'Người dùng không tồn tại',
          messages: langConcat(lang?.resources?.user, lang?.message?.error?.validation?.not_exist),
        });
      }
      if (e.path == 'titleVN' || e.path == 'titleEN') {
        return res.status(400).send({
          success: false,
          validation: false,
          field: e.path,
          message: 'Tiêu đề không được để trống',
          messages: langConcat(lang?.resources?.title, lang?.message?.error?.validation?.required),
        });
      }
      if (e.path == 'descriptionVN' || e.path == 'descriptionEN') {
        return res.status(400).send({
          success: false,
          validation: false,
          field: e.path,
          message: 'Mô tả không được để trống',
          messages: langConcat(lang?.resources?.description, lang?.message?.error?.validation?.required),
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
      if (!bearerToken) throw ({ path: 'token' });
      const user = jwt.verify(bearerToken);
      if (user?.mode != MODE.admin && user?.mode != MODE.exhibitor) throw ({ ...user, path: 'token' });
      const { _ids } = req.query;
      if (!_ids) throw ({ path: '_ids' });
      const query = { _id: { $in: _ids.split(",") } };
      if (user.mode != MODE.admin) {
        query.author = user._id;
      }
      await livestreamController.removeMany(query);
      return res.status(200).send({
        success: true,
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
      if (e.path == '_ids') {
        return res.status(400).send({
          success: false,
          format: false,
          message: "Danh sách video trực tuyến không đúng định dạng",
          messages: langConcat(lang?.resources?.livestreamList, lang?.message?.error?.validation?.format),
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
