import express from 'express';
import pool from './config/database.js';
import app from './app.js';

const port = process.env.PORT;
const startServer = async() => {
    try{
        const con = await pool.query("SELECT 1");
        console.log("Database connected");

        app.listen(port,() => console.log(`Server running on port ${port}`))

    } catch(err){
        console.error("DB connection failed", err.message);
        process.exit(1);
    }
}
startServer();