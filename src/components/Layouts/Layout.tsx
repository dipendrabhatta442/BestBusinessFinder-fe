import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Input, NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from '../ui'
import useAuthenticate from '@/hooks/useAuthenticate';
import API from '../../utils/api';
import { tokenKey } from '@/utils/constant';
import { toast, Toaster } from 'sonner';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const navigate = useNavigate();
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
    const categories = [
        { name: "Restaurants", to: "/search?category=restaurants" },
        { name: "Retail Shops", to: "/search?category=retail-shops" },
        { name: "Services", to: "/search?category=services" },
        { name: "Health & Wellness", to: "/search?category=health-wellness" },
        { name: "Entertainment", to: "/search?category=entertainment" },
    ]

    return (
        <div className="flex flex-col min-h-screen">
            <Toaster position='top-right' richColors />
            <div className="bg-primary text-primary-foreground py-2 text-center">
                <h1 className="text-2xl font-bold">Local Business Finder</h1>
            </div>
            <header className="border-b sticky top-0 bg-background z-10">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        <NavigationMenu>
                            <NavigationMenuList className="hidden md:flex space-x-2">
                                <NavigationMenuItem>
                                    <NavigationMenuLink
                                        asChild
                                        className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                                    >
                                        <Link to="/">Home</Link>
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                                <NavigationMenuItem>
                                    <NavigationMenuTrigger>Categories</NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <ul className="grid w-[200px] gap-3 p-4">
                                            {categories.map((category) => (
                                                <li key={category.name}>
                                                    <NavigationMenuLink asChild>
                                                        <Link
                                                            to={category.to}
                                                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                                        >
                                                            {category.name}
                                                        </Link>
                                                    </NavigationMenuLink>
                                                </li>
                                            ))}
                                        </ul>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>
                                <NavigationMenuItem>
                                    <NavigationMenuLink
                                        asChild
                                        className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                                    >
                                        <Link to="/about">About Us</Link>
                                    </NavigationMenuLink>
                                </NavigationMenuItem>

                                {!authenticate && <>
                                    <NavigationMenuItem>
                                        <NavigationMenuLink
                                            asChild
                                            className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                                        >
                                            <Link to="/login">Login</Link>
                                        </NavigationMenuLink>
                                    </NavigationMenuItem>
                                    <NavigationMenuItem>
                                        <NavigationMenuLink
                                            asChild
                                            className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                                        >
                                            <Link to="/register">Signup</Link>
                                        </NavigationMenuLink>
                                    </NavigationMenuItem>
                                </>
                                }
                                {authenticate && <>
                                    <NavigationMenuItem>
                                        <NavigationMenuLink
                                            asChild
                                            className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                                        >
                                            <Link to="/profile">Profile</Link>
                                        </NavigationMenuLink>
                                    </NavigationMenuItem>
                                    <NavigationMenuItem>
                                        <NavigationMenuLink
                                            asChild
                                            className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                                        >
                                            <Link to="/" onClick={handleLogout}>Logout</Link>
                                        </NavigationMenuLink>
                                    </NavigationMenuItem>
                                </>}
                            </NavigationMenuList>
                        </NavigationMenu>
                        <div className="flex items-center space-x-2">

                            {authenticate && <>
                                <Button variant="ghost" asChild>
                                    <Link to="/dashboard">Business Dashboard</Link>
                                </Button>
                            </>
                            }
                        </div>
                    </div>
                </div>
            </header>
            <main className="flex-grow bg-background p-6">
                {children}
            </main>
            <footer className="bg-muted text-muted-foreground py-4 px-6 text-center">
                <p>&copy; {new Date().getFullYear()} Local Business Directory. All rights reserved.</p>
            </footer >
        </div>
    )
};

export default Layout;