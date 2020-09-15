import { Router } from 'express';
import ensureAuthenticate from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import AppointmentsController from '../controllers/AppointmentsController';

const router = Router();
const appointmentsController = new AppointmentsController();

router.use(ensureAuthenticate);

// router.get('/', async (request, response) => {
//   const appointments = await appointmentsRepository.find();
//   return response.json(appointments);
// });

router.post('/', appointmentsController.create);

export default router;
