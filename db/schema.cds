namespace sap.ai.assistant;

entity Documents {
  key ID        : UUID;
  fileName      : String(255);
  content       : LargeString;
  uploadedAt    : Timestamp;
}

entity ChatHistory {
  key ID        : UUID;
  documentID    : UUID;
  userMessage   : LargeString;
  aiResponse    : LargeString;
  createdAt     : Timestamp;
}
