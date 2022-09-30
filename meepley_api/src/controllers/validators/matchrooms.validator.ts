import { body, oneOf, param, query } from 'express-validator';
import {
  valDoesntExist,
  valNotArray,
  valNotBoolean,
  valNotNumeric,
  valNotString,
} from '../../utils/constants/validationMessages';

const MatchroomValidator = {
  createMatchroomSchema: [
    body('name')
      .exists()
      .withMessage(valDoesntExist('name'))
      .isString()
      .withMessage(valNotString('name'))
      .isLength({ min: 6, max: 100 }),
    body('image')
      .exists()
      .withMessage(valDoesntExist('image'))
      .isString()
      .withMessage(valNotString('image')),
    body('private')
      .exists()
      .withMessage(valDoesntExist('private'))
      .isBoolean()
      .withMessage(valNotBoolean('private')),
    body('min_players')
      .exists()
      .withMessage(valDoesntExist('min_players'))
      .isNumeric()
      .withMessage(valNotNumeric('min_players')),
    body('max_players')
      .exists()
      .withMessage(valDoesntExist('max_players'))
      .isNumeric()
      .withMessage(valNotNumeric('max_players')),
    body('estimated_duration')
      .exists()
      .withMessage(valDoesntExist('estimated_duration'))
      .isString()
      .withMessage(valNotString('estimated_duration')),
    body('scheduled_date')
      .exists()
      .withMessage(valDoesntExist('scheduled_date')),
    body('scheduled_hour')
      .exists()
      .withMessage(valDoesntExist('scheduled_hour'))
      .isString()
      .withMessage(valNotString('scheduled_hour')),
    body('user')
      .exists()
      .withMessage(valDoesntExist('user'))
      .isNumeric()
      .withMessage(valNotNumeric('user')),
    body('boardgames')
      .exists()
      .withMessage(valDoesntExist('boardgames'))
      .isArray()
      .withMessage(valNotArray('boardgames')),
    body('place')
      .exists()
      .withMessage(valDoesntExist('place'))
      .isNumeric()
      .withMessage(valNotNumeric('place')),
  ],
  indexMatchroomsSchema: [
    query('skip').optional(),
    query('items').optional(),
    query('all').optional(),
    query('private').optional(),
    query('min_players').optional(),
    query('max_players').optional(),
    query('scheduled_day').optional(),
    query('estimated_duration').optional(),
    query('boardgame').optional(),
    query('place_id').optional(),
  ],
  getMatchroomSchema: [
    param('id')
      .exists()
      .withMessage('A param with the matchroom id is required')
      .isNumeric()
      .withMessage('Param must be a number'),
  ],
  updateMatchroomSchema: [
    param('id')
      .exists()
      .withMessage('A param with the matchroom id is required')
      .isNumeric()
      .withMessage('Param must be a number'),
    oneOf(
      [
        body('private')
          .isBoolean()
          .withMessage(valNotBoolean('private'))
          .optional(),
        body('scheduled_date')
          .isNumeric()
          .withMessage(valNotNumeric('scheduled_date'))
          .optional(),
        body('scheduled_hour')
          .isNumeric()
          .withMessage(valNotNumeric('scheduled_hour'))
          .optional(),
        body('scheduled_day')
          .isNumeric()
          .withMessage(valNotNumeric('scheduled_day'))
          .optional(),
        body('users').isArray().withMessage(valNotArray('users')).optional(),
        body('boardgames')
          .isArray()
          .withMessage(valNotArray('boardgames'))
          .optional(),
      ],
      'Need at least one valid key in the body to update the matchroom',
    ),
  ],
  deleteMatchroomSchema: [
    param('id')
      .exists()
      .withMessage('A param with the matchroom id is required')
      .isNumeric()
      .withMessage('Param must be a number'),
  ],
};

export default MatchroomValidator;
