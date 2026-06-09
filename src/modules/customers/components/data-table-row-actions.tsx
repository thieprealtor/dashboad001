"use client"

import { useState } from "react"
import type { Row } from "@tanstack/react-table"
import { Copy, Pencil, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import type { Customer } from "@/modules/customers/services/types/customer-types"
import { AddCustomerModal } from "./add-customer-modal"

interface DataTableRowActionsProps {
  row: Row<Customer>
  onUpdateCustomer?: (customer: Customer) => void | Promise<void>
  onDeleteCustomer?: (customerId: string) => void | Promise<void>
  onDuplicateCustomer?: (customer: Customer) => void | Promise<void>
}

export function DataTableRowActions({
  row,
  onUpdateCustomer,
  onDeleteCustomer,
  onDuplicateCustomer,
}: DataTableRowActionsProps) {
  const [showDelete, setShowDelete] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const customer = row.original

  return (
    <>
      <TooltipProvider delayDuration={300}>
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 cursor-pointer text-muted-foreground hover:text-primary"
                onClick={() => setShowEdit(true)}
              >
                <Pencil className="size-4" />
                <span className="sr-only">Chỉnh sửa</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Chỉnh sửa</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 cursor-pointer text-muted-foreground hover:text-blue-600"
                onClick={() => onDuplicateCustomer?.(customer)}
              >
                <Copy className="size-4" />
                <span className="sr-only">Nhân bản</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Nhân bản</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 cursor-pointer text-muted-foreground hover:text-destructive"
                onClick={() => setShowDelete(true)}
              >
                <Trash2 className="size-4" />
                <span className="sr-only">Xóa</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Xóa</TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>

      {/* Edit Modal */}
      <AddCustomerModal
        open={showEdit}
        onOpenChange={setShowEdit}
        initialData={customer}
        onAddCustomer={onUpdateCustomer}
      />

      {/* Delete Confirm */}
      <AlertDialog open={showDelete} onOpenChange={setShowDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa khách hàng?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Khách hàng{" "}
              <strong>{customer.name}</strong> sẽ bị xóa vĩnh viễn.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">Hủy</AlertDialogCancel>
            <AlertDialogAction
              className="cursor-pointer bg-destructive hover:bg-destructive/90"
              onClick={() => onDeleteCustomer?.(customer.id)}
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
