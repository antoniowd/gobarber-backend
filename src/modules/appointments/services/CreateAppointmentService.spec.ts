import AppError from '@shared/errors/AppError';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

describe('CreateAppointment', () => {
  it('Should be able to create a new appointment', async () => {
    const createAppointment = new CreateAppointmentService(
      new FakeAppointmentsRepository(),
    );

    const appointment = await createAppointment.execute({
      provider_id: '123',
      date: new Date(),
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('123');
  });

  it("Shouldn't be able to create two appointments with the same time", async () => {
    const createAppointment = new CreateAppointmentService(
      new FakeAppointmentsRepository(),
    );

    const date = new Date(2020, 4, 10, 11);

    await createAppointment.execute({
      provider_id: '123',
      date,
    });

    expect(
      createAppointment.execute({
        provider_id: '123',
        date,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
