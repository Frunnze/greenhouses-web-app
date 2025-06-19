import React from "react";
import './SoilMoistureShort.css'
import SoilMoistureIcon from '../../imgs/soil-dash-icon.png'


function SoilMoistureShort(props) {
    return (
        <div className="soil-short-info-container">
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
                <span className="parameter-name">Soil moisture</span>
            </div>
            <img src={SoilMoistureIcon}/>
        </div>
    );
}

export default SoilMoistureShort;