-- ====================================================================
-- SKILLBRIDGE AI — SEED SCRIPT (DEMO & REFERENCE DATA)
-- ====================================================================

-- 1. DEMO PROFILES
-- Candidate 1: Alex Chen (Transitioning Full-Stack to AI Engineer)
INSERT INTO public.profiles (id, role, full_name, headline, bio, location, github_url, portfolio_url, target_roles, experience_years, avatar_url)
VALUES (
    'a1111111-1111-1111-1111-111111111111',
    'candidate',
    'Alex Chen',
    'Full-Stack Developer transitioning into AI Engineering & LLM Systems',
    '4+ years building high-scale React/Node applications. Recently focused on building RAG pipelines, fine-tuning open weights, and vector search integrations.',
    'San Francisco, CA (Open to Remote)',
    'https://github.com/alexchen-dev',
    'https://alexchen.dev',
    '["AI Engineer", "Full-Stack AI Developer", "MLOps Engineer"]'::jsonb,
    4,
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
) ON CONFLICT (id) DO NOTHING;

-- Candidate 2: Elena Rostova (Senior ML & Vision Engineer)
INSERT INTO public.profiles (id, role, full_name, headline, bio, location, github_url, portfolio_url, target_roles, experience_years, avatar_url)
VALUES (
    'b2222222-2222-2222-2222-222222222222',
    'candidate',
    'Elena Rostova',
    'Senior Machine Learning Engineer | PyTorch, Transformers, Multimodal AI',
    'M.S. in Computer Science. Specialized in distributed PyTorch training, transformer optimization, and computer vision deployment in production.',
    'Berlin, Germany (Remote EU/US)',
    'https://github.com/erostova-ml',
    'https://erostova.ai',
    '["Senior Machine Learning Engineer", "AI Research Engineer"]'::jsonb,
    6,
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150'
) ON CONFLICT (id) DO NOTHING;

-- Candidate 3: Marcus Johnson (AI Application Engineer)
INSERT INTO public.profiles (id, role, full_name, headline, bio, location, github_url, portfolio_url, target_roles, experience_years, avatar_url)
VALUES (
    'c3333333-3333-3333-3333-333333333333',
    'candidate',
    'Marcus Johnson',
    'AI Application Developer | Next.js, LangChain, Vector Databases',
    'Specialized in building delightful, responsive AI interfaces, LangChain agent workflows, and hybrid search with pgvector.',
    'Austin, TX',
    'https://github.com/marcusj-ai',
    'https://marcusjohnson.tech',
    '["AI Application Engineer", "Frontend AI Specialist"]'::jsonb,
    3,
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
) ON CONFLICT (id) DO NOTHING;

-- Employer Profile: TechCorp AI
INSERT INTO public.profiles (id, role, full_name, headline, bio, location, target_roles, experience_years)
VALUES (
    'e9999999-9999-9999-9999-999999999999',
    'employer',
    'Sarah Jenkins (TechCorp AI Talent)',
    'Head of Technical Recruiting @ TechCorp Global AI',
    'Hiring world-class AI engineers, full-stack innovators, and ML researchers across global remote hubs.',
    'New York, NY',
    '[]'::jsonb,
    10
) ON CONFLICT (id) DO NOTHING;

