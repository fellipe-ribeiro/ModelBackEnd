import { Router } from 'express';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';

import DevicesTokensController from '../controllers/DevicesTokensController';

const devicesTokensRouter = Router();
const devicesTokensController = new DevicesTokensController();

devicesTokensRouter.use(ensureAuthenticated);

devicesTokensRouter.post('/', devicesTokensController.create);

export default devicesTokensRouter;
