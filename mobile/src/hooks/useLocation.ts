import { useState, useEffect, useCallback, Platform } from 'react';
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
    if (Platform.OS === 'web') {
      // Web nao precisa de permissao explicita, mas precisa de user interaction
      return true;
    }

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
    if (Platform.OS === 'web') {
      return await getWebLocation();
    }

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
  }, [requestPermission, getWebLocation]);

  useEffect(() => {
    if (Platform.OS === 'web') {
      // Web - usa polling a cada 10 segundos
      getCurrentPosition();
      const interval = setInterval(() => {
        getCurrentPosition();
      }, 10000);
      setLoading(false);
      return () => clearInterval(interval);
    } else {
      // Mobile - usa watch do expo-location
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
            {
              accuracy: Location.Accuracy.High,
              timeInterval: 5000,
              distanceInterval: 5,
            },
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
    }
  }, [requestPermission, getCurrentPosition]);

  return { position, loading, error, requestPermission, getCurrentPosition };
}
