import { useState, useEffect, useCallback } from 'react';

interface Position {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export function useLocation() {
  const [position, setPosition] = useState<Position | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fallback para web - usa API de geolocalizacao do navegador
  const getWebLocation = useCallback((): Promise<Position | null> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        setError('Geolocalizacao nao suportada no navegador');
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (geoPosition) => {
          const newPosition = {
            latitude: geoPosition.coords.latitude,
            longitude: geoPosition.coords.longitude,
            accuracy: geoPosition.coords.accuracy,
          };
          setPosition(newPosition);
          setError(null);
          resolve(newPosition);
        },
        (err) => {
          setError('Erro ao obter localizacao: ' + err.message);
          resolve(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 30000,
        }
      );
    });
  }, []);

const requestPermission = useCallback(async (): Promise<boolean> => {
return true;
}, []);

const getCurrentPosition = useCallback(async (): Promise<Position | null> => {
return await getWebLocation();
}, [getWebLocation]);

useEffect(() => {
getCurrentPosition();
const interval = setInterval(() => {
getCurrentPosition();
}, 10000);
setLoading(false);
return () => clearInterval(interval);
}, [getCurrentPosition]);

  return { position, loading, error, requestPermission, getCurrentPosition };
}
