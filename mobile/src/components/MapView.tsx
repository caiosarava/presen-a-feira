import { Platform, View, Text, StyleSheet } from 'react-native';

interface MapViewProps {
  children?: React.ReactNode;
  style?: any;
  initialRegion?: any;
  showsUserLocation?: boolean;
  followsUserLocation?: boolean;
}

export default function MapView({ children, style, initialRegion, showsUserLocation, followsUserLocation }: MapViewProps) {
  if (Platform.OS === 'web') {
    return (
      <View style={[styles.webMap, style]}>
        <Text style={styles.webMapText}>📍 Mapa disponível apenas em dispositivos móveis</Text>
        <Text style={styles.webMapSubtext}>Use o app nativo para visualizar o mapa</Text>
      </View>
    );
  }

  const ActualMapView = require('react-native-maps').default;
  return <ActualMapView {...{ style, initialRegion, showsUserLocation, followsUserLocation }}>{children}</ActualMapView>;
}

export const Marker = (props: any) => {
  if (Platform.OS === 'web') {
    return null;
  }
  const ActualMarker = require('react-native-maps').Marker;
  return <ActualMarker {...props} />;
};

export const Circle = (props: any) => {
  if (Platform.OS === 'web') {
    return null;
  }
  const ActualCircle = require('react-native-maps').Circle;
  return <ActualCircle {...props} />;
};

const styles = StyleSheet.create({
  webMap: {
    flex: 1,
    backgroundColor: '#E5E7EB',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  webMapText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 8,
  },
  webMapSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});
