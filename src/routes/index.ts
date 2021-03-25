import { Router } from 'express';

import ordersRouter from './orders.routes';
import usersRouter from './users.routes';
import sessionsRouter from './sessions.routes';
import passwordRouter from './password.routes';
import profileRouter from './profile.routes';
import devicesTokensRouter from './devicesTokens.routes';

const routes = Router();

routes.use('/orders', ordersRouter);
routes.use('/users', usersRouter);
routes.use('/sessions', sessionsRouter);
routes.use('/password', passwordRouter);
routes.use('/profile', profileRouter);
routes.use('/devices', devicesTokensRouter);

export default routes;
