import {React,useState} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';

const CompleteDriverProfile = ()=>{
    const navigate = useNavigate();
    const [licenseNumber,setLicenseNumber] = useState("");
    const [errMsg,setErrMessage] = useState("");
    const [loading,setIsLoading] = useState(false);

    const handleSubmit = async (e)=>{
        e.preventDefault();
        setErrMessage("");
        if(!licenseNumber.trim()){
            setErrMessage("Driver License number is mandatory. ");
            return;
        }
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            if(!token){
                navigate('/login');
                return;
            }
            await axios.post(
                "api/auth/sync",
                {role:'driver',license_number:licenseNumber.trim()},
                {headers:{Authorization:`Bearer ${token}`}}
            );
            localStorage.setItem('licenseNumber',licenseNumber.trim());
            navigate('/driverdashboard');
        } catch (error) {
            console.error("Error saving license: ",error.message);
            setErrMessage(err.response?.data?.message || 'Failed to update license number. Please try again.'); 
        }
        finally{
            setIsLoading(false);
        }
    };
    return(
        <>
        <Navbar/>
        <div className='container d-flex justify-content-center align-items-center' style = {{minHeight:'80vh'}}>
            <div className='card shadow-sm p-4'>
                <h3 className='text-center mb-3'>Driver Onboarding</h3>
                <p className='text-muted text-center' style={{fontSize:'0.9rem'}}>To activate your account,plase provide your official driver's license number</p>
                {errMsg && <div className='alert aler-danger py-2'>{errMsg}</div>}
                <form onSubmit={handleSubmit}>
                    <div className='mb-3'>
                        <label className='form-label fw-bold'>Driver License Number<span>*</span></label>
                        <input
                        type='text'
                        className='form-control'
                        placeholder='DL-12345678'
                        value={licenseNumber}
                        onChange={(e)=>setLicenseNumber(e.target.value)}
                        autoFocus/>
                    </div>
                    <button type = "submit" className='btn btn-warning w-100 fw-bold'>{loading ? `Verifying...` : 'Complete registration'}</button>
                </form>
            </div>
        </div>
        </>
    );
};
export default CompleteDriverProfile