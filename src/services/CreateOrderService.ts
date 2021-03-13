import { startOfHour } from 'date-fns';

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
  private ordersRepository: OrdersRepository;

  constructor(ordersRepository: OrdersRepository) {
    this.ordersRepository = ordersRepository;
  }

  public execute({
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
  }: IRequest): Order {
    const entryDateFormated = startOfHour(entryDate);
    const departureDateFormated = startOfHour(departureDate);

    const order = this.ordersRepository.create({
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
