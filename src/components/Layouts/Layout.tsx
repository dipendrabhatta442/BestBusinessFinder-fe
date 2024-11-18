import React from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, Sheet, SheetContent, SheetTrigger } from '../ui'
import useAuthenticate from '@/hooks/useAuthenticate';
import API from '../../utils/api';
import { tokenKey } from '@/utils/constant';
import { toast, Toaster } from 'sonner';
import { ChevronDown, Menu } from 'lucide-react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = React.useState(false)
    const location = useLocation()
    const { authenticate, setAuthenticate } = useAuthenticate()
    const handleLogout = async () => {
        try {
            const response = await API.post('/auth/logout');
            toast.success('Logout successful!');
        } catch (error) {
            toast.success('logout failed:');
            alert("Something went wrong!!");
        } finally {
            setIsOpen(false)
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
            <header className="">
                <div className="container mx-auto px-4">
                    <nav className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link to="/" className="block md:hidden text-xl font-bold">
                            LBC
                            {/* {(location?.pathname === '/' ? 'Home' : location?.pathname.slice(1))} */}
                        </Link>
                        <div className="hidden md:flex items-center gap-6">
                            <Link
                                to="/"
                                className="text-sm font-medium hover:text-muted-foreground"
                            >
                                Home
                            </Link>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="text-sm font-medium hover:text-black flex items-center gap-1 h-auto p-1"
                                    >
                                        Categories
                                        <ChevronDown className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start">
                                    {categories.map((category) => (
                                        <DropdownMenuItem key={'layout' + category.to + 'desktop'}>
                                            <Link
                                                to={category.to}
                                                className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                            >
                                                {category.name}
                                            </Link>
                                        </DropdownMenuItem>
                                    ))}

                                </DropdownMenuContent>
                            </DropdownMenu>
                            <Link
                                to="/about"
                                className="text-sm font-medium hover:text-muted-foreground"
                            >
                                About Us
                            </Link>
                            {authenticate && <>
                                <Link
                                    to="/profile"
                                    className="text-sm font-medium hover:text-muted-foreground"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Profile
                                </Link>
                                <Link
                                    to="#"
                                    className="text-sm font-medium hover:text-muted-foreground"
                                    onClick={() => handleLogout}
                                >
                                    Logout
                                </Link>
                            </>
                            }
                            {!authenticate && <>
                                <Link
                                    to="/login"
                                    className="text-sm font-medium hover:text-muted-foreground"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="text-sm font-medium hover:text-muted-foreground"
                                >
                                    Register
                                </Link>
                            </>
                            }
                        </div>
                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-6">

                            <Link
                                to="/dashboard"
                                className="text-sm font-medium bg-primary-foreground text-primary px-4 py-2 rounded-md hover:bg-primary-foreground/90"
                            >
                                Business Dashboard
                            </Link>
                        </div>

                        {/* Mobile Navigation */}
                        <Sheet open={isOpen} onOpenChange={setIsOpen}>
                            <SheetTrigger asChild className="md:hidden">
                                <Button variant="ghost" size="icon">
                                    <Menu className="h-6 w-6" />
                                    <span className="sr-only">Toggle menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                                <nav className="flex flex-col gap-4">
                                    <Link
                                        to="/"
                                        className="text-lg font-medium"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Home
                                    </Link>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                className="text-lg font-medium flex items-center justify-start gap-1 h-auto p-0"
                                            >
                                                Categories
                                                <ChevronDown className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            {categories.map((category) => (
                                                <DropdownMenuItem key={'layout' + category.to}>
                                                    <Link
                                                        to={category.to}
                                                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                                    >
                                                        {category.name} xsdfsd
                                                    </Link>
                                                </DropdownMenuItem>
                                            ))}

                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                    <Link
                                        to="/about"
                                        className="text-lg font-medium"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        About Us
                                    </Link>
                                    {authenticate && <>
                                        <Link
                                            to="/profile"
                                            className="text-lg font-medium"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            Profile
                                        </Link>
                                        <Link
                                            to="#"
                                            className="text-lg font-medium"
                                            onClick={() => handleLogout}
                                        >
                                            Logout
                                        </Link>
                                    </>
                                    }
                                    {!authenticate && <>
                                        <Link
                                            to="/login"
                                            className="text-lg font-medium"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            Login
                                        </Link>
                                        <Link
                                            to="/register"
                                            className="text-lg font-medium"
                                            onClick={() => handleLogout}
                                        >
                                            Register
                                        </Link>
                                    </>
                                    }
                                    <Link
                                        to="/dashboard"
                                        className="text-lg font-medium"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Business Dashboard
                                    </Link>
                                </nav>
                            </SheetContent>
                        </Sheet>
                    </nav>
                </div>
            </header >
            <main className="flex-grow bg-background p-6">
                {children}
            </main>
            <footer className="bg-muted text-muted-foreground py-4 px-6 text-center">
                <p>&copy; {new Date().getFullYear()} Local Business Directory. All rights reserved.</p>
            </footer >
        </div >
    )
};

export default Layout;