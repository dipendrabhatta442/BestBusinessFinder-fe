"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Layout from "@/components/Layouts/Layout"
import useAuthenticate from "@/hooks/useAuthenticate"
import Unauthenticated from "@/components/Unauthenticated"
import { toast } from "sonner"
import API from "@/utils/api"
import useFetch from "@/hooks/useFetch"
import { appPublicUrl } from "@/utils/constant"
import { cn } from "@/utils/common"
import { Separator } from "@radix-ui/react-context-menu"
import { IconRight } from "react-day-picker"
import { CheckCheck, CheckCircle, CrossIcon, ExternalLink, EyeIcon, X } from "lucide-react"
import { Link } from "react-router-dom"

const formSchema = z.object({
    status: z.string().min(2, {
        message: "status must be provided.",
    }),
    remarks: z.string().min(0, {
        message: "remarks is required when status is rejected",
    })
})
interface CampaignDialogProps {
    campaign: any
    isOpen: boolean
    onOpenChange: (open: boolean) => void
}
export default function AdminCampaignPage() {
    const { authenticate } = useAuthenticate()
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
    const [selectedCampaign, setSelectedCampaign] = useState<any>(null)
    const { data: pendingCampaignData, error: pendingError, loading: pendingLoading, refetch: pendingRefetch } = useFetch('/campaign/pending');
    const { data: rejectedCampaignData, error: rejectedError, loading: rejectedLoading, refetch: rejectedRefetch } = useFetch('/campaign/rejected');
    const { data: approvedCampaignData, error: approvedError, loading: approvedLoading, refetch: approvedRefetch } = useFetch('/campaign/approved');
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            status: "Rejected",
            remarks: "",
        },
    })
    const getStatusBadge = (status: 'Pending' | 'Approved' | 'Rejected') => {
        switch (status) {
            case 'Pending':
                return <Badge variant="secondary">{status}</Badge>
            case 'Approved':
                return <Badge className="bg-green-500 text-black">{status}</Badge>
            case 'Rejected':
                return <Badge variant="destructive">{status}</Badge>
        }
    }

    const onSubmit = async (values: z.infer<typeof formSchema>, campaignId: string) => {
        try {
            const response = await API.patch(`/campaign/status/${campaignId}`, {
                status: 'Rejected',
                remarks: values.remarks
            });
            console.log({ response })
            toast.success('Successfully Removed Data');
            pendingRefetch();
            rejectedRefetch();
            approvedRefetch()
            form.reset()
            setIsDialogOpen(false)
        } catch (e: any) {
            toast.error(e.message)
        }
    }
    const handleStatusUpdate = (campaginId: string, status: 'Rjected' | 'Approved' | 'Pending') => {
        API.patch(`/campaign/status/${campaginId}`, {
            status: status
        }).then(res => {
            toast.success('Successfully Removed Data');
            pendingRefetch();
            rejectedRefetch();
            approvedRefetch()
        }).catch(e => toast.error(e.message))
    }
    if (!authenticate) return <Unauthenticated />
    return (<Layout>
        <CampaignDialog isOpen={isViewDialogOpen} campaign={selectedCampaign} onOpenChange={(value: boolean) => {
            setIsDialogOpen(value)
            if (!value) setSelectedCampaign(null)
        }} />
        <div className="container mx-auto py-10">
            <div className="flex justify-between items-center mb-5">
                <h1 className="text-2xl font-bold">Pending Campaigns</h1>

            </div>

            <Table>
                <TableCaption className={cn(pendingLoading === false && pendingCampaignData?.length === 0 && 'text-red-500')}>{pendingLoading === false && pendingCampaignData?.length === 0 ? `Currently pending campaign list is empty` : `A list of all Pending campaigns`}</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Cover Image</TableHead>
                        <TableHead>Title</TableHead>
                        {/* <TableHead>Description</TableHead> */}
                        <TableHead>Created By</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {pendingLoading === true && <TableRow>Loading! Please wait, Fetching Data</TableRow>}
                    {!pendingLoading && pendingCampaignData?.length > 0 && pendingCampaignData?.map((campaign: any) => (
                        <TableRow key={campaign._id}>
                            <TableCell className="font-medium">
                                <img className="w-32 aspect-square bg-muted mb-4" src={appPublicUrl + campaign.image} />
                            </TableCell>
                            <TableCell className="font-medium">{campaign.title}</TableCell>
                            {/* <TableCell className="line-clamp-1">{campaign.description}</TableCell> */}
                            <TableCell>
                                {campaign.createdBy?.email}

                            </TableCell>
                            <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                            <TableCell>{new Date(campaign.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell>
                                <Button variant={'outline'} onClick={() => {
                                    setSelectedCampaign(campaign)
                                    setIsViewDialogOpen(true)
                                }}><EyeIcon /> View</Button> &nbsp;
                                <Button
                                    onClick={() => {
                                        handleStatusUpdate(campaign._id, 'Approved')
                                    }}
                                ><CheckCircle /> Approved</Button> &nbsp;
                                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button variant={'destructive'}><X /> Reject</Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px]">
                                        <DialogHeader>
                                            <DialogTitle>Add a details reason for rejection of campaign</DialogTitle>
                                        </DialogHeader>
                                        <Form {...form}>
                                            <form onSubmit={form.handleSubmit((values) => onSubmit(values, campaign._id), (error) => toast.error("check the value of: " + Object.keys(error).join(',') + " fields"))} className="space-y-8">
                                                <FormField
                                                    control={form.control}
                                                    name="remarks"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Remarks</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="Campaign rejected reason" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <Button type="submit">Submit</Button>
                                            </form>
                                        </Form>
                                    </DialogContent>
                                </Dialog>
                                {/* <Button variant={'destructive'}
                                    onClick={() => {
                                        API.patch(`/campaign/status/${campaign._id}`, {
                                            status: 'Rejected',
                                            remarks: ''
                                        }).then(res => {
                                            toast.success('Successfully Removed Data');
                                            pendingRefetch();
                                            rejectedRefetch();
                                            approvedRefetch()
                                        }).catch(e => toast.error(e.message))
                                    }}
                                >Reject</Button> */}

                            </TableCell>
                            <TableCell>

                            </TableCell>

                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <div className="flex justify-between items-center mb-5">
                <h1 className="text-2xl font-bold">Rejected Campaigns</h1>

            </div>
            <Table>
                <TableCaption className={cn(rejectedLoading === false && rejectedCampaignData?.length === 0 && 'text-red-500')}>{rejectedLoading === false && rejectedCampaignData?.length === 0 ? `Currently rejected campaign list is empty` : `A list of all Rejected campaigns`}</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Cover Image</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Created By</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead>Remarks</TableHead>
                        <TableHead>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rejectedCampaignData?.length > 0 && rejectedCampaignData?.map((campaign: any) => (
                        <TableRow key={campaign._id}>
                            <TableCell className="font-medium">
                                <img className="w-32 aspect-square bg-muted mb-4" src={appPublicUrl + campaign.image} />
                            </TableCell>
                            <TableCell className="font-medium">{campaign.title}</TableCell>
                            <TableCell>{campaign.description}</TableCell>
                            <TableCell>{campaign.createdBy?.email}</TableCell>
                            <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                            <TableCell>{new Date(campaign.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell>{campaign.remarks}</TableCell>
                            <TableCell>
                                <Button variant={'outline'} onClick={() => {
                                    setSelectedCampaign(campaign)
                                    setIsViewDialogOpen(true)
                                }}><EyeIcon /> View</Button> &nbsp;
                                <Button
                                    onClick={() => {
                                        handleStatusUpdate(campaign._id, "Approved")
                                    }}
                                ><CheckCircle />Approved</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <div className="flex justify-between items-center mb-5">
                <h1 className="text-2xl font-bold">Approved Campaigns</h1>

            </div>
            <Table>
                <TableCaption className={cn(approvedLoading === false && approvedCampaignData?.length === 0 && 'text-red-500')}>{approvedLoading === false && approvedCampaignData?.length === 0 ? `Currently rejected campaign list is empty` : `A list of all Approved campaigns`}</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Cover Image</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Created By</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {approvedCampaignData?.map((campaign: any) => (
                        <TableRow key={campaign._id}>
                            <TableCell className="font-medium">
                                <img className="w-32 aspect-square bg-muted mb-4" src={appPublicUrl + campaign.image} />
                            </TableCell>
                            <TableCell className="font-medium">{campaign.title}</TableCell>
                            <TableCell>{campaign.description}</TableCell>
                            <TableCell>{campaign.createdBy?.email}</TableCell>
                            <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                            <TableCell>{new Date(campaign.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell>
                                <Button variant={'outline'} onClick={() => {
                                    setSelectedCampaign(campaign)
                                    setIsViewDialogOpen(true)
                                }}><EyeIcon />View</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    </Layout >

    )
}

function CampaignDialog({ campaign, isOpen, onOpenChange }: CampaignDialogProps) {
    if (!campaign) return null

    return (
        <Dialog open={isOpen} onOpenChange={(value) => {
            onOpenChange(value)
        }}>
            <DialogContent className="sm:max-w-[525px] w-full" >
                <div className="relative w-full aspect-video bg-muted">
                    <img
                        src={appPublicUrl + campaign.image}
                        alt={campaign.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
                    <DialogHeader className="absolute bottom-0 left-0 right-0 p-6">
                        <DialogTitle className="text-2xl font-bold text-white drop-shadow-md">
                            {campaign.title}
                        </DialogTitle>

                    </DialogHeader>
                </div>
                <div className="p-6 space-y-6">
                    <>
                        <Separator />
                        <div className="space-y-2">
                            <h3 className="text-sm font-medium leading-none">Description</h3>
                            <p className="text-sm text-muted-foreground">
                                {campaign.description}
                            </p>
                        </div>
                    </>
                    {/* Remarks */}
                    {campaign.remarks && (
                        <>
                            <Separator />
                            <div className="space-y-2">
                                <h3 className="text-sm font-medium leading-none">Remarks</h3>
                                <p className="text-sm text-muted-foreground">
                                    {campaign.remarks}
                                </p>
                            </div>
                        </>
                    )}
                    {/* Status Badges */}
                    <div className="flex flex-wrap gap-4 justify-between">
                        <div className="space-y-2">
                            <span className="text-xs text-muted-foreground uppercase">Status</span> &nbsp;
                            <Badge
                                variant={campaign.status === "Rejected" ? "destructive" : "default"}
                                className="ml-0"
                            >
                                {campaign.status}
                            </Badge>
                        </div>
                        <div className="space-y-2">
                            <span className="text-xs text-muted-foreground uppercase">Visibility</span>&nbsp;
                            <Badge
                                variant={campaign.isPublic ? "secondary" : "outline"}
                                className={cn(
                                    "ml-0",
                                    campaign.isPublic && "bg-green-500/15 text-green-600 hover:bg-green-500/25"
                                )}
                            >
                                {campaign.isPublic ? "Public" : "Private"}
                            </Badge>
                        </div>
                    </div>

                    <>
                        <Separator />
                        <div className="space-y-2">
                            <h3 className="text-sm font-medium leading-none">Created User Details:</h3>
                            {/* <pre>
                                {JSON.stringify(campaign.createdBy, null, 2)}
                            </pre> */}
                            <img src={appPublicUrl + campaign?.createdBy.profileImage} className="size-20" alt={campaign.name} />
                            <p className="">
                                <span className="text-xs uppercase">Email</span> &nbsp;
                                <span className="text-sm text-muted-foreground">{campaign.createdBy.email}</span>
                            </p>
                            <p className="">
                                <span className="text-xs uppercase">Name</span> &nbsp;
                                <span className="text-sm text-muted-foreground">{campaign.createdBy.name}</span>
                            </p>
                            <p className="">
                                <span className="text-xs uppercase">Category</span> &nbsp;
                                <span className="text-sm text-muted-foreground">{campaign.createdBy.category}</span>
                            </p>
                            <p className="">
                                <span className="text-xs uppercase">Location</span> &nbsp;
                                <span className="text-sm text-muted-foreground">{campaign.createdBy.location}</span>
                            </p>
                            <p className="">
                                <span className="text-xs uppercase">Description</span> &nbsp;
                                <span className="text-sm text-muted-foreground line-clamp-1">{campaign.createdBy.description}</span>
                            </p>
                            <Link to={'/'} > <ExternalLink />View More User Details</Link>
                        </div>
                    </>

                    {/* Metadata Footer */}
                    <div className="rounded-lg border bg-muted/50 p-4">
                        <div className="grid grid-cols-2 gap-4 text-sm content-between">
                            <div>
                                <div className="text-muted-foreground">Created</div>
                                <div className="font-medium">
                                    {format(new Date(campaign.createdAt), "PPP")}
                                </div>
                            </div>
                            <div>
                                <div className="text-muted-foreground">Updated</div>
                                <div className="font-medium">
                                    {format(new Date(campaign.updatedAt), "PPP")}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
