import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

import Logo from '../Logo';
import GreenhouseName from "./GreenhouseName";
import AddZoneButton from "./AddZoneButton";
import TemperatureShort from "./TemperatureShort";
import HumidityShort from "./HumidityShort";
import LightShort from "./LightShort";
import SoilMoistureShort from "./SoilMoistureShort";
import AirPressureShort from "./AirPressureShort";
import ParameterGraph from "./ParameterGraph";
import Zone from './Zone'; // Import the Zone component
import './Dashboard.css';

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

function Dashboard() {
    const [greenhouseBasicData, setGreenhouseBasicData] = useState({});
    const [greenhousePrmsAvgs, setGreenhousePrmsAvgs] = useState({});
    const [tempData, setTempData] = useState([]);
    const [humData, setHumData] = useState([]);
    const [lightData, setLightData] = useState([]);
    const [zones, setZones] = useState([]);
    const { id } = useParams();

    useEffect(() => {
        fetch(`/get-greenhouse/${id}`, {
            method: 'GET'
        })
        .then(res => {
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            return res.json();
        })
        .then(data => {
            console.log(data);
            setGreenhouseBasicData(data);
        })
        .catch(error => {
            console.log('Greenhouse not found!', error);
        });
    }, []);


    function getZones() {
        fetch(`/get-zones/${id}`, {
            method: 'GET'
        })
        .then(res => {
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            return res.json();
        })
        .then(data => {
            console.log(data);
            setZones(data);
        })
        .catch(error => {
            console.log('Error fetching zones:', error);
        });
    }

    useEffect(() => {
        getZones();
    }, []);
    
    const deleteZone = (zone) => {
        fetch(`/delete-zone/${zone.zone_id}`, {
            method: 'DELETE'
        })
        .then((res) => {
            if (res.status === 403) {
                alert("No permissions");
                throw new Error("No permissions");
            } else if (res.ok) { 
                 setZones(prevZones => prevZones.filter(prevZone => prevZone.zone_id !== zone.zone_id));
            } else {
                throw new Error('Network response was not ok. Status: ' + res.status);
            }
        })
        .catch((error) => {
            console.log(error);
        });
    };
    
    function getParametersValues() {
        fetch(`/get-gh-parameters-averages/${id}`, {
            method: 'GET'
        })
        .then(res => {
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            return res.json();
        })
        .then(data => {
            console.log(data);
            setGreenhousePrmsAvgs(data);
        })
        .catch(error => {
            console.log(error);
        });
    }

    useEffect(() => {
        getParametersValues();
    }, []);

    useInterval(() => {
        getParametersValues();
    }, 10000);

    function getAllParameterData(parameterName, setData) {
        const url = `/get-gh-parameter-data?gh_id=${id}&parameter=${parameterName}`;
        fetch(url, {
            method: 'GET'
        })
        .then(res => {
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            return res.json();
        })
        .then(data => {
            console.log(data);
            setData(data);
        })
        .catch(error => {
            console.log(error);
        });
    }

    useEffect(() => {
        getAllParameterData("temperature", setTempData);
    }, []);

    useInterval(() => {
        getAllParameterData("temperature", setTempData);
    }, 10000);

    useEffect(() => {
        getAllParameterData("humidity", setHumData);
    }, []);

    useInterval(() => {
        getAllParameterData("humidity", setHumData);
    }, 10000);

    useEffect(() => {
        getAllParameterData("light", setLightData);
    }, []);

    useInterval(() => {
        getAllParameterData("light", setLightData);
    }, 10000);

    function onAddZone() {
        getZones();
    };
      
    return (
        <>
            <Logo />

            <div id="upper-container">
                <GreenhouseName name={greenhouseBasicData.name}/>
                <AddZoneButton greenhouseId={id} onAddZone={onAddZone}/>
            </div>

            <div id="parameters-short-container">
                <TemperatureShort value={greenhousePrmsAvgs.temperature}/>
                <HumidityShort value={greenhousePrmsAvgs.humidity}/>
                <LightShort value={greenhousePrmsAvgs.light}/>
                <SoilMoistureShort value={greenhousePrmsAvgs.soil_moisture}/>
                <AirPressureShort value={greenhousePrmsAvgs.air_pressure}/> 
            </div>

            <div id="parameters-graphs">
                <ParameterGraph data={tempData} parameter="temperature" unit="°C"/>
                <ParameterGraph data={humData} parameter="humidity" unit="%"/>
                <ParameterGraph data={lightData} parameter="light intensity" unit="lux"/>
            </div>

            {zones.length > 0 && (
                <div id="zones-container">
                    {zones.map(zone => (
                        <Zone
                            key={zone.zone_id}
                            name={zone.name}
                            plantName={zone.plant_name}
                            sensors={zone.sensors}
                            zone={zone}
                            gh_id={id}
                            onDelete={deleteZone}
                        />
                    ))}
                </div>
            )}
        </>
    );
}

export default Dashboard;
