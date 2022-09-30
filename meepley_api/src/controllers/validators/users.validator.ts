import { body, oneOf, param, query } from 'express-validator';

const UsersValidator = {
  indexUsersSchema: [
    query('skip').optional(),
    query('items').optional(),
    query('name').optional(),
  ],
  getUserSchema: [
    param('id')
      .exists()
      .withMessage('A param with the user id is required')
      .isNumeric()
      .withMessage('Param must be a number'),
  ],
  updateUserSchema: [
    param('id')
      .exists()
      .withMessage('A param with the user id is required')
      .isNumeric()
      .withMessage('Param must be a number'),
    oneOf([], 'Need at least one valid key in the body to update the user'),
  ],
  deleteUserSchema: [
    param('id')
      .exists()
      .withMessage('A param with the user id is required')
      .isNumeric()
      .withMessage('Param must be a number'),
  ],
  calibrateUserSchema: [
    param('id')
      .exists()
      .withMessage('A param with the user id is required')
      .isNumeric()
      .withMessage('Param must be a number'),
    body('categories').exists().withMessage('').isArray().withMessage(''),
    body('favorite_place_types')
      .exists()
      .withMessage('')
      .isArray()
      .withMessage(''),
    body('boardgame_skill').exists().withMessage('').isString().withMessage(''),
    body('favorite_days').exists().withMessage('').isArray().withMessage(''),
  ],
  updateCalibrationSchema: [
    param('id')
      .exists()
      .withMessage('A param with the user id is required')
      .isNumeric()
      .withMessage('Param must be a number'),
    oneOf(
      [
        body('categories').isArray().optional(),
        body('favorite_place_types').isArray().optional(),
        body('boardgame_skill').isString().optional(),
        body('favorite_days').isArray().optional(),
      ],
      '',
    ),
  ],
  followUserSchema: [query('user_id'), query('target_user_id')],
  unfollowUserSchema: [query('user_id'), query('target_user_id')],
  indexUserFollowersSchema: [
    param('id')
      .exists()
      .withMessage('A param with the user id is required')
      .isNumeric()
      .withMessage('Param must be a number'),
  ],
  indexUserFollowingSchema: [
    param('id')
      .exists()
      .withMessage('A param with the user id is required')
      .isNumeric()
      .withMessage('Param must be a number'),
  ],
};

export default UsersValidator;
