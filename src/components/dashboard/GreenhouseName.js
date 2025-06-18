import React from "react";
import './GreenhouseName.css';
import GreenhouseNameIcon from '../../imgs/greenhouse-name-icon.png'

function GreenhouseName(props) {
    return (
        <div id="greenhouse-name-container">
            <img src={GreenhouseNameIcon} />
            <span>{props.name}</span>
        </div>
    );
}

export default GreenhouseName;