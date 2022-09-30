import { Router } from 'express';

const router = Router();

const notFound = router.get('*', (_, res) => {
  return res.status(404).json('404 Not Found');
});

export default notFound;
