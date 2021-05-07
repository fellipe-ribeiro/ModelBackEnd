import OrdersCustomRepository from '../repositories/OrdersCustomRepository';

import CacheProvider from '../providers/CacheProvider/RedisCacheProvider';

import NotificationsRepository from '../repositories/NotificationsRepository';

import UsersCustomRepository from '../repositories/UsersCustomRepository';

import pushQueue from '../providers/QueueProvider/Bull';

import AppError from '../errors/AppError';

interface IRequest {
  orderId: string;
  user_id: string;
  client: string;
  modelName: string;
  sector: string;
}

class DeleteOrderByIDService {
  public async execute({
    user_id,
    orderId,
    client,
    modelName,
    sector,
  }: IRequest): Promise<string | undefined> {
    const usersCustomRepository = new UsersCustomRepository();
    const ordersCustomRepository = new OrdersCustomRepository();

    const orderUser = await ordersCustomRepository.getOrderByID({
      orderId,
    });

    if (user_id !== orderUser?.user_id) {
      throw new AppError(
        'The logged in user must be the same user who created the order',
      );
    }

    if (orderUser.changed === 'T') {
      throw new AppError('It is not possible to delete a changed order');
    }

    const order = await ordersCustomRepository.deleteOrderByID({
      orderId: String(orderId),
    });

    const cacheProvider = new CacheProvider();

    await cacheProvider.invalidate('orders-list:All');
    await cacheProvider.invalidate(`orders-list:${sector}`);

    console.log(`orders-list:${sector}`);

    const usersExceptUserAuth = await usersCustomRepository.getAllUsersExceptUserIdAuth(
      user_id,
    );

    const notificationsRepository = new NotificationsRepository();

    const userAuth = await usersCustomRepository.getUserById(user_id);

    usersExceptUserAuth.map(async user => {
      await notificationsRepository.create({
        recipient_id: user.id,
        content: `Pedido: ${modelName} do cliente: ${client}, deletado por: ${userAuth?.name}`,
      });
    });

    if (!order) {
      return undefined;
    }

    const orderData = {
      user_id,
      client,
      modelName,
    };

    await pushQueue.add('RegistrationPushNotificationDelete', { orderData });

    return order;
  }
}

export default DeleteOrderByIDService;
