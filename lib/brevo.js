import { BrevoClient } from "@getbrevo/brevo"
import dotenv from "dotenv"

dotenv.config()

const brevoClient = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY,
})

const brevoTransporter = {
    sendMail: async ({ to, subject, html, text }) => {
        try {
            const result = await brevoClient.transactionalEmails.sendTransacEmail({
                subject: subject,
                textContent: text,
                htmlContent: html || text,
                sender: {
                    email: process.env.BREVO_SENDER_EMAIL,
                },
                to: [{ email: to}]
            })

            console.log("Email send to:", to, "successfully.")
            return result
        } catch (error) {
            console.error("Error sending email:", error)
            throw error
        }
    }
}

export default brevoTransporter