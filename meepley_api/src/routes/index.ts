import { Router } from 'express';
import apiRoutes from './api/_apiRoutes';
import notFound from './pages/notFound';
import root from './pages/root';
// import swagger from './pages/swagger';

const router = Router();

router.use('/api', apiRoutes);
// router.use(swagger);
router.use(root);
router.use(notFound);

export default router;
