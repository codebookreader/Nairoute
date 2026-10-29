import {Router} from 'express';
import { getCommuters, registerCommuter, getCommuterByEmail } from '../controllers/commuter.controller.js';
const router = Router();
router.route('/').get(getCommuters);
router.route('/register').post(registerCommuter);
router.route('/:email').get(getCommuterByEmail);
export default router;
