import { openAppShell } from '../lib/shell.js';
import { pageHeader, summaryCard, maintenanceAlert, escapeHtml, confirmDialog } from '../lib/ui.js';
import { icon } from '../lib/icons.js';
import { getSelectedVehicle, onVehicleChange } from '../lib/vehicle-store.js';
import {
  getMaintenanceRecords,
  getWearItems,
  addMaintenanceRecord,
  deleteMaintenanceRecord,
} from '../lib/app-data.js';
import { formatCurrency, formatDate, formatNumber, getWearAlerts } from '../lib/calculations.js';

const GENERIC_ERROR = 'Não foi possível concluir a operação. Tente novamente.';

function startMaintenancePage(root) {
  let vehicle = getSelectedVehicle();

  root.innerHTML = `
    <div data-header></div>
    <p class="form-error" data-page-error hidden></p>

    <section class="stat-grid" data-summary></section>

    <section class="split-layout">
      <article class="card card-pad form-card">
        <h2 class="card-title">Registrar manutenção</h2>
        <form class="form-stack" data-form>
          <label class="field">
            <span class="field-label">Título do serviço</span>
            <input class="input" name="title" placeholder="Ex: Troca de pastilhas de freio" required />
          </label>
          <label class="field">
            <span class="field-label">Peça substituída</span>
            <input class="input" name="partName" placeholder="Ex: Pastilha Bosch" required />
          </label>
          <div class="form-row">
            <label class="field">
              <span class="field-label">Custo da peça (R$)</span>
              <input class="input" name="partCost" type="number" step="0.01" placeholder="0.00" required />
            </label>
            <label class="field">
              <span class="field-label">Mão de obra (R$)</span>
              <input class="input" name="laborCost" type="number" step="0.01" placeholder="0.00" required />
            </label>
          </div>
          <div class="form-row">
            <label class="field">
              <span class="field-label">Hodômetro (km)</span>
              <input class="input" name="odometer" type="number" placeholder="Ex: 55000" required />
            </label>
            <label class="field">
              <span class="field-label">Tipo</span>
              <select class="input" name="category">
                <option value="Preventiva">Preventiva</option>
                <option value="Corretiva">Corretiva</option>
              </select>
            </label>
          </div>
          <button class="btn btn-primary btn-block" type="submit">${icon('plus')}Registrar manutenção</button>
        </form>
      </article>

      <div class="stack">
        <section class="card card-pad">
          <div class="card-head">
            <div>
              <h2 class="card-title">${icon('trending', 'title-icon')}Alertas preditivos</h2>
              <p class="card-subtitle" data-odometer-note></p>
            </div>
          </div>
          <div class="alert-grid" data-alerts></div>
        </section>

        <section class="card table-card">
          <div class="card-pad card-pad-tight">
            <h2 class="card-title">Histórico de serviços</h2>
            <p class="card-subtitle">Reparos e manutenções registradas</p>
          </div>
          <div class="table-scroll" data-table></div>
        </section>
      </div>
    </section>`;

  const headerEl = root.querySelector('[data-header]');
  const summaryEl = root.querySelector('[data-summary]');
  const odometerNoteEl = root.querySelector('[data-odometer-note]');
  const alertsEl = root.querySelector('[data-alerts]');
  const tableEl = root.querySelector('[data-table]');
  const form = root.querySelector('[data-form]');
  const pageErrorEl = root.querySelector('[data-page-error]');

  const records = () => getMaintenanceRecords().filter((m) => m.vehicleId === vehicle.id);

  function showError(message) {
    pageErrorEl.textContent = message;
    pageErrorEl.hidden = !message;
  }

  function renderHeader() {
    headerEl.innerHTML = pageHeader({
      title: 'Manutenção e Reparos',
      description: `Histórico de serviços · ${vehicle.make} ${vehicle.model}`,
    });
  }

  function renderSummary() {
    const list = records();
    const totalParts = list.reduce((s, m) => s + m.partCost, 0);
    const totalLabor = list.reduce((s, m) => s + m.laborCost, 0);

    summaryEl.innerHTML = [
      summaryCard({ title: 'Total em peças', value: formatCurrency(totalParts), iconName: 'wrench', tone: 'primary' }),
      summaryCard({ title: 'Total em mão de obra', value: formatCurrency(totalLabor), iconName: 'wrench', tone: 'primary' }),
      summaryCard({
        title: 'Custo total',
        value: formatCurrency(totalParts + totalLabor),
        subtitle: `${list.length} serviços`,
        iconName: 'alert',
        tone: 'warning',
      }),
    ].join('');
  }

  function renderAlerts() {
    odometerNoteEl.textContent = `Hodômetro atual: ${formatNumber(vehicle.currentOdometer)} km · Média: ${vehicle.dailyMileageKm} km/dia`;
    alertsEl.innerHTML = getWearAlerts(vehicle, getWearItems())
      .map(({ item, kmRemaining, daysRemaining, level }) =>
        maintenanceAlert({ name: item.name, kmRemaining, daysRemaining, level })
      )
      .join('');
  }

  function renderTable() {
    const sorted = [...records()].sort((a, b) => b.odometer - a.odometer);
    const rows = sorted
      .map((m) => `
        <tr>
          <td class="cell-strong nowrap">${formatDate(m.date)}</td>
          <td>
            <p class="cell-strong">${escapeHtml(m.title)}</p>
            <p class="card-subtitle">${escapeHtml(m.partName)}</p>
          </td>
          <td><span class="badge ${m.category === 'Preventiva' ? 'badge-primary' : ''}">${m.category}</span></td>
          <td class="num">${formatCurrency(m.partCost)}</td>
          <td class="num">${formatCurrency(m.laborCost)}</td>
          <td class="num strong">${formatCurrency(m.partCost + m.laborCost)}</td>
          <td>
            <button class="icon-button icon-button-danger" type="button" data-delete="${m.id}" aria-label="Excluir ${escapeHtml(m.title)}">${icon('trash')}</button>
          </td>
        </tr>`)
      .join('');

    tableEl.innerHTML = `
      <table class="table">
        <thead>
          <tr>
            <th>Data</th>
            <th>Serviço</th>
            <th>Tipo</th>
            <th class="num">Peça</th>
            <th class="num">M.O.</th>
            <th class="num">Total</th>
            <th></th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>`;
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const submitButton = form.querySelector('[type="submit"]');
    const values = new FormData(form);
    submitButton.disabled = true;
    showError('');
    try {
      await addMaintenanceRecord(vehicle.id, {
        date: new Date().toISOString().slice(0, 10),
        title: values.get('title'),
        partName: values.get('partName'),
        partCost: parseFloat(values.get('partCost')) || 0,
        laborCost: parseFloat(values.get('laborCost')) || 0,
        odometer: parseFloat(values.get('odometer')) || 0,
        category: values.get('category'),
      });
      form.reset();
      renderSummary();
      renderTable();
    } catch (error) {
      console.error(error);
      showError(GENERIC_ERROR);
    } finally {
      submitButton.disabled = false;
    }
  });

  root.addEventListener('click', async (event) => {
    const remove = event.target.closest('[data-delete]');
    if (!remove) return;
    const record = records().find((m) => m.id === remove.dataset.delete);
    if (!record) return;
    const confirmed = await confirmDialog({
      title: 'Excluir manutenção?',
      description: `Esta ação não pode ser desfeita. O registro "${record.title}" de ${formatDate(record.date)} será removido permanentemente.`,
    });
    if (!confirmed) return;
    showError('');
    try {
      await deleteMaintenanceRecord(record.id);
      renderSummary();
      renderTable();
    } catch (error) {
      console.error(error);
      showError(GENERIC_ERROR);
    }
  });

  function renderAll() {
    renderHeader();
    renderSummary();
    renderAlerts();
    renderTable();
  }

  renderAll();

  onVehicleChange((selected) => {
    vehicle = selected;
    showError('');
    renderAll();
  });
}

openAppShell(startMaintenancePage);
