import { uuid } from 'uuidv4';

class Order {
  id: string;

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

  constructor({
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
  }: Omit<Order, 'id'>) {
    this.id = uuid();
    this.client = client;
    this.modelName = modelName;
    this.type = type;
    this.entryDate = entryDate;
    this.departureDate = departureDate;
    this.modelingTime = modelingTime;
    this.cuttingTime = cuttingTime;
    this.setupTime = setupTime;
    this.sewingTime = sewingTime;
    this.numberOfPieces = numberOfPieces;
    this.sector = sector;
    this.rawMaterial = rawMaterial;
  }
}

export default Order;
