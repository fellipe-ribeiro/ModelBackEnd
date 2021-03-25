import { getMongoRepository, MongoRepository, Not } from 'typeorm';
import DevicesTokens from '../schemas/DevicesTokens';

class DevicesTokensRepository {
  private ormRepository: MongoRepository<DevicesTokens>;

  constructor() {
    this.ormRepository = getMongoRepository(DevicesTokens, 'mongo');
  }

  public async getAllTokens(): Promise<string[]> {
    const devicesTokens = this.ormRepository.find();

    const devicesTokensList = (await devicesTokens).map(
      devices => devices.device_token,
    );

    return devicesTokensList;
  }

  public async getAllTokensExceptUserAuth(user_id: string): Promise<string[]> {
    const devicesTokens = this.ormRepository.find({
      where: { user_id: Not(user_id) },
    });

    const devicesTokensList = (await devicesTokens).map(
      devices => devices.device_token,
    );

    return devicesTokensList;
  }

  public async findToken(
    device_token: string,
  ): Promise<DevicesTokens | undefined> {
    const deviceToken = this.ormRepository.findOne({
      where: { device_token },
    });

    return deviceToken;
  }

  public async findUserId(user_id: string): Promise<DevicesTokens | undefined> {
    const deviceToken = this.ormRepository.findOne({
      where: { user_id },
    });

    return deviceToken;
  }

  public async registerToken(
    user_id: string,
    device_token: string,
  ): Promise<DevicesTokens> {
    const deviceToken = this.ormRepository.create({
      user_id,
      device_token,
    });

    await this.ormRepository.save(deviceToken);

    return deviceToken;
  }
}

export default DevicesTokensRepository;
