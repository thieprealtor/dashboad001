/**
 * Script seed 15 khách hàng mẫu lên Firestore
 * Sử dụng Firestore REST API (không cần firebase-admin)
 *
 * Chạy: node scripts/seed-customers.mjs
 */

import { readFileSync } from "fs"
import { resolve, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))

// Đọc .env.local
function loadEnv() {
  try {
    const envPath = resolve(__dirname, "../.env.local")
    const content = readFileSync(envPath, "utf-8")
    content.split("\n").forEach((line) => {
      const match = line.match(/^([^=]+)=["']?([^"'\n]*)["']?$/)
      if (match) process.env[match[1].trim()] = match[2].trim()
    })
  } catch {
    console.warn("Không tìm thấy .env.local, dùng biến môi trường hệ thống")
  }
}

loadEnv()

const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
const API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY
const COLLECTION = "customers"

if (!PROJECT_ID || !API_KEY) {
  console.error("❌ Thiếu NEXT_PUBLIC_FIREBASE_PROJECT_ID hoặc NEXT_PUBLIC_FIREBASE_API_KEY")
  process.exit(1)
}

const customersData = [
  {
    id: "KH-001",
    name: "Nguyễn Văn An",
    category: "real_estate",
    status: "win",
    address: "123 Lê Lợi, Quận 1, TP. Hồ Chí Minh",
    email: "nguyenvanan@gmail.com",
    phone: "0901234567",
    gender: "male",
    note: "Khách hàng VIP, quan tâm đến dự án ven biển Đà Nẵng.",
  },
  {
    id: "KH-002",
    name: "Trần Thị Bích",
    category: "beauty",
    status: "met",
    address: "45 Nguyễn Huệ, Quận Hải Châu, Đà Nẵng",
    email: "tranthibich@gmail.com",
    phone: "0912345678",
    gender: "female",
    note: "Chủ chuỗi spa 3 cơ sở, cần tư vấn mở rộng.",
  },
  {
    id: "KH-003",
    name: "Phạm Minh Cường",
    category: "technology",
    status: "contacted",
    address: "67 Đinh Tiên Hoàng, Quận Bình Thạnh, TP. Hồ Chí Minh",
    email: "phamcuong@techvn.com",
    phone: "0934567890",
    gender: "male",
    note: "CEO startup fintech, đang tìm văn phòng mới.",
  },
  {
    id: "KH-004",
    name: "Lê Thị Dung",
    category: "education",
    status: "met",
    address: "89 Trần Phú, Quận Hoàn Kiếm, Hà Nội",
    email: "ledung.edu@gmail.com",
    phone: "0945678901",
    gender: "female",
    note: "Hiệu trưởng trường tư thục, quan tâm đến cơ sở mới.",
  },
  {
    id: "KH-005",
    name: "Võ Thanh Hải",
    category: "construction",
    status: "win",
    address: "12 Hùng Vương, Quận Ninh Kiều, Cần Thơ",
    email: "vothanhai@xaydung.vn",
    phone: "0956789012",
    gender: "male",
    note: "Giám đốc công ty xây dựng, đã hợp tác 3 dự án.",
  },
  {
    id: "KH-006",
    name: "Hoàng Lan Anh",
    category: "retail",
    status: "contacted",
    address: "234 Lê Thánh Tông, Quận Ngô Quyền, Hải Phòng",
    email: "hoanglanhanh@gmail.com",
    phone: "0967890123",
    gender: "female",
    note: "Chuỗi cửa hàng thời trang 5 chi nhánh miền Bắc.",
  },
  {
    id: "KH-007",
    name: "Đặng Văn Khoa",
    category: "logistics",
    status: "lead",
    address: "56 Quang Trung, TP. Quy Nhơn, Bình Định",
    email: "dangvankhoa@logistics.com",
    phone: "0978901234",
    gender: "male",
    note: "Giám đốc công ty vận tải, fleet 50 xe tải.",
  },
  {
    id: "KH-008",
    name: "Nguyễn Thị Mai",
    category: "healthcare",
    status: "lead",
    address: "78 Nguyễn Trãi, Quận Thanh Xuân, Hà Nội",
    email: "nguyenthimai.bs@gmail.com",
    phone: "0989012345",
    gender: "female",
    note: "Bác sĩ, muốn mở phòng khám chuyên khoa nhi.",
  },
  {
    id: "KH-009",
    name: "Lý Đức Thắng",
    category: "finance",
    status: "lose",
    address: "90 Đinh Lễ, Quận Hoàn Kiếm, Hà Nội",
    email: "lyducthang@bank.vn",
    phone: "0901234568",
    gender: "male",
    note: "Trưởng phòng tín dụng ngân hàng, khách hàng cũ.",
  },
  {
    id: "KH-010",
    name: "Trương Thị Kim Oanh",
    category: "hospitality",
    status: "win",
    address: "11 Phạm Văn Đồng, Nha Trang, Khánh Hòa",
    email: "truongkimoanh@resort.com",
    phone: "0912345679",
    gender: "female",
    note: "Chủ resort 4 sao ven biển, mở rộng thêm villa.",
  },
  {
    id: "KH-011",
    name: "Bùi Quang Vinh",
    category: "manufacturing",
    status: "met",
    address: "23 KCN Biên Hòa, Đồng Nai",
    email: "buiquangvinh@factory.vn",
    phone: "0923456789",
    gender: "male",
    note: "Giám đốc nhà máy sản xuất đồ gia dụng.",
  },
  {
    id: "KH-012",
    name: "Phan Thị Hồng",
    category: "agriculture",
    status: "contacted",
    address: "Xã Ea Kly, Huyện Krông Pắk, Đắk Lắk",
    email: "phanhong.farm@gmail.com",
    phone: "0934567891",
    gender: "female",
    note: "Chủ trang trại cà phê 50 ha, xuất khẩu sang Châu Âu.",
  },
  {
    id: "KH-013",
    name: "Cao Minh Tuấn",
    category: "entertainment",
    status: "lead",
    address: "156 Võ Văn Kiệt, Quận 1, TP. Hồ Chí Minh",
    email: "caominhtuan@media.vn",
    phone: "0945678902",
    gender: "male",
    note: "Giám đốc sản xuất chương trình truyền hình.",
  },
  {
    id: "KH-014",
    name: "Đỗ Thị Nga",
    category: "other",
    status: "lose",
    address: "34 Trần Hưng Đạo, TP. Huế",
    email: "dothinga@gmail.com",
    phone: "0956789013",
    gender: "female",
    note: "Chưa xác định ngành nghề cụ thể, cần tư vấn thêm.",
  },
  {
    id: "KH-015",
    name: "Vũ Anh Dũng",
    category: "real_estate",
    status: "lead",
    address: "67 Nguyễn Đình Chiểu, Quận 3, TP. Hồ Chí Minh",
    email: "vuanhdung@gmail.com",
    phone: "0967890124",
    gender: null,
    note: "",
  },
]

