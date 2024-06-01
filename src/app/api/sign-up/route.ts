import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request){
    await dbConnect();

    try {
        const {username, email, password} = await request.json()
        const existingUserVerifiedByUsername = await UserModel.findOne({username, isVerified: true})

        if(existingUserVerifiedByUsername) {
            return Response.json({
                success: false,
                message: "Username already exists. Please choose a different one."
            }, {
                status: 400
            });
        }

        const existingUserByEmail = await UserModel.findOne({email})
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        if(existingUserByEmail) {
            if(existingUserByEmail.isVerified) {
                return Response.json({
                    success: false,
                    message: "Email already exists. Please login."
                }, {
                    status: 400
                });
            }
            else {
                const hassedPassword = await bcrypt.hash(password, 10);
                existingUserByEmail.password = hassedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000); //1 hour
                await existingUserByEmail.save();
                // existingUserByEmail.verifyCode = verifyCode;
                // existingUserByEmail.verifyCodeExpiry = new Date();
                // existingUserByEmail.verifyCodeExpiry.setHours(existingUserByEmail.verifyCodeExpiry.getHours() + 1);
                // await existingUserByEmail.save();
            }
        }
        else {
            const hassedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);

            const newUser = new UserModel({
                username,
                email,
                password: hassedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessages: true,
                messages: [],
            });

            await newUser.save();
        }

        //send verification email
        const emailResponse = await sendVerificationEmail(email, username, verifyCode);

        if(!emailResponse.success) {
            return Response.json({
                success: false,
                message: emailResponse.message || "Error sending verification email. Please try again later."
            }, { status: 500 });
        }

        return Response.json({
            success: true,
            message: "User created successfully. Please verify your email to login."
        }, { status: 201 });
    }
    catch (error){
        console.error("Error in sign-up route: ", error); //displayed in terminal
        return Response.json( //displayed in front-end
            {
                success: false,
                message: "Error in sign-up route. Please try again later."
            },
            {
                status: 500
            }
        );
    }
}