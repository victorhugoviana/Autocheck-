const currencyFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

export function formatCurrency(value) {
  return currencyFormatter.format(value);
}

export function formatNumber(value) {
  return value.toLocaleString('pt-BR');
}

export function formatDate(iso) {
  const date = new Date(iso + 'T00:00:00');
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function calcKmPerLiter(current, previous) {
  if (!previous) return null;
  const distance = current.odometer - previous.odometer;
  if (distance <= 0) return null;
  return distance / current.liters;
}

export function calcCostPerKm(refuelings, maintenancePartsCost) {
  if (refuelings.length === 0) return 0;
  const totalFuel = refuelings.reduce((sum, r) => sum + r.totalAmount, 0);
  const totalCost = totalFuel + maintenancePartsCost;
  const sorted = [...refuelings].sort((a, b) => a.odometer - b.odometer);
  const distance = sorted[sorted.length - 1].odometer - sorted[0].odometer;
  if (distance <= 0) return 0;
  return totalCost / distance;
}

export function calcOverallConsumption(refuelings) {
  if (refuelings.length < 2) return 0;
  const sorted = [...refuelings].sort((a, b) => a.odometer - b.odometer);
  let totalDistance = 0;
  let totalLiters = 0;
  for (let i = 1; i < sorted.length; i++) {
    const distance = sorted[i].odometer - sorted[i - 1].odometer;
    if (distance > 0) {
      totalDistance += distance;
      totalLiters += sorted[i].liters;
    }
  }
  if (totalLiters === 0) return 0;
  return totalDistance / totalLiters;
}

export function getWearAlert(item, vehicle) {
  const kmSinceReplacement = vehicle.currentOdometer - item.lastReplacedOdometer;
  const kmRemaining = item.replacementIntervalKm - kmSinceReplacement;
  let level = 'green';
  if (kmRemaining <= 1000) level = 'red';
  else if (kmRemaining <= 3000) level = 'yellow';
  const daysRemaining = Math.ceil(kmRemaining / vehicle.dailyMileageKm);
  return { kmRemaining, level, daysRemaining };
}

export function getWearAlerts(vehicle, wearItems) {
  return wearItems
    .filter((item) => item.vehicleId === vehicle.id)
    .map((item) => ({ item, ...getWearAlert(item, vehicle) }))
    .sort((a, b) => a.kmRemaining - b.kmRemaining);
}
