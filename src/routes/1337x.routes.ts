import express from 'express';
import { get1337xDocs, search1337x, get1337xDetails } from '../controllers/1337x.controller';

const router = express.Router();

// Documentation
router.get('/', get1337xDocs);

// Search
router.get('/search', search1337x);

// Details
router.get('/details', get1337xDetails);

export default router;