-- 2. CANDIDATE SKILLS & EVIDENCE FOR ALEX CHEN
INSERT INTO public.candidate_skills (profile_id, skill_name, category, verification_level, confidence, verified_at)
VALUES 
    ('a1111111-1111-1111-1111-111111111111', 'Python', 'backend', 'Portfolio-Supported', 0.95, NOW()),
    ('a1111111-1111-1111-1111-111111111111', 'TypeScript', 'frontend', 'Portfolio-Supported', 0.98, NOW()),
    ('a1111111-1111-1111-1111-111111111111', 'React', 'frontend', 'Portfolio-Supported', 0.96, NOW()),
    ('a1111111-1111-1111-1111-111111111111', 'Next.js', 'frontend', 'Portfolio-Supported', 0.92, NOW()),
    ('a1111111-1111-1111-1111-111111111111', 'FastAPI', 'backend', 'Portfolio-Supported', 0.88, NOW()),
    ('a1111111-1111-1111-1111-111111111111', 'LangChain', 'ai_ml', 'Portfolio-Supported', 0.85, NOW()),
    ('a1111111-1111-1111-1111-111111111111', 'Vector Databases (pgvector)', 'ai_ml', 'Portfolio-Supported', 0.82, NOW()),
    ('a1111111-1111-1111-1111-111111111111', 'PostgreSQL', 'database', 'Portfolio-Supported', 0.90, NOW()),
    ('a1111111-1111-1111-1111-111111111111', 'Docker', 'devops', 'Portfolio-Supported', 0.78, NOW()),
    ('a1111111-1111-1111-1111-111111111111', 'PyTorch', 'ai_ml', 'Self-Reported', 0.40, NULL),
    ('a1111111-1111-1111-1111-111111111111', 'Kubernetes', 'devops', 'Self-Reported', 0.35, NULL)
ON CONFLICT DO NOTHING;

-- 3. CURATED DEMO JOBS
INSERT INTO public.jobs (id, employer_id, title, company_name, description, location, remote_policy, employment_type, min_experience_years, salary_range, eligibility_requirements, is_active, is_demo, source_url)
VALUES
(
    '10000000-0000-0000-0000-000000000001',
    'e9999999-9999-9999-9999-999999999999',
    'Junior AI Engineer (RAG & Agent Systems)',
    'Nexus AI Labs',
    'Join our fast-moving AI engineering squad building autonomous knowledge assistants and enterprise RAG pipelines. You will design vector search pipelines, integrate LLMs with custom tool-calling mechanisms, and implement production evaluations.',
    'San Francisco, CA / Remote Global',
    'remote',
    'full-time',
    2,
    '$120,000 - $145,000',
    '["Eligible for remote global contract or US W2", "Demonstrated hands-on experience with LLM APIs"]'::jsonb,
    true,
    true,
    'https://example.com/demo/nexus-ai-rag'
),
(
    '10000000-0000-0000-0000-000000000002',
    'e9999999-9999-9999-9999-999999999999',
    'Full-Stack AI Application Engineer',
    'Synthetix Global',
    'Synthetix is building the next-generation generative workflow canvas for creative professionals. We are looking for a full-stack engineer proficient in React, Next.js, FastAPI, and vector embeddings to bridge model outputs into intuitive visual workflows.',
    'Austin, TX / Hybrid',
    'hybrid',
    'full-time',
    3,
    '$140,000 - $175,000',
    '["Authorized to work in US without sponsorship", "Strong portfolio of production Next.js or React applications"]'::jsonb,
    true,
    true,
    'https://example.com/demo/synthetix-fullstack'
),
(
    '10000000-0000-0000-0000-000000000003',
    'e9999999-9999-9999-9999-999999999999',
    'Senior Machine Learning Systems Engineer',
    'HyperScale Computing',
    'We are scaling distributed training frameworks and serving low-latency inference pipelines. You will optimize PyTorch models, manage vLLM/TensorRT deployment clusters on Kubernetes, and benchmark multimodal models.',
    'London, UK / Remote EMEA',
    'remote',
    'full-time',
    5,
    '£110,000 - £140,000',
    '["5+ years production engineering experience", "Demonstrated expertise in PyTorch and distributed training", "Strong Docker and Kubernetes proficiency"]'::jsonb,
    true,
    true,
    'https://example.com/demo/hyperscale-ml'
),
(
    '10000000-0000-0000-0000-000000000004',
    'e9999999-9999-9999-9999-999999999999',
    'AI Data Pipeline & Evaluation Engineer',
    'Veritas AI Trust',
    'We build benchmarks and red-teaming pipelines for frontier foundation models. We seek an engineer experienced with Python, SQL, synthetic data generation, and automated LLM evaluators (Ragas, TruLens).',
    'New York, NY / Remote US',
    'remote',
    'full-time',
    2,
    '$130,000 - $160,000',
    '["Proficiency in Python and SQL", "Experience designing quantitative evaluation datasets"]'::jsonb,
    true,
    true,
    'https://example.com/demo/veritas-data'
),
(
    '10000000-0000-0000-0000-000000000005',
    'e9999999-9999-9999-9999-999999999999',
    'Computer Vision Research & Optimization Engineer',
    'OmniVision Robotics',
    'Deploy embedded neural networks and real-time vision transformers onto edge robotics hardware. Work with PyTorch, ONNX, and C++ inference runtimes.',
    'Boston, MA / Onsite',
    'onsite',
    'full-time',
    4,
    '$150,000 - $185,000',
    '["Ability to work onsite at Boston R&D facility", "Deep experience with PyTorch and Computer Vision architectures"]'::jsonb,
    true,
    true,
    'https://example.com/demo/omnivision'
)
ON CONFLICT (id) DO NOTHING;

