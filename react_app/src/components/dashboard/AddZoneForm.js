import React, { useState, useEffect } from "react";
import CloseFormIcon from '../../imgs/close-form-icon.png';
import './AddZoneForm.css';

function AddZoneForm(props) {
    const [name, setName] = useState("");
    const [submitError, setSubmitError] = useState(false);
    const [zones, setZones] = useState([]);

    const handleNameChange = (event) => {
        setName(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!name) {
            setSubmitError(true);
            return;
        }

        try {
            const zoneResponse = await fetch(`/create-zone`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "gh_id": props.greenhouseId,
                    "name": name
                })
            });

            if (!zoneResponse.ok) {
                throw new Error('Network response was not ok');
            }
            if (zoneResponse.ok) {
                const zoneData = await zoneResponse.json();
                props.onAddZone();
                console.log('Zone created successfully: ', zoneData);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    
        setName('');
        setSubmitError(false);
        props.setAddZone(false);
    };

    return (
        <div className="all-gray">
            <div className="form-rectangle-create-zone">
                <button className='close-form-button' onClick={() => { props.setAddZone(false) }}>
                    <img src={CloseFormIcon} className='close-form-icon' alt="Close" />
                </button>
                <form onSubmit={handleSubmit}>
                    <label className='text-label'>
                        Zone name:
                        <input className='text-input' type="text" value={name} onChange={handleNameChange} />
                        {!name && submitError && <label className='invalid-label'>Invalid name</label>}
                    </label>
                  
                    <button type="submit" className='save-data-create-zone'>Save</button>
                </form>
            </div>
        </div>
    );
}

export default AddZoneForm;
