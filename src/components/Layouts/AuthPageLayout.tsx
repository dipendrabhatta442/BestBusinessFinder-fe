import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger, Input, NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle, Sheet, SheetContent, SheetTrigger } from '../ui'
import { Menu, Search } from 'lucide-react';
import useAuthenticate from '@/hooks/useAuthenticate';
import API from '../../utils/api';
import { tokenKey } from '@/utils/constant';
import { Navigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';

const AuthPageLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const navigate = useNavigate();
    const { authenticate } = useAuthenticate()
    let { pathname } = useLocation();
    if (authenticate) return <Navigate to={'/'} replace={true} />

    return (
        <div className="flex flex-col min-h-screen">
            <Toaster position='top-right' richColors />

            <div className="bg-primary text-primary-foreground py-2 text-center">
                <h1 className="text-2xl font-bold">Local Business Finder</h1>
            </div>
            <header className="border-b sticky top-0 bg-background z-10">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-center h-16">
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

                                {pathname.includes('login') && <NavigationMenuItem>
                                    <NavigationMenuLink
                                        asChild
                                        className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                                    >
                                        <Link to="/register">Signup</Link>
                                    </NavigationMenuLink>
                                </NavigationMenuItem>}

                                {pathname.includes('register') && <NavigationMenuItem>
                                    <NavigationMenuLink
                                        asChild
                                        className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                                    >
                                        <Link to="/login">Login</Link>
                                    </NavigationMenuLink>
                                </NavigationMenuItem>}


                            </NavigationMenuList>
                        </NavigationMenu>

                    </div>
                </div>
            </header>
            <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
                {children}
            </main>
            <footer className="bg-muted text-muted-foreground py-4 px-6 text-center">
                <p>&copy; {new Date().getFullYear()} Local Business Directory. All rights reserved.</p>
            </footer >
        </div >
    )
};

export default AuthPageLayout;