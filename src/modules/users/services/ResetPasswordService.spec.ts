import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import ResetPasswordService from './ResetPasswordService';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeHashProvider: FakeHashProvider;
let resetPassword: ResetPasswordService;

describe('ResetPassword', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    fakeHashProvider = new FakeHashProvider();
    resetPassword = new ResetPasswordService(
      fakeUsersRepository,
      fakeUserTokensRepository,
      fakeHashProvider,
    );
  });

  it('Should be able to reset the password', async () => {
    const { id } = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'ok',
    });

    const { token } = await fakeUserTokensRepository.generate(id);

    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

    await resetPassword.execute({
      token,
      password: 'ok2',
    });

    const user = await fakeUsersRepository.findById(id);

    expect(user?.password).toBe('ok2');
    expect(generateHash).toHaveBeenCalledWith('ok2');
  });

  it("Shouldn't able to reset the password with non-existing token", async () => {
    expect(
      resetPassword.execute({
        token: 'missing-token',
        password: 'ok',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("Shouldn't able to reset the password with non-existing user", async () => {
    const { token } = await fakeUserTokensRepository.generate('missing-user');

    expect(
      resetPassword.execute({
        token,
        password: 'ok',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("Shouldn't be able to reset the password with an expired token. Token is valid for 2 hours.", async () => {
    const { id } = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'ok',
    });

    const { token } = await fakeUserTokensRepository.generate(id);

    await resetPassword.execute({
      token,
      password: 'ok2',
    });

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const date = new Date();
      return date.setHours(date.getHours() + 3);
    });

    await expect(
      resetPassword.execute({
        token,
        password: 'ok2',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
