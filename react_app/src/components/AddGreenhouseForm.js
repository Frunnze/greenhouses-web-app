import React, { useState } from 'react';
import './AddGreenhouseForm.css'
import CloseFormIcon from '../imgs/close-form-icon.png'
import UploadIcon from '../imgs/upload-icon.png'
import AddGreenhouseToMap from './AddGreenhouseToMap';


function AddGreenhouseForm(props) {
  const [name, setName] = useState(props.greenhouseToEdit ? props.greenhouseToEdit.name : "");
  const [location, setLocation] = useState(props.greenhouseToEdit ? props.greenhouseToEdit.location : "");
  const [image, setImage] = useState(props.greenhouseToEdit ? props.greenhouseToEdit.img: null);
  const [submitError, setSubmitError] = useState(false);
  const [imagePath, setImagePath] = useState(props.greenhouseToEdit ? props.greenhouseToEdit.imgPath : "");
  const [realImage, setRealImage] = useState(null);
  const [latLng, setLatLng] = useState([]);

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleLocationChange = (event) => {
    setLocation(event.target.value);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setRealImage(file);
    setImagePath(file.name);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!(name && location)){
      setSubmitError(true);
      return;
    } 

    if (props.greenhouseToEdit) {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("location", location);
      formData.append("imgPath", imagePath);
      formData.append("img", realImage);
      formData.append("lat", latLng.length != 0 ? latLng[0].lat: null);
      formData.append("lng", latLng.length != 0 ? latLng[0].lng: null);

      fetch(`/update-greenhouse/${props.greenhouseToEdit.greenhouse_id}`, {
        method: 'PUT',
        body: formData
      })
      .then (res => {
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
      .then (data => {      
        const updatedGreenhouse = {
          "name": name,
          "location": location,
          "imgPath": imagePath,
          "img":  image ? image: null,
          "date": new Date(),
          "greenhouse_id": props.greenhouseToEdit.greenhouse_id
        };
        props.updateGreenhouse(updatedGreenhouse);
        console.log(data);
      })
      .catch(error => {
        console.error(error);
      });
    } else {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("location", location);
      formData.append("imgPath", imagePath);
      formData.append("img", realImage);
      formData.append("date", new Date().toISOString());
      formData.append("lat", latLng.length != 0 ? latLng[0].lat: null);
      formData.append("lng", latLng.length != 0 ? latLng[0].lng: null);

      fetch('/create-greenhouse', {
        method: 'POST',
        body: formData
      })
      .then(res => {
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
      .then(data => {
        let newGreenhouse = {
          "name": name,
          "location": location,
          "imgPath": imagePath,
          "img": image ? image : null,
          "date": new Date(),
          "greenhouse_id": data["id"] // Access 'id' from data directly
        };
        props.addGreenhouse(newGreenhouse);
      })
      .catch(error => {
        console.error(error);
      });
    }
    // Reset form fields
    setName('');
    setLocation('');
    setImage(null);
    setImagePath(null);
    setSubmitError(false);
    props.closeForm();
  };

  return (
    <div className='all-gray'>
      <div className='form-rectangle'>
        <button className='close-form-button' onClick={props.closeForm}>
          <img src={CloseFormIcon} className='close-form-icon'/>
        </button>

        <form>
          <label className='text-label'>
            Name:
            <input className='text-input' type="text" value={name} onChange={handleNameChange} />
            {!name && submitError && <label className='invalid-label'>Invalid name</label>}
          </label>
          <label className='text-label'>
            Location:
            <input className='text-input' type="text" value={location} onChange={handleLocationChange} />
            {!location && submitError && <label className='invalid-label'>Invalid location</label>}
          </label>

          <label className="img-upload">
            <img src={UploadIcon}/>
            Upload image
            <input type="file" onChange={handleImageChange}/>
          </label>
          {image ? (
              <div className='file-name-container'>
                <span className='file-name'>File name: </span>
                <span>{imagePath}</span>
              </div>
            ):(
              <div className='file-name-container'>
                <span className='file-name'>No file chosen!</span>
              </div>
            )
          }
          <button type="submit" className='save-data' onClick={handleSubmit}>Save</button>
        </form>
        <div className='add-greenhouse-to-map'>
          {console.log(latLng)}
          <AddGreenhouseToMap setLatLng={setLatLng} latLng={latLng}/>
        </div>
      </div>
    </div>
  );
}

export default AddGreenhouseForm;
