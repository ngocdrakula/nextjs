import runMidldleware from '../../../middleware/mongodb';
import lang from '../../../lang.config';
import uploadLogo from '../../../middleware/multerUploadLogo';
import jwt from '../../../middleware/jwt'

const handler = async (req, res) => {
    if (req.method == 'POST') {
        try {
            const contentType = req.headers['content-type'];
            const bearerToken = req.headers['authorization'];
            if (!bearerToken) throw ({ path: 'token' })
            if (!contentType || contentType.indexOf('multipart/form-data') == -1)
                throw ({ path: 'content-type', contentType });
            const user = jwt.verify(bearerToken);
            if (!user?.mode) throw ({ ...user, path: 'token' });
            const { file, err } = await uploadLogo(req);
            if (err || !file) throw ({ path: 'file' });
            return res.status(201).send({
                success: true,
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
            if (e.path == 'content-type') {
                return res.status(400).send({
                    success: false,
                    headerContentType: false,
                    contentType: e.contentType,
                    aceptedOnly: 'multipart/form-data',
                    message: 'Header không được chấp nhận',
                    messages: lang?.message?.error?.header_not_acepted
                });
            }
            if (e.path == 'files') {
                return res.status(400).send({
                    success: false,
                    upload: false,
                    field: 'files',
                    message: 'Upload không thành công',
                    messages: lang?.message?.error?.upload_failed,
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

export const config = {
    api: {
        bodyParser: false, // Disallow body parsing, consume as stream
    },
};

export default runMidldleware(handler);
