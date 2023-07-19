import * as React from 'react';
import CreateProductForm from './create-product-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import AdminUploadProductImage from './upload-product-image';


export default function AdminCreateProduct({ handleProductCreated }) {
    return (
        <div>
            <Card className="w-[300px]">
                <CardHeader>
                    <CardTitle>Create Product</CardTitle>
                </CardHeader>
                <CardContent>
                    <CreateProductForm onProductCreated={handleProductCreated} />
                </CardContent>
            </Card>
        </div>
    )
}