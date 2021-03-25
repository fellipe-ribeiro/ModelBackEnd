import UsersCustomRepository from '../repositories/UsersCustomRepository';

import DiskStorageProvider from '../providers/StorageProvider/DiskStorageProvider';

import AppError from '../errors/AppError';

import User from '../models/User';

interface IRequest {
  user_id: string;
  avatarFilename: string;
}

class UpdateUserAvatarService {
  public async execute({ user_id, avatarFilename }: IRequest): Promise<User> {
    const storageProvider = new DiskStorageProvider();

    const usersCustomRepository = new UsersCustomRepository();

    const user = await usersCustomRepository.getUserById(user_id);

    if (!user) {
      throw new AppError('Only authenticated users can change avatar', 401);
    }

    if (user.avatar) {
      await storageProvider.deleteFile(user.avatar);
    }

    const fileName = await storageProvider.saveFile(avatarFilename);

    user.avatar = fileName;

    const userUpdated = await usersCustomRepository.updateUser(user);

    return userUpdated;
  }
}

export default UpdateUserAvatarService;
