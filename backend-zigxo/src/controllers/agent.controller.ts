import { Request, Response, NextFunction } from 'express';
import { AgentService } from '../services/agent.service';
import { sendSuccess } from '../utils/response';

export const AgentController = {
  async getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try { sendSuccess(res, await AgentService.getAll(), 'Agents fetched'); }
    catch (err) { next(err); }
  },
  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try { sendSuccess(res, await AgentService.getById(req.params.id)); }
    catch (err) { next(err); }
  },
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try { sendSuccess(res, await AgentService.create(req.body), 'Agent created', 201); }
    catch (err) { next(err); }
  },
  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try { sendSuccess(res, await AgentService.update(req.params.id, req.body), 'Agent updated'); }
    catch (err) { next(err); }
  },
  async remove(req: Request, res: Response, next: NextFunction): Promise<void> {
    try { await AgentService.delete(req.params.id); sendSuccess(res, null, 'Agent deleted'); }
    catch (err) { next(err); }
  },
};
