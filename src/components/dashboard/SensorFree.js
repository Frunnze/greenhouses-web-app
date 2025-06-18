import React from "react";
import AddIcon from '../../imgs/add.png';
import './Sensor.css'; 

function SensorFr(props) {
    return (
        <div className="sensor-item">
            <p id="sensor-name">
                <button id='check' onClick={() => {props.onAdd(props.sensor)}}>
                    <img src={AddIcon} className='delete-icon' alt="Add" />
                </button>
                <span>
                    {props.sensor.parameter} {props.sensor.sensor_name}
                </span>
            </p>
        </div>
    );
}

export default SensorFr;