-- 4. JOB SKILLS (REQUIRED VS PREFERRED)
INSERT INTO public.job_skills (job_id, skill_name, is_required, weight)
VALUES
    -- Job 1: Junior AI Engineer
    ('10000000-0000-0000-0000-000000000001', 'Python', true, 5),
    ('10000000-0000-0000-0000-000000000001', 'LangChain', true, 4),
    ('10000000-0000-0000-0000-000000000001', 'Vector Databases (pgvector)', true, 4),
    ('10000000-0000-0000-0000-000000000001', 'FastAPI', true, 3),
    ('10000000-0000-0000-0000-000000000001', 'Docker', false, 2),
    ('10000000-0000-0000-0000-000000000001', 'TypeScript', false, 2),

    -- Job 2: Full-Stack AI Engineer
    ('10000000-0000-0000-0000-000000000002', 'TypeScript', true, 5),
    ('10000000-0000-0000-0000-000000000002', 'React', true, 5),
    ('10000000-0000-0000-0000-000000000002', 'Next.js', true, 4),
    ('10000000-0000-0000-0000-000000000002', 'Python', true, 3),
    ('10000000-0000-0000-0000-000000000002', 'FastAPI', false, 2),
    ('10000000-0000-0000-0000-000000000002', 'Vector Databases (pgvector)', false, 3),

    -- Job 3: Senior ML Systems Engineer
    ('10000000-0000-0000-0000-000000000003', 'PyTorch', true, 5),
    ('10000000-0000-0000-0000-000000000003', 'Python', true, 5),
    ('10000000-0000-0000-0000-000000000003', 'Kubernetes', true, 4),
    ('10000000-0000-0000-0000-000000000003', 'Docker', true, 4),
    ('10000000-0000-0000-0000-000000000003', 'Distributed Training', false, 3)
ON CONFLICT DO NOTHING;

-- 5. SAMPLE APPLICATIONS
INSERT INTO public.applications (id, job_id, candidate_id, status, match_score, match_breakdown, notes)
VALUES
(
    '20000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000001',
    'a1111111-1111-1111-1111-111111111111',
    'Interview',
    92.50,
    '{"required_match_ratio": 1.0, "portfolio_multiplier": 0.95, "preferred_match_ratio": 0.80, "experience_align": 1.0}'::jsonb,
    'Passed initial screening assessment. Scheduled technical conversation on vector indexing.'
),
(
    '20000000-0000-0000-0000-000000000002',
    '10000000-0000-0000-0000-000000000002',
    'a1111111-1111-1111-1111-111111111111',
    'Assessment',
    88.00,
    '{"required_match_ratio": 0.95, "portfolio_multiplier": 0.90, "preferred_match_ratio": 0.70, "experience_align": 1.0}'::jsonb,
    'Take-home assessment sent: build interactive UI for streaming model completions.'
)
ON CONFLICT DO NOTHING;

