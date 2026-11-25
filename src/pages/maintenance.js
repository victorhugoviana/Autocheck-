
import { openAppShell } from '../lib/shell.js';

import {
  pageHeader,
  summaryCard,
  maintenanceAlert,
  escapeHtml,
  confirmDialog,
} from '../lib/ui.js';

import { openInlineEditor } from '../lib/inline-editor.js';
import { icon } from '../lib/icons.js';

import {
  getSelectedVehicle,
  onVehicleChange,
} from '../lib/vehicle-store.js';

import {
  getMaintenanceRecords,
  getWearItems,
  addMaintenanceRecord,
  updateMaintenanceRecord,
  deleteMaintenanceRecord,
} from '../lib/app-data.js';

import {
  formatCurrency,
  formatDate,
  formatNumber,
  getWearAlerts,
} from '../lib/calculations.js';

const GENERIC_ERROR =
  'Não foi possível concluir a operação. Tente novamente.';

const CATEGORIES = ['Preventiva', 'Corretiva'];

const EDIT_ICON = `
  <svg width="18" height="18" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" stroke-width="2"
    stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 20h9"/>
    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L9 17l-4 1 1-4Z"/>
  </svg>`;

function getToday() {
  const now = new Date();

  return [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
  ].join('-');
}

function getPayload(values) {
  const payload = {
    date: values.date,
    title: String(values.title || '').trim(),
    partName: String(values.partName || '').trim(),
    partCost: Number(values.partCost),
    laborCost: Number(values.laborCost),
    odometer: Number(values.odometer),
    category: values.category,
  };

  if (!payload.date || payload.date > getToday()) {
    throw new Error('Informe uma data válida.');
  }

  if (!payload.title || !payload.partName) {
    throw new Error('Preencha os campos obrigatórios.');
  }

  if (
    !Number.isFinite(payload.partCost) ||
    !Number.isFinite(payload.laborCost) ||
    !Number.isSafeInteger(payload.odometer) ||
    payload.partCost < 0 ||
    payload.laborCost < 0 ||
    payload.odometer < 0
  ) {
    throw new Error('Informe valores válidos.');
  }

  if (!CATEGORIES.includes(payload.category)) {
    throw new Error('Selecione um tipo válido.');
  }

  return payload;
}

