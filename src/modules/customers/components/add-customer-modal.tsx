"use client"

import { useEffect, useState } from "react"
import { Plus } from "lucide-react"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  categoryOptions,
  genderOptions,
  statusOptions,
} from "@/modules/customers/services/customer-mock-data"
import { customerSchema, type Customer } from "@/modules/customers/services/types/customer-types"

const customerFormSchema = customerSchema.extend({
  name: z.string().min(1, "Vui lòng nhập tên khách hàng"),
  email: z.string().email("Email không hợp lệ").or(z.literal("")),
  phone: z.string().min(1, "Vui lòng nhập số điện thoại"),
})

type CustomerFormData = z.infer<typeof customerFormSchema>

const defaultForm: CustomerFormData = {
  id: "",
  name: "",
  category: "",
  status: "lead",
  address: "",
  email: "",
  phone: "",
  gender: null,
  note: "",
}

interface AddCustomerModalProps {
  onAddCustomer?: (customer: Customer) => void | Promise<void>
  initialData?: Customer
  open?: boolean
  onOpenChange?: (open: boolean) => void
  trigger?: React.ReactNode
}

export function AddCustomerModal({
  onAddCustomer,
  initialData,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  trigger,
}: AddCustomerModalProps) {
  const isControlled = controlledOpen !== undefined
  const [internalOpen, setInternalOpen] = useState(false)
  const open = isControlled ? controlledOpen : internalOpen
  const setOpen = isControlled ? controlledOnOpenChange! : setInternalOpen

  const isEditing = !!initialData

  const [formData, setFormData] = useState<CustomerFormData>(defaultForm)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (open) {
      setFormData(initialData ?? defaultForm)
      setErrors({})
    }
  }, [open, initialData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const validated = customerFormSchema.parse({
        ...formData,
        id: formData.id || `KH-${Date.now()}`,
      })

      const customer: Customer = {
        ...validated,
        gender: validated.gender || null,
      }

      await onAddCustomer?.(customer)
      setOpen(false)
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {}
        error.issues.forEach((issue) => {
          if (issue.path[0]) newErrors[issue.path[0] as string] = issue.message
        })
        setErrors(newErrors)
      } else {
        setErrors({ root: error instanceof Error ? error.message : "Có lỗi xảy ra" })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const content = (
    <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>
          {isEditing ? "Chỉnh sửa khách hàng" : "Thêm khách hàng mới"}
        </DialogTitle>
        <DialogDescription>
          {isEditing
            ? "Cập nhật thông tin khách hàng."
            : "Điền thông tin để thêm khách hàng vào danh sách."}
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        {errors.root && (
          <p className="text-sm text-destructive">{errors.root}</p>
        )}

        {/* Name + Gender */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Tên khách hàng *</Label>
            <Input
              id="name"
              placeholder="Nguyễn Văn A"
              value={formData.name}
              onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender">Giới tính</Label>
            <Select
              value={formData.gender ?? ""}
              onValueChange={(v) =>
                setFormData((p) => ({ ...p, gender: v || null }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn giới tính" />
              </SelectTrigger>
              <SelectContent>
                {genderOptions.map((g) => (
                  <SelectItem key={g.value} value={g.value}>
                    {g.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Category + Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="category">Ngành nghề</Label>
            <Select
              value={formData.category}
              onValueChange={(v) => setFormData((p) => ({ ...p, category: v }))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn ngành nghề" />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Trạng thái</Label>
            <Select
              value={formData.status}
              onValueChange={(v) => setFormData((p) => ({ ...p, status: v }))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.icon} {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Phone + Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Số điện thoại *</Label>
            <Input
              id="phone"
              placeholder="0901234567"
              value={formData.phone}
              onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
              className={errors.phone ? "border-destructive" : ""}
            />
            {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="example@gmail.com"
              value={formData.email}
              onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
              className={errors.email ? "border-destructive" : ""}
            />
            {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
          </div>
        </div>

        {/* Address */}
        <div className="space-y-2">
          <Label htmlFor="address">Địa chỉ</Label>
          <Input
            id="address"
            placeholder="Số nhà, đường, quận/huyện, tỉnh/thành"
            value={formData.address}
            onChange={(e) => setFormData((p) => ({ ...p, address: e.target.value }))}
          />
        </div>

        {/* Note */}
        <div className="space-y-2">
          <Label htmlFor="note">Ghi chú</Label>
          <Textarea
            id="note"
            placeholder="Thông tin bổ sung về khách hàng..."
            value={formData.note}
            onChange={(e) => setFormData((p) => ({ ...p, note: e.target.value }))}
            rows={4}
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            className="cursor-pointer"
            disabled={isSubmitting}
            onClick={() => setOpen(false)}
          >
            Hủy
          </Button>
          <Button type="submit" className="cursor-pointer" disabled={isSubmitting}>
            <Plus className="w-4 h-4 mr-1" />
            {isSubmitting
              ? isEditing ? "Đang lưu..." : "Đang thêm..."
              : isEditing ? "Lưu thay đổi" : "Thêm khách hàng"}
          </Button>
        </div>
      </form>
    </DialogContent>
  )

  if (isControlled) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        {content}
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button type="button" variant="default" size="sm" className="cursor-pointer">
            <Plus className="w-4 h-4" />
            Thêm khách hàng
          </Button>
        )}
      </DialogTrigger>
      {content}
    </Dialog>
  )
}
