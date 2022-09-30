import { Router } from 'express';
import CardsController from '../../controllers/cards.controller';
import CardsValidator from '../../controllers/validators/cards.validator';
import adminMiddleware from '../../middleware/admin';
import authMiddleware from '../../middleware/auth';
import validation from '../../middleware/validation';

const router = Router();

//* CRUD related routes
router.post(
  '/',
  authMiddleware,
  adminMiddleware,
  validation(CardsValidator.createCardSchema),
  CardsController.create,
);
router.get(
  '/',
  authMiddleware,
  validation(CardsValidator.indexCardsSchema),
  CardsController.index,
);
router.get(
  '/:id([0-9]+)',
  authMiddleware,
  validation(CardsValidator.getCardSchema),
  CardsController.get,
);
router.put(
  '/:id([0-9]+)',
  authMiddleware,
  adminMiddleware,
  validation(CardsValidator.updateCardSchema),
  CardsController.update,
);
router.delete(
  '/:id([0-9]+)',
  authMiddleware,
  adminMiddleware,
  validation(CardsValidator.deleteCardSchema),
  CardsController.delete,
);

router.get('/rarities', authMiddleware, CardsController.indexRarities);
router.get('/attributes', authMiddleware, CardsController.indexAttributes);

export default router;
