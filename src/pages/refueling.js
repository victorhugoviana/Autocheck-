
import { openAppShell } from '../lib/shell.js';
import {
  pageHeader,
  summaryCard,
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
  getRefuelings,
  addRefueling,
  updateRefueling,
  deleteRefueling,
} from '../lib/app-data.js';

import {
  formatCurrency,
  formatDate,
  formatNumber,
  calcKmPerLiter,
  calcOverallConsumption,
} from '../lib/calculations.js';

const PAGE_SIZE = 6;
const FUEL_TYPES = ['Gasolina', 'Etanol', 'Diesel', 'GNV'];

const GENERIC_ERROR =
  'Não foi possível concluir a operação. Tente novamente.';

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
    odometer: Number(values.odometer),
    liters: Number(values.liters),
    totalAmount: Number(values.totalAmount),
    fuelType: values.fuelType,
  };

  if (!payload.date || payload.date > getToday()) {
    throw new Error('Informe uma data válida.');
  }

  if (
    !Number.isSafeInteger(payload.odometer) ||
    !Number.isFinite(payload.liters) ||
    !Number.isFinite(payload.totalAmount) ||
    payload.odometer < 0 ||
    payload.liters <= 0 ||
    payload.totalAmount < 0
  ) {
    throw new Error('Informe valores válidos.');
  }

  if (!FUEL_TYPES.includes(payload.fuelType)) {
    throw new Error('Selecione um combustível válido.');
  }

  return payload;
}

