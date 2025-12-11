"use client"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./select"

export default function ServiceSelect({ services, defaultValue }: any) {
  return (
    <Select name="service_id" defaultValue={defaultValue} required>
      <SelectTrigger>
        <SelectValue placeholder="اختر نوع الخدمة" />
      </SelectTrigger>
      <SelectContent>
        {services?.map((service: any) => (
          <SelectItem key={service.id} value={service.id}>
            {service.name_ar || service.name_en}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
