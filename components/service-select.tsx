"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"

interface ServiceSelectProps {
  services?: Array<{
    id: string
    name_ar?: string | null
    name_en?: string | null
  }> | null
  defaultValue?: string
}

export function ServiceSelectWrapper({ services, defaultValue }: ServiceSelectProps) {
  const [selectedValue, setSelectedValue] = useState<string>(defaultValue || "")

  return (
    <>
      <input type="hidden" name="service_id" value={selectedValue} required />
      <Select value={selectedValue} onValueChange={setSelectedValue} required>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="اختر نوع الخدمة" />
        </SelectTrigger>
        <SelectContent>
          {(services || []).map((service) => (
            <SelectItem key={service.id} value={service.id}>
              {service.name_ar || service.name_en || "خدمة"}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  )
}

interface UrgencySelectProps {
  defaultValue?: string
}

export function UrgencySelectWrapper({ defaultValue = "normal" }: UrgencySelectProps) {
  const [selectedValue, setSelectedValue] = useState<string>(defaultValue)

  return (
    <>
      <input type="hidden" name="urgency" value={selectedValue} />
      <Select value={selectedValue} onValueChange={setSelectedValue}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="low">عادي</SelectItem>
          <SelectItem value="normal">متوسط</SelectItem>
          <SelectItem value="high">عاجل</SelectItem>
          <SelectItem value="emergency">طوارئ</SelectItem>
        </SelectContent>
      </Select>
    </>
  )
}

