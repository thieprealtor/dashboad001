"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Mail, Phone, User } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

import { categoryOptions, genderOptions, statusOptions } from "@/modules/customers/services/customer-mock-data"
import type { Customer } from "@/modules/customers/services/types/customer-types"
import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"

interface CustomerColumnActions {
  onUpdateCustomer?: (customer: Customer) => void | Promise<void>
  onDeleteCustomer?: (customerId: string) => void | Promise<void>
  onDuplicateCustomer?: (customer: Customer) => void | Promise<void>
}

export function getCustomerColumns({
  onUpdateCustomer,
  onDeleteCustomer,
  onDuplicateCustomer,
}: CustomerColumnActions = {}): ColumnDef<Customer>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-[2px] cursor-pointer"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-[2px] cursor-pointer"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Tên khách hàng" />
      ),
      cell: ({ row }) => {
        const gender = row.getValue("gender") as string | null
        const genderLabel = genderOptions.find((g) => g.value === gender)?.label
        return (
          <div className="flex items-center gap-2 min-w-[160px]">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <User className="size-4" />
            </div>
            <div>
              <p className="font-medium leading-none">{row.getValue("name")}</p>
              {genderLabel && (
                <p className="text-xs text-muted-foreground mt-0.5">{genderLabel}</p>
              )}
            </div>
          </div>
        )
      },
      enableHiding: false,
    },
    {
      accessorKey: "category",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Ngành nghề" />
      ),
      cell: ({ row }) => {
        const cat = categoryOptions.find((c) => c.value === row.getValue("category"))
        return cat ? (
          <Badge variant="outline" className="whitespace-nowrap">
            {cat.label}
          </Badge>
        ) : null
      },
      filterFn: (row, id, value) => value.includes(row.getValue(id)),
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Trạng thái" />
      ),
      cell: ({ row }) => {
        const statusValue = row.getValue("status") as string
        const status = statusOptions.find((s) => s.value === statusValue)
        if (!status) return <span className="text-muted-foreground text-sm">—</span>

        const colorMap: Record<string, string> = {
          lead: "bg-blue-500/15 text-blue-700 border-blue-300 dark:text-blue-400 dark:border-blue-700",
          contacted: "bg-amber-500/15 text-amber-700 border-amber-300 dark:text-amber-400 dark:border-amber-700",
          met: "bg-violet-500/15 text-violet-700 border-violet-300 dark:text-violet-400 dark:border-violet-700",
          win: "bg-emerald-500/15 text-emerald-700 border-emerald-300 dark:text-emerald-400 dark:border-emerald-700",
          lose: "bg-red-500/15 text-red-700 border-red-300 dark:text-red-400 dark:border-red-700",
        }

        const dotColorMap: Record<string, string> = {
          lead: "bg-blue-500",
          contacted: "bg-amber-500",
          met: "bg-violet-500",
          win: "bg-emerald-500",
          lose: "bg-red-500",
        }

        return (
          <Badge
            variant="outline"
            className={`whitespace-nowrap font-medium gap-1.5 ${colorMap[statusValue] ?? ""}`}
          >
            <span className={`inline-block size-2 rounded-full ${dotColorMap[statusValue] ?? "bg-muted-foreground"}`} />
            {status.label}
          </Badge>
        )
      },
      filterFn: (row, id, value) => value.includes(row.getValue(id)),
    },
    {
      accessorKey: "phone",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Điện thoại" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5 text-sm">
          <Phone className="size-3.5 text-muted-foreground shrink-0" />
          <span>{row.getValue("phone")}</span>
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Email" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5 text-sm">
          <Mail className="size-3.5 text-muted-foreground shrink-0" />
          <span className="max-w-[200px] truncate">{row.getValue("email")}</span>
        </div>
      ),
    },
    {
      accessorKey: "address",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Địa chỉ" />
      ),
      cell: ({ row }) => (
        <p className="max-w-[220px] truncate text-sm text-muted-foreground">
          {row.getValue("address")}
        </p>
      ),
    },
    {
      accessorKey: "gender",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Giới tính" />
      ),
      cell: ({ row }) => {
        const val = row.getValue("gender") as string | null
        const label = genderOptions.find((g) => g.value === val)?.label
        return label ? (
          <Badge variant="secondary">{label}</Badge>
        ) : (
          <span className="text-muted-foreground text-sm">—</span>
        )
      },
      filterFn: (row, id, value) => value.includes(row.getValue(id)),
    },
    {
      accessorKey: "note",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Ghi chú" />
      ),
      cell: ({ row }) => {
        const note = row.getValue("note") as string
        return note ? (
          <p className="max-w-[200px] truncate text-sm text-muted-foreground">{note}</p>
        ) : (
          <span className="text-muted-foreground text-sm">—</span>
        )
      },
    },
    {
      id: "actions",
      header: () => (
        <span className="text-xs font-medium text-muted-foreground">Hành động</span>
      ),
      cell: ({ row }) => (
        <DataTableRowActions
          row={row}
          onUpdateCustomer={onUpdateCustomer}
          onDeleteCustomer={onDeleteCustomer}
          onDuplicateCustomer={onDuplicateCustomer}
        />
      ),
    },
  ]
}

export const columns = getCustomerColumns()
