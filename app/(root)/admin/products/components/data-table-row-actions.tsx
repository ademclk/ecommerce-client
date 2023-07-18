"use client"

import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { Row } from "@tanstack/react-table"
import { useToast } from "@/components/ui/use-toast";
import { mutate } from "swr";



import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


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

    return (
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
                <DropdownMenuItem>Show Images</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleDelete}>Delete</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}