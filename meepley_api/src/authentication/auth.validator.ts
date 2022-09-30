import { body } from 'express-validator';
import { valDoesntExist } from '../utils/constants/validationMessages';

const AuthValidator = {
  loginSchema: [
    body('email')
      .exists()
      .withMessage(valDoesntExist('email'))
      .isEmail()
      .withMessage('Email is not valid a email')
      .toLowerCase(),
    body('password')
      .exists()
      .withMessage(valDoesntExist('password'))
      .isLength({ min: 6, max: 100 }),
  ],
  loginProviderSchema: {},
  registerSchema: [
    body('email')
      .exists()
      .withMessage(valDoesntExist('email'))
      .isEmail()
      .withMessage('Email is not valid a email')
      .toLowerCase(),
    body('password')
      .exists()
      .withMessage(valDoesntExist('password'))
      .isLength({ min: 6, max: 100 }),
  ],
  changePasswordSchema: {},
  verifyEmailSchema: {},
  refreshTokenSchema: {},
};

export default AuthValidator;
