import React, { useState, useEffect } from 'react';

import Greenhouse from './Greenhouse'
import AddGreenhouseButton from './AddGreenhouseButton'
import AddGreenhouseForm from './AddGreenhouseForm';
import SortGreenhouses from './SortGreenhouses';
import ThemeMode from './ThemeMode';
import Pagination from './Pagination';
import AllGreenhousesMap from './AllGreenhousesMap';
import './Home.css'


function Home() {
  const [addGreenhouseButtonState, setAddGreenhouseButtonState] = useState(false);
  const [currentGreenhouses, setCurrentGreenhouses] = useState([]);
  const [sortingOption, setSortingOption] = useState('name');
  const [greenhouseToEdit, setGreenhouseToEdit] = useState(null);
  const [greenhouseToEditIndex, setGreenhouseToEditIndex] = useState(null);
  const [primaryColor, setPrimaryColor] = useState('#00AF3B');
  const [primaryLightColor, setPrimaryLightColor] = useState('#00D247');
  const [totalItems, setTotalItems] = useState();
  const [latLng, setLatLng] = useState([]);

  // Gets the greenhouse items from a specific page
  function getGreenhouses(page) {
    fetch(`/get-greenhouses?page=${page}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => {
      if (!res.ok) {
        throw new Error('Failed to fetch greenhouse data');
      }
      return res.json();
    })
    .then(data => {
      setCurrentGreenhouses(data["greenhouses"]);

      const latLngList = data["greenhouses"]
      .filter(greenhouse => greenhouse.lat !== undefined && greenhouse.lng !== undefined)
      .map(greenhouse => ({
        name: greenhouse.name,
        lat: greenhouse.lat,
        lng: greenhouse.lng
      }));
      setLatLng(latLngList);

      setTotalItems(data["total_items"]);
    })
    .catch(error => {
      console.error(error.message);
    });
  }

  useEffect(() => {
    getGreenhouses(1);
  }, []);

  // Deletes a greenhouse by id
  const deleteGreenhouse = (greenhouse) => {
    // Delete from the DB.
    fetch(`/delete-greenhouse/${greenhouse.greenhouse_id}`, {
        method: 'DELETE'
      }
    )
    .then((res) => {
      if (res.status == 403){
        alert("No permissions");
        throw new Error("No permissions");
      } else 
      if (res.ok) { 
        return res.json();
      } else {
        throw new Error('Network response was not ok. Status: ' + res.status);
      }
    })
    .then((data) => {
      const updatedGreenhouses = currentGreenhouses.filter(item => item !== greenhouse);
      setCurrentGreenhouses(updatedGreenhouses);
      setTotalItems(totalItems-1);
      console.log(data)
    })
    .catch((error) => {
      console.log(error);
    })
  };
  
  const editGreenhouse = (greenhouse) => {
    setAddGreenhouseButtonState(true);
    setGreenhouseToEdit(greenhouse);
  };

  const updateGreenhouse = (updatedGreenhouse) => {
    const updatedGreenhouses = currentGreenhouses.map(greenhouse => {
      if (greenhouse === greenhouseToEdit) {
        return updatedGreenhouse;
      }
      return greenhouse;
    });
    setCurrentGreenhouses(updatedGreenhouses);
    setGreenhouseToEdit(null);
  };

  const addGreenhouse = (data) => {
    if (currentGreenhouses.length < 6) {
      const updatedGreenhouses = [...currentGreenhouses];
      updatedGreenhouses.push(data);
      setCurrentGreenhouses(updatedGreenhouses);
    }
    setTotalItems(totalItems+1);
  };

  const handleAddGreenhouseButton = () => {
    setAddGreenhouseButtonState(true);
  };

  const closeForm = () => {
    setAddGreenhouseButtonState(false);
    setGreenhouseToEdit(false);
  };

  function sortGreenhousesByOption(greenhouses, option) {
    return [...greenhouses].sort((a, b) => {
      if (option === 'name') {
        return a.name.localeCompare(b.name);
      } else if (option === 'location') {
        return a.location.localeCompare(b.location);
      } else if (option === 'date') {
        return new Date(b.date) - new Date(a.date);
      } else if (option === 'temperature') {
        return b.temperature - a.temperature;
      } else if (option === 'humidity') {
        return b.humidity - a.humidity;
      } else if (option === 'light') {
        return b.light - a.light;
      } else if (option === 'ventilation') {
        return b.ventilation - a.ventilation;
      }
      return 0;
    });
  }

  const handleSort = (option) => {
    setSortingOption(option);
  };


  return (
      <div style={{'--primary-color': primaryColor, '--primary-light-color': primaryLightColor}}>
        <ThemeMode 
          setPrimaryColor={setPrimaryColor}
          setPrimaryLightColor={setPrimaryLightColor}
        />
        <div id='add-sort-buttons'>
          <AddGreenhouseButton handleAddGreenhouseButton={handleAddGreenhouseButton}/>
          <SortGreenhouses handleSort={handleSort}/>
          {addGreenhouseButtonState && 
            <AddGreenhouseForm 
              closeForm={closeForm} 
              addGreenhouse={addGreenhouse}
            />
          } 
        </div>
        <div className={`greenhouse-list ${currentGreenhouses.length == 0 && 'centered-greenhouse-list'}`}>
          {currentGreenhouses.length == 0 && <span className='no-greenhouses-label'>No greenhouses</span>}
          {
            sortGreenhousesByOption(currentGreenhouses, sortingOption).map((greenhouse, index) => (
              <Greenhouse 
                key={index}
                index={index}
                greenhouseId={greenhouse.greenhouse_id}
                onDelete={deleteGreenhouse}
                onEdit={editGreenhouse}
                greenhouse={greenhouse}
              />
            ))    
          }
          {greenhouseToEdit && 
            <AddGreenhouseForm 
              closeForm={closeForm} 
              addGreenhouse={addGreenhouse}
              greenhouseToEdit={greenhouseToEdit}
              index={greenhouseToEditIndex}
              updateGreenhouse={updateGreenhouse}
            />
          } 
        </div>
        <Pagination getGreenhouses={getGreenhouses} totalItems={totalItems}/>
        
        <div className='all-greenhouses-on-map'>
        <AllGreenhousesMap latLng={latLng} />
        </div>
      </div>
  );
}

export default Home;