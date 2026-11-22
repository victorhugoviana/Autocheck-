import { openAppShell } from '../lib/shell.js';
import { pageHeader, summaryCard, escapeHtml, confirmDialog } from '../lib/ui.js';
import { icon } from '../lib/icons.js';
import { getSelectedVehicle, onVehicleChange } from '../lib/vehicle-store.js';
import { getRefuelings, addRefueling, deleteRefueling } from '../lib/app-data.js';
import {
  formatCurrency,
  formatDate,
  formatNumber,
  calcKmPerLiter,
  calcOverallConsumption,
} from '../lib/calculations.js';

const PAGE_SIZE = 6;
const FUEL_TYPES = ['Gasolina', 'Etanol', 'Diesel', 'GNV'];
const GENERIC_ERROR = 'Não foi possível concluir a operação. Tente novamente.';

function startRefuelingPage(root) {
  let vehicle = getSelectedVehicle();
  let page = 0;

  root.innerHTML = `
    <div data-header></div>
    <p class="form-error" data-page-error hidden></p>

    <section class="stat-grid" data-summary></section>

    <section class="split-layout">
      <article class="card card-pad form-card">
        <h2 class="card-title">Registrar abastecimento</h2>
        <form class="form-stack" data-form>
          <label class="field">
            <span class="field-label">Hodômetro atual (km)</span>
            <input class="input" name="odometer" type="number" step="1" placeholder="Ex: 56000" required />
          </label>
          <label class="field">
            <span class="field-label">Litros abastecidos</span>
            <input class="input" name="liters" type="number" step="0.01" placeholder="Ex: 38.5" required />
          </label>
          <label class="field">
            <span class="field-label">Valor total pago (R$)</span>
            <input class="input" name="totalAmount" type="number" step="0.01" placeholder="Ex: 277.20" required />
          </label>
          <label class="field">
            <span class="field-label">Tipo de combustível</span>
            <select class="input" name="fuelType">
              ${FUEL_TYPES.map((t) => `<option value="${t}">${t}</option>`).join('')}
            </select>
          </label>
          <button class="btn btn-primary btn-block" type="submit">${icon('plus')}Adicionar abastecimento</button>
        </form>
      </article>

      <article class="card table-card">
        <div class="card-pad card-pad-tight">
          <h2 class="card-title">Histórico de abastecimentos</h2>
          <p class="card-subtitle">Consumo calculado com base no hodômetro anterior</p>
        </div>
        <div class="table-scroll" data-table></div>
        <div data-pagination></div>
      </article>
    </section>`;

  const headerEl = root.querySelector('[data-header]');
  const summaryEl = root.querySelector('[data-summary]');
  const tableEl = root.querySelector('[data-table]');
  const paginationEl = root.querySelector('[data-pagination]');
  const form = root.querySelector('[data-form]');
  const pageErrorEl = root.querySelector('[data-page-error]');

  const refuelings = () => getRefuelings().filter((r) => r.vehicleId === vehicle.id);

  function showError(message) {
    pageErrorEl.textContent = message;
    pageErrorEl.hidden = !message;
  }

  function consumptionTone(kml) {
    if (kml >= 10) return 'text-success';
    if (kml >= 7) return 'text-warning';
    return 'text-danger';
  }

  function renderHeader() {
    headerEl.innerHTML = pageHeader({
      title: 'Abastecimentos',
      description: `Histórico e registro de combustível · ${vehicle.make} ${vehicle.model}`,
    });
  }

  function renderSummary() {
    const list = refuelings();
    const totalSpent = list.reduce((s, r) => s + r.totalAmount, 0);
    const totalLiters = list.reduce((s, r) => s + r.liters, 0);
    const avgPrice = totalLiters > 0 ? totalSpent / totalLiters : 0;

    summaryEl.innerHTML = [
      summaryCard({
        title: 'Consumo médio',
        value: `${calcOverallConsumption(list).toFixed(1)} km/l`,
        iconName: 'gauge',
        tone: 'success',
      }),
      summaryCard({
        title: 'Total gasto',
        value: formatCurrency(totalSpent),
        subtitle: `${list.length} abastecimentos`,
        iconName: 'fuel',
        tone: 'primary',
      }),
      summaryCard({
        title: 'Preço médio por litro',
        value: formatCurrency(avgPrice),
        subtitle: `${totalLiters.toFixed(1)} L total`,
        iconName: 'fuel',
        tone: 'primary',
      }),
    ].join('');
  }

  function renderTable() {
    const sortedAsc = [...refuelings()].sort((a, b) => a.odometer - b.odometer);
    const sortedDesc = [...sortedAsc].reverse();
    const totalPages = Math.ceil(sortedDesc.length / PAGE_SIZE);
    const visible = sortedDesc.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

    const rows = visible
      .map((r) => {
        const previous = sortedAsc.filter((s) => s.odometer < r.odometer).pop() ?? null;
        const kml = calcKmPerLiter(r, previous);
        const pricePerLiter = r.liters > 0 ? r.totalAmount / r.liters : 0;
        return `
          <tr>
            <td class="cell-strong nowrap">${formatDate(r.date)}</td>
            <td class="num">${formatNumber(r.odometer)}</td>
            <td class="num">${r.liters.toFixed(1)}</td>
            <td><span class="badge">${escapeHtml(r.fuelType)}</span></td>
            <td class="num muted">${formatCurrency(pricePerLiter)}</td>
            <td class="num strong">${formatCurrency(r.totalAmount)}</td>
            <td class="num">${kml !== null ? `<span class="${consumptionTone(kml)} strong">${kml.toFixed(1)}</span>` : '<span class="muted">—</span>'}</td>
            <td>
              <button class="icon-button icon-button-danger" type="button" data-delete="${r.id}" aria-label="Excluir abastecimento de ${formatDate(r.date)}">${icon('trash')}</button>
            </td>
          </tr>`;
      })
      .join('');

    tableEl.innerHTML = `
      <table class="table">
        <thead>
          <tr>
            <th>Data</th>
            <th class="num">Hodômetro</th>
            <th class="num">Litros</th>
            <th>Combustível</th>
            <th class="num">R$/L</th>
            <th class="num">Valor</th>
            <th class="num">km/l</th>
            <th></th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>`;

    paginationEl.innerHTML = totalPages > 1
      ? `
        <div class="pagination">
          <p class="card-subtitle">Página ${page + 1} de ${totalPages}</p>
          <div class="pagination-actions">
            <button class="btn btn-outline btn-sm" type="button" data-page-step="-1" ${page === 0 ? 'disabled' : ''}>Anterior</button>
            <button class="btn btn-outline btn-sm" type="button" data-page-step="1" ${page >= totalPages - 1 ? 'disabled' : ''}>Próxima</button>
          </div>
        </div>`
      : '';
  }

  function renderAll() {
    renderSummary();
    renderTable();
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const submitButton = form.querySelector('[type="submit"]');
    const values = new FormData(form);
    submitButton.disabled = true;
    showError('');
    try {
      await addRefueling(vehicle.id, {
        date: new Date().toISOString().slice(0, 10),
        odometer: parseFloat(values.get('odometer')),
        liters: parseFloat(values.get('liters')),
        totalAmount: parseFloat(values.get('totalAmount')),
        fuelType: values.get('fuelType'),
      });
      form.reset();
      page = 0;
      renderAll();
    } catch (error) {
      console.error(error);
      showError(GENERIC_ERROR);
    } finally {
      submitButton.disabled = false;
    }
  });

  root.addEventListener('click', async (event) => {
    const step = event.target.closest('[data-page-step]');
    if (step) {
      page += Number(step.dataset.pageStep);
      renderTable();
      return;
    }

    const remove = event.target.closest('[data-delete]');
    if (!remove) return;
    const record = refuelings().find((r) => r.id === remove.dataset.delete);
    if (!record) return;
    const confirmed = await confirmDialog({
      title: 'Excluir abastecimento?',
      description: `Esta ação não pode ser desfeita. O registro de ${formatDate(record.date)} será removido permanentemente.`,
    });
    if (!confirmed) return;
    showError('');
    try {
      await deleteRefueling(record.id);
      page = Math.min(page, Math.max(0, Math.ceil(refuelings().length / PAGE_SIZE) - 1));
      renderAll();
    } catch (error) {
      console.error(error);
      showError(GENERIC_ERROR);
    }
  });

  renderHeader();
  renderAll();

  onVehicleChange((selected) => {
    vehicle = selected;
    page = 0;
    showError('');
    renderHeader();
    renderAll();
  });
}

openAppShell(startRefuelingPage);
