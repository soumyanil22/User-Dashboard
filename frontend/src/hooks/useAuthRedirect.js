import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const useAuthRedirect = () => {
    const navigate = useNavigate();
    const initializeToken = useAuthStore((state) => state.initializeToken);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        initializeToken(storedToken);

        if (!storedToken) {
            navigate('/login', { replace: true });
        } else {
            navigate('/dashboard', { replace: true });
        }
    }, [navigate, initializeToken]);
};

export default useAuthRedirect;