import UsersCustomRepository from '../repositories/UsersCustomRepository';

import AppError from '../errors/AppError';

import User from '../models/User';

interface IRequest {
  user_id: string;
}

class ShowProfileService {
  public async execute({ user_id }: IRequest): Promise<User> {
    const usersCustomRepository = new UsersCustomRepository();

    const user = await usersCustomRepository.getUserById(user_id);

    if (!user) {
      throw new AppError('User not found');
    }

    return user;
  }
}

export default ShowProfileService;
