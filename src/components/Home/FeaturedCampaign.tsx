import useFetch from '@/hooks/useFetch';
import { Badge, Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, Skeleton } from '../ui'
import { cn } from '@/utils/common'
import { appPublicUrl } from '@/utils/constant';
import { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink, EyeIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

function FeaturedCampaign() {
    const { data: campaigns, loading, error, refetch } = useFetch('/campaign/approved');
    console.log({ campaigns })
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

    const handlePrev = useCallback(() => {
        api?.prev()
    }, [api])

    const handleNext = useCallback(() => {
        api?.next()
    }, [api])
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Pending':
                return <Badge variant="secondary">{status}</Badge>
            case 'Approved':
                return <Badge >{status}</Badge>
            case 'Rejected':
                return <Badge variant="destructive">{status}</Badge>
            default:
                return <Badge>{status}</Badge>
        }
    }
    return (
        <section className="py-8 container mx-auto px-4">
            <h2 className="text-2xl font-semibold text-center mb-6">Featured Campaigns</h2>
            <div>
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
                {campaigns && campaigns.length > 0 &&
                    <>
                        <Carousel setApi={setApi} >
                            <CarouselContent>
                                {campaigns?.map((campaign: any, index: number) => (
                                    <CarouselItem key={campaign._id} className="md:basis-1/2 lg:basis-1/4">
                                        <Card>
                                            <CardHeader>
                                                <img
                                                    src={appPublicUrl + campaign.image}
                                                    alt={campaign.title}
                                                    width={300}
                                                    height={200}
                                                    className="w-full h-40 object-cover rounded-t-lg"
                                                />
                                            </CardHeader>
                                            <CardContent>
                                                <CardTitle className="text-lg mb-2">{campaign.title}</CardTitle>
                                                <CardDescription className="text-sm mb-2 line-clamp-1">{campaign.description}</CardDescription>
                                                <Badge>{campaign.createdBy?.name}</Badge>
                                            </CardContent>
                                            <CardFooter>
                                                <Link to={`campaign/details/${campaign._id}`} className='flex items-center gap-2'> <ExternalLink size={20} /> <span>view more</span></Link>
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
                {campaigns.length === 0 && <p className='text-center'>Empty!, currently there is no any campaigns posted yet!</p>}
            </div>
        </section >
    )
}

export default FeaturedCampaign