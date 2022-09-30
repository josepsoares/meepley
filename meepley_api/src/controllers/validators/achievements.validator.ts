import { body, oneOf, param, query } from 'express-validator';
import {
  valDoesntExist,
  valNotNumeric,
  valNotString,
} from '../../utils/constants/validationMessages';

const AchivementsValidator = {
  createAchievementSchema: [
    body('name')
      .exists()
      .withMessage(valDoesntExist('name'))
      .isString()
      .withMessage(valNotString('name'))
      .isLength({ min: 6, max: 100 }),
    body('requirement')
      .exists()
      .withMessage(valDoesntExist('requirement'))
      .isString()
      .withMessage(valNotString('requirement')),
    body('achievement_difficulty_id')
      .exists()
      .withMessage(valDoesntExist('achievement_difficulty_id'))
      .isNumeric()
      .withMessage(valNotNumeric('achivement_difficulty_id')),
    body('achivement_type_id')
      .exists()
      .withMessage(valDoesntExist('achievement_type_id'))
      .isNumeric()
      .withMessage(valNotNumeric('achivement_type_id')),
  ],
  indexAchievementsSchema: [
    query('skip').optional(),
    query('items').optional(),
    query('all').optional(),
    query('name').optional(),
    query('difficulty').optional(),
    query('type').optional(),
  ],
  getAchievementSchema: [
    param('id')
      .exists()
      .withMessage('A param with the achievement id is required')
      .isNumeric()
      .withMessage('Param must be a number'),
  ],
  updateAchievementSchema: [
    param('id')
      .exists()
      .withMessage('A param with the achievement id is required')
      .isNumeric()
      .withMessage('Param must be a number'),
    oneOf(
      [
        body('name')
          .isString()
          .withMessage(valNotString('requirement'))
          .isLength({ min: 6, max: 100 })
          .optional(),
        body('requirement')
          .isString()
          .withMessage(valNotString('requirement'))
          .optional(),
        body('achievement_difficulty_id')
          .isNumeric()
          .withMessage(valNotNumeric('achivement_difficulty_id'))
          .optional(),
        body('achivement_type_id')
          .isNumeric()
          .withMessage(valNotNumeric('achivement_type_id'))
          .optional(),
      ],
      'Need at least one valid key in the body to update the achievement',
    ),
  ],
  deleteAchievementSchema: [
    param('id')
      .exists()
      .withMessage('A param with the achievement id is required')
      .isNumeric()
      .withMessage('Param must be a number'),
  ],
};

export default AchivementsValidator;
