import nodemailer from "nodemailer";
import { formatTime } from '../utils/helper';

const ORIGIN = process.env.HOST_NAME === 'localhost' ? process.env.ORIGIN_LOCAL : process.env.ORIGIN

const mailer = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    port: 587,
    // secure: true,
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});


export const resetPassword = async ({ email, name, code, expired }) => {
    const formatted = formatTime(expired, "HH:II:SS DD/MM/YYYY")
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: '[VIMEXPO] Yêu cầu cấp lại mật khẩu',
        html: `<h2>Xin chào ${name}!</h2>`
            + `<p>Mã bảo mật để lấy lại mật khẩu của bạn tại ${ORIGIN} là <b>${code}</b>!</p>`
            + `<p>Mã bảo mật này sẽ hết hạn trong vòng <b>10 phút</b> kể từ lúc bạn yêu cầu (hết hạn lúc: <b>${formatted})</b>.</p>`
    };
    return new Promise(resolve => {
        mailer.sendMail(mailOptions, function (error, info) {
            if (error) {
                resolve({ success: false, error });
            } else {
                resolve({ success: true, info });
            }
        });
    })
}

export const registerSuccess = async ({ email, password, token }) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: '[VIMEXPO] Đăng ký tài khoản thành công',
        html: `<h2 style="with:100%;text-align:center">XIN CHÚC MỪNG</h2>`
            + `<p>Bạn đã đăng ký tài khoản thành công tại website ${ORIGIN}.</p>`
            + `<p>Tài khoản đăng nhập: <b>${email}</b>.</p>`
            + `<p>Mật khẩu đăng nhập: <b>${password.split("").fill("*").join("")}</b>.</p>`
            + `<p>Để xác thực tài khoản vui lòng <a href="${ORIGIN}verify?token=${token}">nhấp vào đây</a> `
            + `hoặc sao chép đường dẫn dưới đây và dán vào thanh địa chỉ:<br>`
            + `<a href="${ORIGIN}verify?token=${token}">${ORIGIN}verify?token=${token}</a>.</p>`
            + `<p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.</p>`
    };
    return new Promise(resolve => {
        mailer.sendMail(mailOptions, function (error, info) {
            if (error) {
                resolve({ success: false, error });
            } else {
                resolve({ success: true, info });
            }
        });
    })
}
export const registerNotification = async ({ email, name }) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: '[VIMEXPO] Thông báo đăng ký thành viên',
        html: `<h2 style="with:100%;text-align:center">BÁO CÁO ĐĂNG KÝ THÀNH VIÊN</h2>`
            + `<p>Một tài khoản người mua đã đăng ký thành công.</p>`
            + `<p>Email: <b>${email}</b>.</p>`
            + `<p>Tên: <b>${name}</b>.</p>`
            + `<p>Bạn có thể kiểm tra và chỉnh sửa thông tin người mua tại <a href="${ORIGIN}admin">trang Admin</a>.</p>`
    };
    return new Promise(resolve => {
        mailer.sendMail(mailOptions, function (error, info) {
            if (error) {
                resolve({ success: false, error });
            } else {
                resolve({ success: true, info });
            }
        });
    })
}
export const verifySuccess = async ({ email }) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: '[VIMEXPO] Xác thực tài khoản thành công',
        html: `<h2 style="with:100%;text-align:center">XIN CHÚC MỪNG</h2>`
            + `<p>Bạn đã xác thực tài khoản thành công tại website ${ORIGIN}.</p>`
            + `<p>Tài khoản đăng nhập: <b>${email}</b>.</p>`
            + `<p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.</p>`
    };
    return new Promise(resolve => {
        mailer.sendMail(mailOptions, function (error, info) {
            if (error) {
                resolve({ success: false, error });
            } else {
                resolve({ success: true, info });
            }
        });
    })
}
export const tradeSuccess = async ({ email, fromEmail, fromName, toEmail, toName, deadline, content }) => {
    const formatted = formatTime(deadline, "HH:II:SS DD/MM/YYYY")
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: '[VIMEXPO] Đăng ký kết nối giao thương thành công',
        html: `<h2 style="with:100%;text-align:center">XIN CHÚC MỪNG</h2>`
            + `<p>Bạn đã đăng ký kết nối giao thương thành công.</p>`
            + `<p>Tên đăng ký: <b>${fromName}</b>.</p>`
            + `<p>Email đăng ký: <b>${fromEmail}</b>.</p>`
            + `<p>Tên đối tác: <b>${toName}</b>.</p>`
            + `<p>Email đối tác: <b>${toEmail}</b>.</p>`
            + `<p>Thời gian: <b>${formatted}</b>.</p>`
            + `<p>Nội dung: <b>${content}</b>.</p>`
            + `<p>Cảm ơn bạn đã đăng ký, mọi thông tin sẽ được chúng tôi liên hệ và thông báo tới bạn.</p>`
    };
    return new Promise(resolve => {
        mailer.sendMail(mailOptions, function (error, info) {
            if (error) {
                resolve({ success: false, error });
            } else {
                resolve({ success: true, info });
            }
        });
    })
}
export const tradeNotification = async ({ fromEmail, fromName, toEmail, toName, deadline, content }) => {
    const formatted = formatTime(deadline, "HH:II:SS DD/MM/YYYY")
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: '[VIMEXPO] Báo cáo đăng ký kết nối giao thương thành công',
        html: `<h2 style="with:100%;text-align:center">BÁO CÁO ĐĂNG KÝ</h2>`
            + `<p>Thành viên đã đăng ký kết nối giao thương thành công.</p>`
            + `<p>Tên tài khoản đăng ký: <b>${fromName}</b>.</p>`
            + `<p>Email đăng ký: <b>${fromEmail}</b>.</p>`
            + `<p>Tên tài khoản đối tác: <b>${toName}</b>.</p>`
            + `<p>Email đối tác: <b>${toEmail}</b>.</p>`
            + `<p>Thời gian: <b>${formatted}</b>.</p>`
            + `<p>Nội dung: <b>${content}</b>.</p>`
            + `<p>Bạn có thể kiểm tra và xét duyệt lịch giao thương tại <a href="${ORIGIN}admin">trang Admin</a>.</p>`
    };
    return new Promise(resolve => {
        mailer.sendMail(mailOptions, function (error, info) {
            if (error) {
                resolve({ success: false, error });
            } else {
                resolve({ success: true, info });
            }
        });
    })
}
export default mailer;