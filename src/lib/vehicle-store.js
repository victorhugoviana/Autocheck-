
import {
  getVehicles,
  onVehicleDataChange,
} from './app-data.js';

const STORAGE_KEY = 'autocheck:selected-vehicle';

const listeners = new Set();

let selectedId = null;

function readStoredId() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function getSelectedVehicle() {
  const vehicles = getVehicles();

  const storedId = selectedId ?? readStoredId();

  return vehicles.find(
    (v) => String(v.id) === String(storedId)
  ) ?? vehicles[0];
}

function notifyListeners() {
  const vehicle = getSelectedVehicle();

  if (!vehicle) return;

  listeners.forEach((fn) => {
    try {
      fn(vehicle);
    } catch (error) {
      console.error(error);
    }
  });
}

export function setSelectedVehicleId(id) {
  selectedId = String(id);

  try {
    localStorage.setItem(
      STORAGE_KEY,
      selectedId
    );
  } catch {
    // Mantém a seleção na memória.
  }

  notifyListeners();
}

export function onVehicleChange(fn) {
  listeners.add(fn);

  return () => listeners.delete(fn);
}

// Atualiza a interface quando os dados mudarem.

onVehicleDataChange(() => {
  notifyListeners();
});
