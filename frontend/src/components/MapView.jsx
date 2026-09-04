import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import L from 'leaflet';
import { PriorityBadge, StatusBadge } from './Badges';
import { Link } from 'react-router-dom';

// Custom Leaflet Markers by Priority
const createCustomIcon = (level) => {
  let color = '#06B6D4'; // cyan
  if (level === 'CRITICAL') color = '#F43F5E'; // red
  if (level === 'HIGH') color = '#F59E0B'; // orange
  if (level === 'MEDIUM') color = '#06B6D4'; // cyan
  if (level === 'LOW') color = '#10B981'; // green

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="32" height="32" stroke="#ffffff" stroke-width="1.5">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
  </svg>`;

  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: svg,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

const ChangeMapView = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, zoom || 14);
    }
  }, [center, zoom, map]);
  return null;
};

export const MapView = ({
  issues = [],
  center = [22.3072, 73.1812],
  zoom = 13,
  interactivePin = false,
  pinPosition = null,
  onPinDragEnd = null,
  height = '400px',
}) => {
  const defaultPosition = pinPosition || center;

  return (
    <div style={{ height }} className="w-full rounded-2xl overflow-hidden border border-slate-800 relative shadow-xl">
      <MapContainer
        center={defaultPosition}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <ChangeMapView center={defaultPosition} zoom={zoom} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Draggable user pin for Report Issue Flow */}
        {interactivePin && (
          <Marker
            position={defaultPosition}
            draggable={true}
            eventHandlers={{
              dragend: (e) => {
                const marker = e.target;
                const pos = marker.getLatLng();
                if (onPinDragEnd) {
                  onPinDragEnd([pos.lat, pos.lng]);
                }
              },
            }}
            icon={createCustomIcon('CRITICAL')}
          >
            <Popup>
              <div className="text-slate-900 text-xs font-semibold p-1">
                📍 Drag pin to adjust exact location
              </div>
            </Popup>
          </Marker>
        )}

        {/* Render Issue Markers */}
        {!interactivePin &&
          issues.map((issue) => {
            if (!issue.latitude || !issue.longitude) return null;
            return (
              <React.Fragment key={issue.id}>
                <Marker
                  position={[issue.latitude, issue.longitude]}
                  icon={createCustomIcon(issue.priorityLevel)}
                >
                  <Popup>
                    <div className="p-1 space-y-2 text-slate-900 w-52">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] font-bold bg-slate-200 px-1.5 py-0.5 rounded">
                          {issue.clusterCode}
                        </span>
                        <PriorityBadge level={issue.priorityLevel} score={issue.priorityScore} />
                      </div>
                      <h4 className="font-bold text-xs leading-snug">{issue.title}</h4>
                      <p className="text-[11px] text-slate-600 line-clamp-2">{issue.address}</p>
                      <div className="flex items-center justify-between text-[11px] font-semibold pt-1 border-t">
                        <StatusBadge status={issue.status} />
                        <Link
                          to={`/citizen/issues/${issue.id}`}
                          className="text-cyan-700 hover:underline"
                        >
                          Details &rarr;
                        </Link>
                      </div>
                    </div>
                  </Popup>
                </Marker>

                {/* Show radius circle for Critical & High issues */}
                {(issue.priorityLevel === 'CRITICAL' || issue.priorityLevel === 'HIGH') && (
                  <Circle
                    center={[issue.latitude, issue.longitude]}
                    radius={50}
                    pathOptions={{
                      color: issue.priorityLevel === 'CRITICAL' ? '#F43F5E' : '#F59E0B',
                      fillColor: issue.priorityLevel === 'CRITICAL' ? '#F43F5E' : '#F59E0B',
                      fillOpacity: 0.15,
                    }}
                  />
                )}
              </React.Fragment>
            );
          })}
      </MapContainer>
    </div>
  );
};
