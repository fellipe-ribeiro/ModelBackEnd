import { Request, Response, Router } from 'express';
import { parseISO } from 'date-fns';

import OrdersRepository from '../repositories/OrdersRepository';
import CreateOrderService from '../services/CreateOrderService';

const ordersRouter = Router();
const ordersRepository = new OrdersRepository();

ordersRouter.get('/', (request: Request, response: Response) => {
  const orders = ordersRepository.all();

  return response.json(orders);
});

ordersRouter.post('/', (request: Request, response: Response) => {
  try {
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

    const createOrder = new CreateOrderService(ordersRepository);

    const order = createOrder.execute({
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
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

export default ordersRouter;
