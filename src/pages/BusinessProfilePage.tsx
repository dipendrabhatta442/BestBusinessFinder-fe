import Layout from '@/components/Layouts/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import Unauthenticated from '@/components/Unauthenticated'
import useAuthenticate from '@/hooks/useAuthenticate'
import useFetch from '@/hooks/useFetch'
import API, { getUserRole } from '@/utils/api'
import { appPublicUrl, tokenKey } from '@/utils/constant'
import { Star } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

function BusinessProfilePage() {
    const navigate = useNavigate();
    const [userRole, setUserRole] = useState<string>('Normal')

    const { authenticate, setAuthenticate } = useAuthenticate()
    const handleLogout = async () => {
        try {
            const response = await API.post('/auth/logout');
            toast.success('Logout successful!');
        } catch (error) {
            toast.success('logout failed:');
            alert("Something went wrong!!");
        } finally {
            localStorage.removeItem(tokenKey); // Store JWT token in localStorage
            setAuthenticate(false);
            navigate('/', { replace: true }); // Redirect to the home page or dashboard after login
        }
    }
    const { data: businessProfile, error, loading } = useFetch('/auth/profile');
    useEffect(() => {
        if (localStorage) {
            setUserRole(getUserRole() ?? 'Normal')
        }
    }, [localStorage])
    if (!authenticate) return <Unauthenticated />
    if (userRole === "Admin") {
        console.log({ userRole })
        return <Navigate to={'/'} replace={true} />
    }
    return (
        <Layout>
            <div className="container mx-auto px-4 py-8 flex-1">
                <h1 className="text-2xl font-bold text-center mb-8">Business Profile</h1>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Business Information */}
                    <div className="space-y-4">
                        <div>
                            <h2 className="font-bold">Business Name</h2>
                            <p>Category: {businessProfile?.category}</p>
                        </div>

                        <div>
                            <h2 className="font-bold">Location</h2>
                            <p>{businessProfile?.location}</p>
                        </div>

                        <div>
                            <h2 className="font-bold">Description</h2>
                            <p>
                                {businessProfile?.description}
                            </p>
                        </div>
                    </div>

                    {/* Business Image */}
                    <div className="border-2 border-dashed rounded-lg flex items-center justify-center">
                        <img src={appPublicUrl + businessProfile?.profileImage} className="w-64 aspect-square bg-muted mb-4" />
                        {/* <p className="text-muted-foreground">Business image</p> */}
                    </div>
                </div>

                {/* Contact Information */}
                <Card className="mt-8">
                    <CardHeader>
                        <CardTitle>Contact Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <p>
                            <span className="font-bold">Email:</span> {businessProfile?.email}
                        </p>
                        <p>
                            <span className="font-bold">Phone:</span> {businessProfile?.contactNumber}
                        </p>
                    </CardContent>
                </Card>

                {/* User Reviews */}
                <div className="mt-8">
                    <h2 className="text-xl font-bold mb-4">User reviews</h2>
                    <div className="space-y-4">
                        {businessProfile?.reviews?.length > 0 && businessProfile?.reviews?.map((review: any, index: number) => <Card key={index + review?.name + "review-business"}>
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <p className="font-bold">{review?.name}</p>
                                    <div className="flex">
                                        {[...Array(4)].map((_, i) => (
                                            <Star
                                                key={review?.rating + i + "review-profile"}
                                                className="w-4 h-4 fill-primary text-primary"
                                            />
                                        ))}
                                        <Star className="w-4 h-4 text-muted-foreground" />
                                    </div>
                                </div>
                                <p>
                                    Review: {review?.review}
                                </p>
                            </CardContent>
                        </Card>)
                        }
                        {businessProfile?.reviews?.length === 0 && <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <p className="font-bold">There are nor reviews to show! </p>
                                </div>

                            </CardContent>
                        </Card>}
                    </div>
                </div>
            </div>
        </Layout>

    )
}

export default BusinessProfilePage