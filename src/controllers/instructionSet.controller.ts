import path from 'path';
import { Request, Response, NextFunction } from 'express';
import { InstructionSetService } from '../services/instructionSet.service';
import { sendSuccess, sendError } from '../utils/response';

const BLOCKED_EXTS = new Set([
  '.html', '.htm', '.png', '.jpg', '.jpeg', '.gif', '.webp',
  '.svg', '.bmp', '.ico', '.tiff', '.tif', '.avif',
]);

export const InstructionSetController = {
  async getByAgent(req: Request, res: Response, next: NextFunction): Promise<void> {
    try { sendSuccess(res, await InstructionSetService.getFullByAgent(req.params.agentId)); }
    catch (err) { next(err); }
  },
  async savePrompt(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { agentId, systemPrompt } = req.body as { agentId?: string; systemPrompt?: string };
    if (!agentId) { sendError(res, 'agentId is required', 400); return; }
    try { sendSuccess(res, await InstructionSetService.savePrompt(agentId, systemPrompt ?? ''), 'Prompt saved'); }
    catch (err) { next(err); }
  },
  async addStarter(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { agentId, text } = req.body as { agentId?: string; text?: string };
    if (!agentId || !text?.trim()) { sendError(res, 'agentId and text are required', 400); return; }
    try { sendSuccess(res, await InstructionSetService.addStarter(agentId, text), 'Starter added', 201); }
    catch (err) { next(err); }
  },
  async deleteStarter(req: Request, res: Response, next: NextFunction): Promise<void> {
    try { await InstructionSetService.deleteStarter(req.params.id); sendSuccess(res, null, 'Starter deleted'); }
    catch (err) { next(err); }
  },
  async reorderStarters(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { orderedIds } = req.body as { orderedIds?: string[] };
    if (!Array.isArray(orderedIds)) { sendError(res, 'orderedIds array required', 400); return; }
    try { await InstructionSetService.reorderStarters(orderedIds); sendSuccess(res, null, 'Reordered'); }
    catch (err) { next(err); }
  },
  async uploadRefFile(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { agentId } = req.body as { agentId?: string };
    const file = req.file;
    if (!agentId || !file) { sendError(res, 'agentId and file are required', 400); return; }
    const ext = path.extname(file.originalname).toLowerCase();
    if (BLOCKED_EXTS.has(ext)) { sendError(res, `File type '${ext}' is not allowed`, 400); return; }
    try { sendSuccess(res, await InstructionSetService.uploadRefFile(agentId, file), 'Ref file queued', 202); }
    catch (err) { next(err); }
  },
  async addRefUrl(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { agentId, url } = req.body as { agentId?: string; url?: string };
    if (!agentId || !url) { sendError(res, 'agentId and url are required', 400); return; }
    try { sendSuccess(res, await InstructionSetService.addRefUrl(agentId, url), 'Ref URL queued', 202); }
    catch (err) { next(err); }
  },
  async pollRefFileStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const state = await InstructionSetService.pollJob(req.params.jobId);
      if (!state) { sendError(res, 'Job not found', 404); return; }
      sendSuccess(res, state);
    } catch (err) { next(err); }
  },
  async deleteRefFile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try { await InstructionSetService.deleteRefFile(req.params.id); sendSuccess(res, null, 'Ref file deleted'); }
    catch (err) { next(err); }
  },
  async reset(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { agentId } = req.body as { agentId?: string };
    if (!agentId) { sendError(res, 'agentId is required', 400); return; }
    try { await InstructionSetService.reset(agentId); sendSuccess(res, null, 'Instruction set reset'); }
    catch (err) { next(err); }
  },
};
