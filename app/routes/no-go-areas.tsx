import { SignInButton } from '@clerk/clerk-react';
import { getAuth } from '@clerk/remix/ssr.server';
import { redirect, type LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { useConvexAuth, useMutation, useQuery } from 'convex/react';
import { LeafletMouseEvent } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { ClientOnly } from 'remix-utils/client-only';
import { GeneralErrorBoundary } from '~/components/error-boundary';
import Navbar from '~/components/navbar';
import { api } from '../../convex/_generated/api';

const NoGoAreaMap = lazy(() => import('../components/NoGoAreaMap'));

export async function loader(args: LoaderFunctionArgs) {
  const { userId } = await getAuth(args);
  if (!userId) {
    return redirect('/sign-in');
  }
  return { userId };
}

export default function NoGoAreas() {
  const { userId } = useLoaderData<typeof loader>();
  const noGoAreas = useQuery(api.noGoAreas.list) || [];
  const saveNoGoArea = useMutation(api.noGoAreas.save);
  const createOrUpdateUser = useMutation(api.users.createOrUpdate);
  const [currentNoGoArea, setCurrentNoGoArea] = useState<[number, number][]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number]>([0, 0]);
  const { isAuthenticated } = useConvexAuth();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
        createOrUpdateUser({ userId, location: [latitude, longitude] });
      },
      (error) => {
        console.error('Error getting user location:', error);
        // Set a default location if geolocation fails
        setUserLocation([51.505, -0.09]);
      }
    );
  }, [createOrUpdateUser, userId]);

  const handleMapClick = useCallback(
    (e: LeafletMouseEvent) => {
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
    },
    [currentNoGoArea, isDrawing]
  );

  const handleSave = async () => {
    if (!isAuthenticated) {
      alert('Please sign in to save a no-go area.');
      return;
    }

    if (currentNoGoArea.length > 2) {
      try {
        await saveNoGoArea({ coordinates: currentNoGoArea });
        await createOrUpdateUser({ location: userLocation, userId });
        setCurrentNoGoArea([]);
        setIsDrawing(false);
      } catch (error) {
        console.error('Error saving no-go area:', error);
        alert('Failed to save no-go area. Please try again.');
      }
    } else {
      alert('Please define a valid no-go area before saving.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <Navbar />

      <div>
        {!isAuthenticated && (
          <div>
            <p>Please sign in to save no-go areas.</p>
            <SignInButton />
          </div>
        )}
        <ClientOnly fallback={<div>Loading map...</div>}>
          {() => (
            <Suspense fallback={<div>Loading map...</div>}>
              <NoGoAreaMap
                userLocation={userLocation}
                currentNoGoArea={currentNoGoArea}
                existingNoGoAreas={noGoAreas.map((area) => area.coordinates as [number, number][])}
                isDrawing={isDrawing}
                onMapClick={handleMapClick}
                onSave={handleSave}
              />
            </Suspense>
          )}
        </ClientOnly>
      </div>
    </div>
  );
}

// This ensures that the error boundary is used for this route
export function ErrorBoundary() {
  return (
    <GeneralErrorBoundary
      statusHandlers={{
        404: ({ params }) => <p>No go area with the id &apos;{params.noGoAreaId}&apos; exists</p>,
      }}
    />
  );
}
