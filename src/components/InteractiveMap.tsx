import * as React from 'react';
import Map, { GeolocateControl, Marker } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import circle from '@turf/circle';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import '../styles/InteractiveMap.css'
import { useMemo } from 'react';
import useStore from '../store/store';


// Создаем геозону радиусом 7 миль вокруг центра СПб
const CENTER_COORDS = [30.315965, 59.939009];
const GEOFENCE = circle(CENTER_COORDS, 7, { units: 'miles' });


interface ViewState {
  longitude: number;
  latitude: number;
  zoom: number;
}

function InteractiveMap() {
  const [viewState, setViewState] = React.useState<ViewState>({
    longitude: CENTER_COORDS[0],
    latitude: CENTER_COORDS[1],
    zoom: 12
  });

  const { data, setCurrentCharacter } = useStore();

  const pins = useMemo(() => {
    if (!data) return null;
    return data.map((character) => (
      <Marker
        key={character.id}
        longitude={character.longitude}
        latitude={character.latitude}
        anchor="center"
        onClick={() => setCurrentCharacter(character)}
      >
        <img 
          className='map-pin'
          src={character.img} 
          alt={character.name}
          title={character.name}
        />
      </Marker>
    ));
  }, [data]);

  const onMove = React.useCallback(({ viewState }: { viewState: ViewState }) => {
    const newCenter = [viewState.longitude, viewState.latitude];
    if (booleanPointInPolygon(newCenter, GEOFENCE)) {
      setViewState(viewState);
    }
  }, []);
  return (
    <div className="map-container">
      <Map
        {...viewState}
        minZoom={10}
        maxZoom={18}
        onMove={onMove}
        style={{ width: '100%', height: '100%' }}
        mapStyle="/positron.json"      >
        <GeolocateControl position="top-left" />
        {pins}
      </Map>
    </div>
  );
};

export default InteractiveMap