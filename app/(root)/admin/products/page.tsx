"use client";

import { columns } from "./components/columns"
import { DataTable } from "./components/data-table"

import useSWR, { mutate } from "swr"
import { useState } from "react";
import { DataTablePagination } from "./components/data-table-pagination";
import { DataTableProvider } from "./components/data-table-context";
import AdminCreateProduct from "./components/create-product";
import * as React from "react"
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";


const fetcher = (path) => fetch(`https://localhost:7068/api${path}`).then(r => r.json())

async function fetchData(pageIndex, pageSize) {
    const path = `/Products?Page=${pageIndex}&Size=${pageSize}`;
    const response = await fetcher(path);
    return response;
}


export default function ProductPage() {
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(5);

    const { data, error } = useSWR([pageIndex, pageSize], () => fetchData(pageIndex, pageSize));

    const handleProductCreated = () => {
        mutate([pageIndex, pageSize]);
    };

    if (error) {
        return (
            <div className="flex flex-col p-8 md:flex-row">
                <div className="w-full md:w-1/3 pr-4">
                    <AdminCreateProduct handleProductCreated={handleProductCreated} />
                </div>
                <div className="w-full pl-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Error while fetching data!</CardTitle>
                            <CardDescription>{error.message}</CardDescription>
                        </CardHeader>
                    </Card>
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="flex flex-col p-8 md:flex-row">
                <div className="w-full md:w-1/3 pr-4">
                    <AdminCreateProduct handleProductCreated={handleProductCreated} />
                </div>
                <div className="w-full pl-4">
                    <Skeleton className="w-full h-[400px]" />
                </div>
            </div>
        );
    }

    const { totalCount, products } = data;

    return (
        <div className="flex flex-col p-8 md:flex-row">
            <div className="w-full md:w-1/3 pr-4">
                <AdminCreateProduct handleProductCreated={handleProductCreated} />
            </div>
            <div className="w-full pl-4">
                <DataTableProvider
                    totalCount={totalCount}
                    pageIndex={pageIndex}
                    pageSize={pageSize}
                    setPageSize={setPageSize}
                    setPageIndex={setPageIndex}
                >
                    <DataTable columns={columns} data={products} />
                    <div className="w-full mt-4">
                        <DataTablePagination />
                    </div>
                </DataTableProvider>
            </div>
        </div>
    );
}
