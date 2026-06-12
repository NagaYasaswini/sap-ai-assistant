const cds = require('@sap/cds');

module.exports = cds.service.impl(async function() {
  const { Documents, ChatHistory } = this.entities;

  this.on('uploadDocument', async (req) => {
    const { fileName, content } = req.data;
    const doc = await INSERT.into(Documents).entries({
      ID: cds.utils.uuid(),
      fileName,
      content,
      uploadedAt: new Date().toISOString()
    });
    return doc;
  });

  this.on('chat', async (req) => {
    const { documentID, userMessage } = req.data;
    // AI logic comes in Phase 2 — placeholder for now
    const aiResponse = `Received your question: "${userMessage}". AI integration coming soon.`;
    await INSERT.into(ChatHistory).entries({
      ID: cds.utils.uuid(),
      documentID,
      userMessage,
      aiResponse,
      createdAt: new Date().toISOString()
    });
    return aiResponse;
  });
});
