import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [process.env.ALLOWED_ORIGINS_1, process.env.ALLOWED_ORIGINS_2];

app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
}));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 1000 * 60 * 60 * 24,
    },
}));

import commuterRoutes from './routes/commuter.route.js';
app.use('/api/commuters', commuterRoutes);   

app.get("/health", (req, res) => res.send("OK"));

export default app;