import type { IPerson } from "./utils/types"
import { createColumnHelper,   useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table"


const columnHelper = createColumnHelper<IPerson>()

const columns = [
  columnHelper.accessor('id', {
    cell: info => info.getValue(),
    header: 'ID',
  }),
  columnHelper.accessor('firstName', {
    cell: info => info.getValue(),
    header: 'First Name',
  }),
  
  columnHelper.accessor('lastName', {
    cell: info => info.getValue(),
    header: 'Last Name',
  }),

  columnHelper.display({
    id: 'fullName',
    header: 'Full Name',
    cell: info => `${info.row.original.firstName} ${info.row.original.lastName}`,
  }),

  columnHelper.accessor('city', {
    cell: info => info.getValue(),
    header: 'City',
  }),

  columnHelper.accessor('email', {
    cell: info => info.getValue(),
    header: 'Email',
  }),
  
  columnHelper.accessor('registeredDate', {
    cell: info => new Date(info.getValue()).toLocaleDateString(),
    header: 'Registered Date',
  }),
  
  columnHelper.display({
    id: 'dsr',
    header: 'Days Since Registered',
    cell: info => {
      const registeredDate = new Date(info.row.original.registeredDate);
      const today = new Date();
      const diffTime = Math.abs(today.getTime() - registeredDate.getTime());
      return Math.floor(diffTime / (1000 * 60 * 60 * 24));
    },
  }),
  




]

const DataTable = ({data}: {data:IPerson[]}) => {

  const table = useReactTable({data, columns, getCoreRowModel: getCoreRowModel() })
  return (
    <div>

<table>
<thead>
{table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
</thead>
<tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>

  </table>
    </div>
  )
}

export default DataTable