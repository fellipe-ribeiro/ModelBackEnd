import { isAfter, addHours } from 'date-fns';

import HashProvider from '../providers/HashProvider/BCryptHashProvider';

import UsersCustomRepository from '../repositories/UsersCustomRepository';
import UserTokensCustomRepository from '../repositories/UserTokensCustomRepository';
// import User from '../models/User';

import AppError from '../errors/AppError';

interface IRequest {
  token: string;
  password: string;
}

class ResetPasswordService {
  public async execute({ token, password }: IRequest): Promise<void> {
    const hashProvider = new HashProvider();

    const userTokensCustomRepository = new UserTokensCustomRepository();
    const usersCustomRepository = new UsersCustomRepository();

    const userToken = await userTokensCustomRepository.findByToken(token);

    if (!userToken) {
      throw new AppError('User token does not exists');
    }

    const user = await usersCustomRepository.getUserById(userToken.user_id);

    if (!user) {
      throw new AppError('User does not exists');
    }

    const tokenCreatedAt = userToken.created_at;
    const compareDate = addHours(tokenCreatedAt, 2);

    if (isAfter(Date.now(), compareDate)) {
      throw new AppError('Token expired');
    }

    user.password = await hashProvider.generateHash(password);

    await usersCustomRepository.updateUser(user);
  }
}

export default ResetPasswordService;
