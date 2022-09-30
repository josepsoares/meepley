import { Router } from 'express';
import PlacesController from '../../controllers/places.controller';
import PlacesValidator from '../../controllers/validators/places.validator';
import adminMiddleware from '../../middleware/admin';
import authMiddleware from '../../middleware/auth';
import validation from '../../middleware/validation';

const router = Router();

//* CRUD related routes
router.get(
  '/',
  authMiddleware,
  validation(PlacesValidator.indexPlacesSchema),
  PlacesController.index,
);
router.get(
  '/:id([0-9]+)',
  authMiddleware,
  validation(PlacesValidator.getPlaceSchema),
  PlacesController.get,
);
router.put(
  '/:id([0-9]+)',
  authMiddleware,
  validation(PlacesValidator.updatePlaceSchema),
  PlacesController.update,
);
router.post(
  '/',
  authMiddleware,
  validation(PlacesValidator.createPlaceSchema),
  PlacesController.create,
);
router.delete(
  '/',
  authMiddleware,
  validation(PlacesValidator.deletePlaceSchema),
  PlacesController.delete,
);

router.get('/types', authMiddleware, PlacesController.indexTypes);

export default router;
