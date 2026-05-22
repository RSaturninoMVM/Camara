// ================================================
//  SENSORS - Acceleròmetre i Orientació
// ================================================

import { showToast }        from './ui.js';
import { updateStatusBadge } from './ui.js';
import { updateCameraAccel } from './camera.js';

const sensorState = {
  active:         false,
  location: { oLatitud: 0, oLongitud: 0 },
  watchId:  null,     
};

// -----------------------------------------------
// INIT
// -----------------------------------------------
export function initSensors() {
  document.getElementById('activateBtn')
    ?.addEventListener('click', handleToggle);
}

// -----------------------------------------------
// TOGGLE
// -----------------------------------------------
async function handleToggle() {
  if (sensorState.active) {
    deactivate();
  } else {
    await activate();
  }
}

async function activate() {
  // Permís iOS 13+
  if ("geolocation" in navigator) {
    sensorState.watchId = navigator.geolocation.watchPosition(
      (position) => {
        sensorState.location.latitud = position.coords.latitude;
        sensorState.location.longitud = position.coords.longitude;
        renderLocation();
      },
      (error) => {
        console.error("Error de geolocalització:", error.message);
        showToast(`📍 GPS: ${error.message}`, 'error');
      },
      { enableHighAccuracy: true, maximumAge: 0 }
    );
  } else {
    showToast('❌ El navegador no té GPS', 'error');
  }

  sensorState.active = true;
  updateUI(true);
  showToast('⚡ Sensors i GPS activats!', 'success');
}

// -----------------------------------------------
// RENDER: LOCATION
// -----------------------------------------------

function renderLocation() {
  const { latitud, longitud } = sensorState.location;

  setText('oLatitud', latitud.toFixed(6));
  setText('oLongitud', longitud.toFixed(6));
};


// -----------------------------------------------
// UTILS
// -----------------------------------------------

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}