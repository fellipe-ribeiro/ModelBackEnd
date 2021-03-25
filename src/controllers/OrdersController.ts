import { Request, Response } from 'express';

import { parseISO } from 'date-fns';
import CreateOrderService from '../services/CreateOrderService';

import OrdersCustomRepository from '../repositories/OrdersCustomRepository';

const ordersCustomRepository = new OrdersCustomRepository();

export default class OrdersController {
  public async create(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
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
      finishingTime,
      readyDate,
      deliveredDate,
      numberOfPieces,
      sector,
      rawMaterial,
    } = request.body;

    const parsedEntryDate = parseISO(entryDate);
    const parsedDepartureDate = parseISO(departureDate);
    const parsedModelingTime = parseISO(modelingTime);
    const parsedCuttingTime = parseISO(cuttingTime);
    const parsedSetupTime = parseISO(setupTime);
    const parsedSewingTime = parseISO(sewingTime);
    const parsedFinishingTime = parseISO(finishingTime);
    const parsedReadyDate = parseISO(readyDate);
    const parsedDeliveredDate = parseISO(deliveredDate);

    const createOrder = new CreateOrderService();

    const order = await createOrder.execute({
      user_id,
      client,
      modelName,
      type,
      entryDate: parsedEntryDate,
      departureDate: parsedDepartureDate,
      modelingTime: parsedModelingTime,
      cuttingTime: parsedCuttingTime,
      setupTime: parsedSetupTime,
      sewingTime: parsedSewingTime,
      finishingTime: parsedFinishingTime,
      readyDate: parsedReadyDate,
      deliveredDate: parsedDeliveredDate,
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

  public async getBySector(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { sectorName } = request.query;

    const orders = await ordersCustomRepository.getSectorOrders({
      sectorName: String(sectorName),
    });

    return response.json(orders);
  }
}
