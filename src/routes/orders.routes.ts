import { Request, Response, Router } from 'express';
import { getCustomRepository } from 'typeorm';
import { parseISO } from 'date-fns';

import OrdersRepository from '../repositories/OrdersRepository';
import CreateOrderService from '../services/CreateOrderService';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const ordersRouter = Router();

ordersRouter.use(ensureAuthenticated);

ordersRouter.get('/', async (request: Request, response: Response) => {
  const ordersRepository = getCustomRepository(OrdersRepository);
  const orders = await ordersRepository.find();

  return response.json(orders);
});

ordersRouter.post('/', async (request: Request, response: Response) => {
  const {
    client,
    modelName,
    type,
    entryDate,
    departureDate,
    modelingTime,
    cuttingTime,
    setupTime,
    sewingTime,
    numberOfPieces,
    sector,
    rawMaterial,
  } = request.body;

  const parsedEntryDate = parseISO(entryDate);
  const parsedDepartureDate = parseISO(departureDate);

  const createOrder = new CreateOrderService();

  const order = await createOrder.execute({
    client,
    modelName,
    type,
    entryDate: parsedEntryDate,
    departureDate: parsedDepartureDate,
    modelingTime,
    cuttingTime,
    setupTime,
    sewingTime,
    numberOfPieces,
    sector,
    rawMaterial,
  });

  return response.json(order);
});

export default ordersRouter;
