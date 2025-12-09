"use client"

import { useEffect, useRef } from "react"
import { MapPin } from "lucide-react"

interface MapViewProps {
  latitude?: number
  longitude?: number
  markers?: Array<{
    id: string
    lat: number
    lng: number
    title: string
  }>
  height?: string
}

export function MapView({ latitude = 30.0444, longitude = 31.2357, markers = [], height = "400px" }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // في التطبيق الحقيقي، سيتم استخدام Google Maps API أو Mapbox
    // هنا نعرض خريطة بسيطة كمثال
    console.log("[v0] Map initialized with coordinates:", { latitude, longitude, markers })
  }, [latitude, longitude, markers])

  return (
    <div ref={mapRef} className="relative w-full rounded-lg overflow-hidden border bg-gray-100" style={{ height }}>
      {/* Placeholder map - في التطبيق الحقيقي سيتم استبداله بخريطة حقيقية */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <MapPin className="w-12 h-12 text-primary mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">الخريطة التفاعلية</p>
          <p className="text-xs text-muted-foreground mt-1">
            الموقع: {latitude.toFixed(4)}, {longitude.toFixed(4)}
          </p>
          {markers.length > 0 && (
            <p className="text-xs text-muted-foreground mt-1">{markers.length} موقع على الخريطة</p>
          )}
        </div>
      </div>

      {/* Grid overlay to simulate map */}
      <div className="absolute inset-0 opacity-10">
        <div className="grid grid-cols-8 grid-rows-8 h-full">
          {Array.from({ length: 64 }).map((_, i) => (
            <div key={i} className="border border-gray-400" />
          ))}
        </div>
      </div>
    </div>
  )
}
