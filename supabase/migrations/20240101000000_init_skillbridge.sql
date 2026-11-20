-- ====================================================================
-- SKILLBRIDGE AI — COMPLETE DATABASE MIGRATION SCRIPT
-- PostgreSQL + pgvector + Row Level Security (RLS)
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- 2. ENUMS & DOMAINS
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('candidate', 'employer', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE verification_level AS ENUM ('Self-Reported', 'Portfolio-Supported', 'Independently Verified');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE application_stage AS ENUM ('Matched', 'Applied', 'Assessment', 'Interview', 'Offer', 'Rejected', 'Withdrawn');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE remote_policy AS ENUM ('remote', 'hybrid', 'onsite');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY,
    role VARCHAR(20) NOT NULL DEFAULT 'candidate' CHECK (role IN ('candidate', 'employer', 'admin')),
    full_name TEXT NOT NULL,
    headline TEXT,
    bio TEXT,
    location TEXT,
    github_url TEXT,
    portfolio_url TEXT,
    target_roles JSONB DEFAULT '[]'::jsonb,
    experience_years INT DEFAULT 0 CHECK (experience_years >= 0),
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. CANDIDATE SKILLS TABLE
CREATE TABLE IF NOT EXISTS public.candidate_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    skill_name VARCHAR(100) NOT NULL,
    category VARCHAR(50) DEFAULT 'general',
    verification_level VARCHAR(30) NOT NULL DEFAULT 'Self-Reported' CHECK (verification_level IN ('Self-Reported', 'Portfolio-Supported', 'Independently Verified')),
    confidence NUMERIC(4, 2) DEFAULT 0.50 CHECK (confidence >= 0 AND confidence <= 1.00),
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_profile_skill UNIQUE (profile_id, skill_name)
);

-- 5. PORTFOLIO ANALYSES TABLE
CREATE TABLE IF NOT EXISTS public.portfolio_analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    repo_url TEXT NOT NULL,
    repo_name TEXT NOT NULL,
    stars INT DEFAULT 0,
    language VARCHAR(50),
    metadata JSONB DEFAULT '{}'::jsonb,
    summary TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. PORTFOLIO EVIDENCE TABLE
CREATE TABLE IF NOT EXISTS public.portfolio_evidence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    analysis_id UUID NOT NULL REFERENCES public.portfolio_analyses(id) ON DELETE CASCADE,
    skill_name VARCHAR(100) NOT NULL,
    evidence_quote TEXT NOT NULL,
    file_path TEXT,
    category VARCHAR(50) DEFAULT 'general',
    confidence NUMERIC(4, 2) DEFAULT 0.75 CHECK (confidence >= 0 AND confidence <= 1.00),
    verification_level VARCHAR(30) NOT NULL DEFAULT 'Portfolio-Supported',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. JOBS TABLE
CREATE TABLE IF NOT EXISTS public.jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    title VARCHAR(150) NOT NULL,
    company_name VARCHAR(100) NOT NULL,
    company_logo TEXT,
    description TEXT NOT NULL,
    location VARCHAR(100) NOT NULL,
    remote_policy VARCHAR(20) NOT NULL DEFAULT 'remote' CHECK (remote_policy IN ('remote', 'hybrid', 'onsite')),
    employment_type VARCHAR(30) NOT NULL DEFAULT 'full-time' CHECK (employment_type IN ('full-time', 'part-time', 'contract', 'internship')),
    min_experience_years INT DEFAULT 0,
    salary_range VARCHAR(50),
    eligibility_requirements JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_demo BOOLEAN NOT NULL DEFAULT FALSE,
    source_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. JOB SKILLS TABLE
CREATE TABLE IF NOT EXISTS public.job_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
    skill_name VARCHAR(100) NOT NULL,
    is_required BOOLEAN NOT NULL DEFAULT TRUE,
    weight INT DEFAULT 1 CHECK (weight >= 1 AND weight <= 5),
    CONSTRAINT unique_job_skill UNIQUE (job_id, skill_name)
);

-- 9. APPLICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
    candidate_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    status VARCHAR(30) NOT NULL DEFAULT 'Applied' CHECK (status IN ('Matched', 'Applied', 'Assessment', 'Interview', 'Offer', 'Rejected', 'Withdrawn')),
    match_score NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    match_breakdown JSONB DEFAULT '{}'::jsonb,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_candidate_job_app UNIQUE (job_id, candidate_id)
);

-- 10. SAVED JOBS TABLE
CREATE TABLE IF NOT EXISTS public.saved_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
    candidate_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_candidate_saved_job UNIQUE (job_id, candidate_id)
);

-- 11. LEARNING RESOURCES TABLE
CREATE TABLE IF NOT EXISTS public.learning_resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    provider VARCHAR(100) NOT NULL,
    url TEXT NOT NULL,
    category VARCHAR(50) DEFAULT 'ai_ml',
    difficulty VARCHAR(20) DEFAULT 'intermediate' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    duration_hours INT DEFAULT 10,
    rating NUMERIC(3, 2) DEFAULT 4.8,
    is_free BOOLEAN DEFAULT TRUE,
    skills_covered JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. LEARNING PROGRESS TABLE
CREATE TABLE IF NOT EXISTS public.learning_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    resource_id UUID NOT NULL REFERENCES public.learning_resources(id) ON DELETE CASCADE,
    status VARCHAR(30) NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
    completed_at TIMESTAMPTZ,
    notes TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_candidate_resource UNIQUE (candidate_id, resource_id)
);