function startMaintenancePage(root) {
  let vehicle = getSelectedVehicle();
  let busy = false;

  root.innerHTML = `
    <div data-header></div>

    <p class="form-error" data-page-error hidden></p>

    <section class="stat-grid" data-summary></section>

    <section class="split-layout">

      <article class="card card-pad form-card">

        <h2 class="card-title">
          Registrar manutenção
        </h2>

        <form class="form-stack" data-form>

          <label class="field">
            <span class="field-label">
              Data da manutenção
            </span>

            <input class="input"
              name="date"
              type="date"
              value="${getToday()}"
              max="${getToday()}"
              required />
          </label>

          <label class="field">
            <span class="field-label">
              Título do serviço
            </span>

            <input class="input"
              name="title"
              placeholder="Ex: Troca de pastilhas de freio"
              required />
          </label>

          <label class="field">
            <span class="field-label">
              Peça substituída
            </span>

            <input class="input"
              name="partName"
              placeholder="Ex: Pastilha Bosch"
              required />
          </label>

          <div class="form-row">

            <label class="field">
              <span class="field-label">
                Custo da peça (R$)
              </span>

              <input class="input"
                name="partCost"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                required />
            </label>

            <label class="field">
              <span class="field-label">
                Mão de obra (R$)
              </span>

              <input class="input"
                name="laborCost"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                required />
            </label>

          </div>

          <div class="form-row">

            <label class="field">
              <span class="field-label">
                Hodômetro (km)
              </span>

              <input class="input"
                name="odometer"
                type="number"
                min="0"
                step="1"
                placeholder="Ex: 55000"
                required />
            </label>

            <label class="field">
              <span class="field-label">
                Tipo
              </span>

              <select class="input" name="category">
                ${CATEGORIES.map(
                  (category) =>
                    `<option value="${category}">
                      ${category}
                    </option>`
                ).join('')}
              </select>
            </label>

          </div>

          <button class="btn btn-primary btn-block"
            type="submit" data-submit>
            ${icon('plus')}Registrar manutenção
          </button>

        </form>
      </article>

      <div class="stack">

        <section class="card card-pad">

          <div class="card-head">
            <div>

              <h2 class="card-title">
                ${icon('trending', 'title-icon')}
                Alertas preditivos
              </h2>

              <p class="card-subtitle"
                data-odometer-note></p>

            </div>
          </div>

          <div class="alert-grid" data-alerts></div>

        </section>

        <section class="card table-card">

          <div class="card-pad card-pad-tight">

            <h2 class="card-title">
              Histórico de serviços
            </h2>

            <p class="card-subtitle">
              Reparos e manutenções registradas
            </p>

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
  const submitButton = root.querySelector('[data-submit]');

  const records = () =>
    getMaintenanceRecords().filter(
      (m) => m.vehicleId === vehicle.id
    );

  function showError(message) {
    pageErrorEl.textContent = message;
    pageErrorEl.hidden = !message;
  }

  function resetForm() {
    form.reset();
    form.elements.date.value = getToday();
    form.elements.date.max = getToday();
  }

  function setBusy(value) {
    busy = value;
    submitButton.disabled = value;
  }

  function renderHeader() {
    headerEl.innerHTML = pageHeader({
      title: 'Manutenção e Reparos',
      description:
        `Histórico de serviços · ${vehicle.make} ${vehicle.model}`,
    });
  }

  function renderSummary() {
    const list = records();

    const totalParts = list.reduce(
      (s, m) => s + Number(m.partCost || 0),
      0
    );

    const totalLabor = list.reduce(
      (s, m) => s + Number(m.laborCost || 0),
      0
    );

    summaryEl.innerHTML = [

      summaryCard({
        title: 'Total em peças',
        value: formatCurrency(totalParts),
        iconName: 'wrench',
        tone: 'primary',
      }),

      summaryCard({
        title: 'Total em mão de obra',
        value: formatCurrency(totalLabor),
        iconName: 'wrench',
        tone: 'primary',
      }),

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
    odometerNoteEl.textContent =
      `Hodômetro atual: ${formatNumber(vehicle.currentOdometer)} km · Média: ${vehicle.dailyMileageKm} km/dia`;

    alertsEl.innerHTML = getWearAlerts(
      vehicle,
      getWearItems()
    )
      .map(({ item, kmRemaining, daysRemaining, level }) =>
        maintenanceAlert({
          name: item.name,
          kmRemaining,
          daysRemaining,
          level,
        })
      )
      .join('');
  }

  function renderTable() {
    const sorted = [...records()].sort(
      (a, b) =>
        String(b.date).localeCompare(String(a.date)) ||
        b.odometer - a.odometer
    );

    const rows = sorted.map((m) => `
      <tr>

        <td class="cell-strong nowrap">
          ${formatDate(m.date)}
        </td>

        <td>

          <p class="cell-strong">
            ${escapeHtml(m.title)}
          </p>

          <p class="card-subtitle">
            ${escapeHtml(m.partName)}
          </p>

        </td>

        <td>
          <span class="badge ${
            m.category === 'Preventiva'
              ? 'badge-primary'
              : ''
          }">
            ${escapeHtml(m.category)}
          </span>
        </td>

        <td class="num">
          ${formatCurrency(m.partCost)}
        </td>

        <td class="num">
          ${formatCurrency(m.laborCost)}
        </td>

        <td class="num strong">
          ${formatCurrency(
            Number(m.partCost) + Number(m.laborCost)
          )}
        </td>

        <td class="nowrap">

          <button class="icon-button"
            type="button"
            data-edit="${escapeHtml(String(m.id))}"
            title="Editar manutenção"
            aria-label="Editar ${escapeHtml(m.title)}">
            ${EDIT_ICON}
          </button>

          <button class="icon-button icon-button-danger"
            type="button"
            data-delete="${escapeHtml(String(m.id))}"
            title="Excluir manutenção"
            aria-label="Excluir ${escapeHtml(m.title)}">
            ${icon('trash')}
          </button>

        </td>

      </tr>`
    ).join('');

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
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          ${
            rows ||
            `<tr>
              <td colspan="7">
                Nenhuma manutenção registrada.
              </td>
            </tr>`
          }
        </tbody>

      </table>`;
  }

  function renderAll() {
    renderHeader();
    renderSummary();
    renderAlerts();
    renderTable();
  }

  function startEditing(record, row) {
    if (busy) return;

    showError('');

    openInlineEditor({
      row,
      title: 'Editar manutenção',

      fields: [
        {
          name: 'date',
          label: 'Data da manutenção',
          type: 'date',
          value: record.date,
          max: getToday(),
        },
        {
          name: 'title',
          label: 'Título do serviço',
          value: record.title,
        },
        {
          name: 'partName',
          label: 'Peça substituída',
          value: record.partName,
        },
        {
          name: 'partCost',
          label: 'Custo da peça (R$)',
          type: 'number',
          value: record.partCost,
          min: 0,
          step: 0.01,
        },
        {
          name: 'laborCost',
          label: 'Mão de obra (R$)',
          type: 'number',
          value: record.laborCost,
          min: 0,
          step: 0.01,
        },
        {
          name: 'odometer',
          label: 'Hodômetro (km)',
          type: 'number',
          value: record.odometer,
          min: 0,
          step: 1,
        },
        {
          name: 'category',
          label: 'Tipo de manutenção',
          value: record.category,
          options: CATEGORIES,
        },
      ],

      onSave: async (values) => {
        if (busy) {
          throw new Error('Operação em andamento.');
        }

        const payload = getPayload(values);

        setBusy(true);

        try {
          await updateMaintenanceRecord(
            record.id,
            payload
          );

          renderAll();

        } finally {
          setBusy(false);
        }
      },
    });
  }

  // Formulário exclusivo para novas manutenções.
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (busy) return;

    const values = Object.fromEntries(
      new FormData(form).entries()
    );

    const vehicleId = vehicle.id;

    showError('');
    setBusy(true);

    try {
      const payload = getPayload(values);

      await addMaintenanceRecord(
        vehicleId,
        payload
      );

      if (vehicle.id === vehicleId) {
        resetForm();
      }

      renderAll();

    } catch (error) {
      console.error(error);
      showError(GENERIC_ERROR);
    } finally {
      setBusy(false);
    }
  });

  // Botões do histórico.
  root.addEventListener('click', async (event) => {
    if (busy) return;

    const edit = event.target.closest('[data-edit]');

    if (edit) {
      const record = records().find(
        (m) => String(m.id) === edit.dataset.edit
      );

      if (record) {
        startEditing(record, edit.closest('tr'));
      }

      return;
    }

    const remove = event.target.closest('[data-delete]');

    if (!remove) return;

    const record = records().find(
      (m) => String(m.id) === remove.dataset.delete
    );

    if (!record) return;

    setBusy(true);

    try {
      const confirmed = await confirmDialog({
        title: 'Excluir manutenção?',
        description:
          `O registro "${record.title}" de ${formatDate(record.date)} será removido permanentemente.`,
      });

      if (!confirmed) return;

      showError('');

      await deleteMaintenanceRecord(record.id);

      renderAll();

    } catch (error) {
      console.error(error);
      showError(GENERIC_ERROR);
    } finally {
      setBusy(false);
    }
  });

  resetForm();
  renderAll();

  onVehicleChange((selected) => {
    vehicle = selected;

    resetForm();
    showError('');
    renderAll();
  });
}

openAppShell(startMaintenancePage);
