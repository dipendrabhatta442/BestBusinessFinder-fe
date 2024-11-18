import Layout from '@/components/Layouts/Layout'
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Textarea } from '@/components/ui'
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage, Form } from '@/components/ui/form'
import useFetch from '@/hooks/useFetch'
import useFormHandler from '@/hooks/useFormHandler'
import API from '@/utils/api'
import { appPublicUrl } from '@/utils/constant'
import { reviewSchema, ReviewSchemaType } from '@/utils/validationSchemas'
import { Star } from 'lucide-react'
import { useParams } from "react-router-dom";
import { toast } from 'sonner'

function BusinessDetailsPage() {
    const { slug } = useParams();
    const form = useFormHandler<ReviewSchemaType>(reviewSchema);

    const { data: businessDetails, error, loading, refetch } = useFetch(`/business/${slug}`);
    const { data: businessProfile, error: profileError, loading: profileLoading, refetch: profileRefetch } = useFetch(`/auth/profile`);
    const onSubmit = async (data: any) => {
        try {

            const response = await API.post(`/business/review/${slug}`, data);
            toast.success('Review added successfully!');
            refetch();
        } catch (error: any) {
            toast.error(error?.message)
            console.error('Registration failed:', error?.message);
        }
    };
    const ratingOptions = [
        { label: '1 Stars', value: '1' },
        { label: '2 Stars', value: '2' },
        { label: '3 Stars', value: '3' },
        { label: '4 Stars', value: '4' },
        { label: '5 Stars', value: '5' }
    ]
    return (
        <Layout>
            <div className="container mx-auto px-4 py-8 flex-1">
                <h1 className="text-2xl font-bold text-center mb-8">Business Profile</h1>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Business Information */}
                    <div className="space-y-4">
                        <div>
                            <h2 className="font-bold">Business Name</h2>
                            <p>Category: {businessDetails?.category}</p>
                        </div>

                        <div>
                            <h2 className="font-bold">Location</h2>
                            <p>{businessDetails?.location}</p>
                        </div>

                        <div>
                            <h2 className="font-bold">Description</h2>
                            <p>
                                {businessDetails?.description}
                            </p>
                        </div>
                    </div>

                    {/* Business Image */}
                    <div className="border-2 border-dashed rounded-lg flex items-center justify-center">
                        <img src={appPublicUrl + businessDetails?.profileImage} className="w-64 aspect-square bg-muted mb-4" />
                        {/* <p className="text-muted-foreground">Business image</p> */}
                    </div>
                </div>

                {/* Contact Information */}
                <Card className="mt-8">
                    <CardHeader>
                        <CardTitle>Contact Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <p>
                            <span className="font-bold">Email:</span> {businessDetails?.email}
                        </p>
                        <p>
                            <span className="font-bold">Phone:</span> {businessDetails?.contactNumber}
                        </p>
                    </CardContent>
                </Card>

                {/* User Reviews */}
                <div className="mt-8">
                    <h2 className="text-xl font-bold mb-4">User reviews</h2>
                    <div className="space-y-4">
                        {businessDetails?.reviews?.length > 0 && businessDetails?.reviews?.map((review: any, index: number) => (
                            <Card key={index + review.name + 'review'}>
                                <CardContent className="pt-6">
                                    <div className="flex items-center gap-2 mb-2">
                                        <p className="font-bold">{review?.name}</p>
                                        <div className="flex">
                                            {[...Array(Number(4))].map((_, i) => (
                                                i < Number(review?.rating) ? <Star
                                                    key={`${review.rating}-star-icon-filled` + crypto.getRandomValues(new Uint32Array(10))
                                                    }
                                                    className="w-4 h-4 fill-primary text-primary"
                                                /> : <Star className="w-4 h-4 text-muted-foreground" key={`${review.rating}-star-icon-filled` + crypto.getRandomValues(new Uint32Array(10))} />
                                            ))}
                                        </div>
                                    </div>
                                    <p>
                                        Review: {review?.review}
                                    </p>
                                    {review.reply.length > 0 ? <div className='mb-2 italic'>
                                        <hr />
                                        <p className=""> Replyed By: {businessDetails?.name},</p>
                                        <p className='ms-5'>{review.reply}</p>
                                    </div>

                                        : null}
                                </CardContent>
                            </Card>))
                        }

                        {!(businessProfile && businessProfile?._id === businessDetails._id) && <Card className='p-4'>
                            <CardTitle>Add A Review</CardTitle>
                            <CardContent className="pt-6">
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
                                                name="rating"
                                                render={({ field }) => (
                                                    <FormItem>

                                                        <FormLabel>Rating</FormLabel>
                                                        <FormControl>
                                                            <Select onValueChange={field.onChange} value={field?.value?.toLowerCase()}>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select a category" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {ratingOptions?.map((item, index) => <SelectItem key={item.value + index + "combox-rating"} value={item.value}>{item.label}</SelectItem>)}

                                                                </SelectContent>
                                                            </Select>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="review"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Review</FormLabel>
                                                        <FormControl>
                                                            <Textarea rows={8}
                                                                {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                        <FormDescription>
                                                            Enter something short description about use.
                                                        </FormDescription>
                                                    </FormItem>
                                                )}
                                            />



                                        </div>

                                        <Button type="submit">Submit</Button>
                                    </form>
                                </Form>
                            </CardContent>
                        </Card>}
                    </div>
                </div>
            </div>
        </Layout>

    )
}

export default BusinessDetailsPage