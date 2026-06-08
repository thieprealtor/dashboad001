"use client"

import type { Table } from "@tanstack/react-table"
import { Search, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import {
  categoryOptions,
  genderOptions,
} from "@/modules/customers/services/customer-mock-data"
import type { Customer } from "@/modules/customers/services/types/customer-types"
import { AddCustomerModal } from "./add-customer-modal"
import { DataTableFacetedFilter } from "./data-table-faceted-filter"
import { DataTableViewOptions } from "./data-table-view-options"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  onAddCustomer?: (customer: Customer) => void | Promise<void>
}

export function DataTableToolbar<TData>({
  table,
  onAddCustomer,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="flex items-center justify-between gap-2 flex-wrap">
      <div className="flex flex-1 items-center gap-2 flex-wrap">
        {/* Search by name */}
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm theo tên..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(e) => table.getColumn("name")?.setFilterValue(e.target.value)}
            className="h-8 w-[180px] lg:w-[240px] pl-8"
          />
        </div>

        {/* Category filter */}
        {table.getColumn("category") && (
          <DataTableFacetedFilter
            column={table.getColumn("category")}
            title="Ngành nghề"
            options={categoryOptions.map((c) => ({ value: c.value, label: c.label }))}
          />
        )}

        {/* Gender filter */}
        {table.getColumn("gender") && (
          <DataTableFacetedFilter
            column={table.getColumn("gender")}
            title="Giới tính"
            options={genderOptions.map((g) => ({ value: g.value, label: g.label }))}
          />
        )}

        {isFiltered && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 cursor-pointer"
            onClick={() => table.resetColumnFilters()}
          >
            Xóa lọc
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2">
        <DataTableViewOptions table={table} />
        <AddCustomerModal onAddCustomer={onAddCustomer} />
      </div>
    </div>
  )
}
