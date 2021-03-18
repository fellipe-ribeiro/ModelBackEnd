import UsersCustomRepository from '../repositories/UsersCustomRepository';
import UserTokenCustomRepository from '../repositories/UserTokenCustomRepository';
// import User from '../models/User';

import AppError from '../errors/AppError';

interface IRequest {
  email: string;
}

class SendForgotPasswordEmailService {
  public async execute({ email }: IRequest): Promise<void> {
    const usersCustomRepository = new UsersCustomRepository();
    const userTokenCustomRepository = new UserTokenCustomRepository();

    const user = await usersCustomRepository.getUserByEmail(email);

    if (!user) {
      throw new AppError('User does not exists');
    }

    await userTokenCustomRepository.generate(user.id);
  }
}

export default SendForgotPasswordEmailService;
