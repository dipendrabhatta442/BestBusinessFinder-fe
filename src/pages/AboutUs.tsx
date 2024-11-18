import Layout from '@/components/Layouts/Layout'
import { Card, CardContent, CardHeader } from '@/components/ui'
import { AppWindow, BookOpenText, Bug, Database, DockIcon, Network, SquareMenu, UserCheck } from 'lucide-react'

function AboutUs() {
    return (
        <Layout>  <div className="container py-12">
            <section className="space-y-6 text-center">
                <h1 className="text-3xl font-bold">Welcome to Local Business Directory</h1>
                <p className="mx-auto max-w-[800px] text-muted-foreground">
                    Our mission is to connect customers with local businesses, making it easy to discover, review and engage with local restaurants, retail shops, services, and more. We are dedicated to supporting the growth of local businesses by improving their online visibility and accessibility.
                </p>
            </section>

            <section className="mt-16">
                <h2 className="text-2xl font-bold text-center mb-8">Our values</h2>
                <div className="grid gap-6 md:grid-cols-3">
                    <Card>
                        <CardHeader className="font-bold">Community Focus</CardHeader>
                        <CardContent>
                            We believe in the power of local businesses to build and strengthen communities.
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="font-bold">Transparency</CardHeader>
                        <CardContent>
                            We are committed to providing honest, reliable information to help customers make informed decisions.
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="font-bold">Quality Service</CardHeader>
                        <CardContent>
                            We strive to deliver a user-friendly platform that offers the best experience for both businesses and customers.
                        </CardContent>
                    </Card>
                </div>
            </section>

            <section className="mt-16">
                <h2 className="text-2xl font-bold text-center mb-8">Meet Our Team</h2>
                <div className="grid gap-8 md:grid-cols-4">
                    {[
                        { name: 'Dipendra Bhatta', position: 'Project Manager', icon: SquareMenu },
                        { name: 'Tianhang Fang', position: 'Developer/Database Designer', icon: Database },
                        { name: 'Mamata Thapa & Sulav Sakya', position: 'Front-end Designer', icon: AppWindow },
                        { name: 'Hamza Farooq, Deepak Tamang', position: 'Tester', icon: Bug },
                        { name: 'Harshana Chathura, Amandeep Kaur', position: 'Data Analyst', icon: BookOpenText },
                        { name: 'Suraj Parsai, Mamata Thapa', position: 'Netweork Designer', icon: Network }
                    ].map(({ name, position, icon: Icon }) => (
                        <Card key={name} className="text-center">
                            <CardContent className="pt-6">
                                <div className="mb-4 flex justify-center">
                                    <Icon className="h-16 w-16 text-primary" />
                                    {/* <img
                                        src="/placeholder.svg"
                                        alt={`Team Member ${member}`}
                                        width={200}
                                        height={200}
                                        className="rounded-full mx-auto"
                                    /> */}
                                </div>
                                <h3 className="font-semibold">{position}</h3>
                                <p className="text-sm text-muted-foreground">{name}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>
        </div></Layout>
    )
}

export default AboutUs