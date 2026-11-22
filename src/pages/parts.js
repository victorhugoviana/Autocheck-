import { openAppShell } from '../lib/shell.js';
import { pageHeader, escapeHtml } from '../lib/ui.js';
import { icon } from '../lib/icons.js';
import { productCard } from '../lib/product-card.js';
import {
  getSelectedVehicle,
  onVehicleChange,
} from '../lib/vehicle-store.js';

function normalize(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function stringValue(value) {
  return typeof value === 'string' ||
    typeof value === 'number'
    ? String(value).trim()
    : '';
}

function vehicleInfo(vehicle) {
  const make = stringValue(vehicle?.make);

  const fullModel = (
    stringValue(vehicle?.model) ||
    stringValue(vehicle?.name)
  )
    .split(/[·|]/)[0]
    .trim();

  const year = stringValue(vehicle?.year);
  const makeTokens = normalize(make).split(' ').filter(Boolean);
  const tokens = normalize(fullModel).split(' ').filter(Boolean);

  const includesMake =
    makeTokens.length > 0 &&
    makeTokens.every((token, index) => tokens[index] === token);

  if (includesMake) {
    tokens.splice(0, makeTokens.length);
  }

  // Remove informações de versão a partir da motorização,
  // potência, quantidade de portas ou câmbio.
  const baseTokens = [];

  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];

    const isYear = /^(19|20)\d{2}$/.test(token);
    const isSpecification = /^\d+(v|cv|p|portas)$/.test(token);

    const isVersion = [
      'flex',
      'gasolina',
      'diesel',
      'automatico',
      'automatica',
      'manual',
      'aut',
      'mec',
      'cvt',
      'dct',
    ].includes(token);

    // "2.0" vira os tokens "2" e "0" após normalização.
    const isEngine =
      baseTokens.length > 0 &&
      /^\d$/.test(token) &&
      /^\d$/.test(tokens[index + 1] || '');

    if (
      baseTokens.length > 0 &&
      (isYear || isSpecification || isVersion || isEngine)
    ) {
      break;
    }

    baseTokens.push(token);

    if (baseTokens.length === 2) break;
  }

  const modelTokens = baseTokens.map((token) =>
    normalize(make) === 'bmw'
      ? token.replace(/^(\d{3}[di])a$/, '$1')
      : token
  );

  const displayModel = includesMake
    ? fullModel
    : [make, fullModel].filter(Boolean).join(' ');

  return {
    searchName: [
      make,
      modelTokens.join(' '),
    ]
      .filter(Boolean)
      .join(' '),

    year,
    modelTokens,
    label: [displayModel, year].filter(Boolean).join(' '),
  };
}

function mentionsVehicle(part, info) {
  if (info.modelTokens.length === 0) return false;

  const textTokens = normalize(
    `${part.name || ''} ${part.description || ''}`
  )
    .split(' ')
    .filter(Boolean);

  return info.modelTokens.every((modelToken) =>
    textTokens.some((token) => {
      if (token === modelToken) return true;

      // BMW: aceita 120i e 120iA como grafias do modelo-base.
      return (
        /^\d{3}[di]$/.test(modelToken) &&
        token === `${modelToken}a`
      );
    })
  );
}

