import { icon } from './icons.js';
import { escapeHtml } from './ui.js';

import {
  getSelectedVehicle,
  setSelectedVehicleId,
  onVehicleChange,
} from './vehicle-store.js';

import { getVehicles, loadAppData } from './app-data.js';
import { requireUser, signOut } from './auth.js';
import { openVehicleDialog } from './vehicle-form.js';

const NAV_ITEMS = [
  { href: '/', label: 'Dashboard', iconName: 'dashboard' },
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

const stripIndex = (path) => path.replace(/index\.html$/, '');

let unsubscribeVehicle = null;

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
      <label class="vehicle-selector" style="min-width:0;">
        ${icon('car', 'vehicle-selector-icon')}

        <span class="vehicle-selector-label">Veículo:</span>

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
    <p class="sidebar-vehicle-caption">Veículo ativo</p>

    <p class="sidebar-vehicle-name" data-sidebar-name>
      ${escapeHtml(`${vehicle.make} ${vehicle.model}`)}
    </p>

    <p class="sidebar-vehicle-meta" data-sidebar-meta>
      ${escapeHtml(
        [vehicle.year, vehicle.engine].filter(Boolean).join(' · ')
      )}
    </p>
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

  app.innerHTML = `
    <aside class="sidebar">
      <div class="brand">
        <div class="brand-mark">${icon('car')}</div>
        <span class="brand-name">AutoCheck</span>
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
          <span class="brand-name">AutoCheck</span>
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
        <div class="drawer-backdrop" data-drawer-close></div>

        <aside class="drawer-panel">
          <div class="drawer-head">
            <div class="brand">
              <div class="brand-mark">${icon('car')}</div>
              <span class="brand-name">AutoCheck</span>
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
        </aside>
      </div>

      <div class="topbar">${vehicleSelectorHtml()}</div>
      <div class="mobile-vehicle">${vehicleSelectorHtml()}</div>

      <main class="content" id="page"></main>
    </div>
  `;

  const drawer = app.querySelector('[data-drawer]');

  app.querySelector('[data-drawer-open]').addEventListener('click', () => {
    drawer.hidden = false;
  });

  app.querySelectorAll('[data-drawer-close]').forEach((element) => {
    element.addEventListener('click', () => {
      drawer.hidden = true;
    });
  });

  app.querySelectorAll('[data-vehicle-select]').forEach((select) => {
    select.addEventListener('change', (event) => {
      setSelectedVehicleId(event.target.value);
    });
  });

  app.onclick = async (event) => {
    if (event.target.closest('[data-logout]')) {
      signOut();
      return;
    }

    if (event.target.closest('[data-add-vehicle]')) {
      const added = await openVehicleDialog();

      if (added) {
        setSelectedVehicleId(added.id);
      }
    }
  };

  if (unsubscribeVehicle) unsubscribeVehicle();

  unsubscribeVehicle = onVehicleChange(syncVehicleUi);

  return app.querySelector('#page');
}

function syncVehicleUi(vehicle) {
  if (!vehicle) return;

  document.querySelectorAll('[data-vehicle-select]').forEach((select) => {
    select.innerHTML = vehicleOptionsHtml();
    select.value = vehicle.id;
  });

  const name = document.querySelector('[data-sidebar-name]');
  const meta = document.querySelector('[data-sidebar-meta]');

  if (name) {
    name.textContent = `${vehicle.make} ${vehicle.model}`;
  }

  if (meta) {
    meta.textContent = [vehicle.year, vehicle.engine]
      .filter(Boolean)
      .join(' · ');
  }
}