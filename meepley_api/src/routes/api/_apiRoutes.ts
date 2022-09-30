import { Router } from 'express';

import achievements from './achivements';
import auth from './auth';
import boardgames from './boardgames';
import users from './users';
import cards from './cards';
import places from './places';
import matchrooms from './matchrooms';

const apiRoutes = Router();

apiRoutes.use('/auth', auth);
apiRoutes.use('/users', users);
apiRoutes.use('/achievements', achievements);
apiRoutes.use('/cards', cards);
apiRoutes.use('/places', places);
apiRoutes.use('/matchrooms', matchrooms);
apiRoutes.use('/bgs', boardgames);

export default apiRoutes;
