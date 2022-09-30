import { param, query } from 'express-validator';

const BoardgamesValidator = {
  indexBoardgamesSchema: [
    query('skip').optional(),
    query('items').optional(),
    query('name').optional(),
    query('min_players').optional(),
    query('max_players').optional(),
    query('min_age').optional(),
    query('year_released').optional(),
  ],
  indexRecommendedBoardgamesSchema: [
    param('id')
      .exists()
      .withMessage('A param with the boardgame id is required')
      .isNumeric()
      .withMessage('Param must be a number'),
    ,
    query('skip').optional(),
    query('items').optional(),
  ],
  indexDivergentBoardgamesSchema: [
    param('id')
      .exists()
      .withMessage('A param with the boardgame id is required')
      .isNumeric()
      .withMessage('Param must be a number'),
    query('skip').optional(),
    query('items').optional(),
  ],
  getBoardgameSchema: [
    param('id')
      .exists()
      .withMessage('A param with the boardgame id is required')
      .isNumeric()
      .withMessage('Param must be a number'),
  ],
};

export default BoardgamesValidator;
