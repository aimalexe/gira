const { transporter } = require("../configs/mailer.config");

const sendEmail = async ({ to, subject, html }) => {
    try {
        await transporter.sendMail({
            from: `"Gira" <${process.env.SMTP_USER}>`,
            to,
            subject,
            html,
        });
        console.log(`Email sent to ${to}`);
    } catch (err) {
        console.error('Error sending email:', err);
        throw new Error('Failed to send email');
    }
};

module.exports = { sendEmail };