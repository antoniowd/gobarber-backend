import { Router } from 'express';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import ProfileController from '../controllers/ProfileController';

const router = Router();
const profileController = new ProfileController();

router.use(ensureAuthenticated);

router.get('/', profileController.show);
router.put('/', profileController.update);

export default router;
