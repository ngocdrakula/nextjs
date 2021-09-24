import fs from 'fs';
import runMidldleware from '../../../middleware/mongodb';
import tradeController from '../../../controllers/trade';
import lang from '../../../lang.config';
import jwt from '../../../middleware/jwt'
import { formatTime, MODE } from '../../../utils/helper';

const handler = async (req, res) => {
  if (req.method == 'GET') {
    try {
      const bearerToken = req.headers['authorization'];
      if (!bearerToken) throw ({ path: 'token' });
      const user = jwt.verify(bearerToken);
      if (user?.mode != MODE.admin && user?.mode != MODE.exhibitor) throw ({ ...user, path: 'token' });
      const { from, type } = req.query;
      const query = {};
      const fromId = user.mode == MODE.admin ? from : user._id;
      if (fromId) {
        query.$or = [{ 'leader.user': fromId }, { 'member.user': fromId, approved: true }];
      }
      const data = await tradeController.getlist(query)
        .populate({ path: 'leader.user', select: 'email' })
        .populate({ path: 'member.user', select: 'email' });
      const fileType = type == "xls" ? "xls" : "csv";
      const fileName = `Danh-sach-giao-thuong-${formatTime(new Date(), "YYYY-MM-DD-HH-II-SS")}.${fileType}`;
      const filePath = process.env.FOLDER_UPLOAD + "/" + fileName;
      const writeStream = fs.createWriteStream(filePath);
      writeStream.write("\uFEFF");
      const tab = (type == "xls" ? "," : "") + "\t";
      const ln = (type == "xls" ? "," : "") + "\n"
      if (user.mode == MODE.admin && !from) {
        const headers = [
          "STT",
          "Tên đăng ký", "Email đăng ký", "Email tài khoản đăng ký",
          "Tên đối tác", "Email đối tác", "Email tài khoản đối tác",
          "Thời gian giao thương", "Nội dung giao thương", "Thời gian đăng ký", "Trạng thái"
        ];
        writeStream.write(headers.join(tab) + ln);
        data.map(({ leader, member, deadline, createdAt, content, approved }, index) => {
          const row = [
            index,
            leader.name, leader.email, leader.user?.email,
            member.name, member.email, member.user?.email,
            formatTime(deadline, "YYYY/MM/DD HH:II:SS"), content, formatTime(createdAt, "YYYY/MM/DD HH:II:SS"), approved ? "Đã duyệt" : "Chưa duyệt"
          ];
          writeStream.write(row.join(tab) + ln);
        });
      }
      else {
        const headers = [
          "STT", "Tên đăng ký", "Email đăng ký", "Tên đối tác", "Email đối tác", "Email tài khoản đối tác", "Thời gian giao thương",
          "Nội dung giao thương", "Thời gian đăng ký"
        ];
        writeStream.write(headers.join(tab) + ln);
        data.map(({ leader, member, deadline, createdAt, content }, index) => {
          const row = [index];
          if (user._id === leader.user?._id) {
            row.push(leader.name, leader.email, member.name, member.email, member.user?.email)
          }
          else {
            row.push(member.name, member.email, leader.name, leader.email, leader.user?.email);
          }
          row.push(formatTime(deadline, "YYYY/MM/DD HH:II:SS"), content, formatTime(createdAt, "YYYY/MM/DD HH:II:SS"));
          writeStream.write(row.join(tab) + ln);
        });
      }
      writeStream.close();
      return res.status(201).send({
        success: true,
        fileName,
        message: 'Tạo file thành công',
        messages: lang?.message?.error?.unauthorized
      });
    } catch (error) {
      console.log(error)
      if (error.path == 'token') {
        if (!error.token) {
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
        message: error.message,
        messages: lang?.message?.error?.server,
        error: error,
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
