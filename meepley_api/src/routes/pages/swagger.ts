import swaggerUi from 'swagger-ui-express';
import { Router } from 'express';

import swaggerConfig from '../../config/swagger';

const router = Router();

const swagger = router.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerConfig, { explorer: true }),
);
export default swagger;
