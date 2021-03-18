import { Router } from 'express';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';

import OrdersController from '../controllers/OrdersController';

const ordersRouter = Router();
const ordersController = new OrdersController();

ordersRouter.use(ensureAuthenticated);

ordersRouter.get('/', ordersController.getAll);

ordersRouter.post('/', ordersController.create);

export default ordersRouter;
