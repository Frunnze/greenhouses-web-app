import './Greenhouse.css'
import NoImage from '../imgs/no-image.jpg'
import TempIcon from '../imgs/temp-icon.png'
import HumidityIcon from '../imgs/humidity-icon.png'
import LightIcon from '../imgs/light-icon.png'
import WindIcon from '../imgs/wind-icon.png'
import DeleteIcon from '../imgs/delete-icon.png'


function Greenhouse() {
    return (
        <div className='greenhouse'>
            <div className='greenhouse-name'>
                <span className='greenhouse-name-text'>Greenhouse 1 fdadf fada dfadf</span>
            </div>
            <div className='greenhouse-location'>
                <span className='greenhouse-location-text'>Greenhouse 1 fdadf fada dfadf</span>
            </div>

            <div className='greenhouse-img'>
                <img src={NoImage} className='no-image'/>
            </div>

            <button className='check-greenhouse-button'>
                Check greenhouse
            </button>
            <button className='delete-button'>
                <img src={DeleteIcon} className='delete-icon'/>
            </button>

            <div className='greenhouse-parameters'>
                <div className='greenhouse-temp'>
                    <div className='icon-container'>
                        <img src={TempIcon} className='temp-icon'/>
                    </div>
                    <div className='temp-number-symbol-container'>
                        <span className='temp-number'>343</span>
                        <span className='temp-symbol'>°C</span>
                    </div>
                </div>

                <div className='greenhouse-temp'>
                    <div className='icon-container'>
                        <img src={HumidityIcon} className='humidity-icon'/>
                    </div>
                    <div className='temp-number-symbol-container'>
                        <span className='temp-number'>53220</span>
                        <span className='temp-symbol'>%</span>
                    </div>
                </div>

                <div className='greenhouse-temp'>
                    <div className='icon-container'>
                        <img src={LightIcon} className='light-icon'/>
                    </div>
                    <div className='temp-number-symbol-container'>
                        <span className='temp-number'>50</span>
                        <span className='temp-symbol'>%</span>
                    </div>
                </div>

                <div className='greenhouse-temp'>
                    <div className='icon-container'>
                        <img src={WindIcon} className='wind-icon'/>
                    </div>
                    <div className='temp-number-symbol-container'>
                        <span className='temp-number'>0</span>
                        <span className='temp-symbol'>%</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Greenhouse;