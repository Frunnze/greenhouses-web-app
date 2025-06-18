import React, { useState, useEffect } from "react";
import CloseFormIcon from '../../imgs/close-form-icon.png';
import './AddZoneForm.css';

function AddPlantForm(props) {
    const [plants, setPlants] = useState([]);
    const [selectedPlantId, setSelectedPlantId] = useState(null);
    const [submitError, setSubmitError] = useState(false);

    useEffect(() => {
        console.log("Received zone_id in AddPlantForm:", props.zone_id); // Debugging statement
        fetch('/choose-plant')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setPlants(data);
                if (data.length > 0) {
                    setSelectedPlantId(data[0].plant_id);
                }
            })
            .catch(error => {
                console.error('Error fetching plant data:', error);
            });
    }, [props.zone_id]);

    const handlePlantChange = (event) => {
        setSelectedPlantId(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (selectedPlantId === null) {
            setSubmitError(true);
            return;
        }

        try {
            const putUrl = '/choose-plant';
            const zoneId = props.zone_id; // Directly accessing zone_id from props
            const plantResponse = await fetch(putUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "plant_id": selectedPlantId,
                    "zone_id": zoneId
                })
            });
            if (!plantResponse.ok) {
                throw new Error('PUT request to ' + putUrl + ' failed with status ' + plantResponse.status);
            }

            const plantData = await plantResponse.json();
            console.log('Plant added to zone successfully: ', plantData);
            
            // Find the plant name
            console.log("THE ID OF THE PLANTED PLANT: ", selectedPlantId)
            console.log("PLANTS: ", plants);
            const selectedPlant = plants.find(plant => plant.plant_id == selectedPlantId);
            if (selectedPlant) {
                props.onPlantUpdate(selectedPlant.plant_name); 
            }

            props.setAddPlant(false); 
        } catch (error) {
            console.error('Error adding plant to zone:', error);
        }
    };
   
    return (
        <div className="all-gray">
            <div className="form-rectangle-create-zone">
                <button className='close-form-button' onClick={() => { props.setAddPlant(false) }}>
                    <img src={CloseFormIcon} className='close-form-icon' alt="Close" />
                </button>
                <form onSubmit={handleSubmit}>
                    <label className='text-label'>
                         Choose plant :
                        <select className='plant-input' value={selectedPlantId} onChange={handlePlantChange}>
                            {plants.map(plant => (
                                <option key={plant.plant_id} value={plant.plant_id}>
                                    {plant.plant_name}
                                </option>
                            ))}
                        </select>
                    </label>
                    <button type="submit" className='save-data-create-zone'>Save</button>
                </form>
                {submitError && <div className="error-message">Please select a plant.</div>}
            </div>
        </div>
    );
}

export default AddPlantForm;