"use client";
import * as React from 'react';

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import SignUpForm from './components/sign-up-form';

export default function Signup() {
    return (
        <div className="flex justify-center items-center h-screen">
            <div className="p-4">
                <Card className='w-[500px]'>
                    <CardHeader>
                        <CardTitle>
                            Sign Up
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <SignUpForm />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
