import React, { createContext, useContext, useState } from 'react';

interface DataTableContextProps {
    totalCount: number;
    pageIndex: number;
    pageSize: number;
    setPageSize: (size: number) => void;
    setPageIndex: (index: number) => void;
    children?: React.ReactNode;
}

const DataTableContext = createContext<DataTableContextProps | undefined>(undefined);

export const DataTableProvider: React.FC<DataTableContextProps> = ({
    totalCount,
    pageIndex: initialPageIndex,
    pageSize: initialPageSize,
    setPageSize: setPageSizeExternal,
    setPageIndex: setPageIndexExternal,
    children,
}) => {
    const [pageIndex, setPageIndexInternal] = useState(initialPageIndex);
    const [pageSize, setPageSizeInternal] = useState(initialPageSize);

    const setPageSize = (size: number) => {
        setPageSizeInternal(size);
        setPageSizeExternal(size);
    };

    const setPageIndex = (index: number) => {
        setPageIndexInternal(index);
        setPageIndexExternal(index);
    };

    return (
        <DataTableContext.Provider
            value={{ totalCount, pageIndex, pageSize, setPageSize, setPageIndex }}
        >
            {children}
        </DataTableContext.Provider>
    );
};

export const useDataTableContext = (): DataTableContextProps => {
    const context = useContext(DataTableContext);

    if (!context) {
        throw new Error(
            'useDataTableContext must be used within a DataTableProvider'
        );
    }

    return context;
};
