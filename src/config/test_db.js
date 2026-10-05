import pool from "./db.js";

async function testConnection() {
    try {
        const res = await pool.query("SELECT NOW() AS now");
        console.log("Database connected! Server time:", res.rows[0].now);

        try {
            const routesRes = await pool.query("SELECT * FROM routes");
            console.log(`Found ${routesRes.rows.length} sample routes in cloud database.`);
        } catch (tableError) {
            console.warn(`Connected, but routes query failed: ${tableError.message}`);
        }

        process.exit(0);
    } catch (error) {
        console.error("Connection test failed:", error.message);
        if (error.code) console.error("Code:", error.code);
        if (error.detail) console.error("Detail:", error.detail);
        if (error.hint) console.error("Hint:", error.hint);
        process.exit(1);
    }
}
testConnection();