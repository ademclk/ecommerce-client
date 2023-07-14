"use client";

import * as React from "react"

import MainNav from "./components/main-nav";

export default function HomeLayout({
    children,
}: { children: React.ReactNode }) {
    return (
        <>
            <div className="hidden flex-col md:flex">
                <div className="border-b">
                    <div className="flex h-16 items-center px-4">

                        <MainNav className="mx-6" />

                        <div className="ml-auto flex items-center blur-lg space-x-4">

                        </div>
                    </div>
                </div>
            </div>

            {children}

        </>
    )
}