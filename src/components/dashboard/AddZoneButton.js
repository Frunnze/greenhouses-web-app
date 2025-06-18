import React, { useState } from "react";
import './AddZoneButton.css';
import AddZoneButtonIcon from '../../imgs/add-zone-button-icon.png'
import AddZoneForm from './AddZoneForm'


function AddZoneButton(props) {
    const [addZone, setAddZone] = useState(false);

    return (
        <>
            <div id="add-zone-button-container" onClick={() => {setAddZone(true)}}>
                <img src={AddZoneButtonIcon} />
                <span>Add zone</span>
            </div>
            {addZone && 
                <AddZoneForm 
                    onAddZone={props.onAddZone}
                    setAddZone={setAddZone} 
                    greenhouseId={props.greenhouseId}
                />
            }
        </>
    );
}

export default AddZoneButton;