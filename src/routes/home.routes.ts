import express from 'express';
import { getHome, clearCache } from '../controllers/home.controller';

const router = express.Router();

// Home page with documentation
router.get('/', getHome);

// Cache clearing endpoint
router.get('/clear-cache', clearCache);

export default router;