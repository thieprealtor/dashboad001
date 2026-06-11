"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { Users, UserCheck, TrendingUp, LayoutGrid, Table2 } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { getCustomerColumns } from "@/modules/customers/components/columns"
import { DataTable } from "@/modules/customers/components/data-table"
import { KanbanBoard } from "@/modules/customers/components/kanban-board"
import { CustomerDetailSheet } from "@/modules/customers/components/customer-detail-sheet"
import { AddCustomerModal } from "@/modules/customers/components/add-customer-modal"
import {
  createCustomer,
  deleteCustomer,
  getCustomers,
  getCustomerStats,
  updateCustomer,
} from "@/modules/customers/services/customer-services"
import { customerMockData } from "@/modules/customers/services/customer-mock-data"
import type { Customer } from "@/modules/customers/services/types/customer-types"

type ViewMode = "table" | "kanban"

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(customerMockData)
  const [loading, setLoading] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>("table")

  const refreshCustomers = useCallback(async () => {
    const list = await getCustomers()
    setCustomers(list)
  }, [])

  useEffect(() => {
    const load = async () => {
      try {
        await refreshCustomers()
      } catch (error) {
        console.error("Failed to load customers:", error)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [refreshCustomers])

  const handleAddCustomer = useCallback(async (customer: Customer) => {
    await createCustomer(customer)
    setCustomers((prev) => [customer, ...prev])
  }, [])

  const handleUpdateCustomer = useCallback(async (customer: Customer) => {
    await updateCustomer(customer)
    setCustomers((prev) => prev.map((c) => (c.id === customer.id ? customer : c)))
  }, [])

  const handleDeleteCustomer = useCallback(async (customerId: string) => {
    await deleteCustomer(customerId)
    setCustomers((prev) => prev.filter((c) => c.id !== customerId))
  }, [])

  const handleDuplicateCustomer = useCallback(async (customer: Customer) => {
    const duplicate: Customer = {
      ...customer,
      id: `KH-${Date.now()}`,
      name: `${customer.name} (Bản sao)`,
    }
    await createCustomer(duplicate)
    setCustomers((prev) => [duplicate, ...prev])
  }, [])

  const handleRowClick = useCallback((customer: Customer) => {
    setSelectedCustomer(customer)
    setIsDetailOpen(true)
  }, [])

  const customerColumns = useMemo(
    () =>
      getCustomerColumns({
        onUpdateCustomer: handleUpdateCustomer,
        onDeleteCustomer: handleDeleteCustomer,
        onDuplicateCustomer: handleDuplicateCustomer,
      }),
    [handleUpdateCustomer, handleDeleteCustomer, handleDuplicateCustomer]
  )

  const stats = getCustomerStats(customers)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-muted-foreground">Đang tải dữ liệu...</div>
      </div>
    )
  }

  return (
    <>
      {/* Page Header */}
      <div className="flex flex-col gap-2 px-4 md:px-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Quản lý khách hàng</h1>
            <p className="text-muted-foreground">
              Quản lý danh sách khách hàng, thông tin liên hệ và phân loại ngành nghề.
            </p>
          </div>

          {/* View Toggle */}
          <TooltipProvider delayDuration={300}>
            <ToggleGroup
              type="single"
              value={viewMode}
              onValueChange={(value) => { if (value) setViewMode(value as ViewMode) }}
              className="bg-muted rounded-lg p-1"
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <ToggleGroupItem
                    value="table"
                    aria-label="Dạng bảng"
                    className="px-3 py-1.5 data-[state=on]:bg-background data-[state=on]:shadow-sm cursor-pointer"
                  >
                    <Table2 className="size-4" />
                  </ToggleGroupItem>
                </TooltipTrigger>
                <TooltipContent side="bottom">Dạng bảng</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <ToggleGroupItem
                    value="kanban"
                    aria-label="Dạng Kanban"
                    className="px-3 py-1.5 data-[state=on]:bg-background data-[state=on]:shadow-sm cursor-pointer"
                  >
                    <LayoutGrid className="size-4" />
                  </ToggleGroupItem>
                </TooltipTrigger>
                <TooltipContent side="bottom">Dạng Kanban</TooltipContent>
              </Tooltip>
            </ToggleGroup>
          </TooltipProvider>
        </div>
      </div>

      <div className="h-full flex-1 flex-col space-y-6 px-4 md:px-6 flex">
        {/* Stats Cards */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
          <Card>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Tổng khách hàng</p>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-3xl font-bold">{stats.total}</span>
                  </div>
                </div>
                <div className="bg-secondary rounded-lg p-3">
                  <Users className="size-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Nam / Nữ</p>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-3xl font-bold">{stats.male}</span>
                    <span className="text-muted-foreground text-sm">/ {stats.female}</span>
                  </div>
                </div>
                <div className="bg-secondary rounded-lg p-3">
                  <UserCheck className="size-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Ngành nghề</p>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-3xl font-bold">
                      {new Set(customers.map((c) => c.category).filter(Boolean)).size}
                    </span>
                    <span className="text-muted-foreground text-sm">loại</span>
                  </div>
                </div>
                <div className="bg-secondary rounded-lg p-3">
                  <TrendingUp className="size-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* View: Table or Kanban */}
        {viewMode === "table" ? (
          <Card>
            <CardHeader>
              <CardTitle>Danh sách khách hàng</CardTitle>
              <CardDescription>
                Tìm kiếm, lọc và quản lý toàn bộ khách hàng tại đây.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                data={customers}
                columns={customerColumns}
                onAddCustomer={handleAddCustomer}
                onRowClick={handleRowClick}
              />
            </CardContent>
          </Card>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold">Pipeline khách hàng</h2>
                <p className="text-sm text-muted-foreground">
                  Kéo thả để chuyển trạng thái khách hàng giữa các giai đoạn.
                </p>
              </div>
            </div>
            <KanbanBoard
              customers={customers}
              onUpdateCustomer={handleUpdateCustomer}
              onCardClick={handleRowClick}
            />
          </div>
        )}
      </div>

      <CustomerDetailSheet
        customer={selectedCustomer}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        onEdit={(customer) => {
          setSelectedCustomer(customer)
          setIsEditOpen(true)
        }}
      />

      <AddCustomerModal
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        initialData={selectedCustomer || undefined}
        onAddCustomer={handleUpdateCustomer}
      />
    </>
  )
}
