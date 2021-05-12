import runMidldleware from '../../../middleware/mongodb';
import userController from '../../../controllers/user';
import lang from '../../../lang.config';
import jwt from '../../../middleware/jwt'

const handler = async (req, res) => {
    if (req.method == 'GET') {
        try {
            const { page, pageSize, enabled } = req.query;
            const query = {};
            if (enabled) query.enabled = (enabled == "true");
            const skip = Number(page * pageSize) || 0;
            const limit = Number(pageSize) || 0;
            const total = await userController.getlist(query).countDocuments();
            const list = await userController.getlist(query).skip(skip).limit(limit);
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
            await userController.removeMany(query);
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
                    message: "Danh sách sản phẩm phải là một mảng id",
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

