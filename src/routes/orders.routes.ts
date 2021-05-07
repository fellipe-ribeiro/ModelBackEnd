import { Router } from 'express';

import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';

import OrdersController from '../controllers/OrdersController';

const ordersRouter = Router();
const ordersController = new OrdersController();

ordersRouter.use(ensureAuthenticated);

ordersRouter.get('/', ordersController.getAll);

ordersRouter.get('/sector', ordersController.getBySector);

ordersRouter.get('/byid', ordersController.getByOrderID);

ordersRouter.delete(
  '/',
  celebrate({
    [Segments.BODY]: {
      id: Joi.string().uuid().required(),
      client: Joi.string().required(),
      modelName: Joi.string().required(),
      sector: Joi.string().required(),
    },
  }),
  ordersController.deleteByID,
);

ordersRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      client: Joi.string().required(),
      modelName: Joi.string().required(),
      type: Joi.string().required(),
      entryDate: Joi.required(),
      departureDate: Joi.required(),
      modelingTime: Joi.optional().options({ allowUnknown: true }),
      cuttingTime: Joi.optional().options({ allowUnknown: true }),
      setupTime: Joi.optional().options({ allowUnknown: true }),
      sewingTime: Joi.optional().options({ allowUnknown: true }),
      finishingTime: Joi.optional().options({ allowUnknown: true }),
      readyDate: Joi.optional().options({ allowUnknown: true }),
      deliveredDate: Joi.optional().options({ allowUnknown: true }),
      numberOfPieces: Joi.number().required(),
      sector: Joi.string().required(),
      rawMaterial: Joi.string().required(),
    },
  }),
  ordersController.create,
);

export default ordersRouter;
