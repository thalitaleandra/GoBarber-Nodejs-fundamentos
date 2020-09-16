import Appointment from '../models/Appointment';
import { getCustomRepository } from 'typeorm'
import AppointmentsRepository from '../repositories/AppointmentsRepository';
import { startOfHour } from 'date-fns';
import AppError from '../erros/AppError'
interface Request {
  provider_id: string;
  date: Date;
}

class CreateAppointmentService {

  public async execute({ provider_id, date }: Request): Promise<Appointment> {
    const appointmentsRepository = getCustomRepository(AppointmentsRepository)
    const appoinmentDate = startOfHour(date);
    console.log(appoinmentDate)
    const findAppointmentInSameDate = await appointmentsRepository.findByDate(
      appoinmentDate,
    );
    if (findAppointmentInSameDate) {
      throw new AppError('this appointment is already booked');
    }

    const appointment = appointmentsRepository.create({
      provider_id,
      date: appoinmentDate,
    });

    await appointmentsRepository.save(appointment);
    return appointment;
  }
}

export default CreateAppointmentService;
