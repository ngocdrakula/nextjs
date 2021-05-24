import runMidldleware from '../../../middleware/mongodb';
import productController from '../../../controllers/product';
import lang from '../../../lang.config';

const handler = async (req, res) => {
  if (req.method == 'POST') {
    try {
      const room = req.query.id
      try {
        const productUpdated = await productController.updateMany({ room }, { room: [room] });
        return res.status(200).send({
          success: true,
          data: productUpdated,
          message: 'Cập nhật thành công',
          messages: lang?.message?.success?.updated
        });
      } catch (error) {
        if (error.path == "_id") throw ({ path: 'product', files });
        throw error
      }
    } catch (e) {
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

