import React, { useState } from 'react'
import { Search } from 'lucide-react'
import { Button, Input } from '../ui'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

function BusinessSearchForm() {
    const navigate = useNavigate()
    const [searchValue, setSearchValue] = useState('')
    return (
        <section className="py-8 text-center">
            <h2 className="text-xl mb-4">Find Local Businesses Here</h2>
            <div className="flex justify-center gap-2 max-w-md mx-auto px-4">
                <Input
                    type="search"
                    placeholder="search"
                    className="w-full"
                    onChange={(event) => setSearchValue(event?.target.value)}
                />
                <Button type="submit" onClick={() => searchValue?.length > 3 ? navigate(`/search?searchValue=${searchValue}`) : toast.info('Please provide atleast 3 character')}>
                    <Search className="h-4 w-4 mr-2" />
                    Search
                </Button>
            </div>
        </section>
    )
}

export default BusinessSearchForm