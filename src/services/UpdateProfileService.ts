import UsersCustomRepository from '../repositories/UsersCustomRepository';

import HashProvider from '../providers/HashProvider/BCryptHashProvider';

import AppError from '../errors/AppError';

import User from '../models/User';

interface IRequest {
  user_id: string;
  name: string;
  email: string;
  old_password?: string;
  password?: string;
}

class UpdateProfileService {
  public async execute({
    user_id,
    name,
    email,
    old_password,
    password,
  }: IRequest): Promise<User> {
    const usersCustomRepository = new UsersCustomRepository();
    const hashProvider = new HashProvider();

    const user = await usersCustomRepository.getUserById(user_id);

    if (!user) {
      throw new AppError('User not found');
    }

    const userWithUpdatedEmail = await usersCustomRepository.getUserByEmail(
      email,
    );

    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user_id) {
      throw new AppError('E-mail already in use');
    }

    user.name = name;
    user.email = email;

    if (password && !old_password) {
      throw new AppError(
        'You need to inform the old password to set new password',
      );
    }

    if (password && old_password) {
      const checkOldPassword = await hashProvider.compareHash(
        old_password,
        user.password,
      );

      if (!checkOldPassword) {
        throw new AppError('Old Password does not match');
      }

      user.password = await hashProvider.generateHash(password);
    }

    const userUpdated = await usersCustomRepository.updateUser(user);

    return userUpdated;
  }
}

export default UpdateProfileService;
