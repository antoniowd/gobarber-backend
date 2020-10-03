import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import AppError from '@shared/errors/AppError';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeNotificationsRepository: FakeNotificationsRepository;
let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeNotificationsRepository = new FakeNotificationsRepository();
    createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
      fakeNotificationsRepository,
    );
  });

  it('Should be able to create a new appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    const appointment = await createAppointment.execute({
      provider_id: '123',
      user_id: '321',
      date: new Date(2020, 4, 10, 13),
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('123');
  });

  it("Shouldn't be able to create two appointments with the same time", async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    const date = new Date(2020, 4, 10, 13);
    await createAppointment.execute({
      provider_id: '123',
      user_id: '321',
      date,
    });

    await expect(
      createAppointment.execute({
        provider_id: '123',
        user_id: '321',
        date,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("Shouldn't be able to create appointments on a past date", async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    const date = new Date(2020, 4, 10, 11);
    await expect(
      createAppointment.execute({
        provider_id: '123',
        user_id: '321',
        date,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("Shouldn't be able to create an appointment to yourself", async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    const date = new Date(2020, 4, 10, 13);
    await expect(
      createAppointment.execute({
        provider_id: '123',
        user_id: '123',
        date,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("Shouldn't be able to create an appointment outside from the available hours", async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        provider_id: '123',
        user_id: '321',
        date: new Date(2020, 4, 11, 7),
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      createAppointment.execute({
        provider_id: '123',
        user_id: '321',
        date: new Date(2020, 4, 11, 18),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
