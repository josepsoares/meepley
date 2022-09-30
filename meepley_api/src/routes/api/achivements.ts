import { Router } from 'express';
import AchievementsController from '../../controllers/achievements.controller';
import validation from '../../middleware/validation';
import AchivementsValidator from '../../controllers/validators/achievements.validator';
import authMiddleware from '../../middleware/auth';
import adminMiddleware from '../../middleware/admin';

const router = Router();

//* CRUD related routes
router.post(
  '/',
  authMiddleware,
  adminMiddleware,
  validation(AchivementsValidator.createAchievementSchema),
  AchievementsController.create,
);
router.get(
  '/',
  authMiddleware,
  validation(AchivementsValidator.indexAchievementsSchema),
  AchievementsController.index,
);
router.get(
  '/:id([0-9]+)',
  authMiddleware,
  validation(AchivementsValidator.getAchievementSchema),
  AchievementsController.get,
);
router.put(
  '/:id([0-9]+)',
  authMiddleware,
  adminMiddleware,
  validation(AchivementsValidator.updateAchievementSchema),
  AchievementsController.update,
);
router.delete(
  '/:id([0-9]+)',
  authMiddleware,
  adminMiddleware,
  validation(AchivementsValidator.deleteAchievementSchema),
  AchievementsController.delete,
);

router.get('/difficulties', AchievementsController.indexDifficulties);
router.get('/types', AchievementsController.indexTypes);

export default router;
