import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
/**
 * return single string which is combination of `inputs` params
 * @param {ClassValue[]} inputs - it is the string of class names
 * @returns `string` -
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}