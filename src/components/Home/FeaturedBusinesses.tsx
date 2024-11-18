import React from 'react'
import { Badge, Button, Card, CardContent, CardFooter, Skeleton } from '../ui'
import { cn } from '@/utils/common'
import useFetch from '@/hooks/useFetch';
import { toast } from 'sonner';
import { appPublicUrl } from '@/utils/constant';
import { Link } from 'react-router-dom';

function FeaturedBusinesses() {
    const { data: businesses, loading, error, refetch } = useFetch('/business');

    if (error) {
        toast.error(error?.toString())
    }

    if (!businesses) return (<div className='flex justify-center gap-5'>{
        [1, 2, 3, 4].map((num, index) => (
            <div key={num + index} className="flex flex-col space-y-3">
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
                            <div key={num + index} className="flex flex-col space-y-3">
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
            <div className={cn(`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4`)}>
                {businesses?.map((item: any, index: number) => (
                    <Card key={index}>
                        <CardContent className="p-6">
                            <img className="w-full aspect-square bg-muted mb-4" src={appPublicUrl + item.profileImage} />
                            <h3 className="font-medium ">{item.name}</h3>
                            <p className='italic text-muted-foreground text-sm'>{item.location}</p>
                            <Badge className='mb-2'>{item.category}</Badge>
                            <p className="text-sm text-muted-foreground">
                                {item.description?.slice(0, 100)}
                            </p>

                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" variant="outline" asChild>
                                <Link to={`/business/${item?.slug}`}>View details</Link>
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </section >
    )
}

export default FeaturedBusinesses