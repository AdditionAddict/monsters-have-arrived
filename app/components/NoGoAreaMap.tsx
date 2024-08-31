import { LeafletMouseEvent } from 'leaflet';
import { MapContainer, Polygon, Polyline, TileLayer, useMapEvents } from 'react-leaflet';

interface NoGoAreaMapProps {
  currentNoGoArea: [number, number][];
  existingNoGoAreas: [number, number][][];
  isDrawing: boolean;
  onMapClick: (e: LeafletMouseEvent) => void;
  onSave: () => void;
  userLocation: [number, number];
}

export default function NoGoAreaMap({
  currentNoGoArea,
  existingNoGoAreas,
  isDrawing,
  onMapClick,
  onSave,
  userLocation,
}: NoGoAreaMapProps) {
  function MapEvents({ onClick }: { onClick: (e: LeafletMouseEvent) => void }) {
    useMapEvents({
      click: onClick,
    });
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="mb-4 rounded-lg overflow-hidden shadow-lg">
        <MapContainer center={userLocation} zoom={15} className="h-[600px] w-full">
          <MapEvents onClick={onMapClick} />
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {existingNoGoAreas.map((area, index) => (
            <Polygon
              key={index}
              positions={area}
              pathOptions={{
                fillColor: 'red',
                fillOpacity: 0.3,
                color: 'red',
                weight: 2,
              }}
            />
          ))}

          {currentNoGoArea.length > 0 && (
            <>
              <Polygon
                positions={currentNoGoArea}
                pathOptions={{
                  fillColor: 'blue',
                  fillOpacity: 0.3,
                  color: 'blue',
                  weight: 2,
                }}
              />
              {isDrawing && (
                <Polyline
                  positions={[currentNoGoArea[0], currentNoGoArea[currentNoGoArea.length - 1]]}
                  pathOptions={{
                    color: 'blue',
                    weight: 2,
                    dashArray: '5, 5',
                  }}
                />
              )}
            </>
          )}

          {isDrawing && currentNoGoArea.length > 0 && (
            <Polygon
              positions={[currentNoGoArea[0]]}
              pathOptions={{
                fillColor: 'blue',
                fillOpacity: 1,
                color: 'blue',
                weight: 5,
              }}
            />
          )}
        </MapContainer>
      </div>
      <button
        onClick={onSave}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
        disabled={!isDrawing && currentNoGoArea.length < 3}
      >
        {isDrawing ? 'Finish and Save No-Go Area' : 'Save No-Go Area'}
      </button>
    </div>
  );
}
