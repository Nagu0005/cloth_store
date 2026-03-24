const emailRepository = require('../repositories/emailRepository');
const nodemailer = require('nodemailer');

class EmailService {

    constructor() {
        // Initialize SMTP Transporter
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.ethereal.email',
            port: process.env.SMTP_PORT || 587,
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });
    }

    async sendEmail(emailReq) {
        if (!emailReq.recipient || !emailReq.subject || !emailReq.body || !emailReq.type) {
            throw new Error("Missing required email fields (recipient, subject, body, type)");
        }

        // 1. Create a record in the database with status PENDING
        const emailRecord = await emailRepository.saveEmail({
            ...emailReq,
            status: 'PENDING'
        });

        // 2. Send actual email via SMTP
        let isSuccess = false;
        try {
            const mailOptions = {
                from: `"Cloth Store" <${process.env.SMTP_USER || 'noreply@clothstore.com'}>`,
                to: emailReq.recipient,
                subject: emailReq.subject,
                text: emailReq.body,
            };

            const info = await this.transporter.sendMail(mailOptions);
            console.log(`Email dispatched to ${emailReq.recipient}. Message ID: ${info.messageId}`);
            if (info.messageId) {
                // If using Ethereal, log the preview URL specifically
                if (process.env.SMTP_HOST && process.env.SMTP_HOST.includes('ethereal')) {
                    console.log(`Preview Ethereal Mail URL: ${nodemailer.getTestMessageUrl(info)}`);
                }
                isSuccess = true;
            }
        } catch (error) {
            console.error(`Failed to send email to ${emailReq.recipient} via SMTP:`, error.message);
        }

        // 3. Update the database record with the final status
        const updatedEmail = await emailRepository.saveEmail({
            ...emailRecord,
            status: isSuccess ? 'SENT' : 'FAILED',
            sent_at: isSuccess ? new Date() : null
        });

        if (!isSuccess) {
            throw new Error("Failed to dispatch email via SMTP provider");
        }

        return updatedEmail;
    }

    async getEmails() {
        return await emailRepository.findAll();
    }

    async getEmailById(id) {
        return await emailRepository.findById(id);
    }
}

module.exports = new EmailService();
