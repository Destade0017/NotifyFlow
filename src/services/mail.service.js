import nodemailer from "nodemailer";

let transporter = null;

const getTransporter = async () => {
    if (transporter) return transporter;

    const testAccount = await nodemailer.createTestAccount();

    console.log("-----------------------------------------");
    console.log("Ethereal Mail Test Account Created");
    console.log(`User: ${testAccount.user}`);
    console.log("-----------------------------------------");

    transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass,
        }
    });

    return transporter;

}

export const sendEmail = async ({ to, subject, html }) => {
        const mailer = await getTransporter();

        const info = await mailer.sendMail({
            from: '"NotifyFlow Reminders" <no-reply@notifyflow.com>',
            to, 
            subject, 
            html,
        });

        console.log(`Email sent: ${info.messageId}`);

        console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);

        return info;
};

export const sendConfirmationEmail = async ({ to, name, title, scheduledAt }) => {
    const formattedDate = new Date(scheduledAt).toLocaleString();

    const html = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2>Appointment Confirmed!</h2>
      <p>Hello <strong>${name}</strong>,</p>
      <p>Your appointment has been successfully scheduled:</p>
      <ul>
        <li><strong>Title:</strong> ${title}</li>
        <li><strong>Date & Time:</strong> ${formattedDate}</li>
      </ul>
      <p>Thank you for using NotifyFlow!</p>
    </div>
    `;

    return await sendEmail({
        to,
        subject: `Confirmed: ${title}`,
        html,
    })
}