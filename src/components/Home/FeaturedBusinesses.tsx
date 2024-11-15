import React from 'react'
import { Card, CardContent, Skeleton } from '../ui'
import { cn } from '@/utils/common'

function FeaturedBusinesses({ businesses }: { businesses: any }) {
    if (!businesses) return (<div className="flex flex-col space-y-3">
        <Skeleton className="h-[125px] w-[250px] rounded-xl" />
        <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
        </div>
    </div>)
    const conditionalCols = (defaultCol: number) => businesses?.length >= defaultCol ? defaultCol : businesses?.length
    return (
        <section className="py-8 container mx-auto px-4">
            <h2 className="text-2xl font-semibold text-center mb-6">Featured Businesses</h2>
            <div className={cn(`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4`)}>
                {businesses?.map((item: any, index: number) => (
                    <Card key={index}>
                        <CardContent className="p-6">
                            <div className="w-full aspect-square bg-muted mb-4" />
                            <h3 className="font-medium mb-2">{item.name}</h3>
                            <p className="text-sm text-muted-foreground">
                                {item.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
    )
}

export default FeaturedBusinesses