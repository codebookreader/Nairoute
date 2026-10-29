import pool from '../config/database.js';

export const getCommuters = async() => {
    const res = await pool.query("SELECT * FROM commuter");
    return res.rows.map(r => r.email);
};

export const getCommuterByEmail = async(email) => {
    const sql = "SELECT * FROM commuter WHERE email=$1";
    const res = await pool.query(sql,[email]);
    return res.rows;
};

export const createCommuter = async({email,first_name,second_name,phone_number,password}) => {
    const sql = "INSERT INTO commuter (email,first_name,second_name,phone_number,password) VALUES($1,$2,$3,$4,$5) RETURNING *";
    const res = await pool.query(sql,[email,first_name,second_name,phone_number,password]);
    return res.rows[0];
};