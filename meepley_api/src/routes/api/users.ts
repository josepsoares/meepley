import { Router } from 'express';
import UsersController from '../../controllers/users.controller';
import UsersValidator from '../../controllers/validators/users.validator';
import authMiddleware from '../../middleware/auth';
import validation from '../../middleware/validation';
import { uploadSingleFile } from '../../utils/fileStorage';

const router = Router();

//* CRUD routes
router.get(
  '/',
  authMiddleware,
  validation(UsersValidator.indexUsersSchema),
  UsersController.index,
);
router.get(
  '/:id([0-9]+)',
  authMiddleware,
  validation(UsersValidator.getUserSchema),
  UsersController.get,
);
router.put('/:id([0-9]+)', authMiddleware, UsersController.update);
router.delete(
  '/:id([0-9]+)',
  authMiddleware,
  validation(UsersValidator.deleteUserSchema),
  UsersController.delete,
);
router.put(
  '/bg/:id([0-9]+)',
  authMiddleware,
  UsersController.updateFavoriteBoardgames,
);

router.post(
  '/update/avatar/:id([0-9]+)',
  [authMiddleware, uploadSingleFile],
  UsersController.uploadAndUpdateAvatar,
);

//* calibration related routes
router.post(
  '/calibrate/:id([0-9]+)',
  authMiddleware,
  UsersController.calibrate,
);
router.put(
  '/calibrate/:id([0-9]+)',
  authMiddleware,
  UsersController.updateCalibration,
);

//* follows related routes
router.get(
  '/follow',
  authMiddleware,
  validation(UsersValidator.followUserSchema),
  UsersController.followUser,
);
router.get(
  '/unfollow',
  authMiddleware,
  validation(UsersValidator.unfollowUserSchema),
  UsersController.unfollowUser,
);
router.get(
  '/followers/:id([0-9]+)',
  authMiddleware,
  validation(UsersValidator.indexUserFollowersSchema),
  UsersController.indexFollowers,
);
router.get(
  '/following/:id([0-9]+)',
  authMiddleware,
  validation(UsersValidator.indexUserFollowingSchema),
  UsersController.indexFollowing,
);

//* misc
router.post(
  '/bug-report/:id([0-9]+)',
  authMiddleware,
  UsersController.createUserBugReport,
);

export default router;
