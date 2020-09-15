import { promises as fs } from 'fs';
import path from 'path';
import { injectable, inject } from 'tsyringe';
import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';
import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
  user_id: string;
  avatarFilename: string;
}

@injectable()
class UpdateUserAvatarService {
  constructor(
    @inject('UsersRepository') private usersRepository: IUsersRepository,
  ) {}

  public async execute({ user_id, avatarFilename }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found.');
    }

    if (user.avatar) {
      const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar);
      if (await fs.stat(userAvatarFilePath)) {
        await fs.unlink(userAvatarFilePath);
      }
    }

    user.avatar = avatarFilename;

    return this.usersRepository.save(user);
  }
}

export default UpdateUserAvatarService;
