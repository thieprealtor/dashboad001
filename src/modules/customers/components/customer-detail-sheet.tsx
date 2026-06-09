"use client"

import { Pencil, Mail, Phone, MapPin, Tag, User2, StickyNote, Hash } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"

import {
  categoryOptions,
  genderOptions,
} from "@/modules/customers/services/customer-mock-data"
import type { Customer } from "@/modules/customers/services/types/customer-types"

interface CustomerDetailSheetProps {
  customer: Customer | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit?: (customer: Customer) => void
}

const categoryColorMap: Record<string, string> = {
  real_estate: "bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-800 dark:text-blue-400",
  beauty: "bg-pink-500/10 text-pink-600 border-pink-200 dark:border-pink-800 dark:text-pink-400",
  technology: "bg-violet-500/10 text-violet-600 border-violet-200 dark:border-violet-800 dark:text-violet-400",
  education: "bg-amber-500/10 text-amber-600 border-amber-200 dark:border-amber-800 dark:text-amber-400",
  construction: "bg-orange-500/10 text-orange-600 border-orange-200 dark:border-orange-800 dark:text-orange-400",
  retail: "bg-teal-500/10 text-teal-600 border-teal-200 dark:border-teal-800 dark:text-teal-400",
  logistics: "bg-cyan-500/10 text-cyan-600 border-cyan-200 dark:border-cyan-800 dark:text-cyan-400",
  healthcare: "bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-800 dark:text-emerald-400",
  finance: "bg-indigo-500/10 text-indigo-600 border-indigo-200 dark:border-indigo-800 dark:text-indigo-400",
  manufacturing: "bg-slate-500/10 text-slate-600 border-slate-200 dark:border-slate-800 dark:text-slate-400",
  agriculture: "bg-lime-500/10 text-lime-600 border-lime-200 dark:border-lime-800 dark:text-lime-400",
  hospitality: "bg-rose-500/10 text-rose-600 border-rose-200 dark:border-rose-800 dark:text-rose-400",
  entertainment: "bg-fuchsia-500/10 text-fuchsia-600 border-fuchsia-200 dark:border-fuchsia-800 dark:text-fuchsia-400",
  other: "bg-muted text-muted-foreground",
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word[0])
    .slice(-2)
    .join("")
    .toUpperCase()
}

function getAvatarColor(id: string): string {
  const colors = [
    "from-blue-500 to-indigo-600",
    "from-violet-500 to-purple-600",
    "from-pink-500 to-rose-600",
    "from-amber-500 to-orange-600",
    "from-emerald-500 to-teal-600",
    "from-cyan-500 to-sky-600",
  ]
  const index = id.charCodeAt(id.length - 1) % colors.length
  return colors[index]
}

interface InfoRowProps {
  icon: React.ReactNode
  label: string
  value: React.ReactNode
}

function InfoRow({ icon, label, value }: InfoRowProps) {
  return (
    <div className="flex items-start gap-3 py-2.5">
      <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-muted-foreground mb-0.5">{label}</p>
        <div className="text-sm font-medium break-words">{value}</div>
      </div>
    </div>
  )
}

export function CustomerDetailSheet({
  customer,
  open,
  onOpenChange,
  onEdit,
}: CustomerDetailSheetProps) {
  if (!customer) return null

  const categoryLabel = categoryOptions.find((c) => c.value === customer.category)?.label
  const genderLabel = genderOptions.find((g) => g.value === customer.gender)?.label
  const categoryClass = categoryColorMap[customer.category] ?? categoryColorMap.other
  const avatarGradient = getAvatarColor(customer.id)
  const initials = getInitials(customer.name)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md flex flex-col p-0 gap-0"
      >
        {/* Header */}
        <SheetHeader className="px-6 pt-6 pb-4">
          <SheetTitle className="sr-only">{customer.name}</SheetTitle>
          <SheetDescription className="sr-only">
            Thông tin chi tiết khách hàng {customer.name}
          </SheetDescription>

          {/* Avatar + Name */}
          <div className="flex items-center gap-4">
            <div
              className={`flex size-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${avatarGradient} text-white text-xl font-bold shadow-lg`}
            >
              {initials}
            </div>
            <div className="min-w-0">
              <h2 className="text-xl font-bold tracking-tight leading-tight truncate">
                {customer.name}
              </h2>
              {categoryLabel && (
                <Badge
                  variant="outline"
                  className={`mt-1.5 text-xs font-medium ${categoryClass}`}
                >
                  <Tag className="size-3 mr-1" />
                  {categoryLabel}
                </Badge>
              )}
            </div>
          </div>
        </SheetHeader>

        <Separator />

        {/* Body — scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-1">
          {/* Section: Liên hệ */}
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
            Thông tin liên hệ
          </p>

          <InfoRow
            icon={<Phone className="size-4" />}
            label="Điện thoại"
            value={
              <a
                href={`tel:${customer.phone}`}
                className="text-primary hover:underline"
              >
                {customer.phone}
              </a>
            }
          />

          {customer.email && (
            <InfoRow
              icon={<Mail className="size-4" />}
              label="Email"
              value={
                <a
                  href={`mailto:${customer.email}`}
                  className="text-primary hover:underline break-all"
                >
                  {customer.email}
                </a>
              }
            />
          )}

          {customer.address && (
            <InfoRow
              icon={<MapPin className="size-4" />}
              label="Địa chỉ"
              value={<span className="text-foreground/90">{customer.address}</span>}
            />
          )}

          <Separator className="my-3" />

          {/* Section: Thông tin bổ sung */}
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
            Thông tin bổ sung
          </p>

          <InfoRow
            icon={<Hash className="size-4" />}
            label="Mã khách hàng"
            value={
              <span className="font-mono text-sm bg-muted px-2 py-0.5 rounded">
                {customer.id}
              </span>
            }
          />

          {genderLabel && (
            <InfoRow
              icon={<User2 className="size-4" />}
              label="Giới tính"
              value={<Badge variant="secondary">{genderLabel}</Badge>}
            />
          )}

          {customer.note && (
            <>
              <Separator className="my-3" />
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                Ghi chú
              </p>
              <InfoRow
                icon={<StickyNote className="size-4" />}
                label="Nội dung"
                value={
                  <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
                    {customer.note}
                  </p>
                }
              />
            </>
          )}
        </div>

        <Separator />

        {/* Footer */}
        <div className="px-6 py-4 flex gap-2">
          <Button
            className="flex-1 cursor-pointer"
            onClick={() => {
              onEdit?.(customer)
              onOpenChange(false)
            }}
          >
            <Pencil className="size-4 mr-2" />
            Chỉnh sửa
          </Button>
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={() => onOpenChange(false)}
          >
            Đóng
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
