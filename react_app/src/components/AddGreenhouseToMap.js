
import React, { useState } from 'react';
import { MapContainer, TileLayer, useMap, Marker, Popup, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';
import './Map.css'
import { Icon, latLng } from 'leaflet';

const AddMarkerOnClick = ({ onAddMarker }) => {
  useMapEvents({
    click(e) {
      onAddMarker(e.latlng);
    },
  });
  return null;
};

export default function AddGreenhouseToMap(props){
  const handleAddMarker = (latlng) => {
    props.setLatLng([latlng]);
  };

  const customIcon = new Icon({
    iconUrl: require("../imgs/location.png"),
    iconSize: [38, 38]
  })

  return (
      <MapContainer center={[47.37022199797108, 28.828125000000004]} zoom={7} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* <Marker position={[51.505, -0.09]} icon={customIcon}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker> */}
        <AddMarkerOnClick onAddMarker={handleAddMarker} />
        {props.latLng.map((position, idx) => (
          <Marker key={`marker-${idx}`} position={position} icon={customIcon}/>
        ))}
      </MapContainer>
  )
}