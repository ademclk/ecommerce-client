"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"


export function MainNav() {
    const pathname = usePathname()

    return (
        <div className="mr-4 hidden md:flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
                <span className="hidden font-bold sm:inline-block">
                    ECommerce
                </span>
            </Link>
            <nav className="flex items-center space-x-6 text-sm font-medium">
                <Link
                    href="/products"
                    className={cn(
                        "transition-colors hover:text-foreground/80",
                        pathname === "/docs" ? "text-foreground" : "text-foreground/60"
                    )}
                >
                    Products
                </Link>
                <Link
                    href="/basket"
                    className={cn(
                        "transition-colors hover:text-foreground/80",
                        pathname?.startsWith("/docs/components")
                            ? "text-foreground"
                            : "text-foreground/60"
                    )}
                >
                    Basket
                </Link>
                <Link
                    href="/admin"
                    className={cn(
                        "transition-colors hover:text-foreground/80",
                        pathname?.startsWith("/examples")
                            ? "text-foreground"
                            : "text-foreground/60"
                    )}
                >
                    Admin
                </Link>
                <Link
                    href="/signup"
                    className={cn(
                        "transition-colors hover:text-foreground/80",
                        pathname?.startsWith("/examples")
                            ? "text-foreground"
                            : "text-foreground/60"
                    )}
                >
                    Signup
                </Link>
            </nav>
        </div>
    )
}