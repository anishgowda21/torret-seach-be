import express from 'express';
import { getHealth } from '../controllers/health.controller';

const router = express.Router();

// Health check endpoint
router.get('/', getHealth);

export default router;