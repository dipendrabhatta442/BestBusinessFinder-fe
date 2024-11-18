import React from 'react'
import { Card, CardContent } from '../ui'
import { cn } from '@/utils/common'

function FeaturedCampaign() {
    return (
        <section className="py-8 container mx-auto px-4">
            <h2 className="text-2xl font-semibold text-center mb-6">Featured Campaign</h2>
            <div className={cn(`grid grid-cols-1 md:grid-cols-2 gap-4`)}>
                {[
                    {
                        title: 'Special Discount on Resturants',
                        coverImage: '/specialDiscount.png',
                        description: 'Enjoy up to 50% off at participating resturants'
                    },
                    {
                        title: 'Shop Local Week',
                        coverImage: '/shopLocal.png',
                        description: 'Support your local shops and get exclusive deals'
                    }].map((item: any, index: number) => (
                        <Card key={index}>

                            <CardContent className="p-6">
                                <img
                                    src={item.coverImage}
                                    alt="Card image"
                                    className="w-full aspect-square bg-muted mb-4"
                                />
                                {/* <div className="w-full aspect-square bg-muted mb-4" /> */}
                                <h3 className="font-medium mb-2">{item.title}</h3>
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

export default FeaturedCampaign