
import { icon } from './icons.js';
import { escapeHtml } from './ui.js';

import {
  getSelectedVehicle,
  setSelectedVehicleId,
  onVehicleChange,
} from './vehicle-store.js';

import {
  getVehicles,
  loadAppData,
  updateVehicleOdometer,
} from './app-data.js';

import { requireUser, signOut } from './auth.js';
import { openVehicleDialog } from './vehicle-form.js';

const NAV_ITEMS = [
  {
    href: '/',
    label: 'Dashboard',
    iconName: 'dashboard',
  },
  {
    href: '/refueling.html',
    label: 'Abastecimentos',
    iconName: 'fuel',
  },
  {
    href: '/maintenance.html',
    label: 'Manutenção',
    iconName: 'wrench',
  },
];

const stripIndex = (path) =>
  path.replace(/index\.html$/, '');

let unsubscribeVehicle = null;

const EDIT_ICON = `
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path d="M12 20h9"/>
    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L9 17l-4 1 1-4Z"/>
  </svg>
`;

function formatOdometer(value) {
  return `${Number(value).toLocaleString('pt-BR')} km`;
}

function vehicleOptionsHtml() {
  const selectedId = getSelectedVehicle()?.id;

  return getVehicles()
    .map((vehicle) => {
      const label = [
        `${vehicle.make} ${vehicle.model}`,
        vehicle.year,
        vehicle.engine,
      ]
        .filter(Boolean)
        .join(' · ');

      return `
        <option
          value="${escapeHtml(String(vehicle.id))}"
          ${vehicle.id === selectedId ? 'selected' : ''}
        >
          ${escapeHtml(label)}
        </option>
      `;
    })
    .join('');
}

function vehicleSelectorHtml() {
  return `
    <div
      style="
        display:flex;
        align-items:center;
        gap:12px;
        flex-wrap:wrap;
        width:100%;
      "
    >

      <label class="vehicle-selector"
        style="min-width:0;">

        ${icon('car', 'vehicle-selector-icon')}

        <span class="vehicle-selector-label">
          Veículo:
        </span>

        <select
          class="vehicle-select"
          data-vehicle-select
          aria-label="Veículo selecionado"
          style="max-width:min(440px, 70vw);"
        >
          ${vehicleOptionsHtml()}
        </select>

      </label>

      <button
        class="btn btn-primary btn-sm"
        type="button"
        data-add-vehicle
      >
        + Adicionar veículo
      </button>

    </div>
  `;
}

function navHtml(extraClass = '') {
  const current = stripIndex(location.pathname);

  return NAV_ITEMS.map((item) => {
    const active = stripIndex(item.href) === current;

    return `
      <a
        class="nav-link ${active ? 'is-active' : ''} ${extraClass}"
        href="${item.href}"
        ${active ? 'aria-current="page"' : ''}
      >
        ${icon(item.iconName)}
        <span>${item.label}</span>
      </a>
    `;
  }).join('');
}

function logoutButtonHtml(extraClass = '') {
  return `
    <button
      class="nav-link ${extraClass}"
      type="button"
      data-logout
    >
      ${icon('logOut')}
      <span>Sair</span>
    </button>
  `;
}

function sidebarVehicleHtml(vehicle) {
  return `
    <p class="sidebar-vehicle-caption">
      Veículo ativo
    </p>

    <p class="sidebar-vehicle-name" data-sidebar-name>
      ${escapeHtml(`${vehicle.make} ${vehicle.model}`)}
    </p>

    <p class="sidebar-vehicle-meta" data-sidebar-meta>
      ${escapeHtml(
        [vehicle.year, vehicle.engine]
          .filter(Boolean)
          .join(' · ')
      )}
    </p>

    <div class="sidebar-odometer">

      <p class="sidebar-vehicle-caption">
        Quilometragem atual
      </p>

      <div class="sidebar-odometer-row">

        <strong data-sidebar-odometer>
          ${formatOdometer(vehicle.currentOdometer)}
        </strong>

        <button
          class="odometer-edit-button"
          type="button"
          data-edit-odometer
          title="Atualizar quilometragem"
          aria-label="Atualizar quilometragem"
        >
          ${EDIT_ICON}
        </button>

      </div>

      <form
        class="odometer-form"
        data-odometer-form
        hidden
      >

        <input
          class="input"
          type="number"
          name="odometer"
          aria-label="Nova quilometragem"
          min="${Number(vehicle.currentOdometer)}"
          step="1"
          required
        />

        <button
          class="btn btn-primary btn-sm"
          type="submit"
        >
          Atualizar km
        </button>

        <button
          class="odometer-cancel"
          type="button"
          data-cancel-odometer
        >
          Cancelar
        </button>

        <p
          class="odometer-error"
          data-odometer-error
          hidden
        ></p>

      </form>

    </div>
  `;
}

