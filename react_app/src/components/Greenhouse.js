import './Greenhouse.css'
import NoImage from '../imgs/no-image.jpg'
import TempIcon from '../imgs/temp-icon.png'
import HumidityIcon from '../imgs/humidity-icon.png'
import LightIcon from '../imgs/light-icon.png'
import SoilMoistureIcon from '../imgs/black-soil-moisture-icon.png'
import DeleteIcon from '../imgs/delete-icon.png'
import EditIcon from '../imgs/edit-icon.png'

import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'


function Greenhouse(props) {
    const [greenhousePrmsAvgs, setGreenhousePrmsAvgs] = useState({})
    const navigate = useNavigate();

    function handleNavigate(id) {
        navigate(`/greenhouse/${id}`);
    }

    function getParametersValues() {
        fetch(`/get-gh-parameters-averages/${props.greenhouseId}`, {
            method: 'GET'
        })
        .then(res => {
            if (!res.ok) {
                throw new Error;
            }
            return res.json();
        })
        .then(data => {
            console.log(data);
            setGreenhousePrmsAvgs(data);
        })
        .catch(error => {
            console.log(error);
        })
    }

    useEffect(() => {
        getParametersValues();
    }, [])

    return (
        <div className='greenhouse'>
            <div className='greenhouse-name'>
                <span className='greenhouse-name-text'>{props.greenhouse.name}</span>
            </div>
            <div className='greenhouse-location'>
                <span className='greenhouse-location-text'>{props.greenhouse.location}</span>
            </div>

            <div className='greenhouse-img'>
                {!props.greenhouse.img ? (<img src={NoImage}/>):(<img src={props.greenhouse.img} />)}
            </div>

            <button className='check-greenhouse-button' onClick={() => handleNavigate(props.greenhouseId)}>
                Check greenhouse
            </button>

            <button className='delete-button edit-button' onClick={() => {props.onEdit(props.greenhouse)}}>
                <img src={EditIcon}/>
            </button>
            <button className='delete-button' onClick={() => {props.onDelete(props.greenhouse)}}>
                <img src={DeleteIcon} className='delete-icon'/>
            </button>

            <div className='greenhouse-parameters'>
                <div className='greenhouse-temp'>
                    <div className='icon-container'>
                        <img src={TempIcon} className='temp-icon'/>
                    </div>
                    <div className='temp-number-symbol-container'>
                        {greenhousePrmsAvgs.temperature ? (
                            <>
                                <span className='temp-number'>{parseInt(greenhousePrmsAvgs.temperature)}</span>
                                <span className='temp-symbol'>°C</span>
                            </>
                        ):(
                            <span className='temp-number'>off</span>
                        )}
                    </div>
                </div>

                <div className='greenhouse-temp'>
                    <div className='icon-container'>
                        <img src={HumidityIcon} className='humidity-icon'/>
                    </div>
                    <div className='temp-number-symbol-container'>
                        {greenhousePrmsAvgs.humidity ? (
                            <>
                                <span className='temp-number'>{parseInt(greenhousePrmsAvgs.humidity)}</span>
                                <span className='temp-symbol'>%</span>
                            </>
                        ):(
                            <span className='temp-number'>off</span>
                        )}
                    </div>
                </div>

                <div className='greenhouse-temp'>
                    <div className='icon-container'>
                        <img src={LightIcon} className='light-icon'/>
                    </div>
                    <div className='temp-number-symbol-container'>
                        {greenhousePrmsAvgs.light ? (
                            <>
                                <span className='temp-number'>{parseInt(greenhousePrmsAvgs.light)}</span>
                                <span className='temp-symbol'>lux</span>
                            </>
                        ):(
                            <span className='temp-number'>off</span>
                        )}
                    </div>
                </div>

                <div className='greenhouse-temp'>
                    <div className='icon-container'>
                        <img src={SoilMoistureIcon} className='wind-icon'/>
                    </div>
                    <div className='temp-number-symbol-container'>
                        {greenhousePrmsAvgs.soil_moisture ? (
                            <>
                                <span className='temp-number'>{parseInt(greenhousePrmsAvgs.soil_moisture)}</span>
                                <span className='temp-symbol'>%</span>
                            </>
                        ):(
                            <span className='temp-number'>off</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Greenhouse;