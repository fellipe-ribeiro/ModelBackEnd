import OrdersCustomRepository from '../repositories/OrdersCustomRepository';
import CacheProvider from '../providers/CacheProvider/RedisCacheProvider';

import Order from '../models/Order';

const ordersCustomRepository = new OrdersCustomRepository();
const cacheProvider = new CacheProvider();

class ListAllOrdersService {
  public async execute(): Promise<Order[] | null> {
    let orders = await cacheProvider.recover<Order[]>('orders-list:All');

    if (!orders) {
      orders = await ordersCustomRepository.getAllOrders();
      await cacheProvider.save('orders-list:All', orders);
    }

    return orders;
  }
}

export default ListAllOrdersService;
