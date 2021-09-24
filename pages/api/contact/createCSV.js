import fs from 'fs';
import runMidldleware from '../../../middleware/mongodb';
import contactController from '../../../controllers/contact';
import lang from '../../../lang.config';
import jwt from '../../../middleware/jwt'
import { formatTime, MODE } from '../../../utils/helper';

const handler = async (req, res) => {
  if (req.method == 'GET') {
    try {
      const bearerToken = req.headers['authorization'];
      if (!bearerToken) throw ({ path: 'token' });
      const user = jwt.verify(bearerToken);
      if (user?.mode != MODE.admin) throw ({ ...user, path: 'token' });
      const { type } = req.query;
      const data = await contactController.getlist({});
      const fileType = type == "xls" ? "xls" : "csv";
      const fileName = `Danh-sach-lien-he-${formatTime(new Date(), "YYYY-MM-DD-HH-II-SS")}.${fileType}`;
      const filePath = process.env.FOLDER_UPLOAD + "/" + fileName;
      const writeStream = fs.createWriteStream(filePath);
      writeStream.write("\uFEFF");
      const headers = ["STT", "Tên", "Email", "Chủ đề", "Nội dung", "Trạng thái", "Thời gian tạo"];
      const tab = (type == "xls" ? "," : "") + "\t";
      const ln = (type == "xls" ? "," : "") + "\n"
      writeStream.write(headers.join(tab) + ln);
      data.map(({ name, email, title, createdAt, message, read }, index) => {
        const row = [index, name, email, title, message, read ? "Đã đọc" : "Chưa đọc", formatTime(createdAt, "YYYY/MM/DD HH:II:SS")];
        writeStream.write(row.join(tab) + ln);
      });
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
