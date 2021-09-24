import fs from 'fs';
import runMidldleware from '../../../middleware/mongodb';
import lang from '../../../lang.config';
import { cleanFiles } from '../../../middleware/multer';

const handler = async (req, res) => {
  if (req.method == 'GET') {
    try {
      const { fileName } = req.query;
      if (!fileName) throw ({ path: 'fileName' });
      const filePath = process.env.FOLDER_UPLOAD + "/" + fileName;
      if (!fs.existsSync(filePath)) throw ({ path: 'fileName' });
      const stat = fs.statSync(filePath);
      const readStream = fs.createReadStream(filePath);
      res.writeHead(200, {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Length': stat.size
      });
      return readStream.pipe(res).once("close", function () {
        readStream.destroy();
        cleanFiles([fileName]);
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
      } else if (error.path == 'fileName') {
        return res.status(400).send({
          success: false,
          field: 'fileName',
          message: 'Không thể tìm thấy file',
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
