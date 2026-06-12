using sap.ai.assistant as db from '../db/schema';

service AssistantService {
  entity Documents   as projection on db.Documents;
  entity ChatHistory as projection on db.ChatHistory;

  action uploadDocument(fileName: String, content: String) returns Documents;
  action chat(documentID: UUID, userMessage: String)       returns String;
}
