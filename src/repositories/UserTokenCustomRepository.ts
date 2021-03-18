import { getCustomRepository, EntityRepository, Repository } from 'typeorm';

import UserToken from '../models/UserToken';

@EntityRepository(UserToken)
class UserTokenCustomRepository extends Repository<UserToken> {
  public async findByToken(token: string): Promise<UserToken | undefined> {
    const userTokenRepository = getCustomRepository(UserTokenCustomRepository);
    const userToken = await userTokenRepository.findOne({
      where: { token },
    });

    return userToken;
  }

  public async generate(user_id: string): Promise<UserToken> {
    const userTokenRepository = getCustomRepository(UserTokenCustomRepository);
    const userToken = userTokenRepository.create({
      user_id,
    });

    await userTokenRepository.save(userToken);

    return userToken;
  }
}

export default UserTokenCustomRepository;
