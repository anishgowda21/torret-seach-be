import express from 'express';
import { getYtsDocs, searchYts } from '../controllers/yts.controller';

const router = express.Router();

// Documentation
router.get('/', getYtsDocs);

// Search
router.get('/search', searchYts);

export default router;