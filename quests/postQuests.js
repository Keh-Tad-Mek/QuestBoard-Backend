import { error } from "better-auth/api"
import dotenv from "dotenv"
import { desc } from "drizzle-orm"

dotenv.config()

export const postQuests = (app) => {
    app.post("/api/quests/post", (req, res) => {
        try {
            const { 
                title,
                description,
                requirement,
                maxQuestTakers
            } = req.body

            if (!title || !description || !requirement || !maxQuestTakers) {
                return res.status(400).json({ error: "Bad Request."})
            }

            res.status(201).json({ ok: true })
        } catch (error) {
            res.status(500)
            .json({ error: "A tad bit busy now. We can not post yer quest. Sorry lad. Come back a bit later." })
        }
    })
}