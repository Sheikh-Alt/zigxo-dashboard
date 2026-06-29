import { Request, Response, NextFunction } from 'express';
import { QueryService } from '../services/query.service';
import { sendSuccess, sendError } from '../utils/response';

export const QueryController = {
  async run(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { agentId, question, topK } = req.body as { agentId?: string; question?: string; topK?: number };
    if (!agentId || !question?.trim()) { sendError(res, 'agentId and question are required', 400); return; }
    try { sendSuccess(res, await QueryService.run(agentId, question.trim(), topK ?? 5)); }
    catch (err) { next(err); }
  },
};
