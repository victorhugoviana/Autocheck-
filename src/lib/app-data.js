import { supabase } from './supabase.js';

let data = {
  vehicles: [],
  refuelings: [],
  maintenanceRecords: [],
  wearItems: [],
};

const fromVehicle = (row) => ({
  id: row.id,
  make: row.make,
  model: row.model,
  year: row.year,
  engine: row.engine,
  nickname: row.nickname,
  currentOdometer: Number(row.current_odometer),
  dailyMileageKm: Number(row.daily_mileage_km),
});

const fromRefueling = (row) => ({
  id: row.id,
  vehicleId: row.vehicle_id,
  date: row.date,
  odometer: row.odometer,
  liters: Number(row.liters),
  totalAmount: Number(row.total_amount),
  fuelType: row.fuel_type,
});

const fromMaintenance = (row) => ({
  id: row.id,
  vehicleId: row.vehicle_id,
  date: row.date,
  title: row.title,
  partName: row.part_name,
  partCost: Number(row.part_cost),
  laborCost: Number(row.labor_cost),
  odometer: row.odometer,
  category: row.category,
});

const fromWearItem = (row) => ({
  id: row.id,
  vehicleId: row.vehicle_id,
  name: row.name,
  replacementIntervalKm: row.replacement_interval_km,
  lastReplacedOdometer: row.last_replaced_odometer,
});

async function selectAll(table, mapper) {
  const { data: rows, error } = await supabase
    .from(table)
    .select('*')
    .order('created_at');

  if (error) throw error;

  return (rows || []).map(mapper);
}

async function fetchAppData() {
  const [
    vehicles,
    refuelings,
    maintenanceRecords,
    wearItems,
  ] = await Promise.all([
    selectAll('vehicles', fromVehicle),
    selectAll('refuelings', fromRefueling),
    selectAll('maintenance_records', fromMaintenance),
    selectAll('wear_items', fromWearItem),
  ]);

  return {
    vehicles,
    refuelings,
    maintenanceRecords,
    wearItems,
  };
}

// Carrega os registros existentes.
// Não cria veículos ou históricos de exemplo.
export async function loadAppData() {
  data = await fetchAppData();
}

export const getVehicles = () => data.vehicles;

export const getRefuelings = () => data.refuelings;

export const getMaintenanceRecords = () =>
  data.maintenanceRecords;

export const getWearItems = () => data.wearItems;

// Cadastro de veículo manual ou selecionado no catálogo.
export async function addVehicle(values) {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) throw authError;

  if (!user) {
    throw new Error(
      'Entre na sua conta para cadastrar um veículo.'
    );
  }

  const make = String(values.make || '').trim();
  const model = String(values.model || '').trim();
  const engine = String(values.engine || '').trim();
  const nickname = String(values.nickname || '').trim();

  const yearText = String(values.year ?? '').trim();

  const year = Number(yearText);

  const currentOdometer = Number(
    values.currentOdometer ?? 0
  );

  const dailyMileageKm = Number(
    values.dailyMileageKm ?? 0
  );

  if (!make || !model) {
    throw new Error('Informe a marca e o modelo.');
  }

  if (make.length > 80 || model.length > 160) {
    throw new Error(
      'A marca ou o modelo ultrapassou o tamanho permitido.'
    );
  }

  if (engine.length > 100 || nickname.length > 80) {
    throw new Error(
      'O motor ou o apelido ultrapassou o tamanho permitido.'
    );
  }

  if (
    !yearText ||
    !Number.isInteger(year) ||
    year < 1900 ||
    year > new Date().getFullYear() + 2
  ) {
    throw new Error('Informe um ano válido.');
  }

  if (
    !Number.isSafeInteger(currentOdometer) ||
    currentOdometer < 0
  ) {
    throw new Error(
      'Informe uma quilometragem atual inteira, maior ou igual a zero.'
    );
  }

  if (
    !Number.isFinite(dailyMileageKm) ||
    dailyMileageKm < 0
  ) {
    throw new Error(
      'Informe uma média diária maior ou igual a zero.'
    );
  }

  const { data: row, error } = await supabase
    .from('vehicles')
    .insert({
      make,
      model,
      year,
      engine: engine || 'Não informado',
      nickname,
      current_odometer: currentOdometer,
      daily_mileage_km: dailyMileageKm,
    })
    .select()
    .single();

  if (error) throw error;

  const vehicle = fromVehicle(row);

  data.vehicles = [...data.vehicles, vehicle];

  return vehicle;
}

export async function addRefueling(vehicleId, values) {
  const { data: row, error } = await supabase
    .from('refuelings')
    .insert({
      vehicle_id: vehicleId,
      date: values.date,
      odometer: values.odometer,
      liters: values.liters,
      total_amount: values.totalAmount,
      fuel_type: values.fuelType,
    })
    .select()
    .single();

  if (error) throw error;

  data.refuelings = [
    ...data.refuelings,
    fromRefueling(row),
  ];
}

export async function deleteRefueling(id) {
  const { error } = await supabase
    .from('refuelings')
    .delete()
    .eq('id', id);

  if (error) throw error;

  data.refuelings = data.refuelings.filter(
    (refueling) => refueling.id !== id
  );
}

export async function addMaintenanceRecord(
  vehicleId,
  values
) {
  const { data: row, error } = await supabase
    .from('maintenance_records')
    .insert({
      vehicle_id: vehicleId,
      date: values.date,
      title: values.title,
      part_name: values.partName,
      part_cost: values.partCost,
      labor_cost: values.laborCost,
      odometer: values.odometer,
      category: values.category,
    })
    .select()
    .single();

  if (error) throw error;

  data.maintenanceRecords = [
    ...data.maintenanceRecords,
    fromMaintenance(row),
  ];
}

export async function deleteMaintenanceRecord(id) {
  const { error } = await supabase
    .from('maintenance_records')
    .delete()
    .eq('id', id);

  if (error) throw error;

  data.maintenanceRecords =
    data.maintenanceRecords.filter(
      (maintenance) => maintenance.id !== id
    );
}