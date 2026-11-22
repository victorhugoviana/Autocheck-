import { escapeHtml } from './ui.js';
import { formatCurrency } from './calculations.js';

const AREA = { width: 640, height: 280, top: 20, right: 16, bottom: 32, left: 48 };
const DONUT_RADIUS = 70;
const DONUT_CIRCUMFERENCE = 2 * Math.PI * DONUT_RADIUS;

export function renderAreaChart(data, { label, unit }) {
  if (data.length === 0) {
    return '<p class="chart-empty">Registre ao menos dois abastecimentos para ver a evolução.</p>';
  }

  const { width, height, top, right, bottom, left } = AREA;
  const innerWidth = width - left - right;
  const innerHeight = height - top - bottom;
  const max = Math.max(...data.map((d) => d.value)) * 1.1 || 1;

  const x = (i) => (data.length === 1 ? left + innerWidth / 2 : left + (i * innerWidth) / (data.length - 1));
  const y = (value) => top + innerHeight - (value / max) * innerHeight;
  const baseline = top + innerHeight;

  const linePath = data.map((d, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(d.value).toFixed(1)}`).join(' ');
  const areaPath = `${linePath} L${x(data.length - 1).toFixed(1)},${baseline} L${x(0).toFixed(1)},${baseline} Z`;

  const gridLines = [0, 1, 2, 3, 4]
    .map((step) => {
      const value = (max * step) / 4;
      const py = y(value).toFixed(1);
      return `
        <line x1="${left}" x2="${width - right}" y1="${py}" y2="${py}" class="chart-gridline" />
        <text x="${left - 8}" y="${py}" class="chart-tick" text-anchor="end" dominant-baseline="middle">${value.toFixed(1)}</text>`;
    })
    .join('');

  const points = data
    .map(
      (d, i) => `
        <circle cx="${x(i).toFixed(1)}" cy="${y(d.value).toFixed(1)}" r="4" class="chart-point">
          <title>${escapeHtml(d.label)}: ${d.value.toFixed(2)} ${unit}</title>
        </circle>
        <text x="${x(i).toFixed(1)}" y="${height - 8}" class="chart-tick" text-anchor="middle">${escapeHtml(d.label)}</text>`
    )
    .join('');

  return `
    <svg viewBox="0 0 ${width} ${height}" class="chart" role="img" aria-label="${escapeHtml(label)}">
      <defs>
        <linearGradient id="consumption-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stop-color="hsl(217 91% 50%)" stop-opacity="0.3" />
          <stop offset="95%" stop-color="hsl(217 91% 50%)" stop-opacity="0" />
        </linearGradient>
      </defs>
      ${gridLines}
      <path d="${areaPath}" fill="url(#consumption-fill)" />
      <path d="${linePath}" class="chart-line" />
      ${points}
    </svg>`;
}

export function renderDonutChart(slices) {
  const total = slices.reduce((sum, s) => sum + s.value, 0);
  if (total === 0) {
    return '<p class="chart-empty">Nenhum gasto registrado ainda.</p>';
  }

  let offset = 0;
  const arcs = slices
    .map((slice) => {
      const length = (slice.value / total) * DONUT_CIRCUMFERENCE;
      const arc = `<circle cx="100" cy="100" r="${DONUT_RADIUS}" fill="none" stroke="${slice.color}" stroke-width="28" stroke-dasharray="${length.toFixed(2)} ${DONUT_CIRCUMFERENCE.toFixed(2)}" stroke-dashoffset="${(-offset).toFixed(2)}" transform="rotate(-90 100 100)"><title>${escapeHtml(slice.label)}: ${formatCurrency(slice.value)}</title></circle>`;
      offset += length;
      return arc;
    })
    .join('');

  const legend = slices
    .map((slice) => {
      const share = Math.round((slice.value / total) * 100);
      return `
        <li class="legend-item">
          <span class="legend-dot" style="background:${slice.color}"></span>
          <span class="legend-label">${escapeHtml(slice.label)}</span>
          <span class="legend-value">${formatCurrency(slice.value)} <span class="legend-share">${share}%</span></span>
        </li>`;
    })
    .join('');

  return `
    <div class="donut">
      <svg viewBox="0 0 200 200" class="donut-svg" role="img" aria-label="Distribuição de gastos">
        <circle cx="100" cy="100" r="${DONUT_RADIUS}" fill="none" stroke="hsl(214 32% 93%)" stroke-width="28" />
        ${arcs}
      </svg>
      <ul class="legend">${legend}</ul>
    </div>`;
}
