import React from 'react';

interface MapViewProps {
children?: React.ReactNode;
style?: React.CSSProperties;
initialRegion?: any;
showsUserLocation?: boolean;
followsUserLocation?: boolean;
}

export default function MapView({ style }: MapViewProps) {
return (
<div style={{ ...webMapStyles, ...style }}>
<p style={webMapTextStyles}>📍 Mapa disponível apenas em dispositivos móveis</p>
<p style={webMapSubtextStyles}>Use o app nativo para visualizar o mapa</p>
</div>
);
}

export const Marker = (_props: any) => null;
export const Circle = (_props: any) => null;

const webMapStyles: React.CSSProperties = {
flex: 1,
backgroundColor: '#E5E7EB',
borderRadius: 16,
justifyContent: 'center',
alignItems: 'center',
padding: 20,
};

const webMapTextStyles: React.CSSProperties = {
fontSize: 16,
fontWeight: 600,
color: '#6B7280',
textAlign: 'center',
marginBottom: 8,
};

const webMapSubtextStyles: React.CSSProperties = {
fontSize: 14,
color: '#9CA3AF',
textAlign: 'center',
};
