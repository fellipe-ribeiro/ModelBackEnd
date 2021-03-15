import { Router } from 'express';

import ordersRouter from './orders.routes';
import usersRouter from './users.routes';
import sessionsRouter from './sessions.routes';

const routes = Router();

routes.use('/orders', ordersRouter);
routes.use('/users', usersRouter);
routes.use('/sessions', sessionsRouter);

export default routes;
