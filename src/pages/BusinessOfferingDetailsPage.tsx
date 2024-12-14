import Layout from '@/components/Layouts/Layout'
import { Badge, Button, Card, CardContent, CardFooter, CardHeader, CardTitle, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Textarea } from '@/components/ui'
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage, Form } from '@/components/ui/form'
import useFetch from '@/hooks/useFetch'
import useFormHandler from '@/hooks/useFormHandler'
import API from '@/utils/api'
import { appPublicUrl } from '@/utils/constant'
import { reviewSchema, ReviewSchemaType } from '@/utils/validationSchemas'
import { ArrowLeft, ExternalLink, Heart, Star } from 'lucide-react'
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from 'sonner'

function BusinessOfferingDetailsPage() {
    const { slug } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    let offeringId = searchParams.get("id")

    console.log({ slug })
    const { data: offeringDetails, error, loading, refetch } = useFetch(`/business/offering/${slug}?id=${offeringId}`);
    const { data: businessProfile, error: profileError, loading: profileLoading, refetch: profileRefetch } = useFetch(`/auth/profile`);
    console.log({ offeringDetails })
    const navigate = useNavigate()
    if (!offeringId) {
        return <div>Requested Offering not found</div>
    }

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8 flex-1">
                <h1 className="text-2xl font-bold text-center mb-8">Offering Deatils</h1>
                <Card className="max-w-3xl mx-auto">
                    <CardContent className="p-6">
                        <Button variant="ghost" onClick={() => navigate('/')} className="mb-4">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
                        </Button>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="aspect-square relative">
                                <img
                                    src={appPublicUrl + offeringDetails?.image}
                                    alt={offeringDetails?.title}
                                    className="w-full h-full object-cover rounded-lg"
                                />
                                <Badge className="absolute top-2 right-2 bg-white/80 text-black backdrop-blur-sm">
                                    ${offeringDetails?.price?.toFixed(2)}
                                </Badge>
                            </div>
                            <div className="space-y-4">
                                <h1 className="text-2xl font-bold">{offeringDetails?.title}</h1>
                                <p className="text-muted-foreground">{offeringDetails?.description}</p>

                            </div>
                        </div>
                    </CardContent>
                    {/* <CardFooter className="flex justify-between">
                        <Button variant="outline" className="w-full mr-2">Add to Cart</Button> 
                    <Button variant="ghost" className="w-12 flex-shrink-0">
                        <Heart className="h-5 w-5" />
                    </Button>
                </CardFooter> */}
                </Card>

            </div>
        </Layout >

    )
}

export default BusinessOfferingDetailsPage