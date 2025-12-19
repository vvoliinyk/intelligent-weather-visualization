/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { formatTime, valueToColor } from '../../utils';
import L from 'leaflet';
import Ruler from '../Ruler';


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
  const [geoData, setGeoData] = useState<GeoJsonObject[] | null>(null);
  const [timeIndex, setTimeIndex] = useState(0);


useEffect(() => {
  const fetchAllGeoJSON = async () => {
    try {
      const promises = Array.from({ length: 46 }, (_, i) =>
        fetch(`fire_geojson_output/${i}.geojson`).then(res => res.json())
      );

      const allData = await Promise.all(promises);

      // Об’єднуємо всі features в один об’єкт GeoJSON
      const mergedData =  allData

      setGeoData(mergedData);
    } catch (err) {
      console.error("Failed to load GeoJSON:", err);
    }
  };

  fetchAllGeoJSON();
}, []);

  // функція для підключення обробника кліку на кожен feature
const onEachFeature = (feature: GeoJsonFeature, layer: any) => {
  layer.on('click', (e: any) => {

    if (feature.properties) {
      L.popup()
        .setLatLng(e.latlng)
        .setContent(
          `<b>Залишок палива: ${feature.properties.value.toFixed(2)}</b>`
        )
        .openOn(layer._map);
    }
  });
};

  return (
    <div style={{ height: '100%', width: '100%', position: 'relative' }}>
      <div
  style={{
    position: 'absolute',
    bottom: 20,
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 1000,
    background: 'rgba(0,0,0,0.6)',
    padding: '10px 16px',
    borderRadius: '8px',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  }}
>
  <input
    type="range"
    min={0}
    max={45}
    step={1}
    value={timeIndex}
    onChange={e => setTimeIndex(Number(e.target.value))}
  />

  <span>{formatTime(timeIndex * 5)}</span>
</div>

      <MapContainer
        center={[50.4501, 30.5234]}
        zoom={8}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
     {geoData && (
          <GeoJSON
          key={timeIndex}
            data={geoData[timeIndex]}
            style={(feature) => ({
              color: valueToColor(feature?.properties?.value),
              weight: 2,
              fillOpacity: 0.5,
            })}
            onEachFeature={onEachFeature} // додаємо попапи
          />
       )}
        <Ruler />
      </MapContainer>
       
    </div>
  );
}
