import { icon } from './icons.js';
import { formatNumber } from './calculations.js';

const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

export function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ESCAPES[char]);
}

export function pageHeader({ title, description, action = '' }) {
  return `
    <header class="page-header">
      <div>
        <h1 class="page-title">${escapeHtml(title)}</h1>
        ${description ? `<p class="page-description">${escapeHtml(description)}</p>` : ''}
      </div>
      ${action}
    </header>`;
}

export function summaryCard({ title, value, subtitle, iconName, tone = 'primary' }) {
  return `
    <article class="card stat-card">
      <div class="stat-body">
        <p class="stat-title">${escapeHtml(title)}</p>
        <p class="stat-value">${escapeHtml(value)}</p>
        ${subtitle ? `<p class="stat-subtitle">${escapeHtml(subtitle)}</p>` : ''}
      </div>
      <div class="stat-icon tone-${tone}">${icon(iconName)}</div>
    </article>`;
}

const ALERT_LEVELS = {
  red: { icon: 'alert', tone: 'danger' },
  yellow: { icon: 'clock', tone: 'warning' },
  green: { icon: 'checkCircle', tone: 'success' },
};

export function maintenanceAlert({ name, kmRemaining, daysRemaining, level }) {
  const { icon: iconName, tone } = ALERT_LEVELS[level];
  const kmText = kmRemaining <= 0
    ? `Vencido há ${formatNumber(Math.abs(kmRemaining))} km`
    : `${formatNumber(kmRemaining)} km restantes`;
  const dayText = daysRemaining <= 0 ? 'Agora' : `${daysRemaining} dias`;

  return `
    <div class="alert-item tone-${tone}">
      ${icon(iconName, 'alert-icon')}
      <div class="alert-main">
        <p class="alert-name">${escapeHtml(name)}</p>
        <p class="alert-detail">${kmText}</p>
      </div>
      <div class="alert-forecast">
        <p class="alert-forecast-label">Previsão</p>
        <p class="alert-forecast-value">${dayText}</p>
      </div>
    </div>`;
}

export function confirmDialog({ title, description, confirmLabel = 'Excluir' }) {
  return new Promise((resolve) => {
    const dialog = document.createElement('dialog');
    dialog.className = 'modal';
    dialog.innerHTML = `
      <form method="dialog" class="modal-body">
        <h3 class="modal-title">${escapeHtml(title)}</h3>
        <p class="modal-text">${escapeHtml(description)}</p>
        <div class="modal-actions">
          <button value="cancel" class="btn btn-ghost">Cancelar</button>
          <button value="confirm" class="btn btn-danger">${escapeHtml(confirmLabel)}</button>
        </div>
      </form>`;
    dialog.addEventListener('close', () => {
      resolve(dialog.returnValue === 'confirm');
      dialog.remove();
    });
    document.body.append(dialog);
    dialog.showModal();
  });
}
