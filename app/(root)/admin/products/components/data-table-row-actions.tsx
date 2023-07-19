"use client"

import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { useToast } from "@/components/ui/use-toast";
import { mutate } from "swr";

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import AdminUploadProductImage from "./upload-product-image";
import { useState } from "react";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';


interface DataTableRowActionsProps<TData> {
    cell,
    pageIndex,
    pageSize
}

export function DataTableRowActions<TData>({
    cell,
    pageIndex,
    pageSize
}: DataTableRowActionsProps<TData>) {
    const [showImageUpload, setShowImageUpload] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const { toast } = useToast();

    async function handleDelete() {
        try {
            const response = await fetch(`${process.env.baseUrl}Products/${cell.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                mutate([pageIndex, pageSize]);
                toast({
                    variant: 'default',
                    title: 'Success!',
                    description: 'Product has been deleted.',
                });
            } else {
                throw new Error('Failed to delete product.');
            }
        } catch (error) {
            console.error(error);
            toast({
                variant: 'destructive',
                title: 'Error!',
                description: 'Failed to delete product.',
            });
        }
    }

    async function handleImageUpload() {
        setShowImageUpload(true);
    }

    async function handleImageUploadDialog() {
        setShowImageUpload(false);
    }

    async function handleDeleteDialog() {
        setShowDeleteConfirm(true);
    }

    async function handleDeleteAction() {
        handleDelete();
        setShowDeleteConfirm(false);
    }

    async function handleProductDeleteDialog() {
        setShowDeleteConfirm(false);
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
                    >
                        <DotsHorizontalIcon className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[160px]">
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem onClick={handleImageUpload}>Upload Image</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleDeleteDialog}>Delete</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialog open={showImageUpload}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Upload Product Image</AlertDialogTitle>
                        <AdminUploadProductImage cellId={cell.id} />
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={handleImageUploadDialog}>Close</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={showDeleteConfirm}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Product</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={handleDeleteAction}>Confirm</AlertDialogAction>
                        <AlertDialogCancel onClick={handleProductDeleteDialog}>Close</AlertDialogCancel>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}