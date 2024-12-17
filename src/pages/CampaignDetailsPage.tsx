import Layout from '@/components/Layouts/Layout'
import { Avatar, AvatarFallback, AvatarImage, Badge, Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Textarea } from '@/components/ui'
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage, Form } from '@/components/ui/form'
import useFetch from '@/hooks/useFetch'
import useFormHandler from '@/hooks/useFormHandler'
import API from '@/utils/api'
import { appPublicUrl } from '@/utils/constant'
import { reviewSchema, ReviewSchemaType } from '@/utils/validationSchemas'
import { Separator } from '@radix-ui/react-context-menu'
import { CalendarIcon, ExternalLink, MapPinIcon, Star, UserIcon } from 'lucide-react'
import { IconLeft } from 'react-day-picker'
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from 'sonner'

function CampaignDetailsPage() {
    const { id } = useParams();
    const form = useFormHandler<ReviewSchemaType>(reviewSchema);
    const navigate = useNavigate()

    const { data: campaignDetails, error, loading, refetch } = useFetch(`/campaign/info/${id}`);
    const { data: businessProfile, error: profileError, loading: profileLoading, refetch: profileRefetch } = useFetch(`/auth/profile`);
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
        <Layout>
            <div className="container mx-auto px-4 py-8 flex-1">
                <h1 className="text-2xl font-bold text-center mb-8">Campaign Details</h1>

                <div className="container mx-auto py-10">
                    <Button variant="ghost" onClick={() => navigate('/')} className="mb-4">
                        <IconLeft /> Back to Home
                    </Button>
                    <Card className="w-full max-w-4xl mx-auto">
                        <CardHeader>
                            <div className="relative w-full h-64 mb-4">
                                <img
                                    src={appPublicUrl + campaignDetails?.image}
                                    alt={campaignDetails?.title}
                                    className="object-cover rounded-t-lg"
                                />
                            </div>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-3xl mb-2">{campaignDetails?.title}</CardTitle>
                                    <CardDescription className="text-lg">
                                        {getStatusBadge(campaignDetails?.status)}
                                    </CardDescription>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-muted-foreground">Created on</p>
                                    <p className="font-medium">{new Date(campaignDetails?.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <h3 className="text-xl font-semibold mb-2">Description</h3>
                                <p>{campaignDetails?.description}</p>
                            </div>
                            <Separator />
                            <div className="flex items-center space-x-4">
                                <Avatar className="w-12 h-12">
                                    <AvatarImage src={appPublicUrl + campaignDetails?.createdBy?.profileImage} alt={campaignDetails?.createdBy?.name} />
                                    <AvatarFallback>{campaignDetails?.createdBy??.name?.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold">{campaignDetails?.createdBy?.name}</p>
                                    <p className="text-sm text-muted-foreground">{campaignDetails?.createdBy.email}</p>
                                </div>
                            </div>
                            <Separator />
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center space-x-2">
                                    <CalendarIcon className="w-5 h-5 text-muted-foreground" />
                                    <span>Updated: {new Date(campaignDetails?.updatedAt).toLocaleDateString()}</span>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <UserIcon className="w-5 h-5 text-muted-foreground" />
                                    <span>{campaignDetails?.isPublic ? 'Public' : 'Private'} Campaign</span>
                                </div>
                            </div>

                        </CardContent>

                    </Card>
                </div>


            </div>

        </Layout >

    )
}

export default CampaignDetailsPage