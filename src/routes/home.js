// home.js
import { Router } from 'express';

const router = Router();

// GET home page
router.get('/', (req, res) => {
  res.render('home', { results: null });
});

// Image detail page
router.get('/image/:id', (req, res) => {
  const { id } = req.params;
  // Pass only the id into the template
  res.render('image', { id });
});

// GET info page
router.get('/info', (req, res) => {
  res.render('info'); 
});

export default router;