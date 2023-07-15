"use client";

import { MainNav } from "@/components/main-nav";
import * as React from "react"


export default function HomeLayout({
    children,
}: { children: React.ReactNode }) {
    return (
        <>
            {children}
        </>
    )
}