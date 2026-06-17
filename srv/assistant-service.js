const cds = require('@sap/cds')
const OpenAI = require('openai')

module.exports = class AssistantService extends cds.ApplicationService {
    async init() {

        const groq = new OpenAI({
            apiKey: process.env.API_KEY,
            baseURL: 'https://api.groq.com/openai/v1'
        })

        // Helper — split text into chunks
        const chunkText = (text, size = 500) => {
            const words = text.split(' ')
            const chunks = []
            for (let i = 0; i < words.length; i += size) {
                chunks.push(words.slice(i, i + size).join(' '))
            }
            return chunks
        }

        // Action 1 — Upload document and store chunks
        this.on('uploadDocument', async (req) => {
            const { fileName, content } = req.data

            if (!fileName || !content) {
                return req.error(400, 'fileName and content are required')
            }

            const { Documents, DocumentChunks } = cds.entities
            // const { Documents, DocumentChunks } = cds.entities('sap.ai.assistant')

            // Save document
            const docID = cds.utils.uuid()

            await INSERT.into(Documents).entries({
                ID: docID,
                fileName,
                uploadedAt: new Date().toISOString(),
                content
            })

            const chunks = chunkText(content)

            for (let i = 0; i < chunks.length; i++) {
                await INSERT.into(DocumentChunks).entries({
                    ID: cds.utils.uuid(),
                    documentID: docID,
                    chunkText: chunks[i],
                    chunkIndex: i,
                    embedding: ''
                })
            }

            return `Document "${fileName}" uploaded with ID: ${docID}. Created ${chunks.length} chunks.`
        })

        // Action 2 — Ask question (existing)


        // this.on('askQuestion', async (req) => {
        //     const { question, documentID } = req.data

        //     if (!question) {
        //         return req.error(400, 'Please provide a question')
        //     }

        //     const completion = await groq.chat.completions.create({
        //         model: 'llama-3.3-70b-versatile',
        //         messages: [
        //             { role: 'system', content: 'You are a helpful enterprise assistant.' },
        //             { role: 'user', content: question }
        //         ]
        //     })

        //     return completion.choices[0].message.content
        // })

        this.on('askQuestion', async (req) => {
            const { question, documentID } = req.data

            if (!question) {
                return req.error(400, 'Please provide a question')
            }

            let context = ''

            if (documentID) {
                const { DocumentChunks } = cds.entities
                const chunks = await SELECT.from(DocumentChunks)
                    .where({ documentID })
                    .orderBy('chunkIndex')
                    .limit(5)

                console.log(`Found ${chunks.length} chunks for documentID: ${documentID}`)

                if (chunks.length > 0) {
                    context = chunks.map(c => c.chunkText).join('\n\n')
                }
            }

            const systemPrompt = context
                ? `You are a helpful enterprise assistant. Answer questions using ONLY the following document context. If the answer is not in the context, say "I cannot find this in the document."\n\nContext:\n${context}`
                : 'You are a helpful enterprise assistant.'

            const completion = await groq.chat.completions.create({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: question }
                ]
            })

            return completion.choices[0].message.content
        })

        await super.init()
    }
}