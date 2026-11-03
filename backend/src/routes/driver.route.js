import {Router} from 'express';
import { getDrivers, getDriverByEmail, registerDriver, loginDriver } from '../controllers/driver.controller.js';

const router = Router();

router.route('/').get(getDrivers);
router.route('/:email').get(getDriverByEmail);
router.route('/register').post(registerDriver);
router.route('/login').post(loginDriver);

export default router;