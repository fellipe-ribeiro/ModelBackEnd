import { getCustomRepository, EntityRepository, Repository } from 'typeorm';
import AppError from '../errors/AppError';

// import OrdersRepository from './OrdersRepository';

import Order from '../models/Order';

interface IRequest {
  user_id: string;
  client: string;
  modelName: string;
  type: string;
  entryDate: Date;
  departureDate: Date;
  modelingTime: Date;
  cuttingTime: Date;
  setupTime: Date;
  sewingTime: Date;
  finishingTime: Date;
  readyDate: Date;
  deliveredDate: Date;
  numberOfPieces: number;
  sector: string;
  rawMaterial: string;
}

interface ISectorDTO {
  sectorName: string;
}

interface IOrderIdDTO {
  orderId: string;
}

@EntityRepository(Order)
class OrdersCustomRepository extends Repository<Order> {
  public async getAllOrders(): Promise<Order[]> {
    const ordersRepository = getCustomRepository(OrdersCustomRepository);

    const orders = await ordersRepository.find();

    return orders;
  }

  public async getSectorOrders(sector: ISectorDTO): Promise<Order[]> {
    const ordersRepository = getCustomRepository(OrdersCustomRepository);

    const orders = await ordersRepository.find({
      where: { sector: sector.sectorName },
    });

    return orders;
  }

  public async getOrderByID(ord: IOrderIdDTO): Promise<Order | undefined> {
    const ordersRepository = getCustomRepository(OrdersCustomRepository);

    const order = await ordersRepository.findOne({
      where: { id: ord.orderId },
    });

    if (!order) {
      return undefined;
    }

    return order;
  }

  public async createOrder({
    user_id,
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
  }: IRequest): Promise<Order> {
    const ordersRepository = getCustomRepository(OrdersCustomRepository);

    const order = ordersRepository.create({
      user_id,
      client,
      modelName,
      type,
      entryDate,
      departureDate,
      numberOfPieces,
      sector,
      rawMaterial,
    });

    await ordersRepository.save(order);

    switch (sector) {
      case 'Modelagem':
        order.modelingTime = modelingTime;
        await ordersRepository.save(order);
        return order;
      case 'Corte':
        order.cuttingTime = cuttingTime;
        await ordersRepository.save(order);
        return order;
      case 'Preparação':
        order.setupTime = setupTime;
        await ordersRepository.save(order);
        return order;
      case 'Costura':
        order.sewingTime = sewingTime;
        await ordersRepository.save(order);
        return order;
      case 'Acabamento':
        order.finishingTime = finishingTime;
        await ordersRepository.save(order);
        return order;
      case 'Pronto':
        order.readyDate = readyDate;
        await ordersRepository.save(order);
        return order;
      case 'Entregue':
        order.deliveredDate = deliveredDate;
        await ordersRepository.save(order);
        return order;
      default:
        throw new AppError('Sector name must be informed');
    }

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
