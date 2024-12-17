import React, { useEffect, useState } from 'react'
import { Badge, Button, Card, CardContent, CardFooter, Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, Skeleton } from '../ui'
import { cn } from '@/utils/common'
import useFetch from '@/hooks/useFetch';
import { toast } from 'sonner';
import { appPublicUrl } from '@/utils/constant';
import { Link } from 'react-router-dom';
import { EyeIcon } from 'lucide-react';

function FeaturedBusinesses() {
    const { data: businesses, loading, error, refetch } = useFetch('/business');
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
    if (error) {
        console.log(error?.toString())
    }

    if (!businesses) return (<div className='flex justify-center gap-5'>{
        [1, 2, 3, 4].map((num, index) => (
            <div key={num + index + 'featured-business'} className="flex flex-col space-y-3">
                <Skeleton className="h-[125px] w-[250px] rounded-xl" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                </div>
            </div>
        ))}
    </div>
    )
    return (
        <section className="py-8 container mx-auto px-4">
            <h2 className="text-2xl font-semibold text-center mb-6">Featured Businesses</h2>
            {
                loading && (
                    <div className='flex justify-center gap-5'>{
                        [1, 2, 3, 4].map((num, index) => (
                            <div key={num + index + "skelleton-card"} className="flex flex-col space-y-3">
                                <Skeleton className="h-[125px] w-[250px] rounded-xl" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-[250px]" />
                                    <Skeleton className="h-4 w-[200px]" />
                                </div>
                            </div>
                        ))}
                    </div>
                )
            }
            {businesses && businesses.length > 0 && <>
                <Carousel setApi={setApi} >
                    <CarouselContent>
                        {businesses?.map((item: any, index: number) => (
                            <CarouselItem key={index + item?.name + "business-card-section"} className="md:basis-1/2 lg:basis-1/4">
                                <Card>
                                    <CardContent className="p-6">
                                        <img className="w-full aspect-square bg-muted mb-4" src={appPublicUrl + item.profileImage} />
                                        <h3 className="font-medium ">{item?.name}</h3>
                                        <p className='italic text-muted-foreground text-sm'>{item.location}</p>
                                        <Badge className='mb-2'>{item.category}</Badge>
                                        <p className="text-sm text-muted-foreground line-clamp-1">
                                            {item.description}
                                        </p>

                                    </CardContent>
                                    <CardFooter>
                                        <Link to={`/business/${item?.slug}`} className='flex items-center gap-2'> <EyeIcon size={20} /> <span>view more</span></Link>
                                    </CardFooter>
                                </Card>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
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
            </>}
            {businesses && businesses?.length === 0 && <p className='text-center'>Empty!, currently there is no any business register yet!</p>}
        </section >
    )
}

export default FeaturedBusinesses