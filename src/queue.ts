import 'reflect-metadata';
import 'dotenv/config';
import './database';

import Queue from './providers/QueueProvider/Bull';

Queue.process();

Queue.add('RegistrationSchedulePN');

console.log('Queue started!');
