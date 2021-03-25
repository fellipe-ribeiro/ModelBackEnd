import { getCustomRepository, EntityRepository, Repository } from 'typeorm';

import UserToken from '../models/UserToken';

@EntityRepository(UserToken)
class UserTokensCustomRepository extends Repository<UserToken> {
  public async findByToken(token: string): Promise<UserToken | undefined> {
    const userTokensRepository = getCustomRepository(
      UserTokensCustomRepository,
    );
    const userToken = await userTokensRepository.findOne({
      where: { token },
    });

    return userToken;
  }

  public async generate(user_id: string): Promise<UserToken> {
    const userTokensRepository = getCustomRepository(
      UserTokensCustomRepository,
    );
    const userToken = userTokensRepository.create({
      user_id,
    });

    await userTokensRepository.save(userToken);

    return userToken;
  }
}

export default UserTokensCustomRepository;