function startRefuelingPage(root) {
  let vehicle = getSelectedVehicle();
  let page = 0;
  let busy = false;

  root.innerHTML = `
    <div data-header></div>

    <p class="form-error" data-page-error hidden></p>

    <section class="stat-grid" data-summary></section>

    <section class="split-layout">

      <article class="card card-pad form-card">

        <h2 class="card-title">
          Registrar abastecimento
        </h2>

        <form class="form-stack" data-form>

          <label class="field">
            <span class="field-label">
              Data do abastecimento
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
              Hodômetro no abastecimento (km)
            </span>

            <input class="input"
              name="odometer"
              type="number"
              min="0"
              step="1"
              placeholder="Ex: 56000"
              required />
          </label>

          <label class="field">
            <span class="field-label">
              Litros abastecidos
            </span>

            <input class="input"
              name="liters"
              type="number"
              min="0.01"
              step="0.01"
              placeholder="Ex: 38.5"
              required />
          </label>

          <label class="field">
            <span class="field-label">
              Valor total pago (R$)
            </span>

            <input class="input"
              name="totalAmount"
              type="number"
              min="0"
              step="0.01"
              placeholder="Ex: 277.20"
              required />
          </label>

          <label class="field">
            <span class="field-label">
              Tipo de combustível
            </span>

            <select class="input" name="fuelType">
              ${FUEL_TYPES.map(
                (t) => `<option value="${t}">${t}</option>`
              ).join('')}
            </select>
          </label>

          <button class="btn btn-primary btn-block"
            type="submit" data-submit>
            ${icon('plus')}Adicionar abastecimento
          </button>

        </form>
      </article>

      <article class="card table-card">

        <div class="card-pad card-pad-tight">

          <h2 class="card-title">
            Histórico de abastecimentos
          </h2>

          <p class="card-subtitle">
            Consumo calculado com base no hodômetro anterior
          </p>

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
  const submitButton = root.querySelector('[data-submit]');

  const refuelings = () =>
    getRefuelings().filter(
      (r) => r.vehicleId === vehicle.id
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

  function consumptionTone(kml) {
    if (kml >= 10) return 'text-success';
    if (kml >= 7) return 'text-warning';
    return 'text-danger';
  }

  function renderHeader() {
    headerEl.innerHTML = pageHeader({
      title: 'Abastecimentos',
      description:
        `Histórico e registro de combustível · ${vehicle.make} ${vehicle.model}`,
    });
  }

  function renderSummary() {
    const list = refuelings();

    const totalSpent = list.reduce(
      (s, r) => s + Number(r.totalAmount || 0),
      0
    );

    const totalLiters = list.reduce(
      (s, r) => s + Number(r.liters || 0),
      0
    );

    const avgPrice =
      totalLiters > 0 ? totalSpent / totalLiters : 0;

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
    const sortedAsc = [...refuelings()].sort(
      (a, b) => a.odometer - b.odometer
    );

    const sortedDesc = [...sortedAsc].sort(
      (a, b) =>
        String(b.date).localeCompare(String(a.date)) ||
        b.odometer - a.odometer
    );

    const totalPages = Math.ceil(
      sortedDesc.length / PAGE_SIZE
    );

    page = Math.max(
      0,
      Math.min(page, Math.max(0, totalPages - 1))
    );

    const visible = sortedDesc.slice(
      page * PAGE_SIZE,
      page * PAGE_SIZE + PAGE_SIZE
    );

    const rows = visible.map((r) => {
      const previous =
        sortedAsc
          .filter((s) => s.odometer < r.odometer)
          .pop() ?? null;

      const kml = calcKmPerLiter(r, previous);

      const pricePerLiter =
        r.liters > 0 ? r.totalAmount / r.liters : 0;

      return `
        <tr>

          <td class="cell-strong nowrap">
            ${formatDate(r.date)}
          </td>

          <td class="num">
            ${formatNumber(r.odometer)}
          </td>

          <td class="num">
            ${Number(r.liters).toFixed(1)}
          </td>

          <td>
            <span class="badge">
              ${escapeHtml(r.fuelType)}
            </span>
          </td>

          <td class="num muted">
            ${formatCurrency(pricePerLiter)}
          </td>

          <td class="num strong">
            ${formatCurrency(r.totalAmount)}
          </td>

          <td class="num">
            ${
              kml !== null
                ? `<span class="${consumptionTone(kml)} strong">
                    ${kml.toFixed(1)}
                  </span>`
                : '<span class="muted">—</span>'
            }
          </td>

          <td class="nowrap">

            <button class="icon-button"
              type="button"
              data-edit="${escapeHtml(String(r.id))}"
              title="Editar abastecimento"
              aria-label="Editar abastecimento">
              ${EDIT_ICON}
            </button>

            <button class="icon-button icon-button-danger"
              type="button"
              data-delete="${escapeHtml(String(r.id))}"
              title="Excluir abastecimento"
              aria-label="Excluir abastecimento">
              ${icon('trash')}
            </button>

          </td>

        </tr>`;
    }).join('');

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
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          ${
            rows ||
            `<tr>
              <td colspan="8">
                Nenhum abastecimento registrado.
              </td>
            </tr>`
          }
        </tbody>

      </table>`;

    paginationEl.innerHTML =
      totalPages > 1
        ? `
          <div class="pagination">

            <p class="card-subtitle">
              Página ${page + 1} de ${totalPages}
            </p>

            <div class="pagination-actions">

              <button class="btn btn-outline btn-sm"
                type="button"
                data-page-step="-1"
                ${page === 0 ? 'disabled' : ''}>
                Anterior
              </button>

              <button class="btn btn-outline btn-sm"
                type="button"
                data-page-step="1"
                ${page >= totalPages - 1 ? 'disabled' : ''}>
                Próxima
              </button>

            </div>

          </div>`
        : '';
  }

  function renderAll() {
    renderSummary();
    renderTable();
  }

  function startEditing(record, row) {
    if (busy) return;

    showError('');

    openInlineEditor({
      row,
      title: 'Editar abastecimento',

      fields: [
        {
          name: 'date',
          label: 'Data do abastecimento',
          type: 'date',
          value: record.date,
          max: getToday(),
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
          name: 'liters',
          label: 'Litros abastecidos',
          type: 'number',
          value: record.liters,
          min: 0.01,
          step: 0.01,
        },
        {
          name: 'fuelType',
          label: 'Tipo de combustível',
          value: record.fuelType,
          options: FUEL_TYPES,
        },
        {
          name: 'totalAmount',
          label: 'Valor total pago (R$)',
          type: 'number',
          value: record.totalAmount,
          min: 0,
          step: 0.01,
        },
      ],

      onSave: async (values) => {
        if (busy) {
          throw new Error('Operação em andamento.');
        }

        const payload = getPayload(values);

        setBusy(true);

        try {
          await updateRefueling(record.id, payload);
          renderAll();
        } finally {
          setBusy(false);
        }
      },
    });
  }

  // Formulário exclusivo para novos abastecimentos.
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

      await addRefueling(vehicleId, payload);

      if (vehicle.id === vehicleId) {
        resetForm();
        page = 0;
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

    const step = event.target.closest('[data-page-step]');

    if (step) {
      page += Number(step.dataset.pageStep);
      renderTable();
      return;
    }

    const edit = event.target.closest('[data-edit]');

    if (edit) {
      const record = refuelings().find(
        (r) => String(r.id) === edit.dataset.edit
      );

      if (record) {
        startEditing(record, edit.closest('tr'));
      }

      return;
    }

    const remove = event.target.closest('[data-delete]');

    if (!remove) return;

    const record = refuelings().find(
      (r) => String(r.id) === remove.dataset.delete
    );

    if (!record) return;

    setBusy(true);

    try {
      const confirmed = await confirmDialog({
        title: 'Excluir abastecimento?',
        description:
          `O registro de ${formatDate(record.date)} será removido permanentemente.`,
      });

      if (!confirmed) return;

      showError('');

      await deleteRefueling(record.id);

      renderAll();

    } catch (error) {
      console.error(error);
      showError(GENERIC_ERROR);
    } finally {
      setBusy(false);
    }
  });

  resetForm();
  renderHeader();
  renderAll();

  onVehicleChange((selected) => {
    vehicle = selected;
    page = 0;

    resetForm();
    showError('');

    renderHeader();
    renderAll();
  });
}

openAppShell(startRefuelingPage);
