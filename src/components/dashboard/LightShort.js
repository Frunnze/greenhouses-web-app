import React from "react";
import './LightShort.css'
import LightIcon from '../../imgs/light-dash-icon.png'


function LightShort(props) {
    return (
        <div className="light-short-info-container">
            <div className="parameter-data-side">
                {props.value ?
                    (
                        <span className="parameter-value">
                            {parseInt(props.value)} lux
                        </span>
                    ):
                    (
                        <span className="parameter-value">
                            off
                        </span>
                    )
                }
                <span className="parameter-name">Light intensity</span>
            </div>
            <img src={LightIcon}/>
        </div>
    );
}

export default LightShort;