import pool from '../config/database.js';

const getDrivers = async () => {
    const res = await pool.query("SELECT * FROM driver");
    return res.rows.map(r => r.email);
};

const getDriverByEmail = async (email) => {
    const sql = "SELECT * FROM driver WHERE email=$1";
    const res = await pool.query(sql,[email]);
    return res.rows;
};

const createDriver = async (first_name, second_name, email, phone_number, license_number, password) => {
    const sql = "INSERT INTO driver (first_name, second_name, email, phone_number, license_number, password) VALUES($1,$2,$3,$4,$5,$6) RETURNING *";
    const res = await pool.query(sql,[first_name, second_name, email, phone_number, license_number, password]);
    return res.rows[0];
};

const updateDriver = async (email) => {
    const sql = "UPDATE driver SET last_login = NOW() WHERE email = $1"
    await pool.query(sql,[email]);
    return true;
};
export {
    getDrivers,
    getDriverByEmail,
    createDriver,
    updateDriver
};