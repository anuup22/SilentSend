import { resend } from "@/lib/resend";
import VerificationEmail from "@/../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: 'SilentSend <onboarding@resend.dev>',
            to: [email],
            subject: 'SilentSend | Verification Code',
            react: VerificationEmail({username, otp: verifyCode}),

            // from: 'onboarding@resend.dev',
            // to: email,
            // subject: 'SilentSend | Verification Code',
            // react: VerificationEmail({username, otp: verifyCode}),
        });
        // const emailTemplate = new VerificationEmail(username, verifyCode);
        // await emailTemplate.sendEmail(email);
        return {
            success: true,
            message: `Verification email sent to ${email}`
        };
    } 
    catch (error) {
        console.error("Error sending verification email", error);
        return {
            success: false,
            message: "Error sending verification email"
        };
    }
}