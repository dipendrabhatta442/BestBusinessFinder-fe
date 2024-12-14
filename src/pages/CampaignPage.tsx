"use client"

import { useEffect, useState } from "react"
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
import { Delete, DeleteIcon, LucideDelete, Trash } from "lucide-react"
import { Card, CardContent, CardTitle } from "@/components/ui"

interface Campaign {
    _id: string
    title: string
    description: string
    createdBy: string
    status: 'Pending' | 'Approved' | 'Rejected'
    createdAt: string
    image?: File
}



const MAX_FILE_SIZE = 5000000 // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]

const formSchema = z.object({
    title: z.string().min(2, {
        message: "Title must be at least 2 characters.",
    }),
    description: z.string().min(10, {
        message: "Description must be at least 10 characters.",
    }),
    image: z
        .any()
        .refine((files) => files?.length == 1, "Image is required.")
        .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
        .refine(
            (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
            ".jpg, .jpeg, .png and .webp files are accepted."
        ),
})

export default function CampaignList() {
    const { authenticate } = useAuthenticate()
    const { data: campaignData, error, loading, refetch } = useFetch('/campaign/user');

    const [campaigns, setCampaigns] = useState<Campaign[]>([])
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
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

    const onSubmit = async (values: z.infer<typeof formSchema>) => {

        const formdata = new FormData();
        formdata.append('title', values.title)
        formdata.append('image', values.image[0])
        formdata.append('description', values.description)
        const response = await API.post('/campaign', formdata, {
            headers: {
                "Content-Type": 'multipart/form-data'
            }
        });
        toast.success(response.data.message)
        refetch();
        setIsDialogOpen(false)
        form.reset()
    }
    useEffect(() => {
        if (campaignData) {
            setCampaigns(campaignData)
        }
    }, [campaignData])
    if (!authenticate) return <Unauthenticated />
    const image = form.watch('image');
    return (<Layout>

        <div className="container mx-auto py-10">
            <div className="flex justify-between items-center mb-5">
                <h1 className="text-2xl font-bold">Campaigns</h1>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>Create Campaign</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Create New Campaign</DialogTitle>
                        </DialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit, (error) => toast.error("check the value of: " + Object.keys(error).join(',') + " fields"))} className="space-y-8">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Title</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Campaign title" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Campaign description"
                                                    className="resize-none"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="image"
                                    render={({ field: { onChange, value, ...rest } }) => (
                                        <FormItem>
                                            <FormLabel>Image</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => onChange(e.target.files)}
                                                    {...rest}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {image && <Card className='w-44 p-2'
                                ><CardTitle> Preview</CardTitle>
                                    <CardContent className="p-6">
                                        <img className="w-full aspect-square bg-muted mb-4" src={URL.createObjectURL(image[0] as File)} />
                                    </CardContent>
                                </Card>
                                }
                                <Button type="submit">Submit</Button>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>
            <Table>
                <TableCaption>A list of all campaigns</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>SN</TableHead>
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
                    {campaignData?.map((campaign: any, index: number) => (
                        <TableRow key={campaign._id + index}>
                            <TableCell className="font-medium">{index + 1}</TableCell>
                            <TableCell className="font-medium">
                                <img className="w-32 aspect-square bg-muted mb-4" src={appPublicUrl + campaign.image} />
                            </TableCell>
                            <TableCell className="font-medium">{campaign.title}</TableCell>
                            <TableCell>{campaign.description}</TableCell>
                            <TableCell>{campaign.createdBy}</TableCell>
                            <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                            <TableCell>{new Date(campaign.createdAt).toLocaleDateString()}</TableCell>

                            <TableCell><Button variant={'ghost'} onClick={() => {
                                API.delete(`/campaign/${campaign._id}`).then(res => {
                                    toast.success('Successfully Removed Data');
                                    refetch();
                                }).catch(e => toast.error(e.message))
                            }}> <Trash color="red" /> </Button></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    </Layout>

    )
}