import { getCustomRepository, EntityRepository, Repository } from 'typeorm';

// import OrdersRepository from './OrdersRepository';

import Order from '../models/Order';

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

@EntityRepository(Order)
class OrdersCustomRepository extends Repository<Order> {
  public async getAllOrders(): Promise<Order[]> {
    const ordersRepository = getCustomRepository(OrdersCustomRepository);

    const orders = await ordersRepository.find();

    return orders;
  }

  public async createOrder({
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
    const ordersRepository = getCustomRepository(OrdersCustomRepository);

    const order = ordersRepository.create({
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
    });

    await ordersRepository.save(order);

    return order;
  }

  public async findByDepartureDateAndModelName(
    departureDate: Date,
    modelName: string,
  ): Promise<Order | null> {
    const ordersRepository = getCustomRepository(OrdersCustomRepository);
    const findOrder = await ordersRepository.findOne({
      where: { departureDate, modelName },
    });
    return findOrder || null;
  }
}

export default OrdersCustomRepository;
