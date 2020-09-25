import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import CreateUserService from './CreateUserService';

describe('CreateUser', () => {
  it('Should be able to create a new user', async () => {
    const createUser = new CreateUserService(
      new FakeUsersRepository(),
      new FakeHashProvider(),
    );

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
    const createUser = new CreateUserService(
      new FakeUsersRepository(),
      new FakeHashProvider(),
    );

    await createUser.execute({
      name: 'John Smith',
      email: 'john@gmail.com',
      password: '123456',
    });

    expect(
      createUser.execute({
        name: 'John Smith',
        email: 'john@gmail.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
