import {
  startOfHour,
  // isBefore,
  // isAfter,
  // addDays,
  // subDays,
  format,
} from 'date-fns';

import AppError from '../errors/AppError';

import Order from '../models/Order';

import CacheProvider from '../providers/CacheProvider/RedisCacheProvider';

import OrdersCustomRepository from '../repositories/OrdersCustomRepository';

import UsersCustomRepository from '../repositories/UsersCustomRepository';

import NotificationsRepository from '../repositories/NotificationsRepository';

import pushQueue from '../providers/QueueProvider/Bull';

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

class CreateOrderService {
  public async execute({
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
    const ordersCustomRepository = new OrdersCustomRepository();
    const entryDateFormated = startOfHour(entryDate);
    const departureDateFormated = startOfHour(departureDate);

    const modelingTimeFormated = startOfHour(modelingTime);
    const cuttingTimeFormated = startOfHour(cuttingTime);
    const setupTimeFormated = startOfHour(setupTime);
    const sewingTimeFormated = startOfHour(sewingTime);
    const finishingTimeFormated = startOfHour(finishingTime);
    const readyDateFormated = startOfHour(readyDate);
    const deliveredDateFormated = startOfHour(deliveredDate);

    const findByDepartureDateAndModelName = await ordersCustomRepository.findByDepartureDateAndModelName(
      departureDateFormated,
      modelName,
    );

    if (findByDepartureDateAndModelName) {
      throw new AppError('This order is already recorded');
    }
    /*  const compareDateBefore = subDays(Date.now(), 6);
    const compareDateAfter = addDays(Date.now(), 5);

    if (
      isBefore(entryDateFormated, compareDateBefore) ||
      isAfter(entryDateFormated, compareDateAfter)
    ) {
      throw new AppError('The entry date must be in a range of 5 days');
    } */

    const order = await ordersCustomRepository.createOrder({
      user_id,
      client,
      modelName,
      type,
      entryDate: entryDateFormated,
      departureDate: departureDateFormated,
      modelingTime: modelingTimeFormated,
      cuttingTime: cuttingTimeFormated,
      setupTime: setupTimeFormated,
      sewingTime: sewingTimeFormated,
      finishingTime: finishingTimeFormated,
      readyDate: readyDateFormated,
      deliveredDate: deliveredDateFormated,
      numberOfPieces,
      sector,
      rawMaterial,
    });

    const cacheProvider = new CacheProvider();

    await cacheProvider.invalidate('orders-list:All');
    await cacheProvider.invalidate(`orders-list:${sector}`);

    console.log(`orders-list:${sector}`);

    const usersCustomRepository = new UsersCustomRepository();

    const usersExceptUserAuth = await usersCustomRepository.getAllUsersExceptUserIdAuth(
      user_id,
    );

    const notificationsRepository = new NotificationsRepository();

    const departureDateFormatedLocally = format(
      departureDateFormated,
      'dd/MM/yyyy',
    );

    usersExceptUserAuth.map(async user => {
      await notificationsRepository.create({
        recipient_id: user.id,
        content: `Novo pedido criado com data de saída para ${departureDateFormatedLocally}`,
      });
    });

    const orderData = {
      user_id,
      client,
      modelName,
      departureDateFormatedLocally,
    };

    await pushQueue.add('RegistrationPushNotification', { orderData });

    return order;
  }
}

export default CreateOrderService;
