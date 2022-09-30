import { Router } from 'express';

const router = Router();

const root = router.get('/', (_, res) => {
  res.status(200).header('Content-Type', 'text/html').send(`
    <div>
    <h4>MeePley Restful API 🎲</h4>
    </div>`);
});

export default root;
