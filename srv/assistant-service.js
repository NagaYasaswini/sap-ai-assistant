require('dotenv').config()
const cds = require('@sap/cds')
const OpenAI = require('openai')

module.exports = class AssistantService extends cds.Service {
    async init() {

        const groq = new OpenAI({
            apiKey: process.env.API_KEY,
            baseURL: 'https://api.groq.com/openai/v1'
        })

        this.on('askQuestion', async (req) => {
            const { question, documentID } = req.data

            if (!question) {
                return req.error(400, 'Please provide a question')
            }

            const completion = await groq.chat.completions.create({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    { role: 'system', content: 'You are a helpful enterprise assistant.' },
                    { role: 'user', content: question }
                ]
            })

            const answer = completion.choices[0].message.content
            return answer
        })

        await super.init()
    }
}