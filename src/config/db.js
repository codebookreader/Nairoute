import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

if(!process.env.DATABASE_URL){
    console.error(`DATABASE_URL env is missing`);
}
const pool = new Pool({
    connectionString:process.env.DATABASE_URL,
    ssl:{
        rejectUnauthorized:false
    }
});
pool.on('connect',()=>{
    console.log(`Connected to Cloud PostgreSQL database`);   
})
pool.on('error',(err)=>{
    console.error(`PostgreSQL connection error: ${err}`);  
});
export default pool;