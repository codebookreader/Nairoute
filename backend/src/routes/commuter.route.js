import {Router} from 'express';
import { getCommuters, registerCommuter, getCommuterByEmail, loginCommuter } from '../controllers/commuter.controller.js';
const router = Router();
router.route('/').get(getCommuters);
router.route('/register').post(registerCommuter);
router.route('/login').post(loginCommuter);
router.route('/:email').get(getCommuterByEmail);
export default router;
