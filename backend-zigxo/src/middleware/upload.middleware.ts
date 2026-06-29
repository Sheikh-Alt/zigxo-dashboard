import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';
import { env } from '../config/env';

const ensureDir = (dir: string): void => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

const storage = multer.diskStorage({
  destination: (req: Request, _file, cb) => {
    const dir = path.join(env.UPLOAD_DIR, req.params.tenantId);
    ensureDir(dir);
    cb(null, dir);
  },
  filename: (_req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

export const uploadFile = multer({
  storage,
  limits: { fileSize: env.MAX_FILE_SIZE },
}).single('file');
