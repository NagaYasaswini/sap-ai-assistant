using sap.ai.assistant as db from '../db/schema';

service AssistantService {
    entity Documents      as projection on db.Documents;
    entity ChatHistory    as projection on db.ChatHistory;
    entity DocumentChunks as projection on db.DocumentChunks;
    
    action askQuestion(question: String, documentID: UUID) returns String;
    action uploadDocument(fileName: String, content: String) returns String;
}