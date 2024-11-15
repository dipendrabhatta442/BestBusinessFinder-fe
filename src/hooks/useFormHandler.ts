import { FieldValues, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ZodType } from 'zod';

function useFormHandler<T extends FieldValues>(schema: ZodType<T>) {
    return useForm<T>({
        resolver: zodResolver(schema),
        mode: 'onBlur',
    });
}

export default useFormHandler;