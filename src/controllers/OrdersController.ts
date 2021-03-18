import { Request, Response } from 'express';

import { parseISO } from 'date-fns';
import CreateOrderService from '../services/CreateOrderService';

import OrdersCustomRepository from '../repositories/OrdersCustomRepository';

const ordersCustomRepository = new OrdersCustomRepository();

export default class OrdersController {
  public async create(request: Request, response: Response): Promise<Response> {
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
  }

  public async getAll(request: Request, response: Response): Promise<Response> {
    const orders = await ordersCustomRepository.getAllOrders();

    return response.json(orders);
  }
}
