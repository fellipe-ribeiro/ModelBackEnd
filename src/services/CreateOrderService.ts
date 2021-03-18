import { startOfHour } from 'date-fns';

import AppError from '../errors/AppError';

import Order from '../models/Order';

import OrdersCustomRepository from '../repositories/OrdersCustomRepository';

interface IRequest {
  client: string;
  modelName: string;
  type: string;
  entryDate: Date;
  departureDate: Date;
  modelingTime: number;
  cuttingTime: number;
  setupTime: number;
  sewingTime: number;
  numberOfPieces: number;
  sector: string;
  rawMaterial: string;
}

class CreateOrderService {
  public async execute({
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
  }: IRequest): Promise<Order> {
    const ordersCustomRepository = new OrdersCustomRepository();
    const entryDateFormated = startOfHour(entryDate);
    const departureDateFormated = startOfHour(departureDate);

    const findByDepartureDateAndModelName = await ordersCustomRepository.findByDepartureDateAndModelName(
      departureDateFormated,
      modelName,
    );

    if (findByDepartureDateAndModelName) {
      throw new AppError('This order is already recorded');
    }

    const order = await ordersCustomRepository.createOrder({
      client,
      modelName,
      type,
      entryDate: entryDateFormated,
      departureDate: departureDateFormated,
      modelingTime,
      cuttingTime,
      setupTime,
      sewingTime,
      numberOfPieces,
      sector,
      rawMaterial,
    });

    return order;
  }
}

export default CreateOrderService;
