import { v4 as uuid } from 'uuid';
import { DataSourceModel, DataSource } from '../models/dataSource.model';
import { storage } from '../config/storage';
import { runPipelineSync } from '../utils/pipeline';

export const DataSourceService = {
  async listByAgent(agentId: string): Promise<DataSource[]> {
    return DataSourceModel.findByAgent(agentId);
  },

  async ingestFile(agentId: string, file: Express.Multer.File): Promise<{ sourceId: string }> {
    const key      = storage.makeKey(agentId, file.originalname);
    await storage.save(file.buffer, key);
    const sourceId = uuid();
    await DataSourceModel.createFile(sourceId, agentId, file.originalname, file.mimetype, file.size, key);
    runPipelineSync({ name: 'process-file', sourceId, agentId, key, filename: file.originalname, mimeType: file.mimetype })
      .catch((err) => console.error('[pipeline] file error:', err));
    return { sourceId };
  },

  async ingestUrl(agentId: string, url: string): Promise<{ sourceId: string }> {
    const sourceId = uuid();
    await DataSourceModel.createUrl(sourceId, agentId, url);
    runPipelineSync({ name: 'process-url', sourceId, agentId, url })
      .catch((err) => console.error('[pipeline] url error:', err));
    return { sourceId };
  },

  async ingestText(agentId: string, content: string, label?: string): Promise<{ sourceId: string }> {
    const sourceId = uuid();
    const name     = label?.trim() || `Text paste ${new Date().toISOString()}`;
    await DataSourceModel.createText(sourceId, agentId, name, Buffer.byteLength(content, 'utf-8'));
    runPipelineSync({ name: 'process-text', sourceId, agentId, content })
      .catch((err) => console.error('[pipeline] text error:', err));
    return { sourceId };
  },

  async delete(sourceId: string): Promise<void> {
    const src = await DataSourceModel.findById(sourceId);
    if (!src) throw Object.assign(new Error('Data source not found'), { statusCode: 404 });
    const key = src.local_key ?? src.gcs_key;
    if (key) await storage.delete(key);
    await DataSourceModel.delete(sourceId);
  },
};
