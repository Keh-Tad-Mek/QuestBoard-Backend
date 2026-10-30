import express from "express"
import { mountAuthRoutes } from "./lib/auth"

const app = express()

mountAuthRoutes(app)

app.use(express.json())


app.listen(3000)