// Chuyển dữ liệu JS sang Firestore REST format
function toFirestoreValue(value) {
  if (value === null || value === undefined) return { nullValue: null }
  if (typeof value === "string") return { stringValue: value }
  if (typeof value === "number") return { integerValue: String(value) }
  if (typeof value === "boolean") return { booleanValue: value }
  if (Array.isArray(value)) {
    return { arrayValue: { values: value.map(toFirestoreValue) } }
  }
  if (typeof value === "object") {
    const fields = {}
    for (const [k, v] of Object.entries(value)) {
      fields[k] = toFirestoreValue(v)
    }
    return { mapValue: { fields } }
  }
  return { stringValue: String(value) }
}

function toFirestoreDocument(obj) {
  const fields = {}
  for (const [key, value] of Object.entries(obj)) {
    fields[key] = toFirestoreValue(value)
  }
  return { fields }
}

async function seedCustomer(customer) {
  const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${COLLECTION}/${customer.id}?key=${API_KEY}`

  const body = JSON.stringify(toFirestoreDocument(customer))

  const res = await fetch(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body,
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`HTTP ${res.status}: ${err}`)
  }

  return res.json()
}

async function main() {
  console.log(`🚀 Bắt đầu seed ${customersData.length} khách hàng lên Firestore...`)
  console.log(`📦 Project: ${PROJECT_ID} | Collection: ${COLLECTION}\n`)

  let success = 0
  let failed = 0

  for (const customer of customersData) {
    try {
      await seedCustomer(customer)
      console.log(`  ✅ ${customer.id} - ${customer.name}`)
      success++
    } catch (err) {
      console.error(`  ❌ ${customer.id} - ${customer.name}: ${err.message}`)
      failed++
    }
  }

  console.log(`\n📊 Kết quả: ${success} thành công, ${failed} thất bại`)

  if (failed === 0) {
    console.log("🎉 Seed data hoàn tất!")
  } else {
    console.log("⚠️  Một số document không được tạo. Kiểm tra Firestore Rules và API Key.")
    process.exit(1)
  }
}

main()
