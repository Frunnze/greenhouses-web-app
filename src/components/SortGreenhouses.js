import { useState } from 'react';
import './SortGreenhouses.css'


function SortGreenhouses({ handleSort }) {
    const [selectedOption, setSelectedOption] = useState('');

    const handleOptionChange = (event) => {
      const selectedValue =  event.target.value;
      setSelectedOption(selectedValue);
      handleSort(selectedValue);
    };
    
    return (
        <>
            <select id="sortDropdown" value={selectedOption} onChange={handleOptionChange}>
                <option value="name">Sort by: Name</option>
                <option value="location">Sort by: Location</option>
                <option value="date">Sort by: Date</option>
                <option value="temperature">Sort by: Temperature</option>
                <option value="humidity">Sort by: Humidity</option>
                <option value="light">Sort by: Light</option>
                <option value="ventilation">Sort by: Soil moisture</option>
            </select>
        </>
    )
}

export default SortGreenhouses;