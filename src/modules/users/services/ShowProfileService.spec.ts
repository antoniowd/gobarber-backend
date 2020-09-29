import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import ShowProfile from './ShowProfileService';

let fakeUsersRepository: FakeUsersRepository;
let showProfile: ShowProfile;

describe('ShowProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    showProfile = new ShowProfile(fakeUsersRepository);
  });

  it('Should be able to retrieve the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Smith',
      email: 'john@gmail.com',
      password: '123456',
    });

    const userProfile = await showProfile.execute(user.id);

    expect(userProfile.name).toBe('John Smith');
    expect(userProfile.email).toBe('john@gmail.com');
  });

  it("Shouldn't be able to retrieve a profile with an unknown user", async () => {
    await expect(
      showProfile.execute('non-existing-uuid'),
    ).rejects.toBeInstanceOf(AppError);
  });
});
