import { sign } from 'jsonwebtoken';
import HashProvider from '../providers/HashProvider/BCryptHashProvider';

import authConfig from '../config/auth';

import AppError from '../errors/AppError';

import User from '../models/User';

import UsersCustomRepository from '../repositories/UsersCustomRepository';

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: User;
  token: string;
}

class AuthenticateUserService {
  public async execute({ email, password }: IRequest): Promise<IResponse> {
    const hashProvider = new HashProvider();

    const usersCustomRepository = new UsersCustomRepository();

    const user = await usersCustomRepository.getUserByEmail(email);

    if (!user) {
      throw new AppError('Incorrect email/password combination.', 401);
    }

    // user.password - Senha criptografada
    // password - Senha não criptografada

    const passwordMatched = await hashProvider.compareHash(
      password,
      user.password,
    );

    if (!passwordMatched) {
      throw new AppError('Incorrect email/password combination.', 401);
    }

    const { secret } = authConfig.jwt;

    const token = sign({}, secret, {
      subject: user.id,
      // expiresIn: authConfig.jwt.expiresIn,
    });

    return {
      user,
      token,
    };
  }
}

export default AuthenticateUserService;
