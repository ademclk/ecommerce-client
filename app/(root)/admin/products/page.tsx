"use client";

import { Product } from "@/lib/models/product"
import { columns } from "./columns"
import { DataTable } from "./data-table"

import useSWR from "swr"
import { useState } from "react";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableProvider } from "./data-table-context";

const fetcher = (path) => fetch(`https://localhost:7068/api${path}`).then(r => r.json())


export default function ProductPage() {
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(5);

    const { data, error } = useSWR(`/Products?Page=${pageIndex}&Size=${pageSize}`, fetcher);

    if (error) {
        console.error(error);
        return (
            <div className="container mx-auto py-10">
                Error loading data.
            </div>
        );
    }

    if (!data) {
        return (
            <div className="container mx-auto py-10">
                Loading...
            </div>
        );
    }

    const { totalCount, products } = data;

    return (
        <div className="container mx-auto py-10">
            <DataTableProvider
                totalCount={totalCount}
                pageIndex={pageIndex}
                pageSize={pageSize}
                setPageSize={setPageSize}
                setPageIndex={setPageIndex}
            >
                <DataTable columns={columns} data={products} />
                <DataTablePagination />
            </DataTableProvider>
        </div>
    );
}
