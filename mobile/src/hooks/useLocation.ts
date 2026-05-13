import { useState, useEffect, useCallback } from 'react';
import * as Location from 'expo-location';

interface Position {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export function useLocation() {
  const [position, setPosition] = useState<Position | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Permissao de localizacao negada');
        return false;
      }
      return true;
    } catch (err) {
      setError('Erro ao solicitar permissao');
      return false;
    }
  }, []);

  const getCurrentPosition = useCallback(async (): Promise<Position | null> => {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status !== 'granted') {
        const hasPermission = await requestPermission();
        if (!hasPermission) return null;
      }
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        maximumAge: 30000,
        timeout: 15000,
      });
      const newPosition = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy,
      };
      setPosition(newPosition);
      setError(null);
      return newPosition;
    } catch (err) {
      setError('Erro ao obter localizacao');
      return null;
    }
  }, [requestPermission]);

  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;
    const startLocationUpdates = async () => {
      try {
        const hasPermission = await requestPermission();
        if (!hasPermission) {
          setLoading(false);
          return;
        }
        await getCurrentPosition();
        setLoading(false);
        subscription = await Location.watchPositionAsync(
          { accuracy: Location.Accuracy.High, timeInterval: 5000, distanceInterval: 5 },
          (location) => {
            setPosition({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              accuracy: location.coords.accuracy,
            });
            setError(null);
          }
        );
      } catch (err) {
        setError('Erro ao iniciar localizacao');
        setLoading(false);
      }
    };
    startLocationUpdates();
    return () => {
      if (subscription) subscription.remove();
    };
  }, [requestPermission, getCurrentPosition]);

  return { position, loading, error, requestPermission, getCurrentPosition };
}
