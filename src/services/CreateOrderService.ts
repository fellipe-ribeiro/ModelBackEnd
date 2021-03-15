import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';

import Order from '../models/Order';
import OrdersRepository from '../repositories/OrdersRepository';

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
    const ordersRepository = getCustomRepository(OrdersRepository);
    const entryDateFormated = startOfHour(entryDate);
    const departureDateFormated = startOfHour(departureDate);

    const findByDepartureDateAndModelName = await ordersRepository.findByDepartureDateAndModelName(
      departureDateFormated,
      modelName,
    );

    if (findByDepartureDateAndModelName) {
      throw new AppError('This order is already recorded');
    }

    const order = ordersRepository.create({
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

    await ordersRepository.save(order);

    return order;
  }
}

export default CreateOrderService;
