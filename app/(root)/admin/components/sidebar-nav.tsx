"use client";

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import { ScrollArea } from "@/components/ui/scroll-area"
import Link from "next/link";


interface SidebarNavProps extends React.HTMLAttributes<HTMLDivElement> {
    items: {
        href: string,
        title: string,
    }[]
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
    const pathname = usePathname()

    return (
        <>
            <nav
                className={cn(
                    "flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1",
                    className
                )}
                {...props}
            >
                {items.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        placeholder=""
                        className={cn(
                            buttonVariants({ variant: "outline" }),
                            pathname === item.href
                                ? "bg-muted hover:bg-muted"
                                : "hover:bg-transparent hover:underline",
                            "justify-start"
                        )}
                    >
                        {item.title}
                    </Link>
                ))}
            </nav>
        </>
    )
}