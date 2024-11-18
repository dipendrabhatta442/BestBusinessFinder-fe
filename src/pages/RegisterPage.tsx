import React, { useState } from 'react';
import useFormHandler from '../hooks/useFormHandler';
import { registerSchema, RegisterSchemaType } from '../utils/validationSchemas';
import API from '../utils/api';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button, Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, Input, Popover, PopoverContent, PopoverTrigger, Textarea } from '@/components/ui';

import AuthPageLayout from '@/components/Layouts/AuthPageLayout';
import { toast } from 'sonner';
import { Navigate, useNavigate } from 'react-router-dom';
import { tokenKey } from '@/utils/constant';
import { cn } from '@/utils/common';
import { Check, ChevronsUpDown } from 'lucide-react';
import useAuthenticate from '@/hooks/useAuthenticate';

const RegisterPage: React.FC = () => {
    const navigate = useNavigate()
    const { authenticate, setAuthenticate } = useAuthenticate()

    const form = useFormHandler<RegisterSchemaType>(registerSchema);
    const [profileImage, setProfileImage] = useState<File | null>(null)
    const onSubmit = async (data: any) => {
        try {
            if (!profileImage) {
                toast.error('Please upload a logo or profile picture');
            }
            if (data.password !== data.confirmPassword) throw new Error("Password and Confirm Password doesnt match!!")
            const form = new FormData();
            form.append('name', data.name)
            form.append('email', data.email)
            form.append('password', data.password)
            form.append('profileImage', profileImage!)
            form.append('location', data.location)
            form.append('description', data.description)
            form.append('category', data.category)
            const response = await API.post('/auth/register', form, {
                headers: {
                    "Content-Type": 'multipart/form-data'
                }
            });
            localStorage.setItem(tokenKey, response?.data?.token as string)
            toast.success('Registered successfully!');
            navigate('/')
        } catch (error: any) {
            toast.error(error?.message)
            console.error('Registration failed:', error?.message);
        }
    };
    const category = [
        { label: 'Entertainment', value: 'entertainment' },
        { label: 'Resturant', value: 'resturant' },
        { label: 'Health & Wellness', value: 'health-wellness' },
        { label: 'Retail Shop', value: 'retail-shop' },
        { label: 'Services', value: 'services' }
    ]
    if (authenticate) return <Navigate to={'/'} replace />

    return (
        <AuthPageLayout>
            <div className="container flex h-full items-center justify-center py-12">
                <div className="w-full max-w-md space-y-6">
                    <div className="space-y-2 text-center">
                        <h1 className="text-2xl font-bold">Create new account</h1>
                    </div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit, console.log)} className="space-y-4" encType="multipart/form-data">
                            <div>
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter your business name" {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                This is your public business name.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                            </div>
                            <div>
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

                            <div>
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
                            <div>
                                <FormField
                                    control={form.control}
                                    name="confirmPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Confirm Password</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter password again" {...field} type='password' />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div>
                                <FormField
                                    control={form.control}
                                    name="category"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Category</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant="outline"
                                                            role="combobox"
                                                            className={cn(
                                                                "w-full justify-between",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            {field.value
                                                                ? category?.find(
                                                                    (catg) => catg.value === field.value
                                                                )?.label
                                                                : "Select Category"}
                                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-[200px] p-0">
                                                    <Command>
                                                        <CommandInput placeholder="Search category..." />
                                                        <CommandList>
                                                            <CommandEmpty>No category found.</CommandEmpty>
                                                            <CommandGroup>
                                                                {category?.map((catg) => (
                                                                    <CommandItem
                                                                        value={catg.label}
                                                                        key={catg.value + "command-item"}
                                                                        onSelect={() => {
                                                                            form.setValue("category", catg.value)
                                                                        }}
                                                                    >
                                                                        {catg.label}
                                                                        <Check
                                                                            className={cn(
                                                                                "ml-auto",
                                                                                catg.value === field.value
                                                                                    ? "opacity-100"
                                                                                    : "opacity-0"
                                                                            )}
                                                                        />
                                                                    </CommandItem>
                                                                ))}
                                                            </CommandGroup>
                                                        </CommandList>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>
                                            <FormDescription>
                                                This is the category that will be used in the dashboard.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="location"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Location</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter your business location (city, state) ex: GREAT SOUTHERN, VIC" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="contactNumber"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Contact Number</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter your business contact number" {...field} inputMode="numeric" onChange={(event) => {
                                                    if (Number(event?.target.value)) {
                                                        field.onChange(event?.target.value)
                                                    }
                                                    else {
                                                        form.setError('contactNumber', { type: 'pattern', message: 'Contact Number can only be number' })
                                                        toast.error('Contact Number can only be number')
                                                        field.onChange('')
                                                    }
                                                }} pattern="[0-9]*" type="text" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description</FormLabel>
                                            <FormControl>
                                                <Textarea rows={8}
                                                    {...field} />
                                            </FormControl>
                                            <FormMessage />
                                            <FormDescription>
                                                Enter your short description with opening hour, days in a week.
                                            </FormDescription>
                                        </FormItem>
                                    )}
                                />
                                <FormLabel>Profile Image</FormLabel>
                                <FormControl>
                                    <Input type='file' accept="image/*" className="cursor-pointer" onChange={(event) => event.target.files && setProfileImage(event?.target?.files[0])} />
                                </FormControl>


                            </div>

                            <Button type="submit">Register</Button>
                        </form>
                    </Form>
                </div>
            </div>

        </AuthPageLayout>
    );
};

export default RegisterPage;
