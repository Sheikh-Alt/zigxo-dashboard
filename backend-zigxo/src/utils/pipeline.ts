import path   from 'path';
import zlib   from 'zlib';
import { pool } from '../config/database';
import { storage } from '../config/storage';

// ── Text extraction ───────────────────────────────────────────────────────────

export async function extractText(buffer: Buffer, filename: string, mimeType: string): Promise<string> {
  const ext = path.extname(filename).toLowerCase();

  if (ext === '.pdf' || mimeType === 'application/pdf') {
    const pdfParse = require('pdf-parse') as (b: Buffer) => Promise<{ text: string }>;
    const { text } = await pdfParse(buffer);
    return text;
  }

  if (ext === '.docx' || mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    const mammoth = require('mammoth') as { extractRawText(o: { buffer: Buffer }): Promise<{ value: string }> };
    const { value } = await mammoth.extractRawText({ buffer });
    return value;
  }

  if (['.xlsx', '.xls'].includes(ext)) {
    const XLSX = require('xlsx') as typeof import('xlsx');
    const wb   = XLSX.read(buffer, { type: 'buffer' });
    return wb.SheetNames.map((n) => XLSX.utils.sheet_to_csv(wb.Sheets[n])).join('\n\n');
  }

  if (ext === '.pptx') {
    const JSZip = require('jszip') as typeof import('jszip');
    const zip   = await JSZip.loadAsync(buffer);
    const texts: string[] = [];
    for (const [name, file] of Object.entries(zip.files)) {
      const f = file as import('jszip').JSZipObject;
      if (name.startsWith('ppt/slides/') && name.endsWith('.xml') && !f.dir) {
        const xml = await f.async('string');
        texts.push(xml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
      }
    }
    return texts.join('\n\n');
  }

  if (ext === '.zip' || mimeType === 'application/zip') {
    const JSZip = require('jszip') as typeof import('jszip');
    const zip   = await JSZip.loadAsync(buffer);
    const texts: string[] = [];
    for (const [, file] of Object.entries(zip.files)) {
      const f = file as import('jszip').JSZipObject;
      if (!f.dir) texts.push(await f.async('string'));
    }
    return texts.join('\n\n');
  }

  if (ext === '.tar' || ext === '.gz' || ext === '.tgz' || mimeType === 'application/x-tar') {
    return extractTar(buffer);
  }

  return buffer.toString('utf-8');
}

function extractTar(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const tarStream = require('tar-stream') as typeof import('tar-stream');
    const extract   = tarStream.extract();
    const texts: string[] = [];
    extract.on('entry', (header, stream, next) => {
      const chunks: Buffer[] = [];
      stream.on('data', (c: Buffer) => chunks.push(c));
      stream.on('end', () => { if (header.type === 'file') texts.push(Buffer.concat(chunks).toString('utf-8')); next(); });
      stream.resume();
    });
    extract.on('finish', () => resolve(texts.join('\n\n')));
    extract.on('error', reject);
    if (buffer[0] === 0x1f && buffer[1] === 0x8b) { extract.end(zlib.gunzipSync(buffer)); }
    else { extract.end(buffer); }
  });
}

// ── URL fetching ──────────────────────────────────────────────────────────────

export async function fetchUrl(url: string): Promise<string> {
  if (url.includes('notion.so') && process.env.NOTION_API_TOKEN) return fetchNotion(url);
  return fetchWithPlaywright(url);
}

async function fetchNotion(url: string): Promise<string> {
  // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-explicit-any
  const axiosGet = (require('axios') as any).get as Function;
  const match = url.match(/([a-f0-9]{32})/i);
  if (!match) throw new Error(`Could not extract Notion page ID from: ${url}`);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const res: any = await axiosGet(
    `https://api.notion.com/v1/blocks/${match[1]}/children?page_size=100`,
    { headers: { Authorization: `Bearer ${process.env.NOTION_API_TOKEN}`, 'Notion-Version': '2022-06-28' } },
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (res.data.results as any[]).flatMap((b: any) => (b[b.type]?.rich_text ?? []).map((r: any) => r.plain_text ?? '')).join('\n');
}

async function fetchWithPlaywright(url: string): Promise<string> {
  const { chromium } = require('playwright') as typeof import('playwright');
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle' });
    return await page.evaluate('document.body.innerText') as string;
  } finally {
    await browser.close();
  }
}

// ── Pipeline job types ────────────────────────────────────────────────────────

export interface PipelineJobData {
  name:       string;        // 'process-file' | 'process-url' | 'process-text' | 'process-reffile' | 'process-reffile-url'
  sourceId?:  string | null;
  refFileId?: string | null;
  agentId:    string;
  key?:       string;
  filename?:  string;
  mimeType?:  string;
  url?:       string;
  content?:   string;
}

// ── Full pipeline (runs synchronously when Redis is unavailable) ──────────────

export async function runPipelineSync(data: PipelineJobData): Promise<void> {
  let rawText = '';

  if (data.name === 'process-file' || data.name === 'process-reffile') {
    const buffer = await storage.download(data.key!);
    rawText = await extractText(buffer, data.filename!, data.mimeType!);
  } else if (data.name === 'process-url' || data.name === 'process-reffile-url') {
    rawText = await fetchUrl(data.url!);
  } else if (data.name === 'process-text') {
    rawText = data.content!;
  }

  const isRef     = data.name === 'process-reffile' || data.name === 'process-reffile-url';
  const sourceId  = isRef ? null : (data.sourceId ?? null);
  const refFileId = isRef ? (data.refFileId ?? null) : null;

  if (sourceId) {
    await pool.query(
      `UPDATE data_sources SET status='ready', raw_content=$1, updated_at=NOW() WHERE id=$2`,
      [rawText, sourceId],
    );
  }
  if (refFileId) {
    await pool.query(`UPDATE reference_files SET status='ready', updated_at=NOW() WHERE id=$1`, [refFileId]);
  }
}
