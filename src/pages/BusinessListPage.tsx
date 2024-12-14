import Layout from '@/components/Layouts/Layout';
import { Badge, Button, Card, CardContent, CardFooter, Skeleton } from '@/components/ui'
import useFetch from '@/hooks/useFetch';
import { appPublicUrl } from '@/utils/constant';
import React, { useEffect, useState } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'

function BusinessListPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    let category = searchParams.get("category")
    let searchValue = searchParams.get("searchValue");
    let location = searchParams.get("location");
    let minRating = searchParams.get("minRating");
    let queryParams = []
    if (category) {
        queryParams.push(`category=${category}`)
    }
    if (searchValue) {
        queryParams.push(`search=${searchValue}`)
    }
    if (location) {
        queryParams.push(`location=${location}`)
    }
   
    const fetchUrl = `/business${queryParams?.length > 0 ? '?' + queryParams.join('&') : ''}`

    const { data: businesses, loading, error, refetch } = useFetch(fetchUrl);
    return (
        <Layout>
            <h2 className="text-2xl font-semibold text-center mb-8">
                Businesses in <span className="italic">{category ?? 'local'}</span>
            </h2>
            {queryParams.length > 0 && <div className='flex flex-col items-center gap-2 mb-4 '>
                <p>Current Filter: {queryParams}</p>
                <Button onClick={() => setSearchParams()} > Reset Filter</Button>
            </div>}
            {
                loading && (<><div className='flex justify-center gap-5'>{
                    [1, 2, 3, 4].map((num, index) => (
                        <div key={num + index + "skeleton-search"} className="flex flex-col space-y-3">
                            <Skeleton className="h-[125px] w-[250px] rounded-xl" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-[250px]" />
                                <Skeleton className="h-4 w-[200px]" />
                            </div>
                        </div>
                    ))}
                </div></ >
                )
            }
            {
                (!businesses || businesses?.length === 0) && !loading && <h2 className="text-2xl font-semibold text-center mb-8">
                    <span className="italic">Empty! There nothing to show</span>
                </h2>
            }
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {businesses?.map((item: any, index: any) => (
                    <Card key={item._id + index + "business-list-page"}>
                        <CardContent className="p-4">
                            {/* <div className="w-full aspect-square bg-muted mb-4" /> */}
                            <img className="w-full aspect-square bg-muted mb-4" src={appPublicUrl + item?.profileImage} />
                            <h3 className="font-medium"> {item.name}</h3>
                            <p className='italic text-muted-foreground text-sm'>{item.location}</p>
                            <Badge className='mb-2'>{item.category}</Badge>
                            <p className="text-sm text-muted-foreground mb-4" title={item?.description as string}>
                                {(item?.description as string)?.slice(0, 100)}
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
        </Layout >
    )
}

export default BusinessListPage