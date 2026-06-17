namespace sap.ai.assistant;

entity Documents {
    key ID       : UUID;
    fileName     : String(255);
    uploadedAt   : DateTime;
    content      : LargeString;
}

entity ChatHistory {
    key ID       : UUID;
    question     : LargeString;
    answer       : LargeString;
    askedAt      : DateTime;
    documentID   : UUID;
}

entity DocumentChunks {
    key ID          : UUID;
    documentID      : UUID;
    chunkText       : LargeString;
    chunkIndex      : Integer;
    embedding       : LargeString;
}