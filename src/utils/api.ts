import axios from 'axios';
import CryptoJS from "crypto-js";
import { appSecretKey, appApiUrl, tokenKey } from '@/utils/constant';

const API = axios.create({
    baseURL: appApiUrl,
    headers: {
        'Content-Type': 'application/json',
    },
});
API.interceptors.request.use((request: any) => {
    const token = localStorage.getItem(tokenKey as string);
    if (token === 'undefined' || token === 'null' || token === '{}' || !token) localStorage.removeItem(tokenKey)
    const timestamp = Math.round(Date.now() / 1000);
    const _crypto = CryptoJS.HmacSHA512('', `${appSecretKey}${timestamp}`);
    const signature = CryptoJS.enc.Hex.stringify(_crypto);

    const temp_headers = {
        ...request.headers,
        'x-api-key': `Signature=${signature},Timestamp=${timestamp}`,
    }

    if (token) {
        const isValid = isJWTValid(token);
        if (!isValid) {
            localStorage.removeItem(import.meta.env.TOKEN_KEY as string);
            if (request.url.includes('login')) return request;
            // Token has expired, handle it accordingly (e.g., refresh token, redirect to login)
            // You can also throw an error here to prevent the request from being sent
            throw new Error('Token has expired');
        }
        temp_headers.Authorization = `Bearer ${token}`
    }
    request.headers = { ...temp_headers }
    return request;
}, (error) => { return Promise.reject(error.message) });

API.interceptors.response.use(
    (response) => {
        console.info({ response })
        return response;
    },
    (error) => {
        console.error({ error })
        const customError = {
            ...error,
            message: error.response?.data?.message,
            statusCode: error.response?.status,
        };

        return Promise.reject(customError);
    }
);
export default API;
export const decodeJWT = (token: string) => {

    const base64Url = token?.split('.')[1]; // Extract the payload part of the token
    const base64 = base64Url?.replace(/-/g, '+').replace(/_/g, '/'); // Replace URL-safe characters
    const payload = JSON.parse(window.atob(base64)); // Decode the base64 payload and parse it as JSON
    return payload;
}
export const isJWTValid = (token: string | null): boolean => {

    if (!token || token === 'undefined') return false
    const decodedJWT = decodeJWT(token);
    const expirationTime = decodedJWT.exp * 1000; // Convert to milliseconds
    const currentTime = Date.now();
    return currentTime < expirationTime
}