import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request){
    await dbConnect();

    try {
        const {username, email, password} = await request.json()
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