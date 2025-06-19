import React, { useState, useEffect } from "react";
import ZoneNameIcon from '../../imgs/zone_name.png';
import PlantNameIcon from '../../imgs/plant_selec.png';
import SensorsIcon from '../../imgs/sens_selec.png';
import TempIcon from '../../imgs/temperature-dash-icon.png';
import HumidityIcon from '../../imgs/humidity-dash-icon.png';
import LightIcon from '../../imgs/light-dash-icon.png';
import plantIcon from '../../imgs/plant.png';
import DeleteIcon from '../../imgs/delete-icon.png';
import EditIcon from '../../imgs/edit-icon.png';
import AddPlantForm from './AddPlantForm';
import AddSensorForm from './AddSensorsForm';
import AddZoneForm from './AddZoneForm';
import './Sensor.css'; 

function Sensor(props) {
    function onDelete() {
        // fetch to unset sensors
        fetch(`/unset-sensor/${props.sensor_id}`, {
            method: "PUT"
        })
        .then(res => {
            if (!res.ok){
                throw new Error;
            }
            return res.json();
        })
        .then(data => {
            console.log("FROM ON DELETE ZONE SENSOR: ", data);
            props.addToFreeSensors({
                "sensor_id": props.sensor_id, 
                "parameter": props.sensor_parameter,
                "sensor_name": props.sensor_name
            })
            props.setZoneSensors(props.zoneSensors.filter(sensor => sensor.sensor_id !== props.sensor_id));
        })
        .catch(error => {
            console.log(error);
        })
    }

    return (
        <div >      
            <p id="sensor-name">
            <button id='button' onClick={() => onDelete(props.sensor)}>
                <img src={DeleteIcon} className='delete-icon' alt="Delete" />
            </button>
            {props.sensor_parameter} sensor {props.sensor_name}
            </p>
        </div>
    );
}

export default Sensor;
