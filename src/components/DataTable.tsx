'use client'

import * as React from 'react'
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { ChevronDown } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export type BomColumn = {
  included: boolean
  id: number
  단위블록: string
  소조명: string
  부재명: string
  P: number
  S: number
  재질: string
  중량: number
  두께: number
  송선: string
  가공계열: string
}

export const columns: ColumnDef<BomColumn>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: '단위블록',
    header: '단위블록',
    cell: ({ row }) => (
      <div className='capitalize'>{row.getValue('단위블록')}</div>
    ),
  },
  {
    accessorKey: '소조명',
    header: '소조명',
    cell: ({ row }) => (
      <div className='capitalize'>{row.getValue('소조명')}</div>
    ),
  },
  {
    accessorKey: '부재명',
    header: '부재명',
    cell: ({ row }) => (
      <div className='capitalize'>{row.getValue('부재명')}</div>
    ),
    filterFn: 'includesString',
  },
  {
    accessorKey: 'P',
    header: 'P',
    cell: ({ row }) => <div className='capitalize'>{row.getValue('P')}</div>,
  },
  {
    accessorKey: 'S',
    header: 'S',
    cell: ({ row }) => <div className='capitalize'>{row.getValue('S')}</div>,
  },
  {
    accessorKey: '재질',
    header: '재질',
    cell: ({ row }) => <div className='capitalize'>{row.getValue('재질')}</div>,
  },
  {
    accessorKey: '중량',
    header: '중량',
    cell: ({ row }) => <div className='capitalize'>{row.getValue('중량')}</div>,
    filterFn: (row, columnId, filterValue) => {
      const value = row.getValue(columnId) as number
      const filter = parseFloat(filterValue as string)
      if (isNaN(filter)) return true
      return value === filter
    },
  },
  {
    accessorKey: '두께',
    header: '두께',
    cell: ({ row }) => <div className='capitalize'>{row.getValue('두께')}</div>,
    filterFn: (row, columnId, filterValue) => {
      const value = row.getValue(columnId) as number
      const filter = parseFloat(filterValue as string)
      if (isNaN(filter)) return true
      return value === filter
    },
  },
  {
    accessorKey: '송선',
    header: '송선',
    cell: ({ row }) => <div className='capitalize'>{row.getValue('송선')}</div>,
  },
  {
    accessorKey: '가공계열',
    header: '가공계열',
    cell: ({ row }) => (
      <div className='capitalize'>{row.getValue('가공계열')}</div>
    ),
  },
]

export function DataTable() {
  const [data, setData] = React.useState<BomColumn[]>([])
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [error, setError] = React.useState<string | null>(null)
  const [totalCount, setTotalCount] = React.useState<number>(0)
  const [totalPages, setTotalPages] = React.useState<number>(0)
  const [currentPage, setCurrentPage] = React.useState<number>(1)

  React.useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`/api/bom?page=${currentPage}`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const result = await response.json()
        if (!result.data || result.data.length === 0) {
          setError('No data found')
          return
        }

        setData(result.data)
        setTotalCount(result.totalCount)
        setTotalPages(result.totalPages)
      } catch (error) {
        console.error('Fetch error:', error)
        setError('Failed to load data')
      }
    }

    fetchData()
  }, [currentPage])

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className='w-full'>
      <div className='space-y-4'>
        <div className='border-b pb-4'>
          <h2 className='text-xl font-semibold'>BOM Data 검색</h2>
        </div>
        {/* 검색 필터 영역 - 모바일에서는 세로로 정렬 */}
        <div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-4'>
          <div className='flex flex-col w-full sm:w-auto gap-4 sm:flex-row'>
            <Input
              placeholder='부재명 필터'
              value={
                (table.getColumn('부재명')?.getFilterValue() as string) ?? ''
              }
              onChange={(event) =>
                table.getColumn('부재명')?.setFilterValue(event.target.value)
              }
              className='w-full sm:max-w-[200px]'
            />
            <Input
              placeholder='중량 필터'
              type='number'
              value={
                (table.getColumn('중량')?.getFilterValue() as string) ?? ''
              }
              onChange={(event) =>
                table.getColumn('중량')?.setFilterValue(event.target.value)
              }
              className='w-full sm:max-w-[200px]'
            />
            <Input
              placeholder='두께 필터'
              type='number'
              value={
                (table.getColumn('두께')?.getFilterValue() as string) ?? ''
              }
              onChange={(event) =>
                table.getColumn('두께')?.setFilterValue(event.target.value)
              }
              className='w-full sm:max-w-[200px]'
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' className='w-full sm:w-auto'>
                Columns <ChevronDown className='ml-2 h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-[200px]'>
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className='capitalize'
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* 테이블 영역 - 모바일에서는 가로 스크롤 */}
      <div className='mt-4 overflow-x-auto rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected()}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* 페이지네이션 영역 - 모바일에서는 세로로 정렬 */}
      <div className='flex flex-col sm:flex-row items-center justify-end gap-4 py-4'>
        <div className='text-sm text-muted-foreground w-full sm:w-auto text-center sm:text-left'>
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className='flex items-center gap-2'>
          <Button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className='w-[100px]'
          >
            Previous
          </Button>
          <span className='mx-2'>{`Page ${currentPage} of ${totalPages}`}</span>
          <Button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className='w-[100px]'
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
