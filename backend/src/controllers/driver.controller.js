
import * as driverModel from '../models/driver.models.js';
import { hashPassword, verifyPassword } from '../utils/password.js';
const getDrivers = async (req,res)=>{
    try {
        const drivers = await driverModel.getDrivers();
        if(!drivers || drivers.length === 0){
            return res.status(404).json({ error: "No drivers found" });
        }
        res.status(200).json(drivers);
    } catch (error) {
        console.error("Error getting drivers", error.message);
        
        res.status(500).json({ message: "Internal Server Error" });
    }
}
const getDriverByEmail = async (req,res)=>{
    const email = req.params.email;
    try {
        const driver = await driverModel.getDriverByEmail(email);
        if(!driver || driver.length === 0){
            return res.status(404).json({ error: "Driver not found" });
        }
        res.status(200).json(driver);
    } catch (error) {
        console.error("Error getting driver by email", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
const registerDriver = async (req,res)=>{
    const {first_name,second_name,email,phone_number,license_number,password} = req.body;
    if(!first_name || !second_name || !email || !phone_number || !license_number || !password){
        return res.status(400).json({ error: "All fields are required" });
    }
    try {
        req.body.password = hashPassword(password);
        const driver = await driverModel.createDriver(first_name, second_name, email, phone_number, license_number, req.body.password);
        res.status(201).json({message: "Driver created successfully", driver});
    } catch (error) {
        console.error('Error registering driver:', error.message);
        res.status(500).json({message:"Internal Server Error"});
    }
}
const loginDriver = async (req,res)=>{
    const {email,password} = req.body;
    if(!email || !password){
        return res.status(400).json({ error: "Email and password are required" });
    }
    try {
        const driver = await driverModel.getDriverByEmail(email);
        if(!driver || driver.length === 0){
            return res.status(404).json({ error: "Driver not found" });
        }
        if(!passwordUtil.verifyPassword(password, driver[0].password)){
            return res.status(401).json({ error: "Invalid password" });
        }
        req.session.email = driver[0].email;
        await driverModel.updateDriver(email);
        res.status(200).json({ Login: true, message: "Login successful", driver: driver[0] });
    } catch (error) {
        console.error("Error logging in driver", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export  {
    getDrivers,
    getDriverByEmail,
    registerDriver,
    loginDriver
};