import * as z from 'zod';

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

export const registerSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    confirmPassword: z.string().optional(),
    category: z.string().optional(),
    location: z.string().optional(),
    description: z.string().optional(),
});
export const offeringSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    price: z.number().min(0, "Price must be a positive number"),
    image: z
        .instanceof(File)
        .optional()
        .refine((file) => file?.size && file.size <= 5 * 1024 * 1024, {
            message: "Image must be less than 5MB",
        }),
});
export type RegisterSchemaType = z.infer<typeof registerSchema>
export type LoginSchemaType = z.infer<typeof loginSchema>
export type offeringSchemaType = z.infer<typeof offeringSchema>