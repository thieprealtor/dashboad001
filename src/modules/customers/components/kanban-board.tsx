"use client"

import { useState, useCallback } from "react"
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from "@dnd-kit/core"
import { useDroppable } from "@dnd-kit/core"
import { useDraggable } from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"
import { Phone, Mail, GripVertical, User } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { statusOptions } from "@/modules/customers/services/customer-mock-data"
import type { Customer } from "@/modules/customers/services/types/customer-types"

/* ─── Color Config ─── */
const columnConfig: Record<
  string,
  { bg: string; border: string; dot: string; headerBg: string; count: string }
> = {
  lead: {
    bg: "bg-blue-50 dark:bg-blue-950/30",
    border: "border-blue-200 dark:border-blue-800",
    dot: "bg-blue-500",
    headerBg: "bg-blue-500/10",
    count: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  },
  contacted: {
    bg: "bg-amber-50 dark:bg-amber-950/30",
    border: "border-amber-200 dark:border-amber-800",
    dot: "bg-amber-500",
    headerBg: "bg-amber-500/10",
    count: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  },
  met: {
    bg: "bg-violet-50 dark:bg-violet-950/30",
    border: "border-violet-200 dark:border-violet-800",
    dot: "bg-violet-500",
    headerBg: "bg-violet-500/10",
    count: "bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300",
  },
  win: {
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    border: "border-emerald-200 dark:border-emerald-800",
    dot: "bg-emerald-500",
    headerBg: "bg-emerald-500/10",
    count: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
  },
  lose: {
    bg: "bg-red-50 dark:bg-red-950/30",
    border: "border-red-200 dark:border-red-800",
    dot: "bg-red-500",
    headerBg: "bg-red-500/10",
    count: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  },
}

