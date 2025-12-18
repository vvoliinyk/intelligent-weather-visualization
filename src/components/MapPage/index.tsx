import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { valueToColor } from '../../utils';
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
  const [geoData, setGeoData] = useState<GeoJsonObject | null>(null);

  useEffect(() => {
    fetch('fire_geojson_output/45.geojson')
      .then(res => res.json())
      .then(data => setGeoData(data))
      .catch(err => console.error('Failed to load GeoJSON:', err));
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
    <div style={{ height: '100%', width: '100%' }}>
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
            data={geoData}
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
