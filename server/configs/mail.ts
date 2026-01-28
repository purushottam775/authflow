export const mailConfig = {
    provider: process.env.EMAIL_PROVIDER,
    from: process.env.EMAIL_FROM,
};

if (!process.env.RESEND_API_KEY) {
    console.warn("⚠️ RESEND_API_KEY is missing in .env");
}
