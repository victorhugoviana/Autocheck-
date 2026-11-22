import { openAppShell } from '../lib/shell.js';
import { pageHeader, summaryCard, maintenanceAlert } from '../lib/ui.js';
import { renderAreaChart, renderDonutChart } from '../lib/charts.js';
import { getSelectedVehicle, onVehicleChange } from '../lib/vehicle-store.js';
import { getRefuelings, getMaintenanceRecords, getWearItems } from '../lib/app-data.js';
import {
  formatCurrency,
  formatNumber,
  calcKmPerLiter,
  calcCostPerKm,
  calcOverallConsumption,
  getWearAlerts,
} from '../lib/calculations.js';

const MONTH_LABELS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

function dashboardHtml(vehicle) {
  const vehicleRefuelings = getRefuelings().filter((r) => r.vehicleId === vehicle.id);
  const vehicleMaintenance = getMaintenanceRecords().filter((m) => m.vehicleId === vehicle.id);
  const partsCost = vehicleMaintenance.reduce((s, m) => s + m.partCost, 0);
  const laborCost = vehicleMaintenance.reduce((s, m) => s + m.laborCost, 0);
  const fuelCost = vehicleRefuelings.reduce((s, r) => s + r.totalAmount, 0);

  const costPerKm = calcCostPerKm(vehicleRefuelings, partsCost);
  const overallConsumption = calcOverallConsumption(vehicleRefuelings);

  const consumptionData = vehicleRefuelings.slice(1).map((r, i) => {
    const kml = calcKmPerLiter(r, vehicleRefuelings[i]);
    const date = new Date(r.date + 'T00:00:00');
    return { label: MONTH_LABELS[date.getMonth()], value: kml ? parseFloat(kml.toFixed(2)) : 0 };
  });

  const expenseSlices = [
    { label: 'Combustível', value: parseFloat(fuelCost.toFixed(2)), color: 'hsl(217 91% 50%)' },
    { label: 'Peças', value: parseFloat(partsCost.toFixed(2)), color: 'hsl(142 71% 45%)' },
    { label: 'Mão de obra', value: parseFloat(laborCost.toFixed(2)), color: 'hsl(38 92% 50%)' },
  ];

  const alerts = getWearAlerts(vehicle, getWearItems());
  const criticalCount = alerts.filter((a) => a.level === 'red').length;

  return `
    ${pageHeader({
      title: 'Dashboard',
      description: `${vehicle.make} ${vehicle.model} · ${vehicle.year} · ${vehicle.engine}`,
    })}

    <section class="stat-grid">
      ${summaryCard({
        title: 'Custo por km',
        value: formatCurrency(costPerKm),
        subtitle: 'Inclui combustível + manutenção',
        iconName: 'dollar',
        tone: 'primary',
      })}
      ${summaryCard({
        title: 'Consumo médio',
        value: `${overallConsumption.toFixed(1)} km/l`,
        subtitle: 'Média geral do veículo',
        iconName: 'gauge',
        tone: 'success',
      })}
      ${summaryCard({
        title: 'Lembretes de revisão',
        value: criticalCount > 0 ? `${criticalCount} vencidos` : 'Tudo em dia',
        subtitle: criticalCount > 0 ? 'Requer atenção imediata' : 'Nenhum item crítico',
        iconName: 'alert',
        tone: criticalCount > 0 ? 'danger' : 'success',
      })}
    </section>

    <section class="chart-grid">
      <article class="card card-pad">
        <div class="card-head">
          <div>
            <h2 class="card-title">Evolução do consumo</h2>
            <p class="card-subtitle">km/l por mês</p>
          </div>
        </div>
        ${renderAreaChart(consumptionData, { label: 'Evolução do consumo em km por litro', unit: 'km/l' })}
      </article>

      <article class="card card-pad">
        <div class="card-head">
          <div>
            <h2 class="card-title">Distribuição de gastos</h2>
            <p class="card-subtitle">Por categoria</p>
          </div>
        </div>
        ${renderDonutChart(expenseSlices)}
      </article>
    </section>

    <section class="card card-pad">
      <div class="card-head">
        <div>
          <h2 class="card-title">Lembretes de revisão</h2>
          <p class="card-subtitle">Hodômetro: ${formatNumber(vehicle.currentOdometer)} km · Média: ${vehicle.dailyMileageKm} km/dia</p>
        </div>
      </div>
      <div class="alert-grid">
        ${alerts
          .map(({ item, kmRemaining, daysRemaining, level }) =>
            maintenanceAlert({ name: item.name, kmRemaining, daysRemaining, level })
          )
          .join('')}
      </div>
    </section>`;
}

openAppShell((root) => {
  const render = (vehicle) => {
    root.innerHTML = dashboardHtml(vehicle);
  };
  render(getSelectedVehicle());
  onVehicleChange(render);
});
