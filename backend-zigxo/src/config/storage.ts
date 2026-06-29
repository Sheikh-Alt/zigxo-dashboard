import fs   from 'fs';
import path  from 'path';
import { env } from './env';

// ── Interface ─────────────────────────────────────────────────────────────────

export interface StorageDriver {
  /** Build a storage key (relative path or GCS object name). */
  makeKey(folder: string, filename: string): string;
  save(buffer: Buffer, key: string): Promise<void>;
  download(key: string): Promise<Buffer>;
  delete(key: string): Promise<void>;
}

// ── Local filesystem ──────────────────────────────────────────────────────────

class LocalDriver implements StorageDriver {
  private readonly base: string;

  constructor(base: string) {
    this.base = base;
  }

  makeKey(folder: string, filename: string): string {
    const safe = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
    return `${folder}/${Date.now()}-${safe}`;
  }

  async save(buffer: Buffer, key: string): Promise<void> {
    const full = path.join(this.base, key);
    await fs.promises.mkdir(path.dirname(full), { recursive: true });
    await fs.promises.writeFile(full, buffer);
  }

  async download(key: string): Promise<Buffer> {
    return fs.promises.readFile(path.join(this.base, key));
  }

  async delete(key: string): Promise<void> {
    await fs.promises.unlink(path.join(this.base, key)).catch(() => {/* ignore missing */});
  }
}

// ── Google Cloud Storage ──────────────────────────────────────────────────────

class GCSDriver implements StorageDriver {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private bucket: any;

  constructor(bucketName: string) {
    // Lazy require — keeps GCS SDK out of memory when STORAGE=local
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { Storage } = require('@google-cloud/storage') as typeof import('@google-cloud/storage');
    this.bucket = new Storage().bucket(bucketName);
  }

  makeKey(folder: string, filename: string): string {
    const safe = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
    return `${folder}/${Date.now()}-${safe}`;
  }

  async save(buffer: Buffer, key: string): Promise<void> {
    await this.bucket.file(key).save(buffer);
  }

  async download(key: string): Promise<Buffer> {
    const [buf] = await this.bucket.file(key).download();
    return buf as Buffer;
  }

  async delete(key: string): Promise<void> {
    await this.bucket.file(key).delete({ ignoreNotFound: true });
  }

  async signedUrl(key: string, mimeType: string): Promise<string> {
    const [url] = await this.bucket.file(key).generateSignedUrl({
      version:      'v4',
      action:       'read',
      expires:      Date.now() + 15 * 60 * 1000,
      responseType: mimeType,
    });
    return url as string;
  }
}

// ── Singleton — swap driver with one env var ──────────────────────────────────

function buildDriver(): StorageDriver {
  if (env.STORAGE === 'gcs') {
    if (!env.GCS_BUCKET_NAME) throw new Error('GCS_BUCKET_NAME is required when STORAGE=gcs');
    return new GCSDriver(env.GCS_BUCKET_NAME);
  }
  return new LocalDriver(path.resolve(env.UPLOAD_DIR));
}

export const storage = buildDriver();
