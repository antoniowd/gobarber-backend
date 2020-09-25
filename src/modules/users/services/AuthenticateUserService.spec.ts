import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';

describe('AuthenticateUser', () => {
  it('Should be able to authenticate', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const createUser = new CreateUserService(
      fakeUsersRepository,
      new FakeHashProvider(),
    );
    const authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      new FakeHashProvider(),
    );

    const user = await createUser.execute({
      name: 'John Smith',
      email: 'john@gmail.com',
      password: '123456',
    });

    const response = await authenticateUser.execute({
      email: 'john@gmail.com',
      password: '123456',
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it("Shouldn't be able to authenticate with non existing users", async () => {
    const authenticateUser = new AuthenticateUserService(
      new FakeUsersRepository(),
      new FakeHashProvider(),
    );

    expect(
      authenticateUser.execute({
        email: 'nonusers@gmail.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("Shouldn't be able to authenticate with a wrong password", async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const createUser = new CreateUserService(
      fakeUsersRepository,
      new FakeHashProvider(),
    );
    const authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      new FakeHashProvider(),
    );

    await createUser.execute({
      name: 'John Smith',
      email: 'john@gmail.com',
      password: '123456',
    });

    expect(
      authenticateUser.execute({
        email: 'john@gmail.com',
        password: 'wrong-password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
