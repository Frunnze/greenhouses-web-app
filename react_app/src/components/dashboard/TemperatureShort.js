import React from "react";
import './TemperatureShort.css'
import TempIcon from '../../imgs/temperature-dash-icon.png'


function TemperatureShort(props) {
    return (
        <div className="parameter-short-info-container">
            <div className="parameter-data-side">
                {props.value ?
                    (
                        <span className="parameter-value">
                            {parseInt(props.value)} °C
                        </span>
                    ):
                    (
                        <span className="parameter-value">
                            off
                        </span>
                    )
                }
                <span className="parameter-name">Temperature</span>
            </div>
            <img src={TempIcon}/>
        </div>
    );
}

export default TemperatureShort