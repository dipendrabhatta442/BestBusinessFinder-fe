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
    contactNumber: z.string().optional(),
    description: z.string().optional(),
});
export const offeringSchema = z.object({
    title: z.string().min(2, "Name must be at least 2 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    price: z.string(),

});
export const reviewSchema = z.object({
    name: z.string(),
    review: z.string(),
    rating: z.string()


});
export const replySchema = z.object({
    reply: z.string().min(10, {
        message: "Reply message must be at least 10 characters.",
    }),
})
export type RegisterSchemaType = z.infer<typeof registerSchema>
export type LoginSchemaType = z.infer<typeof loginSchema>
export type OfferingSchemaType = z.infer<typeof offeringSchema>
export type ProfileSchemaType = z.infer<typeof registerSchema>
export type ReviewSchemaType = z.infer<typeof reviewSchema>
export type ReplySchemaType = z.infer<typeof replySchema>
export const profileSchema = registerSchema;