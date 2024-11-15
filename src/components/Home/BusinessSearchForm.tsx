import React from 'react'
import { Search } from 'lucide-react'
import { Button, Input } from '../ui'

function BusinessSearchForm() {
    return (
        <section className="py-8 text-center">
            <h2 className="text-xl mb-4">Find Local Businesses Here</h2>
            <div className="flex justify-center gap-2 max-w-md mx-auto px-4">
                <Input
                    type="search"
                    placeholder="search"
                    className="w-full"
                />
                <Button type="submit">
                    <Search className="h-4 w-4 mr-2" />
                    Search
                </Button>
            </div>
        </section>
    )
}

export default BusinessSearchForm