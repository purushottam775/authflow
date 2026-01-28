import { Resend } from "resend";

export const sendEmail = async (to: string, subject: string, html: string) => {
    const resend = new Resend(process.env.RESEND_API_KEY!);

    try {
        await resend.emails.send({
            from: process.env.EMAIL_FROM!,
            to,
            subject,
            html,
        });
    } catch (error) {
        console.error("Email sending failed:", error);
        throw new Error("Unable to send email");
    }
};
