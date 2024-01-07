const date = require('date-and-time');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

function getDate() {
    let now = new Date();
    let createdAtDate = date.format(now, "YYYY-MM-DD HH:mm:ss");
    return createdAtDate;
}

function generateRandomString(length) {
    return crypto.randomBytes(Math.ceil(length / 2))
        .toString('hex')
        .slice(0, length);
}


function addMinuteToCurrentDate(min) {
    const currentDate = new Date();
    // Add 5 minutes to the current date and time
    const newDate = date.addMinutes(currentDate, min);
    return date.format(newDate, "YYYY-MM-DD HH:mm:ss");
}

function createToken(dateToFormat) {
    return date.format(dateToFormat, "YYYY-MM-DD HH:mm:ss");
}

function getToken() {
    const staticString = "POST";
    const currentTimeSeconds = new Date().toISOString().replace(/[^\d]/g, "");
    const token =
        staticString +
        currentTimeSeconds +
        generateRandomString(32);
    return token;
}
const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 465,
    secure: true,
    logger: true,
    debug: true,

    auth: {
        user: process.env.email,
        pass: process.env.epassword,
    },
    tls: {
        rejectUnauthorized: true
    }
});
const sendEmail = (email, token) => {
    const mailOptions = {
        from: 'ajay8182831490@gmail.com',
        to: email,
        subject: 'reset password',
        html: `<p>Click <a href="http://localhost:3000/v1/user/resetPassword/?token=${token}>here</a> to reset your password .</p>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};






module.exports = {
    getDate,
    addMinuteToCurrentDate,
    getToken,
    sendEmail


}

