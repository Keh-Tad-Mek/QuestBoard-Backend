import dotenv from "dotenv"
import { db } from "../db/index.js"
import { fromNodeHeaders } from "better-auth/node"
import { auth } from "../lib/auth.js"
import { quests } from "../db/schema.js"
import { desc } from "drizzle-orm"

dotenv.config()

export const postQuests = async (app) => {
    app.post("/api/quests/post", async (req, res) => {
        const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers)
        })

        try {

            if (!session) {
                return res.status(401).json({
                    error: "Ye are but a stranger here. \n Ye are not authorized to take quests."
                })
            }

            console.log(session)
        } catch { 
            res.status(500)
            .json({ error: "A tad bit busy now. We can not post yer quest. Sorry lad. Come back a bit later." })
        }

        try {
            let { 
                title,
                description,
                requirement,
                maxQuestTakers
            } = req.body

            const userId = session.user.id

            if (!title || !description || !requirement || !maxQuestTakers) {
                console.log(title)
                console.log(description)
                console.log(requirement)
                console.log(maxQuestTakers)
                console.log(userId)
                const error = "That is not a proper quest ye mongrel!! \n Fill the form fully."
                return res.status(400).json({ error: error })
            }

            maxQuestTakers = Math.min(2147483647, Math.max(0, maxQuestTakers))

            await db.insert(quests).values({
                title: title,
                description: description,
                completionRequirement: requirement,
                maxQuestTakers: maxQuestTakers,
                userId: userId
            })

            res.status(201).json({ ok: true })
        } catch (error) {
            console.error(error)
            res.status(500)
            .json({ error: "A tad bit busy now. We can not post yer quest. Sorry lad. Come back a bit later." })
        }
    })
}