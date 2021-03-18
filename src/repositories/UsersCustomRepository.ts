import { getCustomRepository, EntityRepository, Repository } from 'typeorm';

import User from '../models/User';

@EntityRepository(User)
class UsersCustomRepository extends Repository<User> {
  public async getUserByEmail(email: string): Promise<User | undefined> {
    const usersRepository = getCustomRepository(UsersCustomRepository);

    const user = await usersRepository.findOne({ where: { email } });

    return user;
  }

  public async getUserById(id: string): Promise<User | undefined> {
    const usersRepository = getCustomRepository(UsersCustomRepository);

    const user = await usersRepository.findOne({ where: { id } });

    return user;
  }

  public async createUser(
    name: string,
    email: string,
    password: string,
  ): Promise<User> {
    const usersRepository = getCustomRepository(UsersCustomRepository);

    const user = usersRepository.create({
      name,
      email,
      password,
    });

    await usersRepository.save(user);

    return user;
  }

  public async updateUser(user: User): Promise<User> {
    const usersRepository = getCustomRepository(UsersCustomRepository);

    await usersRepository.save(user);

    return user;
  }
}

export default UsersCustomRepository;
