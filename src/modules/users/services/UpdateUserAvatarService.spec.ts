import AppError from '@shared/errors/AppError';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateUserAvatar from './UpdateUserAvatarService';

describe('UpdateUserAvatar', () => {
  it('Should be able to upload an avatar', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const updateUserAvatar = new UpdateUserAvatar(
      fakeUsersRepository,
      new FakeStorageProvider(),
    );

    const user = await fakeUsersRepository.create({
      name: 'John Smith',
      email: 'john@gmail.com',
      password: '123456',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'file.png',
    });

    expect(user.avatar).toBe('file.png');
  });

  it("Shouldn't be able to upload an avatar without an unknown user", async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const updateUserAvatar = new UpdateUserAvatar(
      fakeUsersRepository,
      new FakeStorageProvider(),
    );

    expect(
      updateUserAvatar.execute({
        user_id: 'non-users',
        avatarFilename: 'file.png',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should delete an old avatar and update a new one', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStorageProvider = new FakeStorageProvider();
    const updateUserAvatar = new UpdateUserAvatar(
      fakeUsersRepository,
      fakeStorageProvider,
    );

    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const user = await fakeUsersRepository.create({
      name: 'John Smith',
      email: 'john@gmail.com',
      password: '123456',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'file.png',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'file2.png',
    });

    expect(deleteFile).toHaveBeenCalledWith('file.png');
    expect(user.avatar).toBe('file2.png');
  });
});
