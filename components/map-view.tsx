"use client"

import { useMemo, useState } from "react"
import Map, { Marker, Popup } from "react-map-gl"
import { MapPin } from "lucide-react"
import "mapbox-gl/dist/mapbox-gl.css"

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

const defaultCenter = {
  latitude: 30.0444, // القاهرة
  longitude: 31.2357,
}

export function MapView({ latitude, longitude, markers = [], height = "400px" }: MapViewProps) {
  const apiKey = process.env.NEXT_PUBLIC_MAPBOX_API_KEY
  const [popupInfo, setPopupInfo] = useState<{ id: string; title: string; lat: number; lng: number } | null>(null)

  // تحديد المركز: إما من props أو من أول marker أو القيمة الافتراضية
  const viewState = useMemo(() => {
    let centerLat = defaultCenter.latitude
    let centerLng = defaultCenter.longitude

    if (latitude && longitude) {
      centerLat = latitude
      centerLng = longitude
    } else if (markers.length > 0) {
      centerLat = markers[0].lat
      centerLng = markers[0].lng
    }

    return {
      latitude: centerLat,
      longitude: centerLng,
      zoom: markers.length > 0 ? 12 : latitude && longitude ? 15 : 10,
    }
  }, [latitude, longitude, markers])

  // إذا لم يكن هناك API key، نعرض placeholder
  if (!apiKey || apiKey === "your_mapbox_api_key") {
    return (
      <div className="relative w-full rounded-lg overflow-hidden border bg-gray-100" style={{ height }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-12 h-12 text-primary mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">الخريطة التفاعلية</p>
            <p className="text-xs text-muted-foreground mt-1">
              الموقع: {viewState.latitude.toFixed(4)}, {viewState.longitude.toFixed(4)}
            </p>
            {markers.length > 0 && (
              <p className="text-xs text-muted-foreground mt-1">{markers.length} موقع على الخريطة</p>
            )}
            <p className="text-xs text-red-500 mt-2">
              يرجى إضافة NEXT_PUBLIC_MAPBOX_API_KEY في ملف .env.local
            </p>
          </div>
        </div>
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

  return (
    <div className="relative w-full rounded-lg overflow-hidden border" style={{ height }}>
      <Map
        mapboxAccessToken={apiKey}
        initialViewState={viewState}
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        attributionControl={true}
      >
        {/* Marker للموقع الرئيسي إذا كان موجود */}
        {latitude && longitude && (
          <Marker
            latitude={latitude}
            longitude={longitude}
            anchor="bottom"
            onClick={() => setPopupInfo({ id: "main", title: "موقع الخدمة", lat: latitude, lng: longitude })}
          >
            <div className="cursor-pointer">
              <MapPin className="w-6 h-6 text-red-500 fill-red-500" />
            </div>
          </Marker>
        )}

        {/* Markers إضافية */}
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            latitude={marker.lat}
            longitude={marker.lng}
            anchor="bottom"
            onClick={() => setPopupInfo({ id: marker.id, title: marker.title, lat: marker.lat, lng: marker.lng })}
          >
            <div className="cursor-pointer">
              <MapPin className="w-6 h-6 text-blue-500 fill-blue-500" />
            </div>
          </Marker>
        ))}

        {/* Popup للمعلومات */}
        {popupInfo && (
          <Popup
            latitude={popupInfo.lat}
            longitude={popupInfo.lng}
            anchor="top"
            onClose={() => setPopupInfo(null)}
            closeButton={true}
            closeOnClick={false}
          >
            <div className="p-2">
              <p className="font-semibold text-sm">{popupInfo.title}</p>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  )
}
