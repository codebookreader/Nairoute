import pool from "../config/database.js";

export const syncUser = async(req,res)=>{
    const email = req.user.email;    
    const{role,license_number} = req.body;
        
    try {
        if(role === "driver"){
            const checkDriver = await pool.query("SELECT * FROM driver WHERE email = $1",[email]);
            if(checkDriver.rowCount === 0){
                const license = license_number ? license_number.trim() : null;
                const insertQuery = "INSERT INTO driver (email, license_number, application_status, status)VALUES ($1, $2, 'Pending', 'Active')RETURNING email, license_number, first_name, second_name, phone_number";
                const newDriver = await pool.query(insertQuery,[email,license]);
                return res.status(201).json({
                    message:"Driver synchronized successfully",
                    user:newDriver.rows[0],
                    isLicenseProvided:Boolean(license),
                    isProfileComplete:Boolean(newDriver.rows[0].first_name && newDriver.rows[0].phone_number)
                })
            }
            else{
                const driver = checkDriver.rows[0];
                if(!driver.license_number && license_number){
                    const updateRes = await pool.query("UPDATE driver SET license_number = $1 WHERE email = $2 RETURNNING *",[license_number.trim(),email]);
                    return res.status(200).json({
                        message:"Driver license updated",
                        user:updateRes.rows[0],
                        isLicenseProvided:true,
                        isProfileComplete:Boolean(updateRes.rows[0].first_name && updateRes.rows[0].phone_number)
                    })
                }
                return res.status(200).json({
                    message:"Driver found",
                    user:driver,
                    isLicenseProvided:Boolean(driver.license_number),
                    isProfileComplete:Boolean(driver.first_name && driver.phone_number)
                })
            }
        }
        else{
            const checkCommuter  = await pool.query("SELECT * FROM commuter WHERE email = $1",[email]);
            
            if(checkCommuter.rowCount === 0){
                const insertQuery = "INSERT INTO commuter (email,application_status,status) VALUES ($1 ,'pending','Active') RETURNING email,first_name,second_name,phone_number";
                const newCommuter = await pool.query(insertQuery,[email]);
                return res.status(201).json({
                    message:"Commuter synchronized successfully",
                    user:newCommuter.rows[0],
                    isProfileComplete:false
                });
            }
            else{
                const commuter = checkCommuter.rows[0];
                return res.status(200).json({
                    message:"Commuter found",
                    user:commuter,
                    isProfileComplete:Boolean(commuter.first_name && commuter.phone_number)
                });
            }
        }
    } catch (error) {
        console.error("Error in syncUser: ",error.message);
        res.status(500).json({message:"Internal Server Error"});
        
    }
};

export const updateProfile = async(req,res)=>{
    const email = req.user.email;
    const {role,first_name,second_name,phone_number,license_number} = req.body;

    try {
        if(role === "driver"){
            const sql = "UPDATE driver SET first_name = COALESCE($1,first_name),second_name= COALESCE($2,second_name),phone_number = COALESCE($3,phone_number),license_number = COALESCE($4,license_number) WHERE email = $5 RETURNING email, first_name, second_name, phone_number, license_number, application_status, status";
            const result =  await pool.query(sql,[first_name || null,second_name || null,phone_number || null,license_number || null,email]);

            if(result.rowCount === 0) return res.status(404).json({message:"Driver not found"});
            return res.status(200).json({message:"Profile updated",user:result.rows[0]});
        }
        else{
            const sql = "UPDATE commuter SET first_name = COALESCE($1,first_name),second_name = COALESCE($2,second_name),phone_number = COALESCE($3,phone_number) WHERE email = $4 RETURNING email,first_name second_name,phone_number";
            const result = await pool.query(sql,[first_name,second_name,phone_number,email]);
            if(result.rowCount === 0) return res.status(404).json({message:"Commuter not found"});
            return res.status(200).json({message:"Profile updated",user:result.rows[0]});
        }
    } catch (error) {
        console.error("Error updating profile: ",error.message);
        res.status(500).json({message:"Internal Server Error"});
        
    }
};