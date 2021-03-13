import Order from '../models/Order';

interface ICreateAppointmentDTO {
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

class OrdersRepository {
  private orders: Order[];

  constructor() {
    this.orders = [];
  }

  public all(): Order[] {
    return this.orders;
  }

  public create({
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
  }: ICreateAppointmentDTO): Order {
    const order = new Order({
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

    this.orders.push(order);

    return order;
  }
}

export default OrdersRepository;