function startPartsPage(root) {
  let vehicle = getSelectedVehicle();
  let products = [];
  let loading = false;
  let errorMessage = '';
  let needsAuthorization = false;
  let partialResults = false;
  let requestId = 0;
  let sort = 'priceAsc';
  let lastQuery = '';
  let hiddenProducts = 0;

  root.innerHTML = `
    <div data-header></div>

    <form class="search-bar" data-search-form>
      <label class="search-field">
        ${icon('search', 'search-icon')}

        <input
          class="input input-search"
          type="search"
          data-search
          maxlength="120"
          placeholder="Ex.: roda aro 15, filtro de óleo..."
          aria-label="Buscar peças"
          required
        />
      </label>

      <button class="btn btn-primary" type="submit">
        Buscar
      </button>
    </form>

    <div class="card card-pad" style="margin-bottom: 1rem;">
      <label for="parts-sort">Ordenar por</label>

      <select id="parts-sort" class="input" data-sort>
        <option value="priceAsc">Menor preço da peça</option>
        <option value="priceDesc">Maior preço da peça</option>
        <option value="name">Nome do produto</option>
      </select>

      <p class="card-subtitle" style="margin-top: 0.75rem;">
        A pesquisa inclui a marca, o modelo-base e o ano.
        Os resultados precisam mencionar o modelo.
        Confirme versão e especificações no anúncio.
      </p>

      <p class="card-subtitle" data-query></p>
    </div>

    <section
      class="results"
      data-results
      aria-live="polite"
    ></section>
  `;

  const headerEl = root.querySelector('[data-header]');
  const formEl = root.querySelector('[data-search-form]');
  const searchEl = root.querySelector('[data-search]');
  const sortEl = root.querySelector('[data-sort]');
  const queryEl = root.querySelector('[data-query]');
  const resultsEl = root.querySelector('[data-results]');

  function renderHeader() {
    const info = vehicleInfo(vehicle);

    headerEl.innerHTML = pageHeader({
      title: 'Buscar peças',
      description: info.label
        ? `Veículo selecionado: ${escapeHtml(info.label)}. ` +
          'Pesquisa por modelo; confirme a aplicação no anúncio.'
        : 'Selecione um veículo antes de pesquisar.',
      action: '',
    });
  }

  function renderResults() {
    queryEl.textContent = lastQuery
      ? `Pesquisa enviada: ${lastQuery}`
      : '';

    if (loading) {
      resultsEl.innerHTML = `
        <div class="card empty-state">
          <p class="cell-strong">
            Consultando produtos para o veículo selecionado...
          </p>
        </div>
      `;
      return;
    }

    if (errorMessage) {
      resultsEl.innerHTML = `
        <div class="card empty-state" role="alert">
          <p class="cell-strong">
            Não foi possível carregar os produtos
          </p>

          <p>${escapeHtml(errorMessage)}</p>

          ${
            needsAuthorization
              ? `
                <a
                  class="btn btn-primary"
                  href="/.netlify/functions/ml-callback?start=1"
                >
                  Conectar Mercado Livre
                </a>
              `
              : `
                <button
                  class="btn btn-outline"
                  type="button"
                  data-retry
                >
                  Tentar novamente
                </button>
              `
          }
        </div>
      `;
      return;
    }

    if (products.length === 0) {
      resultsEl.innerHTML = `
        <div class="card empty-state">
          ${icon('search', 'empty-icon')}

          <p class="cell-strong">
            Nenhuma oferta encontrada com menção ao modelo
          </p>

          <p>
            Tente o nome da peça, marca ou código do fabricante.
            O catálogo consultado não cobre todos os anúncios.
          </p>

          ${
            hiddenProducts > 0
              ? `
                <p>
                  ${hiddenProducts} resultados foram ocultados
                  porque o título e as características retornadas
                  não mencionam o modelo selecionado.
                </p>
              `
              : ''
          }

          ${
            partialResults
              ? '<p>Também houve falhas em parte das consultas.</p>'
              : ''
          }
        </div>
      `;
      return;
    }

    const sorted = [...products].sort((a, b) => {
      if (sort === 'priceDesc') return b.price - a.price;

      if (sort === 'name') {
        return String(a.name).localeCompare(
          String(b.name),
          'pt-BR'
        );
      }

      return a.price - b.price;
    });

    resultsEl.innerHTML = `
      <div class="results-head">
        <p class="card-subtitle">
          ${sorted.length} produtos com menção ao modelo
        </p>
      </div>

      ${
        partialResults
          ? `
            <p role="status">
              Alguns produtos não puderam ser consultados.
              Estes resultados são parciais.
            </p>
          `
          : ''
      }

      <div class="part-list">
        ${sorted.map((part) => productCard(part)).join('')}
      </div>

      <p class="card-subtitle" style="margin-top: 1rem;">
        Imagens e características do catálogo.
        Confirme compatibilidade, frete e disponibilidade
        no anúncio. Preços sujeitos a alteração.
      </p>
    `;
  }

  async function loadProducts() {
    const term = searchEl.value.trim();

    if (!term) {
      searchEl.focus();
      return;
    }

    const currentRequest = ++requestId;
    const info = vehicleInfo(vehicle);

    products = [];
    errorMessage = '';
    needsAuthorization = false;
    partialResults = false;
    hiddenProducts = 0;

    if (!info.searchName || info.modelTokens.length === 0) {
      loading = false;
      lastQuery = '';
      errorMessage = 'Selecione um veículo com modelo informado.';
      renderResults();
      return;
    }

    lastQuery = [
      term,
      info.searchName,
      info.year,
    ]
      .filter(Boolean)
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (lastQuery.length > 200) {
      loading = false;
      errorMessage = 'Reduza o texto da pesquisa.';
      renderResults();
      return;
    }

    loading = true;
    renderResults();

    try {
      const response = await fetch(
        '/.netlify/functions/ml-parts?q=' +
          encodeURIComponent(lastQuery),
        {
          credentials: 'same-origin',
          cache: 'no-store',
        }
      );

      const contentType =
        response.headers.get('content-type') || '';

      if (!contentType.includes('application/json')) {
        throw new Error(
          response.status === 404
            ? 'A função ml-parts não foi encontrada.'
            : 'O servidor não retornou uma resposta JSON.'
        );
      }

      const data = await response.json();

      if (currentRequest !== requestId) return;

      if (!response.ok) {
        needsAuthorization = response.status === 401;

        throw new Error(
          data.error || `Falha na consulta: HTTP ${response.status}.`
        );
      }

      if (!Array.isArray(data.results)) {
        throw new Error('Formato inesperado na resposta.');
      }

      products = data.results.filter((part) =>
        mentionsVehicle(part, info)
      );

      hiddenProducts = data.results.length - products.length;

      partialResults =
        Array.isArray(data.warnings) &&
        data.warnings.length > 0;
    } catch (error) {
      if (currentRequest !== requestId) return;

      products = [];
      errorMessage = error.message || 'Erro ao buscar produtos.';
    } finally {
      if (currentRequest === requestId) {
        loading = false;
        renderResults();
      }
    }
  }

  formEl.addEventListener('submit', (event) => {
    event.preventDefault();
    loadProducts();
  });

  sortEl.addEventListener('change', () => {
    sort = sortEl.value;
    renderResults();
  });

  resultsEl.addEventListener('click', (event) => {
    if (event.target.closest('[data-retry]')) {
      loadProducts();
    }
  });

  onVehicleChange((selected) => {
    vehicle = selected;
    renderHeader();

    if (searchEl.value.trim()) {
      loadProducts();
    } else {
      requestId += 1;
      products = [];
      loading = false;
      errorMessage = '';
      needsAuthorization = false;
      partialResults = false;
      hiddenProducts = 0;
      lastQuery = '';
      renderResults();
    }
  });

  renderHeader();
  searchEl.value = 'roda aro 15';
  loadProducts();
}

openAppShell(startPartsPage);