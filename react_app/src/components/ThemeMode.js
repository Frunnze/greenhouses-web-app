import './ThemeMode.css'
import LightModeIcon from '../imgs/light-mode-icon.png'
import DarkModeIcon from '../imgs/dark-mode-icon.png'
import Logo from './Logo'
import DarkLogo from './DarkLogo'
import { useState } from 'react';



function ThemeMode(props) {
    const [toggleLight, setToggleLight] = useState(true);

    const onChangeColor = () => {
        setToggleLight(!toggleLight);
        if (toggleLight) {
          props.setPrimaryColor("#005B1F");
          props.setPrimaryLightColor("#007c2a");
        } else {
          props.setPrimaryColor("#00AF3B");
          props.setPrimaryLightColor("#00D247");
        }
      };

    return (
        <>
        {!toggleLight ? document.body.classList.add('dark-mode') : document.body.classList.remove('dark-mode')}
        {!toggleLight ? (<DarkLogo/>):(<Logo/>) }
        <button className="theme-mode-button" onClick={onChangeColor}>
            {!props.toggleLight ? (
                <img className="light-mode-icon" src={LightModeIcon}></img>
            ):(
                <>
                    <img className="dark-mode-icon" src={DarkModeIcon}></img>
                </>
            )}
        </button>     
        {!props.toggleLight && <div className='background-dark-theme'></div>}
        </>
    )
}

export default ThemeMode;