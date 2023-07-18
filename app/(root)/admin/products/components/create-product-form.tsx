import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from "@/components/ui/use-toast";

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const CreateProductFormSchema = z.object({
    name: z
        .string()
        .min(2, {
            message: 'Name must be at least 2 characters.',
        })
        .max(150, {
            message: 'Name cannot be longer than 150 characters.',
        }),
    description: z
        .string()
        .min(9, {
            message: 'Description must be at least 10 characters.',
        })
        .max(500, {
            message: 'Description cannot be longer than 500 characters.',
        }),
    stock: z
        .number()
        .nonnegative({
            message: 'Stock cannot be negative.',
        })
        .int({
            message: 'Only whole numbers are accepted.',
        })
        .positive({
            message: 'Stock should be greater than 0.',
        }),
    price: z
        .number({
            invalid_type_error: 'Price should be a number.',
        })
        .nonnegative({
            message: 'Price cannot be negative.',
        })
        .positive({
            message: 'Price should be greater than 0.',
        }),
});

export default function CreateProductForm({ onProductCreated }) {
    const [showDialog, setShowDialog] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { toast } = useToast();

    const CreateProductForm = useForm({
        resolver: zodResolver(CreateProductFormSchema),
        defaultValues: {
            name: '',
            description: '',
            stock: 0,
            price: 0,
        },
    });

    useEffect(() => {
        CreateProductForm.register('name');
        CreateProductForm.register('description');
        CreateProductForm.register('stock');
        CreateProductForm.register('price');
    }, []);

    async function openDialog() {
        try {
            await CreateProductForm.trigger();
            if (CreateProductForm.formState.isValid) {
                setShowDialog(true);
            } else {
                toast({
                    variant: "destructive",
                    title: "Validation Error!",
                    description: "Check the form and try again.",
                });
            }
        } catch (error) {
            console.error(error);
        }
    }

    function closeDialog() {
        setShowDialog(false);
    }

    async function confirmAction() {
        closeDialog();

        try {
            await CreateProductForm.handleSubmit(submitForm)();
        } catch (error) {
            console.error(error);
        }
    }

    async function submitForm(values) {
        setIsSubmitting(true);
        try {
            const response = await fetch(`${process.env.baseUrl}Products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            setIsSubmitting(false);

            if (response.ok) {
                CreateProductForm.reset();
                onProductCreated();
                toast({
                    variant: "default",
                    title: "Successful!",
                    description: "Product has been created",
                });
            } else {
                const data = await response.json();
                throw new Error(data.message);
            }
        } catch (error) {
            console.error(error);
            setIsSubmitting(false);
        }
    }

    return (
        <>
            <Form {...CreateProductForm}>
                <form className="space-y-3" onSubmit={CreateProductForm.handleSubmit(openDialog)}>
                    <FormField
                        control={CreateProductForm.control}
                        name="name"
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
                    <FormField
                        control={CreateProductForm.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Description of the product" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={CreateProductForm.control}
                        name="stock"
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
                    <FormField
                        control={CreateProductForm.control}
                        name="price"
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
                    <Button type="submit" disabled={isSubmitting} onClick={openDialog}>
                        {isSubmitting ? 'Submitting...' : 'Submit'}
                    </Button>
                </form>
            </Form>

            <AlertDialog open={showDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Submit</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to create this product?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={closeDialog}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmAction}>Confirm</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
