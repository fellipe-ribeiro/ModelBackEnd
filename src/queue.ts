import 'reflect-metadata';
import 'dotenv/config';
import './database';

import mailQueue from './providers/QueueProvider/Bull';

mailQueue.process();

console.log('Queue started!');
