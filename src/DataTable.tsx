import { useMemo, useRef, useState } from "react";
import { useVirtualizer } from '@tanstack/react-virtual';
import type { IPerson } from "./utils/types";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type SortingState,
  getSortedRowModel,
  type ColumnDef,
  type ColumnOrderState,
} from "@tanstack/react-table";
import { DndProvider} from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import DraggableHeader from "./DraggableHeader";



const DataTable = ({ data }: { data: IPerson[] }) => {
  const columns = useMemo<ColumnDef<IPerson>[]>(() => [
    {
      accessorKey: 'id',
      header: 'ID',
      size: 60,
    },
    {
      accessorKey: 'firstName',
      header: 'First Name',
      size: 120,
    },
    {
      accessorKey: 'lastName',
      header: 'Last Name',
      size: 120,
    },
    {
      id: "fullName",
      header: "Full Name",
      size: 180,
      accessorFn: (row) => `${row.firstName} ${row.lastName}`,
      cell: (info) => info.getValue(),
      sortingFn: (rowA, rowB) => {
        const fullNameA = `${rowA.original.firstName} ${rowA.original.lastName}`;
        const fullNameB = `${rowB.original.firstName} ${rowB.original.lastName}`;
        return fullNameA.localeCompare(fullNameB);
      },
    },
    {
      accessorKey: 'email',
      header: 'Email',
      size: 220,
    },
    {
      accessorKey: 'city',
      header: 'City',
      size: 120,
    },
    {
      accessorKey: "registeredDate",
      header: "Registered Date",
      size: 120,
      cell: (info) => new Date(info.getValue() as string).toLocaleDateString(),
      sortingFn: (rowA, rowB) => {
        const dateA = new Date(rowA.original.registeredDate).getTime();
        const dateB = new Date(rowB.original.registeredDate).getTime();
        return dateA - dateB;
      }
    },
    {
      id: "dsr",
      header: "Days Since Registered",
      size: 120,
      accessorFn: (row) => {
        const registeredDate = new Date(row.registeredDate);
        return Math.floor((Date.now() - registeredDate.getTime()) / (1000 * 60 * 60 * 24));
      },
      cell: (info) => info.getValue(),
      sortingFn: (rowA, rowB) => {
        const dateA = new Date(rowA.original.registeredDate).getTime();
        const dateB = new Date(rowB.original.registeredDate).getTime();
        const today = Date.now();
        return (today - dateA) - (today - dateB);
      },
    },
  ], []);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(() => 
    columns.map(column => column.id as string)
  );
  
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnOrder,
    },
    onSortingChange: setSorting,
    onColumnOrderChange: setColumnOrder,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true
  });

  const tableContainerRef = useRef<HTMLDivElement>(null);
  const { rows } = table.getRowModel();

  const rowVirtualizer = useVirtualizer({
    getScrollElement: () => tableContainerRef.current,
    count: rows.length,
    estimateSize: () => 50,
    overscan: 10,
  });

  // Get all leaf columns for consistent sizing
  const leafColumns = table.getAllLeafColumns();

  // Reorder columns function
  const reorderColumns = (draggedId: string, targetId: string) => {
    const newColumnOrder = [...columnOrder];
    const draggedIndex = newColumnOrder.indexOf(draggedId);
    const targetIndex = newColumnOrder.indexOf(targetId);
    
    newColumnOrder.splice(draggedIndex, 1);
    newColumnOrder.splice(targetIndex, 0, draggedId);
    
    setColumnOrder(newColumnOrder);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div 
        ref={tableContainerRef}
        style={{
          height: '600px',
          overflow: 'auto',
          position: 'relative',
          border: '1px solid #ddd',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        <table style={{ 
          width: '100%', 
          tableLayout: 'fixed',
          borderCollapse: 'collapse',
        }}>
          <colgroup>
            {leafColumns.map(column => (
              <col 
                key={column.id} 
                style={{ width: `${column.getSize()}px` }} 
              />
            ))}
          </colgroup>
          
          <thead style={{ 
            position: 'sticky', 
            top: 0,
            zIndex: 10,
          }}>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <DraggableHeader 
                    key={header.id}
                    header={header}
                    reorderColumns={reorderColumns}
                  />
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {rowVirtualizer.getVirtualItems().map((virtualRow, index) => {
              const row = rows[virtualRow.index];
              return (
                <tr
                  key={row.id}
                  style={{
                    transform: `translateY(${virtualRow.start - index * virtualRow.size}px)`,
                    backgroundColor: index % 2 === 0 ? '#fff' : '#f9f9f9',
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      style={{
                        padding: '8px',
                        border: '1px solid #ddd',
                        verticalAlign: 'middle',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        boxSizing: 'border-box',
                      }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </DndProvider>
  );
};

export default DataTable;