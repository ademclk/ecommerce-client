import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { mutate } from 'swr';

const CreateProductFormSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters."
    }).max(150, {
        message: "Name cannot be longer than 150 characters."
    }),
    description: z.string().min(9, {
        message: "Description must be at least 10 characters."
    }).max(500, {
        message: "Description cannot be longer than 500 characters."
    }),
    stock: z.number().nonnegative({
        message: "Stock cannot be negative."
    }).int({
        message: "Only whole numbers are accepted."
    }).positive({
        message: "Stock should be greater than 0."
    }),
    price: z.number({
        invalid_type_error: "Price should be a number."
    }).nonnegative({
        message: "Price cannot be negative."
    }).positive({
        message: "Price should be greater than 0."
    })
});

export default function CreateProductForm({ onProductCreated }) {
    const [showDialog, setShowDialog] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const CreateProductForm = useForm<z.infer<typeof CreateProductFormSchema>>({
        resolver: zodResolver(CreateProductFormSchema),
        defaultValues: {
            name: "",
            description: "",
            stock: 0,
            price: 0
        }
    });

    function openDialog() {
        if (CreateProductForm.formState.isValid) {
            setShowDialog(true);
        }
    }

    function closeAction() {
        setShowDialog(false);
    }

    async function confirmAction() {
        setShowDialog(false);

        setIsSubmitting(true);
        try {
            await submitForm();
        } catch (error) {
            console.error(error);
        }

        setIsSubmitting(false);
    }

    async function submitForm() {
        const values = CreateProductForm.getValues();
        const response = await fetch('https://localhost:7068/api/Products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(values)
        });

        setIsSubmitting(false);

        if (response.ok) {
            CreateProductForm.reset();
            onProductCreated();
        } else {
            const data = await response.json();
            throw new Error(data.message);
        }
    }

    return (
        <>
            <Form {...CreateProductForm}>
                <form className="space-y-3" onSubmit={CreateProductForm.handleSubmit(openDialog)}>
                    <FormField control={CreateProductForm.control} name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Name of the product" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField control={CreateProductForm.control} name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Input placeholder="Description of the product" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField control={CreateProductForm.control} name="stock"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Stock</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField control={CreateProductForm.control} name="price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Price</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type='submit' disabled={isSubmitting}>
                        {isSubmitting ? "Submitting..." : "Submit"}
                    </Button>
                </form>
            </Form>

            <Dialog open={showDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Submit</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to create this product?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button onClick={confirmAction}>Confirm</Button>
                        <Button onClick={closeAction}>Cancel</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
