import * as commuterModel from '../models/commuter.models.js';
import password from '../utils/password.js';
const getCommuters = async(req,res) => {
    try {
    const commuters = await commuterModel.getCommuters();
    if(!commuters) return res.status(404).json({message:"No commuters"});
    res.status(200).json(commuters);
    } catch (err) {
        console.log("Error fetching commuters: ",err.message);
        
        res.status(500).json({message:"Internal Server Error"});
    }
};
const getCommuterByEmail = async(req,res) => {
    const email = req.params.email;
    try {
    const commuter = await commuterModel.getCommuterByEmail(email);
    if(!commuter || commuter.length===0) {
        return res.status(404).json({message:`Commuter with email ${email} Not found`});
    }
    res.status(200).json(commuter);
    } catch (err) {
        console.log("Error fetching commuter: ", err.message);
        res.status(500).json({message:"Internal Server Error"});
    }
};

const registerCommuter = async(req,res) => {
    const{email,first_name,second_name,phone_number,password} = req.body;
    if(!email || !first_name || !second_name || !phone_number || !password)
        return res.status(400).json({message:"All fields are required"});
    try {
    req.body.password = password.hashPassword(req.body.password);
    const commuter = await commuterModel.createCommuter(req.body);
    res.status(201).json({message:'Registration successful',commuter});
    } catch (err) {
        console.log("An error occured during registration: ", err.message);
        res.status(500).json({message:"Internal Server Error"});
    }
};
const loginCommuter = async(req,res) => {
    const email = req.body.email;
    const commuter = await commuterModel.getCommuterByEmail(email);    
    if(!commuter || commuter.length===0) return res.status(404).json({message:"Commuter not found"});
    if(!password.verifyPassword(req.body.password, commuter[0].password))
        return res.status(401).json({message:"Invalid password"});
    req.session.email = commuter[0].email;
    await commuterModel.updateCommuter(email);
    res.status(200).json({Login:true,email:req.session.email});
};


export {
    getCommuters,
    getCommuterByEmail,
    registerCommuter,
    loginCommuter,
};