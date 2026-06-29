import { pool } from '../config/database';
import anthropic from '../config/anthropic';

export interface QueryResult {
  answer: string;
  sources: Array<{ sourceId: string; sourceName: string; score: number; preview: string }>;
}

const MAX_CONTENT_PER_SOURCE = 3000; // characters sent to Claude per source

export const QueryService = {
  async run(agentId: string, question: string, topK = 5): Promise<QueryResult> {
    // 1. Load system prompt
    const { rows: instrRows } = await pool.query(
      'SELECT system_prompt FROM instruction_sets WHERE agent_id=$1', [agentId],
    );
    const systemPrompt = (instrRows[0]?.system_prompt as string | undefined) ?? 'You are a helpful assistant.';

    // 2. Full-text search on raw_content
    const { rows: ftRows } = await pool.query(
      `SELECT id, name, raw_content,
              ts_rank(to_tsvector('english', COALESCE(raw_content,'')), plainto_tsquery('english', $2)) AS score
       FROM data_sources
       WHERE agent_id=$1 AND status='ready' AND raw_content IS NOT NULL
         AND to_tsvector('english', COALESCE(raw_content,'')) @@ plainto_tsquery('english', $2)
       ORDER BY score DESC
       LIMIT $3`,
      [agentId, question, topK],
    );

    // 3. Fall back to all ready sources if no keyword match
    let sources = ftRows;
    if (!sources.length) {
      const { rows: allRows } = await pool.query(
        `SELECT id, name, raw_content, 0.1 AS score
         FROM data_sources
         WHERE agent_id=$1 AND status='ready' AND raw_content IS NOT NULL
         LIMIT $2`,
        [agentId, topK],
      );
      sources = allRows;
    }

    if (!sources.length) return { answer: 'No indexed data found for this agent yet.', sources: [] };

    // 4. Build context (truncate each source to avoid huge prompts)
    const context = sources
      .map((r) => `[Source: ${r.name as string}]\n${(r.raw_content as string).slice(0, MAX_CONTENT_PER_SOURCE)}`)
      .join('\n\n---\n\n');

    // 5. Call Claude
    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system: `${systemPrompt}\n\nUse only the following context to answer the user's question:\n\n${context}`,
      messages: [{ role: 'user', content: question }],
    });

    const answer = message.content[0].type === 'text' ? message.content[0].text : '';

    return {
      answer,
      sources: sources.map((r) => ({
        sourceId:   r.id as string,
        sourceName: r.name as string,
        score:      Number((r.score as number).toFixed(4)),
        preview:    (r.raw_content as string).slice(0, 200),
      })),
    };
  },
};