-- 6. CURATED LEARNING RESOURCES
INSERT INTO public.learning_resources (id, title, provider, url, category, difficulty, duration_hours, rating, is_free, skills_covered)
VALUES
(
    '30000000-0000-0000-0000-000000000001',
    'Deep Learning Specialization',
    'DeepLearning.AI / Coursera',
    'https://www.coursera.org/specializations/deep-learning',
    'ai_ml',
    'intermediate',
    40,
    4.9,
    false,
    '["PyTorch", "Neural Networks", "Deep Learning", "Convolutional Networks", "Sequence Models"]'::jsonb
),
(
    '30000000-0000-0000-0000-000000000002',
    'LangChain for LLM Application Development',
    'DeepLearning.AI',
    'https://www.deeplearning.ai/short-courses/langchain-for-llm-application-development/',
    'ai_ml',
    'beginner',
    4,
    4.8,
    true,
    '["LangChain", "Vector Databases", "Prompt Engineering", "Agents"]'::jsonb
),
(
    '30000000-0000-0000-0000-000000000003',
    'Practical Deep Learning for Coders',
    'fast.ai',
    'https://course.fast.ai/',
    'ai_ml',
    'intermediate',
    30,
    4.9,
    true,
    '["PyTorch", "Computer Vision", "NLP", "Model Deployment"]'::jsonb
),
(
    '30000000-0000-0000-0000-000000000004',
    'Kubernetes for Developers Hands-On Guide',
    'Linux Foundation / CNCF',
    'https://www.cncf.io/training/',
    'devops',
    'intermediate',
    15,
    4.7,
    true,
    '["Kubernetes", "Docker", "Container Orchestration", "CI/CD"]'::jsonb
)
ON CONFLICT DO NOTHING;

-- 7. RAG DOCUMENTS (O*NET & CURRICULUM GUIDES)
INSERT INTO public.documents (id, title, source_type, source_url, content)
VALUES
(
    '40000000-0000-0000-0000-000000000001',
    'O*NET Standard 15-1251.00: AI and Computer Programmers',
    'onet',
    'https://www.onetonline.org/link/summary/15-1251.00',
    'Core occupational requirements include: Designing, creating, and modifying general computer applications software or specialized utility programs. Key knowledge areas: Computers and Electronics, Mathematics (Linear Algebra and Statistics), Engineering and Technology. Key skills include Programming in languages such as Python, C++, and TypeScript, Complex Problem Solving, Systems Analysis, and Vector Data Architectures. Entry-level transition pathways emphasize translating software engineering fundamentals into specialized machine learning inference frameworks.'
),
(
    '40000000-0000-0000-0000-000000000002',
    'Production RAG Systems Architecture Guide',
    'guide',
    'https://skillbridge.ai/guides/production-rag',
    'Building robust Retrieval-Augmented Generation (RAG) systems requires three distinct stages: (1) Ingestion: chunking documents with sliding windows (400-800 characters) and preserving rich document metadata; (2) Embedding & Storage: using standardized embedding dimensions (e.g., 768 for text-embedding-004) and HNSW indexing with pgvector; (3) Retrieval & Prompt Defense: querying using cosine distance, filtering out prompt injections by treating retrieved context strictly as external data tokens, and providing explicit source citations in generated responses.'
),
(
    '40000000-0000-0000-0000-000000000003',
    'Full-Stack Developer to AI Engineer Career Transition Blueprint',
    'guide',
    'https://skillbridge.ai/guides/transition-to-ai-engineer',
    'Experienced web developers moving into AI engineering have strong advantages in API design, frontend usability, and database integration. The critical missing skills are typically: (1) Vector embeddings and semantic search (pgvector, Chroma, Pinecone); (2) LLM orchestration (LangChain, LlamaIndex, tool calling); (3) Evaluation harnesses (testing for hallucinations, groundedness); (4) Basic PyTorch for understanding model mechanics. Recommended portfolio projects: Build an end-to-end RAG system with source verification, an autonomous tool-calling agent with observability, and a multimodal document parser.'
)
ON CONFLICT DO NOTHING;
