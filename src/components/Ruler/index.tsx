import { useEffect, useState } from "react";
import { Polyline, Popup, useMapEvents } from "react-leaflet";

 // Компонент лінійки
  export default function Ruler() {
        const [rulerPoints, setRulerPoints] = useState<[number, number][]>([]);
      const [rulerDistance, setRulerDistance] = useState<number | null>(null);
         const [rulerMode, setRulerMode] = useState(false); // режим лінійки
         
    const map = useMapEvents({
      click(e) {
                if (!rulerMode) return; 
        if (rulerPoints.length === 0) {
          setRulerPoints([[e.latlng.lat, e.latlng.lng]]);
          setRulerDistance(null);
        } else if (rulerPoints.length === 1) {
          const newPoints = [...rulerPoints, [e.latlng.lat, e.latlng.lng]];
          setRulerPoints(newPoints);

          const [p1, p2] = newPoints;
          // Відстань у метрах
          const dist = L.latLng(p1[0], p1[1]).distanceTo(L.latLng(p2[0], p2[1]));
          setRulerDistance(dist);
        } else {
          // Скидаємо лінійку при третьому кліку
          setRulerPoints([[e.latlng.lat, e.latlng.lng]]);
          setRulerDistance(null);
        }
      },
    });

     useEffect(() => {
      if (rulerMode) {
        map.getContainer().style.cursor = 'crosshair';
      } else {
        map.getContainer().style.cursor = '';
      }
    }, [map, rulerMode]);

    return (
      <>
           <button
        onClick={() => {
          setRulerMode(!rulerMode)
          setRulerDistance(null)
          setRulerPoints([])
        }}
        style={{
          position: 'absolute',
          top: 10,
          left: 10,
          zIndex: 1000,
          padding: '0.5em 1em',
          backgroundColor: rulerMode ? '#f00' : '#3b8beb',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        {rulerMode ? 'Вимкнути лінійку' : 'Увімкнути лінійку'}
      </button>
        {rulerPoints.length > 1 && (
          <>
            <Polyline positions={rulerPoints} color="blue" />
            <Popup position={rulerPoints[1]}>
              {rulerDistance! >= 1000
                ? `${(rulerDistance! / 1000).toFixed(2)} км`
                : `${rulerDistance!.toFixed(0)} м`}
            </Popup>
          </>
        )}
      </>
    );
  }