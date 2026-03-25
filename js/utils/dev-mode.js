import { readTable, writeTable } from "../database/db-core.js";

const DEV_VALUES = {
    ACTIVE: 'active',
    DISABLED: 'disabled'
};

// Dev testing button
const btn = document.getElementById('devModeBtn'); 

/**
 * @brief Sets the correct data value for the button to give it a background color indicating its state.
 * @returns {void} no return value.
 */
function setBtnData(){
    if(btn)
        btn.dataset.devMode = isDevActive() 
        ? DEV_VALUES.ACTIVE : DEV_VALUES.DISABLED;
}

/**
 * @brief Toggles the dev mode for easier testing. bypasses authentication.
 * @returns {void} no return value.
 */
export function toggleDevMode(e){
    const newStateActive = !isDevActive();

    if(newStateActive){
        writeTable('dev', DEV_VALUES.ACTIVE);
    }
    else{
        writeTable('dev', DEV_VALUES.DISABLED);
    }

    // Update button color
    setBtnData();
}

/**
 * @brief Checks if the dev mode is active. Used by checkAuth() in auth.js. 
 * @returns {boolean} dev mode active or disabled.
 */
export function isDevActive(){
    const devAccess = readTable('dev');
    if(devAccess)
        return devAccess === DEV_VALUES.ACTIVE;
    return false;
}


// Only works inside index.html
if(btn){
    btn.addEventListener('click', toggleDevMode);
    setBtnData();
}
