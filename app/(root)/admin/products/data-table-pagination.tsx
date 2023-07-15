import {
    ChevronLeftIcon,
    ChevronRightIcon,
    DoubleArrowLeftIcon,
    DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useDataTableContext } from './data-table-context';

export function DataTablePagination() {
    const { totalCount, pageIndex, pageSize, setPageSize, setPageIndex } = useDataTableContext();

    const handlePageChange = (newPageIndex: number) => {
        setPageIndex(newPageIndex);
    };

    return (
        <div className="flex items-center justify-between px-2">
            <div className="flex items-center space-x-6 lg:space-x-8">
                <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium">Rows per page</p>
                    <Select
                        value={`${pageSize}`}
                        onValueChange={(value) => {
                            setPageSize(Number(value));
                        }}
                    >
                        <SelectTrigger className="h-8 w-[70px]">
                            <SelectValue placeholder={`${pageSize}`} />
                        </SelectTrigger>
                        <SelectContent side="top">
                            {[5, 10, 20, 30, 40, 50].map((pageSizeOption) => (
                                <SelectItem key={pageSizeOption} value={`${pageSizeOption}`}>
                                    {pageSizeOption}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                    Page {pageIndex + 1} of {Math.ceil(totalCount / pageSize)}
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        className="hidden h-8 w-8 p-0 lg:flex"
                        onClick={() => {
                            handlePageChange(0);
                        }}
                        disabled={pageIndex === 0}
                    >
                        <span className="sr-only">Go to first page</span>
                        <DoubleArrowLeftIcon className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => {
                            handlePageChange(pageIndex - 1);
                        }}
                        disabled={pageIndex === 0}
                    >
                        <span className="sr-only">Go to previous page</span>
                        <ChevronLeftIcon className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => {
                            handlePageChange(pageIndex + 1);
                        }}
                        disabled={pageIndex === Math.ceil(totalCount / pageSize) - 1}
                    >
                        <span className="sr-only">Go to next page</span>
                        <ChevronRightIcon className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        className="hidden h-8 w-8 p-0 lg:flex"
                        onClick={() => {
                            handlePageChange(Math.ceil(totalCount / pageSize) - 1);
                        }}
                        disabled={pageIndex === Math.ceil(totalCount / pageSize) - 1}
                    >
                        <span className="sr-only">Go to last page</span>
                        <DoubleArrowRightIcon className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
