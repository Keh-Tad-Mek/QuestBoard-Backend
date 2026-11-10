import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db/index.js"
import { toNodeHandler } from "better-auth/node";
import { username, emailOTP } from "better-auth/plugins";
import * as schema from "../db/schema.js"
import transporter from "./brevo.js"
import dotenv from "dotenv"

dotenv.config()

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: {
            user: schema.user,
            session: schema.session,
            account: schema.account,
            verification: schema.verification,
        }
    }), 
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
		onExistingUserSignUp: async ({ user }, request) => {
			await transporter.sendMail({
				to: user.email,
				subject: "Sign-up attempt with your email",
				text: "A traveler ventured to sign up to the quest board using yer raven address. \
                        \n If this is not ye, just remain sober traveler. \
                        \n We will find the imposter and send him to the gallows.",
			});
		},

    },
    emailVerification: {
        autoSignInAfterVerification: true,
    },
    plugins: [
        username({
            displayUsername: false,
        }),
        emailOTP({
            overrideDefaultEmailVerification: true,
            sendVerificationOnSignUp: true,
            async sendVerificationOTP({ email, otp, type}) {
                await transporter.sendMail({
                    to: email,
                    subject: "Yer code number",
                    text: `${otp} 
                    \n This be yer code number our raven sent. 
                    \n Use it to verify yerself. 
                    \n Give this number to no one, or ye'll be walkin' to the gallows.`
                })
            },
            expiresIn: 600,
            otpLength: 6,
        })
    ],
    baseURL: process.env.BETTER_AUTH_URL,
    trustedOrigins: [process.env.FRONTEND_URL],

    advanced: {
        useSecureCookies: true,
    },

    secret: process.env.BETTER_AUTH_SECRET,
})

export const mountAuthRoutes = (app) => {
    app.all("/api/auth/*path", toNodeHandler(auth))
}