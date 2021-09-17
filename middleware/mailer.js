import nodemailer from "nodemailer";

// const mailer = nodemailer.createTransport({
//     service: process.env.EMAIL_SERVICE,
//     secure: true,
//     auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
// });

const testAccount = nodemailer.createTestAccount();
let mailer = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: { user: 'h3uj3rbndgxo3hw5@ethereal.email', pass: 'Ue3sG45hV9HuCfcQsJ', },
});

export const resetPassword = async ({ email, name, code }) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: '[VIMEXPO] Password reset',
        html: `<h1>Hell ${name}</h1><p>Your code for reset password is <b>${code}</b>!</p>`
    };
    console.log(mailOptions)
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