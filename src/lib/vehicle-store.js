import { getVehicles } from './app-data.js';

const STORAGE_KEY = 'autocheck:selected-vehicle';
const listeners = new Set();

function readStoredId() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function getSelectedVehicle() {
  const vehicles = getVehicles();
  const storedId = readStoredId();
  return vehicles.find((v) => v.id === storedId) ?? vehicles[0];
}

export function setSelectedVehicleId(id) {
  try {
    localStorage.setItem(STORAGE_KEY, id);
  } catch {
    // Storage indisponível: a seleção continua válida nesta página.
  }
  listeners.forEach((fn) => fn(getSelectedVehicle()));
}

export function onVehicleChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
