import { getAuth } from "@clerk/remix/ssr.server";
import { redirect, type LoaderFunctionArgs } from "@remix-run/node";
import { useMutation, useQuery } from "convex/react";
import { LeafletMouseEvent } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { lazy, Suspense, useCallback, useState } from 'react';
import { ClientOnly } from 'remix-utils/client-only';
import { api } from "../../convex/_generated/api";

const NoGoAreaMap = lazy(() => import('../components/NoGoAreaMap'));

export async function loader(args: LoaderFunctionArgs) {
  const { userId } = await getAuth(args);
  if (!userId) {
    return redirect("/sign-in");
  }
  return { userId };
}

export default function NoGoAreas() {
  const noGoAreas = useQuery(api.noGoAreas.list) || [];
  const saveNoGoArea = useMutation(api.noGoAreas.save);
  const [currentNoGoArea, setCurrentNoGoArea] = useState<[number, number][]>([]);
  const [isDrawing, setIsDrawing] = useState(false);

  const handleMapClick = useCallback((e: LeafletMouseEvent) => {
    const newPoint: [number, number] = [e.latlng.lat, e.latlng.lng];
    
    if (!isDrawing) {
      setCurrentNoGoArea([newPoint]);
      setIsDrawing(true);
    } else {
      const startPoint = currentNoGoArea[0];
      const distance = Math.sqrt(
        Math.pow(newPoint[0] - startPoint[0], 2) + Math.pow(newPoint[1] - startPoint[1], 2)
      );

      if (distance < 0.0001 && currentNoGoArea.length > 2) {
        setCurrentNoGoArea([...currentNoGoArea, startPoint]);
        setIsDrawing(false);
      } else {
        setCurrentNoGoArea([...currentNoGoArea, newPoint]);
      }
    }
  }, [currentNoGoArea, isDrawing]);

  const handleSave = async () => {
    if (currentNoGoArea.length > 2) {
      await saveNoGoArea({ coordinates: currentNoGoArea });
      setCurrentNoGoArea([]);
      setIsDrawing(false);
    } else {
      alert("Please define a valid no-go area before saving.");
    }
  };

  return (
    <div>
      <h1>No-Go Area Map</h1>
      <ClientOnly fallback={<div>Loading map...</div>}>
        {() => (
          <Suspense fallback={<div>Loading map...</div>}>
            <NoGoAreaMap
              currentNoGoArea={currentNoGoArea}
              existingNoGoAreas={noGoAreas.map(area => area.coordinates)}
              isDrawing={isDrawing}
              onMapClick={handleMapClick}
              onSave={handleSave}
            />
          </Suspense>
        )}
      </ClientOnly>
    </div>
  );
}