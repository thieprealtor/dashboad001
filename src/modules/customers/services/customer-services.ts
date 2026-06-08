import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  writeBatch,
} from "firebase/firestore"

import { db } from "@/lib/firebase/client"
import { customerMockData } from "./customer-mock-data"
import type { Customer } from "./types/customer-types"

const CUSTOMERS_COLLECTION = "customers"

export async function getCustomers(): Promise<Customer[]> {
  try {
    const snapshot = await getDocs(collection(db, CUSTOMERS_COLLECTION))
    if (snapshot.empty) return customerMockData

    const result = snapshot.docs.map((document) => {
      const data = document.data() as Customer
      return { ...data, id: data.id ?? document.id }
    })

    return JSON.parse(JSON.stringify(result))
  } catch {
    return customerMockData
  }
}

export async function seedCustomersWithClient(): Promise<Customer[]> {
  const batch = writeBatch(db)
  customerMockData.forEach((customer) => {
    batch.set(doc(db, CUSTOMERS_COLLECTION, customer.id), customer, { merge: true })
  })
  await batch.commit()
  return getCustomers()
}

export async function createCustomer(customer: Customer): Promise<Customer> {
  await setDoc(doc(db, CUSTOMERS_COLLECTION, customer.id), customer)
  return customer
}

export async function updateCustomer(customer: Customer): Promise<Customer> {
  await updateDoc(doc(db, CUSTOMERS_COLLECTION, customer.id), { ...customer })
  return customer
}

export async function deleteCustomer(customerId: string): Promise<void> {
  await deleteDoc(doc(db, CUSTOMERS_COLLECTION, customerId))
}

export function getCustomerStats(customers: Customer[]) {
  const total = customers.length
  const byGender = {
    male: customers.filter((c) => c.gender === "male").length,
    female: customers.filter((c) => c.gender === "female").length,
    other: customers.filter((c) => c.gender === "other" || !c.gender).length,
  }
  return { total, ...byGender }
}
