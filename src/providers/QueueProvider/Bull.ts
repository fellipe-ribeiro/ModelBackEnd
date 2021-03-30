import Queue from 'bull';
import * as Sentry from '@sentry/node';

import cacheConfig from '../../config/cache';
import AppError from '../../errors/AppError';

import * as jobs from '../../jobs';

Sentry.init({
  dsn:
    'https://90caeb4fca8b4a07a0c4b9ba7df9bfeb@o561958.ingest.sentry.io/5699939',

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

const queues = Object.values(jobs).map(job => ({
  bull: new Queue(job.key, cacheConfig.config.redis as string),
  name: job.key,
  handle: job.handle,
}));

export default {
  queues,
  add(name: unknown, data: unknown): Promise<Queue.Job<any>> {
    const queue = this.queues.find(queue => queue.name === name);

    if (!queue) {
      throw new AppError('Invalid Job name');
    }

    return queue.bull.add(data);
  },
  process(): void {
    this.queues.forEach(queue => {
      queue.bull.process(queue.handle);

      queue.bull.on('failed', (job, err) => {
        Sentry.captureException(err);
        console.log('Job failed', queue.name, job.data);
        console.log(err);
      });
    });
  },
};
