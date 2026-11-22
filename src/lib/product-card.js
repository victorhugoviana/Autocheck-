import { icon } from './icons.js';
import { escapeHtml } from './ui.js';
import { formatCurrency } from './calculations.js';

const TRUST_BADGES = {
  'Loja Oficial': { icon: 'badge', tone: 'primary' },
  'Vendedor Platinum': { icon: 'award', tone: 'accent' },
  '5 Estrelas': { icon: 'star', tone: 'warning' },
  'Vendedor Ouro': { icon: 'medal', tone: 'warning' },
};

const FALLBACK_IMAGE =
  'data:image/svg+xml;charset=UTF-8,' +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg"
         width="150" height="150" viewBox="0 0 150 150">
      <rect width="150" height="150" fill="#f3f4f6"/>
      <text x="50%" y="50%"
            dominant-baseline="middle"
            text-anchor="middle"
            font-family="sans-serif"
            font-size="13"
            fill="#9ca3af">Sem foto</text>
    </svg>
  `);

function text(value, fallback = '') {
  if (value === null || value === undefined) return fallback;

  const result = String(value).trim();
  return result || fallback;
}

function html(value, fallback = '') {
  return escapeHtml(text(value, fallback));
}

function nonNegativeNumber(value) {
  if (
    value === null ||
    value === undefined ||
    (typeof value !== 'number' && typeof value !== 'string') ||
    (typeof value === 'string' && value.trim() === '')
  ) {
    return null;
  }

  const number = Number(value);

  return Number.isFinite(number) && number >= 0 ? number : null;
}

function imageUrl(value) {
  try {
    const url = new URL(text(value));

    if (url.protocol === 'http:') {
      url.protocol = 'https:';
    }

    return url.protocol === 'https:' ? url.href : FALLBACK_IMAGE;
  } catch {
    return FALLBACK_IMAGE;
  }
}

function mercadoLivreUrl(value) {
  try {
    const url = new URL(text(value));
    const hostname = url.hostname.toLowerCase();

    const isMercadoLivre =
      hostname === 'mercadolivre.com.br' ||
      hostname.endsWith('.mercadolivre.com.br');

    if (
      !isMercadoLivre ||
      url.username ||
      url.password ||
      !['http:', 'https:'].includes(url.protocol)
    ) {
      return null;
    }

    url.protocol = 'https:';
    return url.href;
  } catch {
    return null;
  }
}

export function productCard(part = {}) {
  part = part ?? {};

  const name = text(part.name, 'Produto sem título');
  const brand = text(part.brand);
  const description = text(part.description);
  const compatibility = text(part.compatibility);
  const storeName = text(part.storeName);

  const price = nonNegativeNumber(part.price);
  const freight = nonNegativeNumber(part.freight);
  const rating = nonNegativeNumber(part.rating);
  const salesCount = nonNegativeNumber(part.salesCount);
  const deliveryDays = nonNegativeNumber(part.deliveryDays);

  const totalCost =
    price !== null && freight !== null
      ? price + freight
      : null;

  const productUrl = mercadoLivreUrl(part.permalink);
  const productImage = imageUrl(part.imageUrl);

  const badgeLabel = text(part.trustBadge);
  const badge = TRUST_BADGES[badgeLabel];

  const badgeMarkup = badge
    ? `
      <span class="trust-badge tone-${badge.tone}">
        ${icon(badge.icon)}
        ${html(badgeLabel)}
      </span>
    `
    : '';

  const freightText =
    freight === null
      ? 'Frete a consultar no anúncio'
      : freight === 0
        ? 'Frete grátis'
        : `Frete: ${formatCurrency(freight)}`;

  const deliveryText =
    deliveryDays === null
      ? ''
      : deliveryDays === 0
        ? ' · Entrega prevista para hoje'
        : ` · Entrega em ${deliveryDays} ${
            deliveryDays === 1 ? 'dia' : 'dias'
          }`;

  const ratingMarkup =
    rating !== null
      ? `
        <span class="part-rating">
          ${icon('star', 'rating-icon')}
          ${html(rating.toFixed(1))}
        </span>
      `
      : '';

  const salesMarkup =
    salesCount !== null
      ? `
        <span class="muted">
          (${html(Math.floor(salesCount))} vendas)
        </span>
      `
      : '';

  const sellerMarkup =
    storeName || ratingMarkup || salesMarkup
      ? `
        <div class="part-meta">
          ${
            storeName
              ? `
                ${icon('store')}
                <span class="part-store">${html(storeName)}</span>
              `
              : ''
          }
          ${ratingMarkup}
          ${salesMarkup}
        </div>
      `
      : '';

  const compatibilityMarkup = compatibility
    ? `
      <div
        class="part-compatibility"
        style="
          margin: 0.4rem 0;
          padding: 0.35rem 0.6rem;
          background: #f3f4f6;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          color: #374151;
          font-size: 0.82rem;
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
        "
      >
        <span>
          <strong>Compatibilidade informada:</strong>
          ${html(compatibility)}
        </span>
      </div>
    `
    : '';

  const descriptionMarkup = description
    ? `
      <p
        class="part-description"
        style="
          font-size: 0.85rem;
          color: #4b5563;
          margin: 0.4rem 0 0.6rem 0;
          line-height: 1.35;
        "
      >
        ${html(description)}
      </p>
    `
    : '';

  const displayedPrice =
    totalCost !== null
      ? formatCurrency(totalCost)
      : price !== null
        ? formatCurrency(price)
        : 'Preço a consultar';

  const priceLabel = totalCost !== null ? 'total' : '';

  const priceSummary =
    price === null
      ? 'Consulte os valores no anúncio'
      : freight === null
        ? 'Frete a consultar no anúncio'
        : `Peça ${formatCurrency(price)} + Frete ${
            freight === 0 ? 'grátis' : formatCurrency(freight)
          }`;

  const buttonMarkup = productUrl
    ? `
      <a
        href="${html(productUrl)}"
        target="_blank"
        rel="noopener noreferrer"
        class="btn btn-primary btn-sm"
        style="
          text-decoration: none;
          text-align: center;
          display: inline-block;
        "
      >
        Ver produto no Mercado Livre
      </a>
    `
    : `
      <button
        type="button"
        class="btn btn-primary btn-sm"
        disabled
        style="opacity: 0.6; cursor: not-allowed;"
      >
        Link indisponível
      </button>
    `;

  return `
    <article class="part-card">
      <div class="part-body">
        <div class="part-image">
          <img
            src="${html(productImage)}"
            alt="${html(name)}"
            loading="lazy"
            decoding="async"
            onerror="this.onerror=null;this.src='${FALLBACK_IMAGE}';"
          />
        </div>

        <div class="part-info">
          <div class="part-top">
            <div class="part-title-block">
              <h3 class="part-name">${html(name)}</h3>

              ${
                brand
                  ? `
                    <p class="card-subtitle">
                      Marca: <strong>${html(brand)}</strong>
                    </p>
                  `
                  : ''
              }
            </div>

            ${badgeMarkup}
          </div>

          ${compatibilityMarkup}
          ${descriptionMarkup}
          ${sellerMarkup}

          <div class="part-meta">
            ${icon('truck')}
            <span>${html(freightText)}${html(deliveryText)}</span>
          </div>
        </div>
      </div>

      <div class="part-footer">
        <div>
          <p class="part-price">
            <span class="price-value">${html(displayedPrice)}</span>
            ${
              priceLabel
                ? `<span class="muted">${html(priceLabel)}</span>`
                : ''
            }
          </p>

          <p class="card-subtitle">${html(priceSummary)}</p>
        </div>

        ${buttonMarkup}
      </div>
    </article>
  `;
}