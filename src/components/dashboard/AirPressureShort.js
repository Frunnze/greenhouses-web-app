import React from "react";
import './AirPressureShort.css'
import AirPressureIcon from '../../imgs/pressure-dash-icon.png'


function AirPressureShort(props) {
    return (
        <div className="pressure-short-info-container">
            <div className="parameter-data-side">
                {props.value ?
                    (
                        <span className="parameter-value">
                            {parseInt(props.value)} Pa
                        </span>
                    ):
                    (
                        <span className="parameter-value">
                            off
                        </span>
                    )
                }
                <span className="parameter-name">Air pressure</span>
            </div>
            <img src={AirPressureIcon}/>
        </div>
    );
}

export default AirPressureShort;