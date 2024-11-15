import { Button, Card, CardContent, CardFooter } from '@/components/ui'
import useFetch from '@/hooks/useFetch';
import React, { useEffect, useState } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'

function BusinessListPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    let category = searchParams.get("category")
    let search = searchParams.get("search");
    let location = searchParams.get("location");
    let minRating = searchParams.get("minRating");
    const [fetchUrl, setFetchUrl] = useState('/business');
    const { data: businesses, loading, error, refetch } = useFetch(fetchUrl);
    useEffect(() => {
        
    }, [category, search, location, minRating])
    return (
        <>  <h2 className="text-2xl font-semibold text-center mb-8">
            Businesses in <span className="italic">Restaurant</span>
        </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                    <Card key={num}>
                        <CardContent className="p-4">
                            <div className="w-full aspect-square bg-muted mb-4" />
                            <h3 className="font-medium mb-2">Business name {num}</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                Short description of Business {num}.
                            </p>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" variant="outline" asChild>
                                <Link to={`/business/${num}`}>View details</Link>
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div></>
    )
}

export default BusinessListPage