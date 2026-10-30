import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db/index"
import { toNodeHandler } from "better-auth/node";
import { username } from "better-auth/plugins";


export const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL,
    database: drizzleAdapter(db, {
        provider: "pg"
    }), 
    emailAndPassword: {
        enabled: true
    },
    plugins: [
        username()
    ]
})

export const mountAuthRoutes = (app) => {
    app.all("/api/auth/*", toNodeHandler(auth))
}


