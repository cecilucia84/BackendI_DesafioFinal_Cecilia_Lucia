import { Router } from 'express';
import Controller from '../controller/cartView.controller.js';

const router = Router();


router.get('/:cid', (req, res) => new Controller().getCartById(req, res));

export default router; 
