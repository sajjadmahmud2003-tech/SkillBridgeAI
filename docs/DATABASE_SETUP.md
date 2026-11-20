# SkillBridge AI — Database & Supabase Setup Guide

This guide details the database architecture, schema migrations, Row Level Security (RLS) policies, and pgvector configuration for SkillBridge AI.

---

## 1. Prerequisites

- A [Supabase](https://supabase.com) account and active project (or local PostgreSQL 15+ with pgvector installed).
- Supabase Project URL, Anon Key, and Service Role Key.

---

## 2. Enabling Database Extensions

In your Supabase SQL Editor, run:

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";
```

*Note: The `vector` extension provides pgvector operations including the cosine distance operator `<=>` and HNSW indexing.*

---

## 3. Running Database Migrations

Apply the migration file located at [supabase/migrations/20240101000000_init_skillbridge.sql](file:///d:/skillbridgeai/supabase/migrations/20240101000000_init_skillbridge.sql):

1. Open your Supabase Dashboard.
2. Navigate to **SQL Editor** -> **New Query**.
3. Copy and paste the entire contents of `supabase/migrations/20240101000000_init_skillbridge.sql`.
4. Click **Run**.

### Key Tables Initialized:
- `profiles`: User accounts, roles (`candidate` | `employer` | `admin`), headlines, bios, and target career tracks.
- `candidate_skills`: Skills categorized by domain, verification level (`Portfolio-Supported` vs `Self-Reported`), and confidence.
- `portfolio_analyses`: Public GitHub repository audit runs and summary findings.
- `portfolio_evidence`: Confirmed code implementations, file paths, and extracted syntax quotes.
- `jobs`: Engineering opportunities with salary ranges, remote policies, and mandatory eligibility criteria.
- `job_skills`: Required vs preferred skills with configurable importance weights (1 to 5).
- `applications`: End-to-end recruitment pipeline tracker (`Matched` -> `Applied` -> `Assessment` -> `Interview` -> `Offer` / `Rejected`).
- `documents` & `document_chunks`: Knowledge corpus chunked for vector similarity search with 768-dimension embeddings.
- `learning_resources` & `learning_progress`: Curated curricula and candidate completion tracking.

---

## 4. Seeding Demonstration Data

Apply the seed script located at [supabase/seed.sql](file:///d:/skillbridgeai/supabase/seed.sql):

1. Open the Supabase **SQL Editor**.
2. Paste the contents of `supabase/seed.sql`.
3. Click **Run**.

This populates:
- 3 realistic test personas (Alex Chen, Elena Rostova, Marcus Johnson).
- 1 employer organization (Sarah Jenkins @ TechCorp AI).
- 5 curated jobs across SF, London, Austin, NY, and Boston.
- Curated learning resources (Coursera Deep Learning, Fast.ai, LangChain, CNCF Kubernetes).
- O*NET and architectural documentation chunks for RAG vector search.

---

## 5. Row Level Security (RLS) Verification

RLS is enabled across all sensitive tables:
- **Profiles**: Public read for basic identity; updates restricted strictly to `auth.uid() = id`.
- **Applications**: Candidates can view only applications where `auth.uid() = candidate_id`. Employers can view and update applications only for jobs where `jobs.employer_id = auth.uid()`.
- **Portfolio Evidence**: Publicly viewable by prospective employers once attached to an application.

---

## 6. Vector Similarity Search Function (RPC)

The migration installs the `match_document_chunks` RPC function:

```sql
SELECT * FROM match_document_chunks(
    query_embedding := '[0.012, -0.045, ...]'::vector(768),
    match_count := 3
);
```

This performs an HNSW-indexed cosine similarity search over `document_chunks` and returns ranked documents in under 10ms.
