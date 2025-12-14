import { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON,  } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';


interface GeoJsonObject {
  type: "FeatureCollection";
  features: GeoJsonFeature[];
}

type GeoJsonPoint = [number, number];

interface GeoJsonFeature {
  type: "Feature";
  geometry: {
    type: "Polygon";
    coordinates:  GeoJsonPoint[][];
  }
  properties: {
    value: number;
    bin_id: number;
  };
}


export default function DniproMap() {
  const [geoData, setGeoData] = useState<GeoJsonObject>(null);

  useEffect(() => {
    fetch('wrf_polygons.geojson')
      .then(res => res.json())
      .then(data => setGeoData(data))
      .catch(err => console.error('Failed to load GeoJSON:', err));
  }, []);

  // функція для підключення обробника кліку на кожен feature
  const onEachFeature = (feature: GeoJsonFeature, layer: any) => {
    if (feature.properties) {
      const popupContent = Object.entries(feature.properties)
        .map(([key, value]) => `<b>${key}:</b> ${value}`)
        .join('<br />');

      layer.bindPopup(popupContent);
    }
  };

function valueToColor(value: number): string {
  const v = Math.max(0, Math.min(1, value));

  if (v === 1) {
   
    return `#00ff00`;
  }

  // 0.9 → 0.8 : помаранчевий → червоний
  if (v > 0.8) {
    const t = (0.9 - v) / 0.1; // 0 → 1
    const r = 255;
    const g = Math.round(153 * (1 - t)); // 153 → 0
    return `rgb(${r}, ${g}, 0)`;
  }

  // 0.8 → 0.5 : червоний (яскравий → темний)
  if (v > 0.5) {
    const t = (v - 0.5) / 0.3; // 0 → 1
    const r = Math.round(120 + 135 * t); // 120 → 255
    return `rgb(${r}, 0, 0)`;
  }

  // 0.5 → 0.4 : червоний → чорний
  if (v > 0.4) {
    const t = (v - 0.4) / 0.1; // 0 → 1
    const r = Math.round(120 * t);
    return `rgb(${r}, 0, 0)`;
  }

  // ≤ 0.4 : чорний
  return '#000000';
}



  return (
    <div style={{ height: '100%', width: '100%' }}>
      
      <MapContainer
        center={[51.0024299621582, 30.68597412109375]}
        zoom={10}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
     {geoData && (
          <GeoJSON
            data={geoData}
            style={(feature) => ({
              color: valueToColor(feature.properties?.value),
              weight: 2,
              fillOpacity: 0.5,
            })}
            onEachFeature={onEachFeature} // додаємо попапи
          />
       )}
      </MapContainer>
       
    </div>
  );
}
