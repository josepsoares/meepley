import { Router } from 'express';
import BoardgamesController from '../../controllers/boardgames.controller';
import BoardgamesValidator from '../../controllers/validators/boardgames.validator';
import validation from '../../middleware/validation';

const router = Router();

//* CRUD related routes
router.get(
  '/',
  validation(BoardgamesValidator.indexBoardgamesSchema),
  BoardgamesController.index,
);
router.get(
  '/:id([0-9]+)',
  validation(BoardgamesValidator.getBoardgameSchema),
  BoardgamesController.get,
);

router.get('/categories', BoardgamesController.indexCategories);
router.get('/mechanics', BoardgamesController.indexMechanics);
router.get('/skills', BoardgamesController.indexSkills);

export default router;
