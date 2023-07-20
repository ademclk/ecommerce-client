import * as React from 'react';
import CreateProductForm from './create-product-form';

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

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