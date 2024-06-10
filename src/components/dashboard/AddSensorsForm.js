import React, { useState, useEffect } from "react";
import CloseFormIcon from '../../imgs/close-form-icon.png';
import './AddZoneForm.css';
import Sensor from "./Sensor";
import SensorFr from "./SensorFree";

function AddSensorsForm(props) {
    const [freeSensors, setFreeSensors] = useState([]);
    const [zoneSensors, setZoneSensors] = useState([]);
    const [submitError, setSubmitError] = useState(false);

    useEffect(() => {
        // Fetch free sensors
        fetch('/get-free-sensors')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })

            .then(data => {
                setFreeSensors(data);
            })
            .catch(error => {
                console.error('Error fetching free sensors data:', error);
            });

        // Fetch sensors for the specific zone
        fetch(`/get-zones/${props.zone_id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setZoneSensors(data.sensors);
            })
            .catch(error => {
                console.error('Error fetching zone sensors data:', error);
            });
    }, [props.zone_id]);

    const handleAddSensor = async (sensor) => {
        try {
            const response = await fetch('/set-sensor', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "sensor_id": sensor.sensor_id,
                    "zone_id": props.zone_id,
                    "gh_id": props.gh_id
                })
            });

            if (!response.ok) {
                throw new Error('PUT request to /set-sensor failed with status ' + response.status);
            }

            const data = await response.json();
            console.log('Sensor added to zone successfully:', data);
            
            // Update the free sensors list
            setFreeSensors(freeSensors.filter(s => s.sensor_id !== sensor.sensor_id));
            
            // Update the zone sensors list
            setZoneSensors([...zoneSensors, sensor]);
            
            // Call the parent component's refresh function to update the displayed sensors
            props.onSensorUpdate();
        } catch (error) {
            console.error('Error adding sensor to zone:', error);
        }
    };

   return (
    <div className="all-gray">
        <div className="form-rectangle-create-zone">
            <button className='close-form-button' onClick={() => { props.setAddSensor(false) }}>
                <img src={CloseFormIcon} className='close-form-icon' alt="Close" />
            </button>
            <div className='text-label'>
                <p>Zone's sensors:</p>
                {zoneSensors && zoneSensors.map(sensors => (
                    <Sensor 
                        key={sensors.sensor_id}
                        sensors={sensors.name}
                    />
                ))}
            </div>
            <div className='text-label'>
                <p>Free sensors:</p>
                {freeSensors.map(sensor => (
                    <SensorFr 
                        key={sensor.sensor_id}
                        sensor={sensor}
                        onAdd={handleAddSensor}
                    />
                ))}
            </div>
            {submitError && <div className="error-message">Please select at least one sensor.</div>}
        </div>
    </div>
);
}

export default AddSensorsForm;