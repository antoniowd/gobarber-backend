import AppError from '@shared/errors/AppError';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );
  });

  it('Should be able to create a new appointment', async () => {
    const appointment = await createAppointment.execute({
      provider_id: '123',
      date: new Date(),
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('123');
  });

  it("Shouldn't be able to create two appointments with the same time", async () => {
    const date = new Date(2020, 4, 10, 11);
    await createAppointment.execute({
      provider_id: '123',
      date,
    });

    await expect(
      createAppointment.execute({
        provider_id: '123',
        date,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
