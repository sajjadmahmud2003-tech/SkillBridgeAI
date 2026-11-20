import { describe, it, expect } from 'vitest';
import { 
  cosineSimilarity, 
  generateLocalEmbedding, 
  chunkDocument, 
  retrieveRelevantChunks, 
  generateCareerAdvice 
} from '@/lib/rag';
import { CandidateSkill } from '@/types';

describe('RAG Career Guidance Pipeline', () => {
  it('calculates vector cosine similarity accurately', () => {
    const vecA = [1, 0, 0];
    const vecB = [1, 0, 0];
    const vecC = [0, 1, 0];

    expect(cosineSimilarity(vecA, vecB)).toBeCloseTo(1.0);
    expect(cosineSimilarity(vecA, vecC)).toBeCloseTo(0.0);
  });

  it('generates normalized local embeddings with unit length', () => {
    const text = 'Production RAG and pgvector semantic search';
    const embedding = generateLocalEmbedding(text, 768);

    expect(embedding).toHaveLength(768);
    const sumSquares = embedding.reduce((sum, val) => sum + val * val, 0);
    expect(Math.sqrt(sumSquares)).toBeCloseTo(1.0, 3);
  });

  it('chunks documents with overlapping sliding windows', () => {
    const content = 'Word '.repeat(500);
    const chunks = chunkDocument('doc-1', 'Test Title', 'guide', 'https://example.com', content, 200, 50);

    expect(chunks.length).toBeGreaterThanOrEqual(2);
    expect(chunks[0].chunk_text.length).toBeGreaterThan(0);
    expect(chunks[0].source_url).toBe('https://example.com');
  });

  it('retrieves top relevant chunks and provides source citations in generated advice', async () => {
    const mockSkills: CandidateSkill[] = [
      {
        id: 's1',
        profile_id: 'p1',
        skill_name: 'Python',
        category: 'backend',
        verification_level: 'Portfolio-Supported',
        confidence: 0.95,
      },
      {
        id: 's2',
        profile_id: 'p1',
        skill_name: 'TypeScript',
        category: 'frontend',
        verification_level: 'Portfolio-Supported',
        confidence: 0.90,
      },
    ];

    const advice = await generateCareerAdvice({
      question: 'How do I transition from Full-Stack into AI Engineering?',
      targetRole: 'AI Engineer',
      candidateSkills: mockSkills,
      candidateExperienceYears: 3,
    });

    expect(advice.grounded_in_rag).toBe(true);
    expect(advice.citations.length).toBeGreaterThan(0);
    expect(advice.citations[0].title).toBeDefined();
    expect(advice.missing_skills.length).toBeGreaterThan(0);
    expect(advice.recommended_projects.length).toBeGreaterThan(0);
    expect(advice.learning_resources.length).toBeGreaterThan(0);
  });
});
