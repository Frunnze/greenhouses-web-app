import React, { useState, useEffect, useRef } from "react";
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
import './Zone.css'; 

function useInterval(callback, delay) {
    const savedCallback = useRef();
   
    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);
   
    // Set up the interval.
    useEffect(() => {
        function tick() {
            savedCallback.current();
        }
        if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}

function Zone(props) {
    const [UpdateName, setAddZone] = useState(false);
    const [addPlant, setAddPlant] = useState(false);
    const [addSensor, setAddSensor] = useState(false);
    const [EditButton, setEditButton] = useState(false);
    const [plantName, setPlantName] = useState(props.zone.plant_name);
    const [zoneParamAvgs, setZoneParamAvgs] = useState({})

    function getParametersValues() {
        fetch(`/get-zone-parameters-averages?gh_id=${props.gh_id}&zone_id=${props.zone.zone_id}`, {
            method: 'GET'
        })
        .then(res => {
            if (!res.ok) {
                throw new Error;
            }
            return res.json();
        })
        .then(data => {
            console.log("ZONE PARAMS AVGS: ", data);
            setZoneParamAvgs(data);
        })
        .catch(error => {
            console.log(error);
        })
    };

    useEffect(() => {
        getParametersValues();
    }, [])

    useInterval(() => {
        getParametersValues();
    }, 10000);

    const handlePlantUpdate = (newPlantName) => {
        setPlantName(newPlantName);
        refreshZoneData(); 
    };

    const refreshZoneData = () => {
        props.onRefresh(); 
    };
    console.log("PLANT NAME----------", plantName)
    return (
        <div className="zone">
            <button className='button' onClick={() => {setAddZone(true)}}>
                <img src={EditIcon} className='delete-icon' alt="Edit" />
            </button>
            {UpdateName && 
                <AddZoneForm 
                      setAddZone={setAddZone}
                      zone={props.zone.zone_id}
                />
            }
            
            <button className='button' onClick={() => {props.onDelete(props.zone)}}>
                <img src={DeleteIcon} className='delete-icon' alt="Delete" />
            </button>

            <p id="zone-name">
                <img src={ZoneNameIcon} alt="Zone Name" />
                {props.zone.name}
            </p>

            <p id="zone-name" onClick={() => {setAddPlant(true)}}>
                <img src={PlantNameIcon} alt="Plant" />
                Plant: {plantName}
            </p>

            {addPlant && 
                <AddPlantForm 
                    setAddPlant={setAddPlant}
                    zone_id={props.zone.zone_id}
                    onPlantUpdate={handlePlantUpdate}
                />
            }
            
            <p id="zone-name" onClick={() => {setAddSensor(true)}}>
                <img src={SensorsIcon} alt="Sensors" />
                Sensors
            </p>
            {addSensor && 
                <AddSensorForm 
                    setAddSensor={setAddSensor}
                    zone_id={props.zone.zone_id}
                    gh_id={props.gh_id}
                />
            }

            <div className='greenhouse-parameters'>
                <div className='greenhouse-temp'>
                    <div className='icon-container'>
                        <img src={TempIcon} className='temp-icon'/>
                    </div>
                    <div className='temp-number-symbol-container'>
                        {zoneParamAvgs.temperature ? (
                            <>
                                <span className='ch-symbol'>{parseInt(zoneParamAvgs.temperature)}</span>
                                <span className='ch-symbol'> °C</span>
                            </>
                        ):(
                            <span className='ch-symbol'>off</span>
                        )}
                    </div>
                </div>

                <div className='greenhouse-temp'>
                    <div className='icon-container'>
                        <img src={HumidityIcon} className='humidity-icon'/>
                    </div>
                    <div className='temp-number-symbol-container'>
                        {zoneParamAvgs.humidity ? (
                            <>
                                <span className='ch-symbol'>{parseInt(zoneParamAvgs.humidity)}</span>
                                <span className='ch-symbol'> %</span>
                            </>
                        ):(
                            <span className='ch-symbol'>off</span>
                        )}
                    </div>
                </div>

                <div className='greenhouse-temp'>
                    <div className='icon-container'>
                        <img src={LightIcon} className='light-icon'/>
                    </div>
                    <div className='temp-number-symbol-container'>
                        {zoneParamAvgs.light ? (
                            <>
                                <span className='ch-symbol'>{parseInt(zoneParamAvgs.light)}</span>
                                <span className='ch-symbol'> lux</span>
                            </>
                        ):(
                            <span className='ch-symbol'>off</span>
                        )}
                    </div>
                </div>

                <div className='greenhouse-temp'>
                    <div className='icon-container'>
                        <img src={plantIcon} className='wind-icon'/>
                    </div>
                    <div className='temp-number-symbol-container'>
                        {zoneParamAvgs.soil_moisture ? (
                            <>
                                <span className='ch-symbol'>{parseInt(zoneParamAvgs.soil_moisture)}</span>
                                <span className='ch-symbol'> %</span>
                            </>
                        ):(
                            <span className='ch-symbol'>off</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Zone;
