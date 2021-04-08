import UsersCustomRepository from '../repositories/UsersCustomRepository';

import User from '../models/User';

const usersCustomRepository = new UsersCustomRepository();

class ListOrderByIDService {
  public async execute(id: string): Promise<User | undefined> {
    const user = await usersCustomRepository.getUserById(id);

    if (!user) {
      return undefined;
    }

    return user;
  }
}

export default ListOrderByIDService;
