import OrdersCustomRepository from '../repositories/OrdersCustomRepository';

import Order from '../models/Order';

const ordersCustomRepository = new OrdersCustomRepository();

class ListOrderByIDService {
  public async execute(orderId: string): Promise<Order | undefined> {
    const order = await ordersCustomRepository.getOrderByID({
      orderId: String(orderId),
    });

    if (!order) {
      return undefined;
    }

    return order;
  }
}

export default ListOrderByIDService;
