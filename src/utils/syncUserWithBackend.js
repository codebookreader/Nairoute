import axios from "axios";

export const syncUserWithBackend = async (idToken,role,licenseNumber = "")=>{
    const response =  await axios.post("api/auth/sync",
        {role,license_number:licenseNumber},
    {headers:{Authorization:`Bearer ${idToken}`}});
    return response.data
}