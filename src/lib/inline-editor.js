
import { escapeHtml } from './ui.js';

export function openInlineEditor({
  row,
  title,
  fields,
  onSave,
}) {
  const table = row.closest('table');

  // Fecha outra edição aberta na mesma tabela.
  const previous = table.querySelector('[data-inline-editor]');

  if (previous?.dataset.saving === 'true') return;

  previous?.remove();

  const editor = document.createElement('tr');

  editor.dataset.inlineEditor = '';

  const renderField = (field) => {
    const value = escapeHtml(String(field.value ?? ''));

    const control = field.options
      ? `
        <select class="input" name="${field.name}" required>
          ${field.options.map((option) => `
            <option
              value="${escapeHtml(option)}"
              ${option === field.value ? 'selected' : ''}
            >
              ${escapeHtml(option)}
            </option>
          `).join('')}
        </select>
      `
      : `
        <input
          class="input"
          name="${field.name}"
          type="${field.type || 'text'}"
          value="${value}"
          ${field.min !== undefined ? `min="${field.min}"` : ''}
          ${field.max !== undefined ? `max="${field.max}"` : ''}
          ${field.step !== undefined ? `step="${field.step}"` : ''}
          required
        />
      `;

    return `
      <label class="field">
        <span class="field-label">
          ${escapeHtml(field.label)}
        </span>
        ${control}
      </label>
    `;
  };

  editor.innerHTML = `
    <td colspan="${row.cells.length}">
      <div class="inline-editor">
        <h3 class="card-title">
          ${escapeHtml(title)}
        </h3>

        <form class="form-stack">
          <div class="inline-editor-grid">
            ${fields.map(renderField).join('')}
          </div>

          <p class="form-error" data-error hidden></p>

          <div class="inline-editor-actions">
            <button
              class="btn btn-outline"
              type="button"
              data-close-editor
            >
              Cancelar
            </button>

            <button
              class="btn btn-primary"
              type="submit"
            >
              Salvar alterações
            </button>
          </div>
        </form>
      </div>
    </td>
  `;

  row.after(editor);

  const form = editor.querySelector('form');
  const cancel = editor.querySelector('[data-close-editor]');
  const submit = editor.querySelector('[type="submit"]');
  const errorEl = editor.querySelector('[data-error]');

  cancel.addEventListener('click', () => {
    editor.remove();
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (editor.dataset.saving === 'true') return;

    editor.dataset.saving = 'true';

    const values = Object.fromEntries(
      new FormData(form).entries()
    );

    submit.disabled = true;
    cancel.disabled = true;
    submit.textContent = 'Salvando...';
    errorEl.hidden = true;

    try {
      await onSave(values);
      editor.remove();
    } catch (error) {
      console.error(error);

      errorEl.textContent =
        'Não foi possível salvar as alterações. Tente novamente.';

      errorEl.hidden = false;
    } finally {
      editor.dataset.saving = 'false';
      submit.disabled = false;
      cancel.disabled = false;
      submit.textContent = 'Salvar alterações';
    }
  });
}
