import React from "react";
import './HumidityShort.css'
import HumidityIcon from '../../imgs/humidity-dash-icon.png'


function HumidityShort(props) {
    return (
        <div className="humidity-short-info-container">
            <div className="parameter-data-side">
                {props.value ?
                    (
                        <span className="parameter-value">
                            {parseInt(props.value)} %
                        </span>
                    ):
                    (
                        <span className="parameter-value">
                            off
                        </span>
                    )
                }
                <span className="parameter-name">Humidity</span>
            </div>
            <img src={HumidityIcon}/>
        </div>
    );
}

export default HumidityShort;