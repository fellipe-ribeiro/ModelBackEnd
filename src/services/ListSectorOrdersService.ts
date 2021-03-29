import OrdersCustomRepository from '../repositories/OrdersCustomRepository';
import CacheProvider from '../providers/CacheProvider/RedisCacheProvider';

import Order from '../models/Order';

const ordersCustomRepository = new OrdersCustomRepository();
const cacheProvider = new CacheProvider();

class ShowProfileService {
  public async execute(sectorName: string): Promise<Order[]> {
    let orders = await cacheProvider.recover<Order[]>(
      `orders-list:${sectorName}`,
    );

    if (!orders) {
      orders = await ordersCustomRepository.getSectorOrders({
        sectorName: String(sectorName),
      });
      await cacheProvider.save(`orders-list:${sectorName}`, orders);
    }

    return orders;
  }
}

export default ShowProfileService;
