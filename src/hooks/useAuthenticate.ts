import { useState, useEffect } from 'react';
import { isJWTValid } from '../utils/api';
import { tokenKey } from '@/utils/constant';

const useAuthenticate = () => {
    const [authenticate, setAuthenticate] = useState(false)
    useEffect(() => {
        if (localStorage) {
            const token = localStorage.getItem(tokenKey);
            if (token) {
                const isValid = isJWTValid(token);
                if (isValid) {
                    setAuthenticate(true)
                }
            } else {
                localStorage.removeItem(tokenKey)
            }
        }
    }, [localStorage]);

    return { authenticate, setAuthenticate };
};

export default useAuthenticate;
