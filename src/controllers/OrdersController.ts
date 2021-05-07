import { Request, Response } from 'express';

import { parseISO } from 'date-fns';

import CreateOrderService from '../services/CreateOrderService';
import ListAllOrdersService from '../services/ListAllOrdersService';
import ListSectorOrdersService from '../services/ListSectorOrdersService';
import ListOrderByIDService from '../services/ListOrderByIDService';
import DeleteOrderByIDService from '../services/DeleteOrderByIDService';

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
    const listAllOrdersService = new ListAllOrdersService();

    const orders = await listAllOrdersService.execute();

    return response.json(orders);
  }

  public async getBySector(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { sectorName } = request.query;
    const listSectorOrdersService = new ListSectorOrdersService();

    const orders = await listSectorOrdersService.execute(sectorName as string);

    return response.json(orders);
  }

  public async getByOrderID(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { id } = request.query;
    const listOrderByIDService = new ListOrderByIDService();

    const orders = await listOrderByIDService.execute(id as string);

    return response.json(orders);
  }

  public async deleteByID(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const user_id = request.user.id;
    const { id, client, modelName, sector } = request.body;
    const deleteOrderByIDService = new DeleteOrderByIDService();

    const orders = await deleteOrderByIDService.execute({
      user_id,
      orderId: id,
      client,
      modelName,
      sector,
    });

    return response.json(orders);
  }
}