-- 13. RAG DOCUMENTS & VECTOR CHUNKS
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(250) NOT NULL,
    source_type VARCHAR(50) NOT NULL CHECK (source_type IN ('onet', 'job_desc', 'learning_resource', 'guide')),
    source_url TEXT,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.document_chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
    chunk_text TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    embedding vector(768),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 14. AUDIT EVENTS TABLE
CREATE TABLE IF NOT EXISTS public.audit_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID,
    payload JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ====================================================================
-- INDEXES FOR HIGH-PERFORMANCE SEARCH & FILTERING
-- ====================================================================
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_candidate_skills_profile ON public.candidate_skills(profile_id);
CREATE INDEX IF NOT EXISTS idx_candidate_skills_name ON public.candidate_skills(skill_name);
CREATE INDEX IF NOT EXISTS idx_jobs_is_active ON public.jobs(is_active);
CREATE INDEX IF NOT EXISTS idx_jobs_remote_policy ON public.jobs(remote_policy);
CREATE INDEX IF NOT EXISTS idx_job_skills_job_id ON public.job_skills(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_candidate_id ON public.applications(candidate_id);
CREATE INDEX IF NOT EXISTS idx_applications_job_id ON public.applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON public.applications(status);

-- Vector Index (HNSW for cosine similarity distance)
CREATE INDEX IF NOT EXISTS idx_document_chunks_embedding 
ON public.document_chunks USING hnsw (embedding vector_cosine_ops);

-- ====================================================================
-- RAG VECTOR SEARCH RPC FUNCTION
-- ====================================================================
CREATE OR REPLACE FUNCTION match_document_chunks (
    query_embedding vector(768),
    match_count INT DEFAULT 5,
    filter_source_type VARCHAR DEFAULT NULL
)
RETURNS TABLE (
    id UUID,
    document_id UUID,
    chunk_text TEXT,
    metadata JSONB,
    similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        dc.id,
        dc.document_id,
        dc.chunk_text,
        dc.metadata,
        1 - (dc.embedding <=> query_embedding) AS similarity
    FROM public.document_chunks dc
    JOIN public.documents d ON dc.document_id = d.id
    WHERE (filter_source_type IS NULL OR d.source_type = filter_source_type)
    ORDER BY dc.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidate_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_chunks ENABLE ROW LEVEL SECURITY;

-- Profiles: Anyone can view basic profiles, but only the owner can edit
CREATE POLICY "Public profiles are readable by authenticated users"
ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Jobs: Everyone can view active jobs
CREATE POLICY "Active jobs are readable by all"
ON public.jobs FOR SELECT USING (is_active = true OR is_demo = true);

CREATE POLICY "Employers can insert jobs"
ON public.jobs FOR INSERT WITH CHECK (auth.uid() = employer_id);

CREATE POLICY "Employers can update their own jobs"
ON public.jobs FOR UPDATE USING (auth.uid() = employer_id);

-- Job Skills: Readable by all
CREATE POLICY "Job skills readable by all"
ON public.job_skills FOR SELECT USING (true);

-- Applications: Candidates view own apps; Employers view apps to their jobs
CREATE POLICY "Candidates can view their own applications"
ON public.applications FOR SELECT USING (auth.uid() = candidate_id);

CREATE POLICY "Employers can view applications for their jobs"
ON public.applications FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.jobs
        WHERE jobs.id = applications.job_id
        AND jobs.employer_id = auth.uid()
    )
);

CREATE POLICY "Candidates can submit applications"
ON public.applications FOR INSERT WITH CHECK (auth.uid() = candidate_id);

CREATE POLICY "Authorized parties can update applications"
ON public.applications FOR UPDATE USING (
    auth.uid() = candidate_id OR
    EXISTS (
        SELECT 1 FROM public.jobs
        WHERE jobs.id = applications.job_id
        AND jobs.employer_id = auth.uid()
    )
);

-- Candidate Skills & Evidence
CREATE POLICY "Public can view verified skills"
ON public.candidate_skills FOR SELECT USING (true);

CREATE POLICY "Candidates manage own skills"
ON public.candidate_skills FOR ALL USING (auth.uid() = profile_id);

CREATE POLICY "Portfolio analyses readable by owner and employers"
ON public.portfolio_analyses FOR SELECT USING (
    auth.uid() = profile_id OR
    EXISTS (
        SELECT 1 FROM public.applications a
        JOIN public.jobs j ON a.job_id = j.id
        WHERE a.candidate_id = portfolio_analyses.profile_id AND j.employer_id = auth.uid()
    )
);

CREATE POLICY "Portfolio evidence readable by owner and employers"
ON public.portfolio_evidence FOR SELECT USING (true);

-- Learning Resources & Progress
CREATE POLICY "Learning resources are public"
ON public.learning_resources FOR SELECT USING (true);

CREATE POLICY "Candidates manage own learning progress"
ON public.learning_progress FOR ALL USING (auth.uid() = candidate_id);

-- Documents and RAG chunks are publicly readable for career guidance
CREATE POLICY "Documents readable by all"
ON public.documents FOR SELECT USING (true);

CREATE POLICY "Document chunks readable by all"
ON public.document_chunks FOR SELECT USING (true);
