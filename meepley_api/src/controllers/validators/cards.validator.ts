import { body, oneOf, param, query } from 'express-validator';
import {
  valDoesntExist,
  valNotArray,
  valNotNumeric,
  valNotString,
} from '../../utils/constants/validationMessages';

const CardsValidator = {
  createCardSchema: [
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
    body('description')
      .exists()
      .withMessage(valDoesntExist('description'))
      .isString()
      .withMessage(valNotString('description'))
      .isLength({ min: 20, max: 1000 }),
    body('card_rarity_id')
      .exists()
      .withMessage(valDoesntExist('card_rarity_id'))
      .isNumeric()
      .withMessage(valNotNumeric('card_rarity_id')),
    body('card_attributes')
      .exists()
      .withMessage(valDoesntExist('card_attributes'))
      .isArray()
      .withMessage(valNotArray('card_attributes')),
  ],
  indexCardsSchema: [
    query('skip').optional(),
    query('items').optional(),
    query('all').optional(),
    query('name').optional(),
    query('rarity').optional(),
    query('attributes').optional(),
  ],
  getCardSchema: [
    param('id')
      .exists()
      .withMessage('A param with the card id is required')
      .isNumeric()
      .withMessage('Param must be a number'),
  ],
  updateCardSchema: [
    param('id')
      .exists()
      .withMessage('A param with the card id is required')
      .isNumeric()
      .withMessage('Param must be a number'),
    oneOf(
      [
        body('name')
          .isString()
          .withMessage(valNotString('name'))
          .isLength({ min: 6, max: 100 })
          .optional(),
        body('image').isString().withMessage(valNotString('image')).optional(),
        body('description')
          .isString()
          .withMessage(valNotString('description'))
          .optional(),
        body('card_rarity_id')
          .isNumeric()
          .withMessage(valNotNumeric('card_rarity_id'))
          .optional(),
        body('card_attributes')
          .isArray()
          .withMessage(valNotArray('card_attributes'))
          .optional(),
      ],
      'Need at least one valid key in the body to update the card',
    ),
  ],
  deleteCardSchema: [
    param('id')
      .exists()
      .withMessage('A param with the card id is required')
      .isNumeric()
      .withMessage('Param must be a number'),
  ],
};

export default CardsValidator;
