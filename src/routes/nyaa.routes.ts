import express from 'express';
import { getNyaaDocs, searchNyaa } from '../controllers/nyaa.controller';

const router = express.Router();

// Documentation
router.get('/', getNyaaDocs);

// Search
router.get('/search', searchNyaa);

export default router;