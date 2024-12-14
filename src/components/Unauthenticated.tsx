import useAuthenticate from '@/hooks/useAuthenticate';
import API from '@/utils/api';
import { tokenKey } from '@/utils/constant';
import React from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from './ui';

function Unauthenticated() {
    const navigate = useNavigate();
    const { authenticate, setAuthenticate } = useAuthenticate()
    const handleLogout = async () => {
        try {
            const response = await API.post('/auth/logout');
            toast.success('Logout successful!');
        } catch (error) {
            toast.success('logout failed:');
            alert("Something went wrong!!");
        } finally {
            localStorage.removeItem(tokenKey); // Store JWT token in localStorage
            setAuthenticate(false);
            navigate('/', { replace: true }); // Redirect to the home page or dashboard after login
        }
    }
    return (
        <div>Token might have expired or you are not authenticate, <Button onClick={handleLogout}>Logout Now</Button></div>
    )
}

export default Unauthenticated