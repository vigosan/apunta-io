import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import type { Item } from "@/hooks/useItems";

const proto = L.Icon.Default.prototype as unknown as Record<string, unknown>;
// biome-ignore lint/complexity/useLiteralKeys: required for leaflet default icon fix
delete proto["_getIconUrl"];
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface Props {
  items: Item[];
  activeItems: Item[];
}

function InvalidateSize() {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
  }, [map]);
  return null;
}

export function ListMap({ items, activeItems }: Props) {
  const geoItems = items.filter(
    (i) => i.latitude !== null && i.longitude !== null
  );

  if (geoItems.length === 0) return null;

  const activeIds = new Set(activeItems.map((i) => i.id));

  const center: [number, number] = [
    Number(geoItems[0].latitude),
    Number(geoItems[0].longitude),
  ];

  return (
    <MapContainer
      center={center}
      zoom={5}
      style={{ height: "100%", width: "100%" }}
      className="[filter:grayscale(1)]"
    >
      <InvalidateSize />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {geoItems.map((item) => (
        <Marker
          key={item.id}
          position={[Number(item.latitude), Number(item.longitude)]}
          opacity={activeIds.size === 0 || activeIds.has(item.id) ? 1 : 0.3}
        >
          <Popup>{item.text}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
