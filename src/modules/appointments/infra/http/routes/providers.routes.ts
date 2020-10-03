import { Router } from 'express';
import ensureAuthenticate from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import ProvidersController from '../controllers/ProvidersController';
import ProviderMonthAvailabilityController from '../controllers/ProviderMonthAvailabilityController';
import ProviderDayAvailabilityController from '../controllers/ProviderDayAvailabilityController';

const router = Router();
const providersController = new ProvidersController();
const providerMonthAvailabilityController = new ProviderMonthAvailabilityController();
const providerDayAvailabilityController = new ProviderDayAvailabilityController();

router.use(ensureAuthenticate);

router.get('/', providersController.index);

router.get(
  '/:id/month-availability',
  providerMonthAvailabilityController.index,
);
router.get('/:id/day-availability', providerDayAvailabilityController.index);

export default router;
