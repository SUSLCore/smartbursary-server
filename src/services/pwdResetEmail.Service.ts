import nodemailer from "nodemailer";

export class EmailService {

    private transporter;

    constructor() {

        this.transporter = nodemailer.createTransport({

            service: "gmail",

            auth: {

                user: process.env.EMAIL_USER,

                pass: process.env.EMAIL_PASSWORD

            }

        });

    }

    public async sendOtpEmail(

        email: string,

        otp: string

    ): Promise<void> {

        await this.transporter.sendMail({

            from: process.env.EMAIL_USER,

            to: email,

            subject: "SmartBursary Password Reset OTP",

            html: `
                <h2>SmartBursary Password Reset</h2>

                <p>Your OTP is</p>

                <h1>${otp}</h1>

                <p>This OTP expires in 5 minutes.</p>

                <p>If you didn't request this, please ignore this email.</p>
            `

        });

    }

}