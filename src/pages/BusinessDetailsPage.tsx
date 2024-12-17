import Layout from '@/components/Layouts/Layout'
import { Badge, Button, Card, CardContent, CardFooter, CardHeader, CardTitle, Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Textarea } from '@/components/ui'
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage, Form } from '@/components/ui/form'
import useFetch from '@/hooks/useFetch'
import useFormHandler from '@/hooks/useFormHandler'
import API from '@/utils/api'
import { appPublicUrl } from '@/utils/constant'
import { reviewSchema, ReviewSchemaType } from '@/utils/validationSchemas'
import { ExternalLink, Star } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from "react-router-dom";
import { toast } from 'sonner'

function BusinessDetailsPage() {
    const { slug } = useParams();
    const form = useFormHandler<ReviewSchemaType>(reviewSchema);
    const [api, setApi] = useState<any>()
    const [current, setCurrent] = useState(0)
    const [count, setCount] = useState(0)

    useEffect(() => {
        if (!api) return

        setCount(api.scrollSnapList().length)
        setCurrent(api.selectedScrollSnap() + 1)

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap() + 1)
        })
    }, [api])
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
                <Card className="mt-8">
                    <CardHeader>
                        <CardTitle>Bussiness offerings</CardTitle>
                    </CardHeader>
                    <CardContent >
                        <Carousel setApi={setApi} >
                            <CarouselContent>
                                {businessDetails?.offerings?.map((offer: any, index: number) =>
                                    <CarouselItem key={offer?._id + index} className="sm:basis-1 md:basis-1/3 lg:basis-1/4">
                                        <Card className="overflow-hidden">
                                            <div className="aspect-square relative">
                                                <img
                                                    src={appPublicUrl + offer?.image}
                                                    alt={offer?.title}
                                                    className="w-full h-full object-cover"
                                                />
                                                {typeof offer?.price === 'number' && (
                                                    <Badge className="absolute top-2 right-2 bg-white/80 text-black backdrop-blur-sm">
                                                        ${offer?.price.toFixed(2)} AUD
                                                    </Badge>
                                                )}
                                            </div>
                                            <CardContent className="p-4">
                                                <h3 className="text-lg font-semibold line-clamp-1">{offer?.title}</h3>
                                                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{offer?.description}</p>
                                            </CardContent>
                                            <CardFooter className="p-4 pt-0 flex items-center">
                                                <Link to={`/business/offering/${slug}?id=${offer?.id}`} target='_blank' className='flex'><ExternalLink size={20} />&nbsp;<span>View More</span></Link>

                                            </CardFooter>
                                        </Card></CarouselItem>)}
                            </CarouselContent>
                            <CarouselPrevious className='left-[-1rem]' />
                            <CarouselNext className='right-[-1rem]' />
                        </Carousel>
                        <div className="flex justify-center mt-4 space-x-2">
                            {Array.from({ length: count }).map((_, index) => (
                                <Button
                                    key={index}
                                    variant="outline"
                                    size="icon"
                                    className={`w-2 h-2 rounded-full ${index === current - 1 ? 'bg-blue-600' : 'bg-gray-300'
                                        }`}
                                    onClick={() => api?.scrollTo(index)}
                                />
                            ))}
                        </div>
                    </CardContent>
                </Card>
                {/* User Reviews */}
                <div className="mt-8">
                    <h2 className="text-xl font-bold mb-4">User reviews</h2>
                    <div className="space-y-4">
                        {businessDetails?.reviews?.length === 0 && <p className='text-muted-foreground'>Currently there no review yet!</p>}
                        {businessDetails?.reviews?.length > 0 && businessDetails?.reviews?.map((review: any, index: number) => (
                            <Card key={index + review?.name + 'review'}>
                                <CardContent className="pt-6">
                                    <div className="flex items-center gap-2 mb-2">
                                        <p className="font-bold">{review?.name}</p>
                                        <div className="flex">
                                            {[...Array(Number(4))].map((_, i) => (
                                                i < Number(review?.rating) ? <Star
                                                    key={`${review?.rating}-star-icon-filled` + crypto.getRandomValues(new Uint32Array(10))
                                                    }
                                                    className="w-4 h-4 fill-primary text-primary"
                                                /> : <Star className="w-4 h-4 text-muted-foreground" key={`${review?.rating}-star-icon-filled` + crypto.getRandomValues(new Uint32Array(10))} />
                                            ))}
                                        </div>
                                    </div>
                                    <p>
                                        Review: {review?.review}
                                    </p>
                                    {review?.reply.length > 0 ? <div className='mb-2 italic'>
                                        <hr />
                                        <p className=""> Replyed By: {businessDetails?.name},</p>
                                        <p className='ms-5'>{review?.reply}</p>
                                    </div>

                                        : null}
                                </CardContent>
                            </Card>))
                        }

                        {!(businessProfile && businessProfile?._id === businessDetails?._id) && <Card className='p-4'>
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
                                                                    {ratingOptions?.map((item, index) => <SelectItem key={item?.value + index + "combox-rating"} value={item?.value}>{item?.label}</SelectItem>)}

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