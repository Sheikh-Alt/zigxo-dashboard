import { v4 as uuid } from 'uuid';
import { InstructionSetModel, InstructionSet, ConversationStarter, ReferenceFile } from '../models/instructionSet.model';
import { storage } from '../config/storage';
import { runPipelineSync } from '../utils/pipeline';

export const InstructionSetService = {
  async getFullByAgent(agentId: string): Promise<{ instruction: InstructionSet | null; starters: ConversationStarter[]; refFiles: ReferenceFile[] }> {
    const instr = await InstructionSetModel.findByAgent(agentId);
    if (!instr) return { instruction: null, starters: [], refFiles: [] };
    const [starters, refFiles] = await Promise.all([
      InstructionSetModel.getStarters(instr.id),
      InstructionSetModel.getRefFiles(instr.id),
    ]);
    return { instruction: instr, starters, refFiles };
  },

  async savePrompt(agentId: string, systemPrompt: string): Promise<InstructionSet> {
    return InstructionSetModel.upsertPrompt(agentId, systemPrompt ?? '');
  },

  async addStarter(agentId: string, text: string): Promise<ConversationStarter> {
    if (!text?.trim()) throw Object.assign(new Error('text is required'), { statusCode: 400 });
    const instrId  = await InstructionSetModel.getOrCreate(agentId);
    const maxOrder = await InstructionSetModel.maxStarterOrder(instrId);
    return InstructionSetModel.addStarter(instrId, text.trim(), maxOrder + 1);
  },

  async deleteStarter(id: string): Promise<void> {
    const ok = await InstructionSetModel.deleteStarter(id);
    if (!ok) throw Object.assign(new Error('Starter not found'), { statusCode: 404 });
  },

  async reorderStarters(orderedIds: string[]): Promise<void> {
    if (!Array.isArray(orderedIds)) throw Object.assign(new Error('orderedIds array required'), { statusCode: 400 });
    await InstructionSetModel.reorderStarters(orderedIds);
  },

  async uploadRefFile(agentId: string, file: Express.Multer.File): Promise<{ refFileId: string }> {
    const instrId = await InstructionSetModel.getOrCreate(agentId);
    const key     = storage.makeKey(`ref/${agentId}`, file.originalname);
    await storage.save(file.buffer, key);
    const refId = uuid();
    await InstructionSetModel.createRefFile(refId, instrId, file.originalname, file.mimetype, file.size, key);
    runPipelineSync({ name: 'process-reffile', refFileId: refId, agentId, key, filename: file.originalname, mimeType: file.mimetype })
      .catch((err) => console.error('[pipeline] reffile error:', err));
    return { refFileId: refId };
  },

  async addRefUrl(agentId: string, url: string): Promise<{ refFileId: string }> {
    const instrId = await InstructionSetModel.getOrCreate(agentId);
    const refId   = uuid();
    await InstructionSetModel.createRefUrl(refId, instrId, url);
    runPipelineSync({ name: 'process-reffile-url', refFileId: refId, agentId, url })
      .catch((err) => console.error('[pipeline] reffile-url error:', err));
    return { refFileId: refId };
  },

  async deleteRefFile(id: string): Promise<void> {
    const rf = await InstructionSetModel.findRefFile(id);
    if (!rf) throw Object.assign(new Error('Reference file not found'), { statusCode: 404 });
    const key = rf.local_key ?? rf.gcs_key;
    if (key) await storage.delete(key);
    await InstructionSetModel.deleteRefFile(id);
  },

  async reset(agentId: string): Promise<void> {
    const instr = await InstructionSetModel.findByAgent(agentId);
    if (instr) {
      const refFiles = await InstructionSetModel.getRefFiles(instr.id);
      for (const rf of refFiles) {
        const key = rf.local_key ?? rf.gcs_key;
        if (key) await storage.delete(key);
      }
      await InstructionSetModel.deleteById(instr.id);
    }
  },
};
