import { addVehicle } from './app-data.js';

const API = 'https://parallelum.com.br/fipe/api/v1/carros';

let activeDialog = null;

async function fetchCatalog(path) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);

  try {
    const response = await fetch(`${API}/${path}`, {
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Catálogo indisponível: HTTP ${response.status}.`);
    }

    return await response.json();
  } finally {
    clearTimeout(timeout);
  }
}

function fillOptions(select, items, placeholder) {
  select.replaceChildren(new Option(placeholder, ''));

  for (const item of items) {
    select.add(new Option(item.nome, String(item.codigo)));
  }

  select.disabled = items.length === 0;
}

export function openVehicleDialog({ required = false } = {}) {
  if (activeDialog) {
    activeDialog.focus();
    return Promise.resolve(null);
  }

  return new Promise((resolve) => {
    const dialog = document.createElement('dialog');
    activeDialog = dialog;

    dialog.setAttribute('aria-labelledby', 'vehicle-dialog-title');

    dialog.style.cssText = `
      width: min(560px, calc(100vw - 32px));
      max-height: 90vh;
      overflow-y: auto;
      padding: 24px;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      color: #0f172a;
      background: white;
      box-shadow: 0 24px 80px #0003;
    `;

    dialog.innerHTML = `
      <form data-form>
        <h2 id="vehicle-dialog-title" style="margin-top:0;">
          Adicionar veículo
        </h2>

        <p>Escolha no catálogo ou preencha os dados manualmente.</p>

        <label style="display:block; margin-bottom:16px;">
          Forma de cadastro
          <select class="input" name="mode">
            <option value="manual">Preencher manualmente</option>
            <option value="catalog">Selecionar no catálogo</option>
          </select>
        </label>

        <fieldset
          data-manual
          style="border:0; padding:0; margin:0;"
        >
          <label style="display:block; margin-bottom:16px;">
            Marca
            <input
              class="input"
              name="make"
              maxlength="80"
              placeholder="Ex.: Hyundai"
              required
            />
          </label>

          <label style="display:block; margin-bottom:16px;">
            Modelo
            <input
              class="input"
              name="model"
              maxlength="160"
              placeholder="Ex.: HB20"
              required
            />
          </label>
        </fieldset>

        <fieldset
          data-catalog
          hidden
          disabled
          style="border:0; padding:0; margin:0;"
        >
          <label style="display:block; margin-bottom:16px;">
            Marca do catálogo
            <select class="input" name="catalogMake" required>
              <option value="">Selecione uma marca</option>
            </select>
          </label>

          <label style="display:block; margin-bottom:16px;">
            Modelo / versão do catálogo
            <select class="input" name="catalogModel" required disabled>
              <option value="">Selecione uma marca primeiro</option>
            </select>
          </label>

          <label style="display:block; margin-bottom:16px;">
            Anos disponíveis no catálogo
            <select class="input" name="catalogYear" disabled>
              <option value="">Selecione um modelo primeiro</option>
            </select>
          </label>

          <p>
            O modelo pode incluir a versão e a motorização.
            Confira o ano abaixo com o documento do veículo.
          </p>
        </fieldset>

        <p data-catalog-status role="status"></p>

        <label style="display:block; margin-bottom:16px;">
          Ano do modelo
          <input
            class="input"
            type="number"
            name="year"
            min="1900"
            max="${new Date().getFullYear() + 2}"
            step="1"
            placeholder="Ex.: 2020"
            required
          />
        </label>

        <label style="display:block; margin-bottom:16px;">
          Motor / combustível (opcional)
          <input
            class="input"
            name="engine"
            maxlength="100"
            placeholder="Ex.: 1.6 Flex"
          />
        </label>

        <label style="display:block; margin-bottom:16px;">
          Apelido (opcional)
          <input
            class="input"
            name="nickname"
            maxlength="80"
            placeholder="Ex.: Meu carro"
          />
        </label>

        <label style="display:block; margin-bottom:16px;">
          Quilometragem atual
          <input
            class="input"
            type="number"
            name="currentOdometer"
            min="0"
            step="1"
            value="0"
            required
          />
        </label>

        <label style="display:block; margin-bottom:16px;">
          Média de quilômetros por dia
          <input
            class="input"
            type="number"
            name="dailyMileageKm"
            min="0"
            step="0.1"
            value="0"
            required
          />
        </label>

        <p data-error role="alert" style="color:#b91c1c;"></p>

        <div style="display:flex; gap:12px; justify-content:flex-end;">
          <button
            class="btn btn-outline"
            type="button"
            data-cancel
            ${required ? 'hidden' : ''}
          >
            Cancelar
          </button>

          <button class="btn btn-primary" type="submit" data-save>
            Salvar veículo
          </button>
        </div>
      </form>
    `;

    document.body.append(dialog);

    const form = dialog.querySelector('[data-form]');
    const manual = dialog.querySelector('[data-manual]');
    const catalog = dialog.querySelector('[data-catalog]');
    const status = dialog.querySelector('[data-catalog-status]');
    const errorEl = dialog.querySelector('[data-error]');
    const saveButton = dialog.querySelector('[data-save]');

    const mode = form.elements.namedItem('mode');
    const makeSelect = form.elements.namedItem('catalogMake');
    const modelSelect = form.elements.namedItem('catalogModel');
    const yearSelect = form.elements.namedItem('catalogYear');
    const yearInput = form.elements.namedItem('year');

    let saving = false;
    let brandLoad = null;
    let catalogRequest = 0;
    let savedVehicle = null;

    async function loadBrands() {
      if (brandLoad) return brandLoad;

      status.textContent = 'Carregando marcas...';

      brandLoad = fetchCatalog('marcas')
        .then((items) => {
          if (!Array.isArray(items)) {
            throw new Error('Formato inesperado no catálogo.');
          }

          fillOptions(makeSelect, items, 'Selecione uma marca');

          if (mode.value === 'catalog') {
            status.textContent = '';
          }
        })
        .catch(() => {
          brandLoad = null;

          if (mode.value === 'catalog') {
            status.textContent =
              'Não foi possível carregar o catálogo. ' +
              'Selecione “Preencher manualmente” para continuar.';
          }
        });

      return brandLoad;
    }

    mode.addEventListener('change', () => {
      const useCatalog = mode.value === 'catalog';

      manual.hidden = useCatalog;
      manual.disabled = useCatalog;
      catalog.hidden = !useCatalog;
      catalog.disabled = !useCatalog;
      errorEl.textContent = '';

      if (useCatalog) {
        loadBrands();
      } else {
        status.textContent = '';
      }
    });

    makeSelect.addEventListener('change', async () => {
      const current = ++catalogRequest;
      const brandId = makeSelect.value;

      fillOptions(modelSelect, [], 'Selecione uma marca primeiro');
      fillOptions(yearSelect, [], 'Selecione um modelo primeiro');
      yearInput.value = '';

      if (!brandId) {
        status.textContent = '';
        return;
      }

      status.textContent = 'Carregando modelos...';

      try {
        const response = await fetchCatalog(
          `marcas/${encodeURIComponent(brandId)}/modelos`
        );

        if (current !== catalogRequest || !dialog.isConnected) return;

        if (!Array.isArray(response.modelos)) {
          throw new Error('Formato inesperado.');
        }

        fillOptions(
          modelSelect,
          response.modelos,
          'Selecione um modelo'
        );

        status.textContent =
          response.modelos.length === 0
            ? 'Nenhum modelo encontrado. Você pode cadastrar manualmente.'
            : '';
      } catch {
        if (current !== catalogRequest || !dialog.isConnected) return;

        status.textContent =
          'Não foi possível carregar os modelos. ' +
          'Tente novamente ou use o cadastro manual.';
      }
    });

    modelSelect.addEventListener('change', async () => {
      const current = ++catalogRequest;
      const brandId = makeSelect.value;
      const modelId = modelSelect.value;

      fillOptions(yearSelect, [], 'Carregando anos...');
      yearInput.value = '';

      if (!brandId || !modelId) {
        status.textContent = '';
        return;
      }

      status.textContent = 'Carregando anos...';

      try {
        const items = await fetchCatalog(
          `marcas/${encodeURIComponent(brandId)}/modelos/` +
          `${encodeURIComponent(modelId)}/anos`
        );

        if (current !== catalogRequest || !dialog.isConnected) return;

        if (!Array.isArray(items)) {
          throw new Error('Formato inesperado.');
        }

        fillOptions(yearSelect, items, 'Selecione o ano');

        status.textContent =
          'Escolha um ano da lista ou preencha o ano do modelo abaixo.';
      } catch {
        if (current !== catalogRequest || !dialog.isConnected) return;

        status.textContent =
          'Não foi possível carregar os anos. ' +
          'Preencha o ano do modelo manualmente.';
      }
    });

    yearSelect.addEventListener('change', () => {
      const year = Number(yearSelect.value.split('-')[0]);

      if (
        Number.isInteger(year) &&
        year >= 1900 &&
        year <= new Date().getFullYear() + 2
      ) {
        yearInput.value = String(year);
        status.textContent = '';
      } else {
        yearInput.value = '';
        status.textContent =
          'Informe o ano do modelo conforme o documento do veículo.';
      }
    });

    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      if (saving || !form.reportValidity()) return;

      const useCatalog = mode.value === 'catalog';

      if (
        useCatalog &&
        (!makeSelect.value || !modelSelect.value)
      ) {
        errorEl.textContent = 'Selecione a marca e o modelo.';
        return;
      }

      saving = true;
      saveButton.disabled = true;
      saveButton.textContent = 'Salvando...';
      errorEl.textContent = '';

      const field = (name) => form.elements.namedItem(name).value;

      try {
        savedVehicle = await addVehicle({
          make: useCatalog
            ? makeSelect.selectedOptions[0].textContent
            : field('make'),

          model: useCatalog
            ? modelSelect.selectedOptions[0].textContent
            : field('model'),

          year: field('year'),
          engine: field('engine'),
          nickname: field('nickname'),
          currentOdometer: field('currentOdometer'),
          dailyMileageKm: field('dailyMileageKm'),
        });

        saving = false;
        dialog.close();
      } catch (error) {
        errorEl.textContent =
          error.message || 'Não foi possível salvar o veículo.';

        saving = false;
        saveButton.disabled = false;
        saveButton.textContent = 'Salvar veículo';
      }
    });

    dialog.querySelector('[data-cancel]').addEventListener('click', () => {
      if (!saving) dialog.close();
    });

    dialog.addEventListener('cancel', (event) => {
      if (required || saving) event.preventDefault();
    });

    dialog.addEventListener('close', () => {
      catalogRequest += 1;
      activeDialog = null;
      dialog.remove();
      resolve(savedVehicle);
    }, { once: true });

    dialog.showModal();
  });
}