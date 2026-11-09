import {auth} from "../config/firebaseAdmin.js";

export const verifyFirebaseToken = async(req,res,next)=>{
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({message:"Unauthorized:No token provided"});
    }
    const token = authHeader.split(" ")[1];
    try {
        const decodedToken =  await auth.verifyIdToken(token);
        req.user = decodedToken;
        next();
    } catch (error) {
        console.error("Firebase authentication error: ",error.message);
        return res.status(401).json({message:"Unauthorized:Invalid or expired token"});
        
    }
};
