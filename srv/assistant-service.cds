using sap.ai.assistant as db from '../db/schema';

service AssistantService {
    entity Documents   as projection on db.Documents;
    entity ChatHistory as projection on db.ChatHistory;
    
    action askQuestion(question: String, documentID: UUID) returns String;
}
