import React from 'react'
import { Card, CardContent, Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../ui'
import { Utensils, ShoppingBag, Wrench, Heart, FilmIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Value } from '@radix-ui/react-select'

function PopularCategories() {
    return (
        <section className="py-8 container mx-auto px-4">
            <h2 className="text-2xl font-semibold text-center mb-6">Popular Categories</h2>
            <div className="">
                <Carousel className="w-full" opts={{
                    align: "start",
                    loop: true,
                }}>
                    <CarouselContent className="-ml-1">
                        {[
                            { name: "Restaurants", icon: Utensils, value: 'resturant' },
                            { name: "Retail Shops", icon: ShoppingBag, value: 'retail-shops' },
                            { name: "Services", icon: Wrench, value: 'services' },
                            { name: "Health & Wellnesses", icon: Heart, value: 'health-wellness' },
                            { name: "Entertainment", icon: FilmIcon, value: 'entertainment' }
                        ].map(({ name, value, icon: Icon }, index) => (
                            <CarouselItem key={index} className="pl-1 md:basis-1/2 lg:basis-1/3">
                                <div className="p-1">
                                    <Card key={name} className="text-center">
                                        <CardContent className="p-6">
                                            <div className="w-32 h-32 mx-auto mb-4 bg-muted flex items-center justify-center">
                                                <Icon className="h-16 w-16 text-primary" />
                                            </div>
                                            <Link className="font-medium hover:underline" to={`/search?category=${value}`}>{name}</Link>
                                        </CardContent>
                                    </Card>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
                {/* {[
                    { name: "Food and Restaurants", icon: Utensils },
                    { name: "Retail Shops", icon: ShoppingBag },
                    { name: "Services", icon: Wrench },
                    { name: "Health & Wellnesses", icon: Heart },
                    { name: "Entertainment", icon: FilmIcon }
                ].map(({ name, icon: Icon }) => (
                    <Card key={name} className="text-center">
                        <CardContent className="p-6">
                            <div className="w-32 h-32 mx-auto mb-4 bg-muted flex items-center justify-center">
                                <Icon className="h-16 w-16 text-primary" />
                            </div>
                            <h3 className="font-medium">{name}</h3>
                        </CardContent>
                    </Card>
                ))} */}
            </div>
        </section>
    )
}

export default PopularCategories