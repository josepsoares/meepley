import { body, oneOf, param, query } from 'express-validator';
import {
  valDoesntExist,
  valNotBoolean,
  valNotNumeric,
  valNotString,
} from '../../utils/constants/validationMessages';

const PlacesValidator = {
  createPlaceSchema: [
    body('name')
      .exists()
      .withMessage(valDoesntExist('name'))
      .isString()
      .withMessage(valNotString('name'))
      .isLength({ min: 6, max: 100 }),
    body('address')
      .exists()
      .withMessage(valDoesntExist('address'))
      .isString()
      .withMessage(valNotString('address')),
    body('latitude')
      .exists()
      .withMessage(valDoesntExist('latitude'))
      .isString()
      .withMessage(valNotString('latitude')),
    body('longitude')
      .exists()
      .withMessage(valDoesntExist('longitude'))
      .isString()
      .withMessage(valNotString('longitude')),
    body('minimum_consumption')
      .isNumeric()
      .withMessage(valNotNumeric('minimum_consumption'))
      .optional(),
    body('image')
      .exists()
      .withMessage(valDoesntExist('image'))
      .isString()
      .withMessage(valNotString('image')),
    body('sells_boardgames')
      .isBoolean()
      .withMessage(valNotBoolean('sells_boardgames'))
      .optional(),
    body('city')
      .exists()
      .withMessage(valDoesntExist('city'))
      .isString()
      .withMessage(valNotString('city')),
    body('open_days')
      .exists()
      .withMessage(valDoesntExist('open_days'))
      .isString()
      .withMessage(valNotString('open_days')),
    body('place_types')
      .exists()
      .withMessage(valDoesntExist('place_type'))
      .isNumeric()
      .withMessage(valNotNumeric('place_types')),
  ],
  indexPlacesSchema: [
    query('skip').optional(),
    query('items').optional(),
    query('all').optional(),
    query('minimum_consumption').optional(),
    query('sells_boardgames').optional(),
    query('name').optional(),
    query('city').optional(),
    query('type').optional(),
    query('open_days').optional(),
  ],
  getPlaceSchema: [
    param('id')
      .exists()
      .withMessage('A param with the place id is required')
      .isNumeric()
      .withMessage('Param must be a number'),
  ],
  updatePlaceSchema: [
    param('id')
      .exists()
      .withMessage('A param with the place id is required')
      .isNumeric()
      .withMessage('Param must be a number'),
    oneOf(
      [
        body('name')
          .isString()
          .withMessage(valNotString('name'))
          .isLength({ min: 6, max: 100 })
          .optional(),
        body('address')
          .isString()
          .withMessage(valNotString('address'))
          .optional(),
        body('latitude')
          .isString()
          .withMessage(valNotString('latitude'))
          .optional(),
        body('longitude')
          .isString()
          .withMessage(valNotString('longitude'))
          .optional(),
        body('minimum_consumption')
          .isNumeric()
          .withMessage(valNotNumeric('minimum_consumption'))
          .optional(),
        body('image').isString().withMessage(valNotString('image')).optional(),
        body('sells_boardgames')
          .isBoolean()
          .withMessage(valNotBoolean('sells_boardgames'))
          .optional(),
        body('city').isString().withMessage(valNotString('city')).optional(),
        body('open_days')
          .isString()
          .withMessage(valNotString('open_days'))
          .optional(),
        body('place_types')
          .isNumeric()
          .withMessage(valNotNumeric('place_types'))
          .optional(),
      ],
      'Need at least one valid key in the body to update the place',
    ),
  ],
  deletePlaceSchema: [
    param('id')
      .exists()
      .withMessage('A param with the place id is required')
      .isNumeric()
      .withMessage('Param must be a number'),
  ],
};

export default PlacesValidator;
