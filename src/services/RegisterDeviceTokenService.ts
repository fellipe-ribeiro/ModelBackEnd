import DevicesTokensRepository from '../repositories/DevicesTokensRepository';

interface ITokenDTO {
  user_id: string;
  device_token: string;
}

class CreateUserService {
  public async execute({
    user_id,
    device_token,
  }: ITokenDTO): Promise<ITokenDTO> {
    const devicesTokensRepository = new DevicesTokensRepository();

    const checkUserIdExists = await devicesTokensRepository.findUserId(user_id);
    if (checkUserIdExists && device_token !== checkUserIdExists.device_token) {
      await devicesTokensRepository.registerToken(user_id, device_token);
    }

    const checkDeviceTokenExists = await devicesTokensRepository.findToken(
      device_token,
    );
    if (!checkDeviceTokenExists) {
      await devicesTokensRepository.registerToken(user_id, device_token);
    }

    return {
      user_id,
      device_token,
    };
  }
}

export default CreateUserService;
