import { Router } from 'express';
import { parseISO } from 'date-fns';
import { getCustomRepository } from 'typeorm'
import CreateAppointmentsService from '../services/CreateAppointmentService';
import AppointmentsRepository from '../repositories/AppointmentsRepository';
import ensureAuthenticated from '../middlewares/ensureAuthenticated'
const appoimentsRouter = Router();

appoimentsRouter.use(ensureAuthenticated);

appoimentsRouter.get('/', async (request, response) => {
  const appointmentsRepository = getCustomRepository(AppointmentsRepository)
  const appointments = await appointmentsRepository.find();
  return response.json(appointments);
});
appoimentsRouter.post('/', async (request, response) => {

  console.log(request.body)
  const { provider_id, date } = request.body;
  console.log(date)
  const parsedDate = parseISO(date);
  console.log(parsedDate)
  const createAppointment = new CreateAppointmentsService();

  const appoinment = await createAppointment.execute({
    date: parsedDate,
    provider_id,
  });
  return response.json(appoinment);

});

export default appoimentsRouter;
