import * as express from 'express';
import { handleDemoTrigger } from '@controllers/demo.controller';

const router = express.Router();

router.post('/demo/trigger', (req, res) => {
  handleDemoTrigger();
  return res.status(200).json({ status: 'Demo trigger received' });
});

export default router;
