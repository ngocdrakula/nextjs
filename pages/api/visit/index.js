import runMidldleware from '../../../middleware/mongodb';
import visitController from '../../../controllers/visit';
import countController from '../../../controllers/count';
import lang from '../../../lang.config';
import jwt from '../../../middleware/jwt';
import { formatTime, MODE } from '../../../utils/helper'

const handler = async (req, res) => {
  if (req.method == 'GET') {
    try {
      const bearerToken = req.headers['authorization'];
      const user = bearerToken && jwt.verify(bearerToken);
      if (user?.mode != MODE.admin) throw ({ path: 'token' })
      const { page, pageSize = 100, address, counts } = req.query;
      const query = {};
      const skip = Number(page * pageSize) || 0;
      const limit = Number(pageSize) || 0;
      if (address) query.address = new RegExp(address, "i");
      const total = await visitController.getlist(query).countDocuments();
      const list = await visitController.getlist(query).skip(skip).limit(limit);
      const countList = [];
      if (counts) {
        try {
          const ranges = counts.split(',');
          const timeZone = new Date().getTimezoneOffset() * 60 * 1000
          for (let i = 0; i < ranges.length; i++) {
            const dates = ranges[i].split('.')
            const minDate = new Date(dates[0]);
            minDate.setTime(minDate.getTime() + (Number(timeZone) || 0));
            const maxDate = new Date(dates[1]);
            maxDate.setTime(maxDate.getTime() + (Number(timeZone) || 0));
            const countRange = await countController.getlist({ createdAt: { $gte: minDate, $lt: maxDate } });
            const visit = countRange.length && countRange.reduce((sum, c) => ({
              view: sum.view + c.view,
              hit: sum.hit + c.hit
            }), { view: 0, hit: 0 }) || { view: 0, hit: 0 };
            countList.push({ dates, visit })
          }
        }
        catch (e) { throw ({ path: 'counts' }); }
      }
      return res.status(200).send({
        success: true,
        data: list,
        total,
        countList,
        page: Number(page) || 0,
        pageSize: Number(pageSize) || 0,
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
      return res.status(500).send({
        success: false,
        message: 'Máy chủ không phản hồi',
        messages: lang?.message?.error?.server,
        error: e,
      });
    }
  } else if (req.method == 'POST') {
    try {
      const address = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;
      const now = new Date();
      now.setTime(now.getTime() + now.getTimezoneOffset() * 60 * 1000);
      const today = formatTime(now, "YYYY-MM-DD");
      now.setDate(now.getDate() + 1);
      const tomorrow = formatTime(now, "YYYY-MM-DD");
      try {
        const currentVisit = await visitController.find({ address });
        if (!currentVisit) throw ({});
        currentVisit.hit++;
        if (formatTime(currentVisit.updatedAt, "YYYY-MM-DD") != today) {
          currentVisit.view++;
        }
        await currentVisit.save();
      }
      catch {
        await visitController.create({ address });
      }
      try {
        const currentCount = await countController.find({ address, createdAt: { $gte: today, $lt: tomorrow } });
        if (!currentCount) throw ({});
        currentCount.hit++;
        await currentCount.save();
      }
      catch (e) {
        await countController.create({ address });
      }
      return res.status(200).send({
        success: true,
        address
      });
    } catch (e) {
      return res.status(500).send({
        success: false,
        message: 'Máy chủ không phản hồi',
        messages: lang?.message?.error?.server,
        error: e,
      });
    }
  } else if (req.method == 'DELETE') {
    try {
      const bearerToken = req.headers['authorization'];
      if (!bearerToken) throw ({ path: 'token' });
      const user = jwt.verify(bearerToken);
      if (!user?.mode) throw ({ ...user, path: 'token' });
      const { _ids } = req.query;
      if (!_ids) throw ({ path: '_ids' });
      const query = {
        _id: { $in: _ids.split(",") }
      };
      await visitController.removeMany(query);
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
          required: false,
          message: "Danh sách khách truy cập không đúng định dạng", 
          messages: langConcat(lang?.resources?.visitList, lang?.message?.error?.validation?.format),
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
