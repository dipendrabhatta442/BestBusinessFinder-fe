import Layout from '@/components/Layouts/Layout'
import { Button, Card, CardContent, CardHeader, CardTitle, Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, Input, ScrollArea, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow, Textarea } from '@/components/ui'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import Unauthenticated from '@/components/Unauthenticated'
import useAuthenticate from '@/hooks/useAuthenticate'
import useFetch from '@/hooks/useFetch'
import useFormHandler from '@/hooks/useFormHandler'
import API from '@/utils/api'
import { appPublicUrl } from '@/utils/constant'
import { OfferingSchemaType, ProfileSchemaType, offeringSchema, profileSchema, replySchema } from '@/utils/validationSchemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { Delete, DeleteIcon, LucideDelete, RemoveFormatting } from 'lucide-react'
import React, { useState } from 'react'
import { IconRight } from 'react-day-picker'
import { useForm } from 'react-hook-form'
import { Navigate, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'

function BusinessDashboard() {
    const { authenticate } = useAuthenticate()
    const { data: businessProfile, error, loading, refetch } = useFetch('/auth/profile');
    const navigate = useNavigate();
    const [profileImage, setProfileImage] = useState<File | null>(null)
    const [productImage, setProductImage] = useState<File | null>(null)
    const businessForm = useForm<ProfileSchemaType>({
        resolver: zodResolver(profileSchema),
        mode: 'onBlur',
        defaultValues: async () => {
            const response = await API.get(`/auth/profile`);
            return response.data.data
        },


    });
    const productForm = useFormHandler<OfferingSchemaType>(offeringSchema)

    const onBusinessSubmit = async (values: ProfileSchemaType) => {

        const form = new FormData();
        form.append('name', values.name)
        form.append('profileImage', profileImage ?? businessProfile?.profileImage)
        form.append('description', values.description ?? businessProfile?.description)
        form.append('category', values?.category ?? businessProfile?.category)
        const response = await API.post('/auth/profile/update', form, {
            headers: {
                "Content-Type": 'multipart/form-data'
            }
        });
        toast.success(response.data.message)
        navigate('/profile', { replace: true })
    }

    const onProductSubmit = async (values: OfferingSchemaType) => {
        if (!productImage) {
            toast.error("Please upload image of product");
        } else {
            const form = new FormData();
            form.append('name', businessProfile?.name)
            form.append('title', values.title)
            form.append('image', productImage)
            form.append('description', values.description)
            form.append('price', values?.price?.toString())
            const response = await API.post('/business/offerings', form, {
                headers: {
                    "Content-Type": 'multipart/form-data'
                }
            });
            toast.success(response.data.message);
            setProductImage(null);
            productForm.setValue('title', '')
            productForm.setValue('description', '')
            productForm.setValue('price', '')
            productForm.reset();
            refetch();
        }
    }
    const category = [
        { label: 'Entertainment', value: 'entertainment' },
        { label: 'Resturant', value: 'resturant' },
        { label: 'Health & Wellness', value: 'health-wellness' },
        { label: 'Retail Shop', value: 'retail-shop' },
        { label: 'Services', value: 'services' }
    ]
    if (!authenticate) return <Unauthenticated />

    return (
        <Layout>

            <div className="container mx-auto px-4 py-8 flex-1">
                <h1 className="text-2xl font-bold text-center mb-8">Manage Your Business</h1>

                {/* Business Details */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Business Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Form {...businessForm}>
                            <form onSubmit={businessForm.handleSubmit(onBusinessSubmit)} className="space-y-4">
                                <FormField
                                    control={businessForm.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Business Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter business name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={businessForm.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    rows={8}
                                                    placeholder="Enter a description of your business"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={businessForm.control}
                                    name="category"
                                    render={({ field }) => (
                                        <FormItem>

                                            <FormLabel>Category</FormLabel>
                                            <FormControl>
                                                <Select onValueChange={field.onChange} value={field?.value?.toLowerCase()}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a category" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {category?.map((item, index) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}

                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="space-y-2">
                                    <FormLabel>Upload Image</FormLabel>
                                    <Input type='file' accept="image/*" className="cursor-pointer" onChange={(event) => event.target.files && setProfileImage(event?.target?.files[0])} />

                                    <div className='flex gap-3 items-center'>

                                        <Card className='w-72'>
                                            {profileImage && <CardTitle className='p-3'>Old Profile</CardTitle>}
                                            <CardContent className="p-6">
                                                <img className="w-full aspect-square bg-muted mb-4" src={appPublicUrl + businessProfile?.profileImage} />

                                            </CardContent>
                                        </Card>
                                        {profileImage && <>
                                            <IconRight />
                                            <Card className='w-72'>
                                                {profileImage && <CardTitle className='p-3'>New Profile</CardTitle>}
                                                <CardContent className="p-6">
                                                    <img className="w-full aspect-square bg-muted mb-4" src={URL.createObjectURL(profileImage as File)} />
                                                </CardContent>
                                            </Card>
                                        </>

                                        }
                                    </div>
                                </div>
                                <Button type="submit">Save changes</Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>

                <div className='grid md:grid-cols-2 gap-8'>

                    {/* Products & Services */}
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle>Product & services</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Form {...productForm}>
                                <form onSubmit={productForm.handleSubmit(onProductSubmit, console.log)} className="space-y-4">
                                    <FormField
                                        control={productForm.control}
                                        name="title"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Product/service Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Enter product/service title" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={productForm.control}
                                        name="description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Description</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        rows={8}

                                                        placeholder="Enter a description"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={productForm.control}
                                        name="price"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Product/service Price</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Enter product/service price" inputMode='numeric' {...field} />
                                                </FormControl>
                                                <FormMessage />
                                                <FormDescription>For Free Product or service please set to 0</FormDescription>
                                            </FormItem>
                                        )}
                                    />
                                    <div className="space-y-2">
                                        <FormLabel>Upload Product Image</FormLabel>
                                        <Input type='file' accept="image/*" className="cursor-pointer" onChange={(event) => event.target.files && setProductImage(event?.target?.files[0])} />
                                        {productImage && <Card className='w-72'>
                                            <CardContent className="p-6">
                                                <img className="w-full aspect-square bg-muted mb-4" src={URL.createObjectURL(productImage as File)} />
                                            </CardContent>
                                        </Card>
                                        }                                </div>
                                    <Button type="submit">Add product/Services</Button>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                    {/* Products & Services */}
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle>Product & services List</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="container mx-auto py-10">
                                <ScrollArea className="h-[400px] rounded-md border">
                                    <Table>
                                        <TableCaption>{businessProfile?.offerings?.length > 0 ? 'A list of our products' : "There are no product/ or service added"}</TableCaption>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-[100px]">Image</TableHead>
                                                <TableHead>Title</TableHead>
                                                <TableHead>Description</TableHead>
                                                <TableHead className="text-right">Price</TableHead>
                                                <TableHead className="text-right">Action</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {businessProfile?.offerings?.reverse()?.map((product: any, index: number) => (
                                                <TableRow key={product.title + index + 'dashboard'}>
                                                    <TableCell>
                                                        <img
                                                            src={appPublicUrl + product.image}
                                                            alt={product.title}
                                                            width={50}
                                                            height={50}
                                                            className="rounded-md"
                                                        />
                                                    </TableCell>
                                                    <TableCell className="font-medium">{product.title}</TableCell>
                                                    <TableCell title='product?.description'>{product?.description?.slice(0, 100)}</TableCell>
                                                    <TableCell className="text-right">
                                                        ${product.price.toFixed(2)}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <Button variant={'destructive'} onClick={() => {
                                                            API.delete(`/business/${product.id}`).then(res => {
                                                                toast.success('Successfully Removed Data');
                                                                refetch();
                                                            }).catch(e => toast.error(e.message))
                                                        }}><LucideDelete /></Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </ScrollArea>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Customer Reviews</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {businessProfile?.reviews?.map((item: any, index: number) => {

                            return <div className="border rounded-lg p-4" key={index + item.review?.slice(0, 3)}>
                                <p className="mb-2"><b>{item.name}</b>: {item.review}</p>
                                {item.reply.length > 0 ? <div className='mb-2 italic'>
                                    <hr />
                                    <p className=""> Replyed By: {businessProfile?.name},</p>
                                    <p className='ms-5'>{item.reply}</p>
                                </div>

                                    : <ReplyModal reviewId={item.id} reviewText={item.review} />}
                                {/* <Button variant="outline" size="sm">
                                    Respond
                                </Button> */}
                            </div>
                        })}
                        <div className="border rounded-lg p-4">
                            <p className="mb-2">User 2: Service was good but could improve in some areas.</p>
                            {/* <Button variant="outline" size="sm">
                                Respond
                            </Button> */}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </Layout >

    )
}
export default BusinessDashboard
interface ReviewReplyModalProps {
    reviewId: string
    reviewText: string
}
const ReplyModal = ({ reviewId, reviewText }: ReviewReplyModalProps) => {
    const [isOpen, setIsOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<z.infer<typeof replySchema>>({
        resolver: zodResolver(replySchema),
        defaultValues: {
            reply: "",
        },
    })
    async function onSubmit(values: z.infer<typeof replySchema>) {
        setIsSubmitting(true)
        try {
            // In a real application, replace this with your actual API call
            const response = await API.put(`/business/review/reply`, { reviewId, reply: values.reply })

            if (response.status === 200) {
                toast.success(
                    "Your reply has been posted successfully.",
                )
                form.reset()
            } else {
                throw new Error("Failed to post reply")
            }
        } catch (error: any) {
            toast(error?.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (<Dialog open={isOpen} onOpenChange={setIsOpen} >
        <DialogTrigger asChild>
            <Button variant="outline" size="sm">Respond</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Reply to Review</DialogTitle>
                <DialogDescription>
                    Respond to the following review:
                </DialogDescription>
            </DialogHeader>
            <div className="mt-2 mb-4 p-2 bg-muted rounded-md">
                <p className="text-sm">{reviewText}</p>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="reply"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Your Reply</FormLabel>
                                <FormControl>
                                    <Textarea
                                        rows={8}
                                        placeholder="Type your reply here."
                                        className="resize-none"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Provide a thoughtful response to the review.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Posting..." : "Post Reply"}
                    </Button>
                </form>
            </Form>
        </DialogContent>
    </Dialog >
    )

}