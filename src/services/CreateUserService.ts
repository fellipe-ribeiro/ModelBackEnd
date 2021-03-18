import { hash } from 'bcryptjs';
import UsersCustomRepository from '../repositories/UsersCustomRepository';
import User from '../models/User';

import AppError from '../errors/AppError';

interface IRequest {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  public async execute({ name, email, password }: IRequest): Promise<User> {
    const usersCustomRepository = new UsersCustomRepository();

    const checkUserExists = await usersCustomRepository.getUserByEmail(email);

    if (checkUserExists) {
      throw new AppError('Email address already used');
    }

    const hashedPassword = await hash(password, 8);

    const user = await usersCustomRepository.createUser(
      name,
      email,
      hashedPassword,
    );

    return user;
  }
}

export default CreateUserService;