export async function openAppShell(onReady) {
  const app = document.getElementById('app');
  const user = await requireUser();

  if (!user) return;

  try {
    await loadAppData();

    if (getVehicles().length === 0) {
      app.innerHTML = `
        <main class="status-screen">
          <p class="status-message">
            Cadastre seu primeiro veículo para começar.
          </p>
        </main>
      `;

      const vehicle = await openVehicleDialog({
        required: true,
      });

      if (!vehicle) return;

      setSelectedVehicleId(vehicle.id);
    }

  } catch (error) {
    console.error(error);

    app.innerHTML = `
      <main class="status-screen">
        <p class="status-message">
          Não foi possível carregar seus dados.
          Recarregue a página para tentar novamente.
        </p>
      </main>
    `;

    return;
  }

  onReady(mountShell());
}

export function mountShell() {
  const app = document.getElementById('app');
  const vehicle = getSelectedVehicle();

  let odometerBusy = false;

  app.innerHTML = `
    <aside class="sidebar">

      <div class="brand">

        <div class="brand-mark">
          ${icon('car')}
        </div>

        <span class="brand-name">
          AutoCheck
        </span>

      </div>

      <nav class="sidebar-nav">
        ${navHtml()}
        ${logoutButtonHtml()}
      </nav>

      <div class="sidebar-vehicle">
        ${sidebarVehicleHtml(vehicle)}
      </div>

    </aside>

    <div class="workspace">

      <header class="mobile-header">

        <div class="brand">

          <div class="brand-mark brand-mark-sm">
            ${icon('car')}
          </div>

          <span class="brand-name">
            AutoCheck
          </span>

        </div>

        <button
          class="icon-button"
          type="button"
          data-drawer-open
          aria-label="Abrir menu"
        >
          ${icon('menu')}
        </button>

      </header>

      <div class="drawer" data-drawer hidden>

        <div
          class="drawer-backdrop"
          data-drawer-close
        ></div>

        <aside class="drawer-panel">

          <div class="drawer-head">

            <div class="brand">

              <div class="brand-mark">
                ${icon('car')}
              </div>

              <span class="brand-name">
                AutoCheck
              </span>

            </div>

            <button
              class="icon-button icon-button-light"
              type="button"
              data-drawer-close
              aria-label="Fechar menu"
            >
              ${icon('x')}
            </button>

          </div>

          <nav class="sidebar-nav">
            ${navHtml('nav-link-drawer')}
            ${logoutButtonHtml('nav-link-drawer')}
          </nav>

          <div class="sidebar-vehicle">
            ${sidebarVehicleHtml(vehicle)}
          </div>

        </aside>

      </div>

      <div class="topbar">
        ${vehicleSelectorHtml()}
      </div>

      <div class="mobile-vehicle">
        ${vehicleSelectorHtml()}
      </div>

      <main class="content" id="page"></main>

    </div>
  `;

  const drawer = app.querySelector('[data-drawer]');

  app.querySelector('[data-drawer-open]')
    .addEventListener('click', () => {
      drawer.hidden = false;
    });

  app.querySelectorAll('[data-drawer-close]')
    .forEach((element) => {
      element.addEventListener('click', () => {
        drawer.hidden = true;
      });
    });

  app.querySelectorAll('[data-vehicle-select]')
    .forEach((select) => {
      select.addEventListener('change', (event) => {
        setSelectedVehicleId(event.target.value);
      });
    });

  app.onclick = async (event) => {

    // Abrir edição da quilometragem.

    const editOdometer = event.target.closest(
      '[data-edit-odometer]'
    );

    if (editOdometer) {
      if (odometerBusy) return;

      const current = getSelectedVehicle();

      const form = editOdometer
        .closest('.sidebar-odometer')
        .querySelector('[data-odometer-form]');

      const shouldOpen = form.hidden;

      app.querySelectorAll('[data-odometer-form]')
        .forEach((item) => {
          item.hidden = true;
        });

      form.dataset.vehicleId = String(current.id);

      form.elements.odometer.value =
        current.currentOdometer;

      form.elements.odometer.min =
        current.currentOdometer;

      form.querySelector(
        '[data-odometer-error]'
      ).hidden = true;

      form.hidden = !shouldOpen;

      if (shouldOpen) {
        form.elements.odometer.focus();
      }

      return;
    }

    // Cancelar edição.

    const cancelOdometer = event.target.closest(
      '[data-cancel-odometer]'
    );

    if (cancelOdometer) {
      if (odometerBusy) return;

      cancelOdometer.closest('form').hidden = true;

      return;
    }

    // Sair da conta.

    if (event.target.closest('[data-logout]')) {
      await signOut();
      return;
    }

    // Adicionar veículo.

    if (event.target.closest('[data-add-vehicle]')) {
      const added = await openVehicleDialog();

      if (added) {
        setSelectedVehicleId(added.id);
      }
    }
  };

  // Salvar quilometragem.

  app.onsubmit = async (event) => {
    const form = event.target;

    if (!form.matches('[data-odometer-form]')) {
      return;
    }

    event.preventDefault();

    if (odometerBusy) return;

    const current = getSelectedVehicle();

    if (
      String(current.id) !== form.dataset.vehicleId
    ) {
      form.hidden = true;
      return;
    }

    const submit = form.querySelector(
      '[type="submit"]'
    );

    const errorEl = form.querySelector(
      '[data-odometer-error]'
    );

    const value = form.elements.odometer.value;

    odometerBusy = true;
    submit.disabled = true;
    submit.textContent = 'Salvando...';
    errorEl.hidden = true;

    try {
      await updateVehicleOdometer(
        current.id,
        value
      );

      form.hidden = true;

    } catch (error) {
      console.error(error);

      errorEl.textContent =
        error.message || 'Erro ao atualizar km.';

      errorEl.hidden = false;

    } finally {
      odometerBusy = false;
      submit.disabled = false;
      submit.textContent = 'Atualizar km';
    }
  };

  if (unsubscribeVehicle) {
    unsubscribeVehicle();
  }

  unsubscribeVehicle = onVehicleChange(
    syncVehicleUi
  );

  return app.querySelector('#page');
}

// Sincroniza as informações do veículo.

function syncVehicleUi(vehicle) {
  if (!vehicle) return;

  document.querySelectorAll(
    '[data-vehicle-select]'
  ).forEach((select) => {
    select.innerHTML = vehicleOptionsHtml();
    select.value = vehicle.id;
  });

  document.querySelectorAll(
    '[data-sidebar-name]'
  ).forEach((name) => {
    name.textContent =
      `${vehicle.make} ${vehicle.model}`;
  });

  document.querySelectorAll(
    '[data-sidebar-meta]'
  ).forEach((meta) => {
    meta.textContent = [
      vehicle.year,
      vehicle.engine,
    ].filter(Boolean).join(' · ');
  });

  document.querySelectorAll(
    '[data-sidebar-odometer]'
  ).forEach((element) => {
    element.textContent = formatOdometer(
      vehicle.currentOdometer
    );
  });

  document.querySelectorAll(
    '[data-odometer-form]'
  ).forEach((form) => {
    form.elements.odometer.value =
      vehicle.currentOdometer;

    form.elements.odometer.min =
      vehicle.currentOdometer;

    form.hidden = true;
  });
}
