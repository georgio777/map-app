import * as React from 'react';
import Map, { GeolocateControl, Marker } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import circle from '@turf/circle';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import '../styles/InteractiveMap.css';
import { useMemo, useCallback } from 'react';
import useStore from '../store/store';
import { useSearchParams } from 'react-router-dom';
import { MAPTILER_KEY } from '../config'

// Геозона радиусом 7 миль вокруг центра СПб
const CENTER_COORDS: [number, number] = [30.315965, 59.939009];
const GEOFENCE = circle(CENTER_COORDS, 7, { units: 'miles' });

interface ViewState {
  longitude: number;
  latitude: number;
  zoom: number;
}


export default function InteractiveMap() {
  const setSearchParams = useSearchParams()[1];
  const { data, setCurrentCharacter, currentId, setCurrentId } = useStore();
  const [viewState, setViewState] = React.useState<ViewState>({
    longitude: CENTER_COORDS[0],
    latitude: CENTER_COORDS[1],
    zoom: 12
  });

  // Генерим маркеры
  const pins = useMemo(() => {
    if (!data) return null;

    return data.map((character) => (
      <Marker
        key={character.id}
        longitude={character.longitude}
        latitude={character.latitude}
        anchor="center"
        onClick={() => {
          // 1) Устанавливаем персонажа в Zustand
          setCurrentCharacter(character);
          // 2) Записываем id в строку запроса
          setSearchParams({ id: String(character.id) });
          // 3) Устанавливаем currentId
          setCurrentId(character.id)
        }}
      >
        <div 
          style={{
            backgroundColor: currentId === character.id ? 'white' : 'black',
          }}
          title={character.name}
          className="map-pin">
            <span 
              style={{
                color: currentId === character.id ? 'black' : 'white'
              }}
              className="pin-name">
              {Array.from(character.name)[0]}
            </span>
        </div>
      </Marker>
    ));
  }, [data, setCurrentCharacter, setSearchParams, currentId, setCurrentId]);

  const onMove = useCallback(
    ({ viewState }: { viewState: ViewState }) => {
      const newCenter: [number, number] = [viewState.longitude, viewState.latitude];
      if (booleanPointInPolygon(newCenter, GEOFENCE)) {
        setViewState(viewState);
      }
    },
    []
  );

  return (
    <div className="map-container">
      <Map
        attributionControl={false}
        {...viewState}
        minZoom={10}
        maxZoom={18}
        onMove={onMove}
        style={{ width: '100%', height: '100%' }}
        mapStyle={`https://api.maptiler.com/maps/01980d77-7e8c-712b-a9a9-ae80a88527a9/style.json?key=${MAPTILER_KEY}`}
      >
        <GeolocateControl position="top-left" />
        {pins}
      </Map>
    </div>
  );
}
