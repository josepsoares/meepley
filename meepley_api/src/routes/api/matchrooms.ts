import { Router } from 'express';
import MatchroomsController from '../../controllers/matchrooms.controller';
import MatchroomValidator from '../../controllers/validators/matchrooms.validator';
import adminMiddleware from '../../middleware/admin';
import authMiddleware from '../../middleware/auth';
import validation from '../../middleware/validation';

const router = Router();

//* CRUD related routes
router.post(
  '/',
  authMiddleware,
  validation(MatchroomValidator.createMatchroomSchema),
  MatchroomsController.create,
);
router.get(
  '/',
  authMiddleware,
  validation(MatchroomValidator.indexMatchroomsSchema),
  MatchroomsController.index,
);

router.get(
  '/recommended',
  authMiddleware,
  MatchroomsController.indexRecommended,
);
router.get('/divergent', authMiddleware, MatchroomsController.indexDivergent);
router.get(
  '/user/:id([0-9]+)',
  authMiddleware,
  MatchroomsController.indexUserMatchrooms,
);

router.get(
  '/:id([0-9]+)',
  authMiddleware,
  validation(MatchroomValidator.getMatchroomSchema),
  MatchroomsController.get,
);
router.put(
  '/:id([0-9]+)',
  authMiddleware,
  validation(MatchroomValidator.updateMatchroomSchema),
  MatchroomsController.update,
);
router.delete(
  '/:id([0-9]+)',
  authMiddleware,
  validation(MatchroomValidator.deleteMatchroomSchema),
  MatchroomsController.delete,
);

//* user joining or abandonning matchrooms
router.get('/enter', authMiddleware, MatchroomsController.enter);
router.post('/enter', authMiddleware, MatchroomsController.enterViaCode);
router.get('/abandon', authMiddleware, MatchroomsController.abandon);

//* user feedback related to matchrooms
router.get(
  '/check-feedback/:id([0-9]+)',
  authMiddleware,
  MatchroomsController.checkUserMatchroomFeedback,
);
router.post(
  '/feedback',
  authMiddleware,
  MatchroomsController.createSubmittedFeedback,
);
router.put(
  '/feedback/:id([0-9]+)',
  adminMiddleware,
  MatchroomsController.deleteFeedback,
);
router.delete(
  '/feedback/:id([0-9]+)',
  adminMiddleware,
  MatchroomsController.deleteFeedback,
);

export default router;
