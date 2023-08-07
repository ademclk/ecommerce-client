"use client"

import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { useToast } from "@/components/ui/use-toast";
import { mutate } from "swr";
import Image from "next/image";

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
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";


interface DataTableRowActionsProps<TData> {
    cell,
    pageIndex,
    pageSize
}

interface ProductImageResponse {
    id: string,
    path: string,
    fileName: string
}

export function DataTableRowActions<TData>({
    cell,
    pageIndex,
    pageSize
}: DataTableRowActionsProps<TData>) {
    const [showImageUpload, setShowImageUpload] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showDeleteImageConfirm, setShowDeleteImageConfirm] = useState(false);
    const [showImageGallery, setShowImageGallery] = useState(false);
    const [images, setImages] = useState<ProductImageResponse[]>([]);
    const [loadingImages, setLoadingImages] = useState(false);
    const [imageToDelete, setImageToDelete] = useState<ProductImageResponse | null>(null);

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

    async function getProductImages(id: string) {
        try {
            const response = await fetch(`${process.env.baseUrl}Products/GetImages/${cell.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const imageData = await response.json() as ProductImageResponse[];
                setImages(imageData);
                setLoadingImages(false);
            } else {
                throw new Error('Failed to get product images.');
            }
        } catch (error) {
            console.error(error);
            setLoadingImages(false);
            toast({
                variant: 'destructive',
                title: 'Error!',
                description: 'Failed to get product images.',
            });
        }
    }

    async function deleteProductImage(productId: string, imageId: string) {
        try {
            const response = await fetch(`${process.env.baseUrl}Products/DeleteImage/${productId}/${imageId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                setImages((prevImages) => prevImages.filter((image) => image.id !== imageId));

                toast({
                    variant: 'default',
                    title: 'Success!',
                    description: 'Product image has been deleted.',
                });
            } else {
                throw new Error('Failed to delete product image.');
            }
        } catch (error) {
            console.error(error);
            toast({
                variant: 'destructive',
                title: 'Error!',
                description: 'Failed to delete product image.',
            });
        }
    }

    async function openImageUploadDialog() {
        setShowImageUpload(false);
    }

    async function closeImageUploadDialog() {
        setShowImageUpload(true);
    }

    async function openProductDeleteDialog() {
        setShowDeleteConfirm(true);
    }

    async function closeProductDeleteDialog() {
        setShowDeleteConfirm(false);
    }

    async function closeProductImageDeleteDialog() {
        setShowDeleteImageConfirm(false);
    }

    async function openImageGalleryDialog() {
        setLoadingImages(true);
        setShowImageGallery(true);
        await getProductImages(cell.id);
        setLoadingImages(false);
    }

    async function closeImageGalleryDialog() {
        setShowImageGallery(false);
    }

    async function handleDeleteAction() {
        handleDelete();
        setShowDeleteConfirm(false);
    }

    async function handleDeleteProductImage(image: ProductImageResponse) {
        setShowDeleteImageConfirm(true);
        setImageToDelete(image);
    }

    async function confirmProductImageDelete() {
        if (imageToDelete) {
            await deleteProductImage(cell.id, imageToDelete.id);
            setImageToDelete(null);
            setShowDeleteImageConfirm(false);
        }
    }

    return (
        <div>
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
                    <DropdownMenuItem onClick={openImageGalleryDialog}>Image Gallery</DropdownMenuItem>
                    <DropdownMenuItem onClick={closeImageUploadDialog}>Upload Image</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={openProductDeleteDialog}>Delete</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialog open={showImageUpload}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Upload Product Image</AlertDialogTitle>
                        <AdminUploadProductImage cellId={cell.id} />
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={openImageUploadDialog}>Close</AlertDialogAction>
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
                        <AlertDialogCancel onClick={closeProductDeleteDialog}>Close</AlertDialogCancel>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={showImageGallery}>
                {images.length > 0 ? (
                    <AlertDialogContent className={"lg:max-w-screen-lg overflow-y-scroll max-h-screen"}>
                        <AlertDialogTitle>
                            Image Gallery of {cell.name}
                        </AlertDialogTitle>
                        <div className="grid grid-cols-3 gap-4">
                            {images.map((image, index) => (
                                <Card key={index}>
                                    <CardContent>
                                        <AspectRatio ratio={16 / 9}>
                                            <Image
                                                src={`https://ademclkstorage.blob.core.windows.net/${image.path}`}
                                                alt={image.fileName}
                                                fill
                                                className="rounded-md"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                priority
                                            />
                                        </AspectRatio>
                                        <Button
                                            variant="destructive"
                                            className="w-full mt-2"
                                            onClick={() => handleDeleteProductImage(image)}
                                        >
                                            Delete
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                        <AlertDialogFooter>
                            <AlertDialogAction onClick={closeImageGalleryDialog}>Close</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                ) : (
                    loadingImages ? (
                        <AlertDialogContent>
                            <AlertDialogTitle>Loading...</AlertDialogTitle>
                        </AlertDialogContent>
                    ) : (
                        <AlertDialogContent>
                            <AlertDialogTitle>No images found.</AlertDialogTitle>
                            <AlertDialogFooter>
                                <AlertDialogAction onClick={closeImageGalleryDialog}>Close</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    )
                )}
            </AlertDialog>

            <AlertDialog open={showDeleteImageConfirm}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Product Image</AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogDescription>Image will be deleted forever. Are you sure?</AlertDialogDescription>
                    <AlertDialogAction onClick={confirmProductImageDelete}>Confirm</AlertDialogAction>
                    <AlertDialogCancel onClick={closeProductImageDeleteDialog}>Cancel</AlertDialogCancel>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}