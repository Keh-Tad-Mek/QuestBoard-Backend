import express from "express"
import { mountAuthRoutes } from "./lib/auth.js"
import { postQuests } from "./quests/postQuests.js"
import dotenv from "dotenv"
import cors from "cors"

dotenv.config()

const app = express()

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
}))

mountAuthRoutes(app, cors())

app.use(express.json())

postQuests(app, cors())

app.listen(3000)