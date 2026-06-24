/**
 * MapViewLeaflet — Search Feature (dynamic import only)
 * src/features/search/MapViewLeaflet.tsx
 *
 * Actual Leaflet map with doctor pins and popup mini-cards.
 * Must be dynamically imported with { ssr: false } in the parent.
 */

"use client";

import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import Link from "next/link";
import { Star } from "lucide-react";
import { cn, toPersianNumerals } from "@/lib/utils";
import { ROUTES } from "@/constants";
import type { Doctor } from "@/types/doctor";

/* Custom teal teardrop pin — avoids webpack default-icon path issues */
const PIN = L.divIcon({
  className: "",
  html: `<span style="display:block;width:24px;height:24px;background:#0d9488;border:2.5px solid #fff;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 1px 6px rgba(0,0,0,.25)"></span>`,
  iconSize:    [24, 24],
  iconAnchor:  [12, 24],
  popupAnchor: [0, -28],
});

/* ----------------------------------------------------------------
   FitBounds — re-fits the map whenever the doctor list changes
   ---------------------------------------------------------------- */
function FitBounds({ doctors }: { doctors: Doctor[] }) {
  const map = useMap();

  useEffect(() => {
    const pts = doctors
      .filter((d) => d.lat != null && d.lng != null)
      .map((d) => [d.lat!, d.lng!] as [number, number]);

    if (pts.length === 0) return;
    if (pts.length === 1 && pts[0]) {
      map.setView(pts[0], 14);
    } else {
      map.fitBounds(L.latLngBounds(pts as [number, number][]), { padding: [48, 48], maxZoom: 13 });
    }
  }, [map, doctors]);

  return null;
}

/* ----------------------------------------------------------------
   DoctorPopup — mini-preview card shown on pin click
   ---------------------------------------------------------------- */
function DoctorPopup({ doctor }: { doctor: Doctor }) {
  return (
    <div className="min-w-[190px]" dir="rtl">
      {/* Avatar + Name */}
      <div className="flex items-center gap-2 mb-2.5">
        {doctor.photoUrl ? (
          <img
            src={doctor.photoUrl}
            alt={doctor.displayName}
            className="w-9 h-9 rounded-xl object-cover shrink-0"
          />
        ) : (
          <div
            className={cn(
              "w-9 h-9 rounded-xl shrink-0",
              "flex items-center justify-center",
              "text-xs font-bold select-none",
              doctor.avatarColor
            )}
            aria-hidden="true"
          >
            {doctor.initials}
          </div>
        )}
        <div className="min-w-0">
          <p className="text-xs font-semibold text-neutral-900 leading-snug">
            {doctor.displayName}
          </p>
          <p className="text-[0.625rem] text-neutral-500 truncate">
            {doctor.specialtyLabel} · {doctor.cityLabel}
          </p>
        </div>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-1 mb-3">
        <Star size={10} className="text-amber-400 fill-amber-400" aria-hidden="true" />
        <span className="text-xs font-semibold text-neutral-700 tabular-nums">
          {toPersianNumerals(doctor.rating.toFixed(1))}
        </span>
        <span className="text-xs text-neutral-400 tabular-nums">
          ({toPersianNumerals(doctor.reviewCount)} نظر)
        </span>
      </div>

      {/* CTA */}
      <Link
        href={ROUTES.DOCTOR_PROFILE(doctor.slug)}
        className={cn(
          "block w-full text-center py-1.5 rounded-lg",
          "bg-brand-600 hover:bg-brand-700",
          "text-white text-xs font-semibold",
          "transition-colors duration-150"
        )}
      >
        مشاهده پروفایل
      </Link>
    </div>
  );
}

/* ----------------------------------------------------------------
   MapViewLeaflet — default export, dynamically imported by MapView
   ---------------------------------------------------------------- */
export interface MapViewLeafletProps {
  doctors: Doctor[];
}

export default function MapViewLeaflet({ doctors }: MapViewLeafletProps) {
  const withCoords = doctors.filter((d) => d.lat != null && d.lng != null);

  return (
    <MapContainer
      center={[32.4279, 53.6880]}
      zoom={5}
      style={{ width: "100%", height: "100%" }}
      scrollWheelZoom
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      <FitBounds doctors={withCoords} />
      {withCoords.map((doctor) => (
        <Marker
          key={doctor.id}
          position={[doctor.lat!, doctor.lng!]}
          icon={PIN}
        >
          <Popup>
            <DoctorPopup doctor={doctor} />
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
