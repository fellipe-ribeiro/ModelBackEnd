import { EntityRepository, Repository } from 'typeorm';
import Order from '../models/Order';

@EntityRepository(Order)
class OrdersRepository extends Repository<Order> {
  public async findByDepartureDateAndModelName(
    departureDate: Date,
    modelName: string,
  ): Promise<Order | null> {
    const findOrder = await this.findOne({
      where: { departureDate, modelName },
    });
    return findOrder || null;
  }
}

export default OrdersRepository;
