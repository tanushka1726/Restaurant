import { Router } from 'express';
import {
    createSession,
    getAllSessions,
    getSessionById,
    updateSessionById,
    deleteSessionById
} from '../controllers/session.controller.js';

const router = Router();

router.post('/', createSession);
router.get('/', getAllSessions);
router.get('/:id', getSessionById);
router.put('/:id', updateSessionById);
router.delete('/:id', deleteSessionById);

export default router;