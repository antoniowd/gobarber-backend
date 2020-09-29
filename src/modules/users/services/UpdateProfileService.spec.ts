import AppError from '@shared/errors/AppError';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateProfile from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfile;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    updateProfile = new UpdateProfile(fakeUsersRepository, fakeHashProvider);
  });

  it('Should be able to update the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Smith',
      email: 'john@gmail.com',
      password: '123456',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'John Smith 2',
      email: 'john@example.com',
    });

    expect(updatedUser.name).toBe('John Smith 2');
    expect(updatedUser.email).toBe('john@example.com');
  });

  it("Shouldn't be able to update with an unknown user", async () => {
    await expect(
      updateProfile.execute({
        user_id: 'non-existing-uuid',
        name: 'John Smith 2',
        email: 'john@example.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("Shouldn't be able to update its email with other user email", async () => {
    await fakeUsersRepository.create({
      name: 'John Smith',
      email: 'john@example.com',
      password: '123456',
    });

    const user = await fakeUsersRepository.create({
      name: 'John Smith',
      email: 'john@gmail.com',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'John Smith 2',
        email: 'john@example.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should be able to update password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Smith',
      email: 'john@gmail.com',
      password: '123456',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'John Smith 2',
      email: 'john@example.com',
      old_password: '123456',
      password: '123',
    });

    expect(updatedUser.password).toBe('123');
  });

  it('Should inform the current password to change a new one', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Smith',
      email: 'john@gmail.com',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'John Smith 2',
        email: 'john@example.com',
        password: '123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("Shouldn't be able to update the password with a wrong old_password", async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Smith',
      email: 'john@gmail.com',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'John Smith 2',
        email: 'john@example.com',
        old_password: '1234567',
        password: '123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
