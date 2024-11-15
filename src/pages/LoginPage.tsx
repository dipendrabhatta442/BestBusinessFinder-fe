import React from 'react';
import useFormHandler from '../hooks/useFormHandler';
import { loginSchema, LoginSchemaType } from '../utils/validationSchemas';
import API from '../utils/api';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button, Card, CardContent, CardHeader, CardTitle, Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, Input } from '@/components/ui';

import { tokenKey } from '@/utils/constant';
import { useNavigate } from 'react-router-dom';
import useAuthenticate from '@/hooks/useAuthenticate';
import AuthPageLayout from '@/components/Layouts/AuthPageLayout';
import { toast } from 'sonner';

const LoginPage: React.FC = () => {
    const form = useFormHandler<LoginSchemaType>(loginSchema);
    const navigate = useNavigate()
    const { setAuthenticate } = useAuthenticate()

    const onSubmit = async (data: LoginSchemaType) => {
        try {
            const response = await API.post('/auth/login', data);
            localStorage.setItem(tokenKey, response.data.token); // Store JWT token in localStorage
            setAuthenticate(true);
            toast.success('Login successful!');
            navigate('/'); // Redirect to the home page or dashboard after login
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    return (
        <AuthPageLayout>
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-center">Create new account</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                            <div className="space-y-2">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter your business email" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                            </div>

                            <div className="space-y-2">
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter your business acount password" {...field} type='password' />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                            </div>

                            <Button type="submit">Login</Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </AuthPageLayout>
    );
};

export default LoginPage;
