import { z } from "zod"

export const genderOptions = [
  { value: "male", label: "Nam" },
  { value: "female", label: "Nữ" },
  { value: "other", label: "Khác" },
] as const

export const categoryOptions = [
  { value: "real_estate", label: "Bất động sản" },
  { value: "retail", label: "Bán lẻ" },
  { value: "hospitality", label: "Nhà hàng / Khách sạn" },
  { value: "construction", label: "Xây dựng" },
  { value: "education", label: "Giáo dục" },
  { value: "healthcare", label: "Y tế / Sức khỏe" },
  { value: "technology", label: "Công nghệ" },
  { value: "finance", label: "Tài chính / Ngân hàng" },
  { value: "manufacturing", label: "Sản xuất" },
  { value: "agriculture", label: "Nông nghiệp" },
  { value: "logistics", label: "Vận tải / Logistics" },
  { value: "beauty", label: "Làm đẹp / Spa" },
  { value: "entertainment", label: "Giải trí / Truyền thông" },
  { value: "other", label: "Khác" },
] as const

export const statusOptions = [
  { value: "lead", label: "Lead", icon: "🔵" },
  { value: "contacted", label: "Đã liên hệ", icon: "📞" },
  { value: "met", label: "Đã gặp mặt", icon: "🤝" },
  { value: "win", label: "Win", icon: "✅" },
  { value: "lose", label: "Lose", icon: "❌" },
] as const

export const customerSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string(),
  status: z.string(),
  address: z.string(),
  email: z.string(),
  phone: z.string(),
  gender: z.string().nullable(),
  note: z.string(),
})

export type Customer = z.infer<typeof customerSchema>