/* ─── Draggable Card ─── */
function KanbanCard({
  customer,
  onClick,
  isDragging,
}: {
  customer: Customer
  onClick?: (customer: Customer) => void
  isDragging?: boolean
}) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: customer.id,
    data: { customer },
  })

  const style = transform
    ? {
        transform: CSS.Translate.toString(transform),
      }
    : undefined

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative rounded-lg border bg-card p-3 shadow-sm transition-all hover:shadow-md cursor-grab active:cursor-grabbing ${
        isDragging ? "opacity-50 shadow-lg ring-2 ring-primary/30" : ""
      }`}
      onClick={() => onClick?.(customer)}
    >
      {/* Drag handle */}
      <div
        {...listeners}
        {...attributes}
        className="absolute right-2 top-2 opacity-0 group-hover:opacity-60 transition-opacity cursor-grab"
      >
        <GripVertical className="size-4 text-muted-foreground" />
      </div>

      {/* Name + avatar */}
      <div className="flex items-center gap-2.5 mb-2">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <User className="size-3.5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-medium text-sm leading-tight truncate">{customer.name}</p>
          <p className="text-xs text-muted-foreground truncate">{customer.id}</p>
        </div>
      </div>

      {/* Contact info */}
      <div className="space-y-1 mt-2">
        {customer.phone && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Phone className="size-3 shrink-0" />
            <span className="truncate">{customer.phone}</span>
          </div>
        )}
        {customer.email && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Mail className="size-3 shrink-0" />
            <span className="truncate">{customer.email}</span>
          </div>
        )}
      </div>

      {/* Note preview */}
      {customer.note && (
        <p className="mt-2 text-xs text-muted-foreground/70 line-clamp-2 leading-relaxed">
          {customer.note}
        </p>
      )}
    </div>
  )
}

/* ─── Overlay Card (shown while dragging) ─── */
function DragOverlayCard({ customer }: { customer: Customer }) {
  return (
    <div className="rounded-lg border bg-card p-3 shadow-xl ring-2 ring-primary/40 w-[260px] rotate-2">
      <div className="flex items-center gap-2.5">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <User className="size-3.5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-medium text-sm leading-tight truncate">{customer.name}</p>
          <p className="text-xs text-muted-foreground truncate">{customer.id}</p>
        </div>
      </div>
    </div>
  )
}

/* ─── Droppable Column ─── */
function KanbanColumn({
  status,
  customers,
  onCardClick,
}: {
  status: (typeof statusOptions)[number]
  customers: Customer[]
  onCardClick?: (customer: Customer) => void
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: status.value,
    data: { status: status.value },
  })

  const config = columnConfig[status.value] ?? columnConfig.lead

  return (
    <div
      className={`flex flex-col rounded-xl border ${config.border} ${config.bg} min-w-[280px] w-[280px] shrink-0 transition-all ${
        isOver ? "ring-2 ring-primary/40 scale-[1.01]" : ""
      }`}
    >
      {/* Column header */}
      <div className={`p-3 rounded-t-xl ${config.headerBg}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`inline-block size-2.5 rounded-full ${config.dot}`} />
            <span className="font-semibold text-sm">{status.icon} {status.label}</span>
          </div>
          <Badge variant="secondary" className={`text-xs px-2 py-0.5 ${config.count}`}>
            {customers.length}
          </Badge>
        </div>
      </div>

      {/* Cards area */}
      <ScrollArea className="flex-1 max-h-[calc(100vh-340px)]">
        <div ref={setNodeRef} className="p-2 space-y-2 min-h-[80px]">
          {customers.length === 0 ? (
            <div className="flex items-center justify-center h-20 text-xs text-muted-foreground/50 border border-dashed rounded-lg">
              Kéo thả vào đây
            </div>
          ) : (
            customers.map((customer) => (
              <KanbanCard
                key={customer.id}
                customer={customer}
                onClick={onCardClick}
              />
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

/* ─── Main Kanban Board ─── */
interface KanbanBoardProps {
  customers: Customer[]
  onUpdateCustomer: (customer: Customer) => void | Promise<void>
  onCardClick?: (customer: Customer) => void
}

export function KanbanBoard({
  customers,
  onUpdateCustomer,
  onCardClick,
}: KanbanBoardProps) {
  const [activeCustomer, setActiveCustomer] = useState<Customer | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  )

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const customer = event.active.data.current?.customer as Customer | undefined
    if (customer) setActiveCustomer(customer)
  }, [])

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveCustomer(null)

      const { active, over } = event
      if (!over) return

      const draggedCustomer = active.data.current?.customer as Customer | undefined
      if (!draggedCustomer) return

      // Determine target status
      let targetStatus: string | undefined

      // Dropped on a column
      if (over.data.current?.status) {
        targetStatus = over.data.current.status as string
      }
      // Dropped on another card — get its status
      else {
        const overCustomer = customers.find((c) => c.id === over.id)
        if (overCustomer) targetStatus = overCustomer.status
      }

      if (targetStatus && targetStatus !== draggedCustomer.status) {
        const updated = { ...draggedCustomer, status: targetStatus }
        onUpdateCustomer(updated)
      }
    },
    [customers, onUpdateCustomer]
  )

  const handleDragOver = useCallback((_event: DragOverEvent) => {
    // Can be used for real-time preview — kept minimal for now
  }, [])

  // Group customers by status
  const grouped = statusOptions.reduce(
    (acc, status) => {
      acc[status.value] = customers.filter((c) => c.status === status.value)
      return acc
    },
    {} as Record<string, Customer[]>
  )

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
    >
      <div className="flex gap-4 overflow-x-auto pb-4 px-1">
        {statusOptions.map((status) => (
          <KanbanColumn
            key={status.value}
            status={status}
            customers={grouped[status.value] ?? []}
            onCardClick={onCardClick}
          />
        ))}
      </div>

      <DragOverlay dropAnimation={{ duration: 200, easing: "ease" }}>
        {activeCustomer ? (
          <DragOverlayCard customer={activeCustomer} />
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
