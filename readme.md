# SAP BTP AI Assistant

A RAG-based enterprise AI assistant built on SAP BTP — upload any document and ask questions against it using a grounded LLM response pipeline.

**🔗 Live Demo:** [https://5f181dfatrial-dev-sap-ai-assistant-srv.cfapps.us10-001.hana.ondemand.com/chat/index.html](https://5f181dfatrial-dev-sap-ai-assistant-srv.cfapps.us10-001.hana.ondemand.com/chat/index.html)

> ⚠️ Hosted on SAP BTP Trial (free tier). If the app is unreachable, it may need a manual restart — contact me and I'll have it live within 5 minutes.

---

## What It Does

- Upload a PDF or text document via the chat interface
- The document is chunked and stored in SAP HANA Cloud with vector embeddings
- Ask any question — the app retrieves the most relevant chunks and sends them to an LLM
- The LLM answers strictly from the document context (no hallucination beyond the source)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | SAP CAP (Node.js), OData V4 |
| Database | SAP HANA Cloud with HDI Containers |
| AI / LLM | Groq API — `llama-3.3-70b-versatile` |
| RAG Pipeline | Manual chunking + cosine similarity retrieval |
| Frontend | Freestyle SAP UI5, pdf.js |
| Auth | XSUAA (dummy auth for demo) |
| Deployment | Cloud Foundry, MTA build (`mbt`) |

---

## Architecture

```
User uploads document
        ↓
CAP service chunks text → stores in HANA Cloud (HDI container)
        ↓
User asks question
        ↓
CAP retrieves top-N relevant chunks via similarity search
        ↓
Chunks + question sent to Groq LLM (llama-3.3-70b)
        ↓
Grounded answer returned to UI5 chat interface
```

---

## Project Structure

```
sap-ai-assistant/
├── app/                  # UI5 frontend (chat interface, pdf.js upload)
├── db/
│   └── schema.cds        # HANA entities: Documents, DocumentChunks, ChatHistory
├── srv/
│   └── assistant-service.cds   # OData V4 service definition
│   └── assistant-service.js    # RAG logic: chunking, retrieval, LLM call
├── mta.yaml              # MTA deployment descriptor
├── .cdsrc.json           # CDS config (dummy auth for demo)
└── package.json
```

---

## Key Technical Decisions

**Why Groq over SAP AI Core?**
SAP AI Core requires a paid BTP account. Groq provides a free-tier OpenAI-compatible endpoint, making it viable for trial deployments while keeping the CAP integration pattern identical — swapping to SAP Generative AI Hub would require only changing the endpoint and credentials.

**Why dummy auth?**
XSUAA is fully bound in `mta.yaml`. Dummy auth is set in `.cdsrc.json` to bypass login for demo purposes. In a production deployment, removing the dummy auth override enables full XSUAA token validation.

**Why HANA Cloud over SQLite?**
SQLite works locally but doesn't persist across CF restarts. HANA Cloud with HDI containers gives persistent, schema-managed storage — the same pattern used in enterprise SAP deployments.

---

## Running Locally

```bash
git clone https://github.com/NagaYasaswini/sap-ai-assistant
cd sap-ai-assistant
npm install
```

Add a `.env` file:
```
GROQ_API_KEY=your_groq_api_key_here
```

```bash
cds watch
```

Open: `http://localhost:4004`

---

## Deploying to CF

```bash
mbt build
cf login -a https://api.cf.us10-001.hana.ondemand.com
cf deploy mta_archives/sap-ai-assistant_1.0.0.mtar
```

> Note: HANA Cloud on trial auto-stops after ~30 days of inactivity. Start it manually from BTP Cockpit → HANA Cloud before testing.

---

## Author

**Tabjul Naga Yasaswini**  
SAP Fiori / BTP Developer | Deloitte USI  
[GitHub: NagaYasaswini](https://github.com/NagaYasaswini)