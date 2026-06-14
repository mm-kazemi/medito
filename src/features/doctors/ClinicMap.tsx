/**
 * ClinicMap — Doctors Feature
 * src/features/doctors/ClinicMap.tsx
 *
 * Renders a fully interactive OpenStreetMap via an <iframe> embed.
 * - No API key required
 * - Native pan, zoom, and click interactions
 * - A distinct map pin is shown using OSM's marker URL parameter
 * - Works in SSR (static iframe, no client JS needed)
 *
 * The iframe uses the openstreetmap.org export/embed endpoint:
 *   https://www.openstreetmap.org/export/embed.html
 *   ?bbox=<lng-w>,<lat-s>,<lng-e>,<lat-n>
 *   &layer=mapnik
 *   &marker=<lat>,<lng>
 *
 * A fixed ±0.005° bounding box produces an appropriate zoom level
 * for a city-level clinic location.
 */

import type { ClinicInfo } from "@/types/doctor";

export interface ClinicMapProps {
  clinic: ClinicInfo;
  /** Map height — defaults to "360px" */
  height?: string;
}

export function ClinicMap({ clinic, height = "360px" }: ClinicMapProps) {
  const { lat, lng } = clinic;

  /* Build bounding box ~±0.005° around the marker for ~zoom 15 */
  const delta  = 0.005;
  const bbox   = [lng - delta, lat - delta, lng + delta, lat + delta].join(",");

  const src =
    `https://www.openstreetmap.org/export/embed.html` +
    `?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`;

  return (
    <div
      className="overflow-hidden rounded-2xl border border-neutral-100"
      style={{ height }}
    >
      <iframe
        title={`موقعیت ${clinic.name} روی نقشه`}
        src={src}
        width="100%"
        height="100%"
        style={{ border: 0, display: "block" }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    </div>
  );
}
