import axios from "axios";
import { useNavigate } from "react-router-dom";
const navigate = useNavigate()

export const Auth = () => {
    const token = localStorage.getItem('token');
    if (token) {
        axios.post('http://localhost:5000/api/check/verifyAccess', {}, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then((res) => {
            return true
        }).catch((err) => {
            localStorage.removeItem('token');
            console.log(err);
            navigate('/login');
        });

    } else {
        navigate('/login');
    }
}