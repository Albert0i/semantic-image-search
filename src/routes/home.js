// home.js
import { Router } from 'express';

const router = Router();

// GET home page
router.get('/', (req, res) => {
  res.render('home', { results: null });
});

export default router;