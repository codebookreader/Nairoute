import pool from '../config/database.js';



 const getCommuters = async() => {
    const res = await pool.query("SELECT * FROM commuter");
    return res.rows.map(r => r.email);
};

 const getCommuterByEmail = async(email) => {
    const sql = "SELECT * FROM commuter WHERE email=$1";
    const res = await pool.query(sql,[email]);
    return res.rows;
};

 const createCommuter = async({email,first_name,second_name,phone_number,password}) => {
    const sql = "INSERT INTO commuter (email,first_name,second_name,phone_number,password) VALUES($1,$2,$3,$4,$5) RETURNING *";
    const res = await pool.query(sql,[email,first_name,second_name,phone_number,password]);
    return res.rows[0];
};

 const updateCommuter = async(email) => {
    const sql = "UPDATE commuter SET last_login = NOW() WHERE email = $1"
    await pool.query(sql,[email]);
    return true;
};

export {
    getCommuters,
    getCommuterByEmail,
    createCommuter,
    updateCommuter
};