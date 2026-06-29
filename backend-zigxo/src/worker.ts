/**
 * BullMQ worker — runs as a separate process in production with Redis/Docker.
 * Not used in local development (pipeline runs synchronously instead).
 */
import 'dotenv/config';
import { Worker, Job } from 'bullmq';
import { pool } from './config/database';
import { redisOpts } from './config/queue';
import { runPipelineSync } from './utils/pipeline';

async function runPipeline(job: Job): Promise<void> {
  await job.updateProgress(10);

  await runPipelineSync({
    name:      job.name,
    sourceId:  job.data.sourceId  as string | null ?? null,
    refFileId: job.data.refFileId as string | null ?? null,
    agentId:   job.data.agentId   as string,
    key:       job.data.key       as string | undefined,
    filename:  job.data.filename  as string | undefined,
    mimeType:  job.data.mimeType  as string | undefined,
    url:       job.data.url       as string | undefined,
    content:   job.data.content   as string | undefined,
  });

  if (job.data.sourceId) {
    await pool.query(
      `UPDATE data_sources SET status='error', error_msg=NULL, updated_at=NOW() WHERE id=$1`,
      [job.data.sourceId],
    );
  }

  await job.updateProgress(100);
}

const worker = new Worker('processing', runPipeline, {
  connection:  redisOpts,
  concurrency: 4,
});

worker.on('completed', (job) => {
  console.log(`[worker] ✓ job=${job.id}  name=${job.name}`);
});

worker.on('failed', async (job, err) => {
  console.error(`[worker] ✗ job=${job?.id}  name=${job?.name}  err=${err.message}`);
  if (!job) return;
  const { data } = job;
  if (data.sourceId) {
    await pool.query(
      `UPDATE data_sources SET status='error', error_msg=$1, updated_at=NOW() WHERE id=$2`,
      [err.message, data.sourceId],
    );
  }
  if (data.refFileId) {
    await pool.query(
      `UPDATE reference_files SET status='error', error_msg=$1, updated_at=NOW() WHERE id=$2`,
      [err.message, data.refFileId],
    );
  }
});

console.log('[worker] started  concurrency=4  queue=processing');
