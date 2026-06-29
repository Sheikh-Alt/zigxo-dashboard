import { Request, Response, NextFunction } from 'express';
import { DataSourceService } from '../services/dataSource.service';
import { sendSuccess, sendError } from '../utils/response';

export const DataSourceController = {
  async listByAgent(req: Request, res: Response, next: NextFunction): Promise<void> {
    try { sendSuccess(res, await DataSourceService.listByAgent(req.params.agentId), 'Sources fetched'); }
    catch (err) { next(err); }
  },
  async uploadFile(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { agentId } = req.body as { agentId?: string };
    const file = req.file;
    if (!agentId || !file) { sendError(res, 'agentId and file are required', 400); return; }
    try { sendSuccess(res, await DataSourceService.ingestFile(agentId, file), 'File queued', 202); }
    catch (err) { next(err); }
  },
  async ingestUrl(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { agentId, url } = req.body as { agentId?: string; url?: string };
    if (!agentId || !url) { sendError(res, 'agentId and url are required', 400); return; }
    try { sendSuccess(res, await DataSourceService.ingestUrl(agentId, url), 'URL queued', 202); }
    catch (err) { next(err); }
  },
  async ingestText(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { agentId, content, label } = req.body as { agentId?: string; content?: string; label?: string };
    if (!agentId || !content) { sendError(res, 'agentId and content are required', 400); return; }
    try { sendSuccess(res, await DataSourceService.ingestText(agentId, content, label), 'Text queued', 202); }
    catch (err) { next(err); }
  },
  async pollStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const state = await DataSourceService.pollJob(req.params.jobId);
      if (!state) { sendError(res, 'Job not found', 404); return; }
      sendSuccess(res, state);
    } catch (err) { next(err); }
  },
  async remove(req: Request, res: Response, next: NextFunction): Promise<void> {
    try { await DataSourceService.delete(req.params.sourceId); sendSuccess(res, null, 'Data source deleted'); }
    catch (err) { next(err); }
  },
};
