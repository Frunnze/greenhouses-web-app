
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap, Marker, Popup, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';
import './Map.css'
import { Icon } from 'leaflet';


export default function AllGreenhousesMap(props){
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
        {console.log(props.latLng)}
        {props.latLng.map((location, idx) => {
            const { name, lat, lng } = location;
            return (
                <Marker key={`marker-${idx}`} position={{ lat: lat, lng: lng }} icon={customIcon}>
                    <Popup>
                        {name}
                    </Popup>
                </Marker>
            );
        })}
      </MapContainer>
  )
}