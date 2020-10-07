import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import CreateUserService from './CreateUserService';

let createUser: CreateUserService;

describe('CreateUser', () => {
  beforeEach(() => {
    createUser = new CreateUserService(
      new FakeUsersRepository(),
      new FakeHashProvider(),
      new FakeCacheProvider(),
    );
  });

  it('Should be able to create a new user', async () => {
    const user = await createUser.execute({
      name: 'John Smith',
      email: 'john@gmail.com',
      password: '123456',
    });

    expect(user).toHaveProperty('id');
    expect(user.name).toBe('John Smith');
    expect(user.email).toBe('john@gmail.com');
  });

  it("Shouldn't be able to create two users with the same email", async () => {
    await createUser.execute({
      name: 'John Smith',
      email: 'john@gmail.com',
      password: '123456',
    });

    await expect(
      createUser.execute({
        name: 'John Smith',
        email: 'john@gmail.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
