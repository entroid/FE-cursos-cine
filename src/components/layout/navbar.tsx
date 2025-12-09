"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from "@headlessui/react"
import { Fragment } from "react"
import { BookOpen, Library, User, Settings, LogOut, Menu as MenuIcon, X } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { useState } from "react"
import { cn } from "@/lib/utils"

export function Navbar() {
    const pathname = usePathname()
    const { data: session, status } = useSession()
    const isAuthenticated = status === "authenticated"
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const routes = [
        {
            href: "/dashboard",
            label: "Mis Cursos",
            icon: BookOpen,
            active: pathname === "/dashboard",
            authOnly: true,
        },
        {
            href: "/catalog",
            label: "Catálogo",
            icon: Library,
            active: pathname === "/catalog",
            authOnly: true,
        },
    ]

    const filteredRoutes = routes.filter(
        (route) => !route.authOnly || isAuthenticated
    )

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="text-xl font-bold tracking-tight">ESCUELA DE CINE</span>
                    </Link>
                </div>

                <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
                    {filteredRoutes.map((route) => (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={cn(
                                "transition-colors hover:text-foreground/80 border-b-[3px] p-1",
                                route.active
                                    ? "text-foreground font-semibold border-primary"
                                    : "text-foreground/60 border-transparent"
                            )}
                        >
                            {route.label}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-4">
                    {isAuthenticated ? (
                        <Menu as="div" className="relative ml-3">
                            <div>
                                <MenuButton className="relative flex rounded-full bg-main text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                    <span className="absolute -inset-1.5" />
                                    <span className="sr-only">Open user menu</span>
                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                        {session?.user?.name?.[0] || "U"}
                                    </div>
                                </MenuButton>
                            </div>
                            <Transition
                                as={Fragment}
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                            >
                                <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-background py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none border border-border">
                                    <div className="px-4 py-2 border-b border-border">
                                        <p className="text-sm font-medium leading-none">{session?.user?.name}</p>
                                        <p className="text-xs leading-none text-muted-foreground mt-1">
                                            {session?.user?.email}
                                        </p>
                                    </div>
                                    <MenuItem>
                                        {({ active }) => (
                                            <Link
                                                href="/profile"
                                                className={cn(
                                                    active ? "bg-muted" : "",
                                                    "flex items-center px-4 py-2 text-sm text-foreground"
                                                )}
                                            >
                                                <User className="mr-2 h-4 w-4" />
                                                Perfil
                                            </Link>
                                        )}
                                    </MenuItem>
                                    <MenuItem>
                                        {({ active }) => (
                                            <Link
                                                href="/settings"
                                                className={cn(
                                                    active ? "bg-muted" : "",
                                                    "flex items-center px-4 py-2 text-sm text-foreground"
                                                )}
                                            >
                                                <Settings className="mr-2 h-4 w-4" />
                                                Configuración
                                            </Link>
                                        )}
                                    </MenuItem>
                                    <MenuItem>
                                        {({ active }) => (
                                            <button
                                                onClick={() => signOut()}
                                                className={cn(
                                                    active ? "bg-muted" : "",
                                                    "flex w-full items-center px-4 py-2 text-sm text-foreground"
                                                )}
                                            >
                                                <LogOut className="mr-2 h-4 w-4" />
                                                Cerrar Sesión
                                            </button>
                                        )}
                                    </MenuItem>
                                </MenuItems>
                            </Transition>
                        </Menu>
                    ) : (
                        <div className="hidden md:flex items-center space-x-4">
                            <Link href="/login" className="text-sm font-medium hover:underline">
                                Iniciar Sesión
                            </Link>
                            <Link
                                href="/register"
                                className="inline-flex h-9 items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                            >
                                Registrarse
                            </Link>
                        </div>
                    )}

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? (
                            <X className="h-6 w-6" />
                        ) : (
                            <MenuIcon className="h-6 w-6" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden border-t border-border bg-background"
                    >
                        <div className="space-y-1 px-4 pb-3 pt-2">
                            {filteredRoutes.map((route) => (
                                <Link
                                    key={route.href}
                                    href={route.href}
                                    className={cn(
                                        "block rounded-md px-3 py-2 text-base font-medium transition-colors",
                                        route.active
                                            ? "bg-muted text-foreground"
                                            : "text-foreground/60 hover:bg-muted hover:text-foreground"
                                    )}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {route.label}
                                </Link>
                            ))}
                            {!isAuthenticated && (
                                <>
                                    <Link
                                        href="/login"
                                        className="block rounded-md px-3 py-2 text-base font-medium text-foreground/60 hover:bg-muted hover:text-foreground"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Iniciar Sesión
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="block rounded-md px-3 py-2 text-base font-medium text-foreground/60 hover:bg-muted hover:text-foreground"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Registrarse
                                    </Link>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    )
}
