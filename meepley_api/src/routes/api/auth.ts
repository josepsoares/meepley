import { Router } from 'express';
import AuthController from '../../authentication/auth.controller';

const router = Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/sigin/facebook', AuthController.signInWithFacebook);
router.post('/sigin/google', AuthController.signInWithGoogle);
router.post('/change-password/:id([0-9]+)', AuthController.changePassword);
router.post('/verify-email', AuthController.verifyEmail);

export default router;
