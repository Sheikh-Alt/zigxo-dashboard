import { Queue } from 'bullmq';
import { env }   from './env';

// Plain options — BullMQ creates its own internal ioredis instance from these.
// lazyConnect: don't connect at import time.
// retryStrategy: stop after 1 failed attempt so ECONNREFUSED doesn't flood logs.
export const redisOpts = {
  host:                 env.REDIS_HOST,
  port:                 env.REDIS_PORT,
  maxRetriesPerRequest: null as null,
  lazyConnect:          true,
  enableOfflineQueue:   false,
  retryStrategy:        (times: number) => (times >= 1 ? null : 500),
};

let _queue: Queue | null = null;

export function getProcessingQueue(): Queue {
  if (_queue) return _queue;
  _queue = new Queue('processing', {
    connection: redisOpts,
    defaultJobOptions: {
      attempts: 3,
      backoff:  { type: 'exponential', delay: 5000 },
      removeOnComplete: 100,
    },
  });
  return _queue;
}
