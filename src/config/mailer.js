import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
    service: "gmail", 
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

export const verifyMailer = async () => {
    try {
        await transporter.verify();
        console.log("📨 Mailer está listo para enviar correos.");
    } catch (err) {
        console.error("Error en mailer:", err);
    }
};
