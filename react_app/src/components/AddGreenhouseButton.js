import './AddGreenhouseButton.css'
import AddGreenhouseIcon from '../imgs/add-greenhouse-icon.png'


function AddGreenhouseButton(props){
    return (
        <button className="add-button" onClick={props.handleAddGreenhouseButton}>
            <img src={AddGreenhouseIcon} className='add-greenhouse-icon'/>
            <span>Add greenhouse</span>
        </button>
    );
}

export default AddGreenhouseButton;