import { useState, useEffect } from 'react';
import API, { isJWTValid } from '../utils/api';
import { tokenKey } from '@/utils/constant';

const useAuthenticate = () => {
    const [authenticate, setAuthenticate] = useState(false)
    useEffect(() => {
        if (localStorage) {
            const token = localStorage.getItem(tokenKey)
            const isValid = isJWTValid(token);
            if (isValid) {
                setAuthenticate(true)
            }
        }
    }, [localStorage]);

    return { authenticate, setAuthenticate };
};

export default useAuthenticate;
