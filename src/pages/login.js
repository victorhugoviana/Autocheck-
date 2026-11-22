import { supabase } from '../lib/supabase.js';
import { icon } from '../lib/icons.js';

const app = document.getElementById('app');

let mode = 'signin';
let busy = false;
let pendingEmail = '';
let purpose = 'email';
let recoveryVerified = false;
let resendAfter = 0;

const COPY = {
  signin: {
    title: 'Bem-vindo de volta',
    subtitle: 'Entre para acessar seus veículos e registros.',
    submit: 'Entrar',
  },
  signup: {
    title: 'Crie sua conta',
    subtitle: 'Você receberá um código para confirmar seu e-mail.',
    submit: 'Criar conta',
  },
  forgot: {
    title: 'Recuperar senha',
    subtitle: 'Informe seu e-mail para receber um código.',
    submit: 'Enviar código',
  },
  verify: {
    title: 'Confira seu e-mail',
    subtitle: 'Digite o código recebido. Confira também o spam.',
    submit: 'Validar código',
  },
  reset: {
    title: 'Criar nova senha',
    subtitle: 'Escolha e confirme sua nova senha.',
    submit: 'Salvar nova senha',
  },
};

function authMessage(error) {
  const messages = {
    invalid_credentials: 'E-mail ou senha incorretos.',
    email_not_confirmed: 'Confirme seu e-mail antes de entrar.',
    user_already_exists: 'Já existe uma conta com esse e-mail.',
    otp_expired: 'Código inválido ou expirado. Solicite outro.',
    weak_password: 'Escolha uma senha mais forte.',
    same_password: 'Escolha uma senha diferente da anterior.',
    over_email_send_rate_limit:
      'Aguarde um pouco antes de solicitar outro código.',
    over_request_rate_limit:
      'Muitas tentativas. Aguarde e tente novamente.',
    email_address_invalid: 'Confira o endereço de e-mail.',
    email_address_not_authorized:
      'O serviço de envio não autorizou esse destinatário.',
  };

  if (error?.status === 429) {
    return 'Muitas solicitações. Aguarde e tente novamente.';
  }

  return messages[error?.code] ||
    'Não foi possível concluir. Confira sua conexão e tente novamente.';
}

function showMessage(message = '', success = false) {
  const errorEl = app.querySelector('[data-error]');
  const successEl = app.querySelector('[data-success]');

  errorEl.textContent = success ? '' : message;
  errorEl.hidden = success || !message;

  successEl.textContent = success ? message : '';
  successEl.hidden = !success || !message;
}

function setBusy(value) {
  busy = value;

  app.querySelectorAll('button').forEach((button) => {
    button.disabled = value;
  });

  const submit = app.querySelector('[data-submit]');

  if (submit) {
    submit.textContent = value ? 'Aguarde...' : COPY[mode].submit;
  }
}

function render() {
  const copy = COPY[mode];
  const hasEmail = ['signin', 'signup', 'forgot'].includes(mode);
  const hasPassword = ['signin', 'signup', 'reset'].includes(mode);
  const confirmPassword = ['signup', 'reset'].includes(mode);

  app.innerHTML = `
    <main class="login-page">
      <section class="login-card card">
        <div class="brand login-brand">
          <div class="brand-mark">${icon('car')}</div>
          <span class="brand-name">AutoCheck</span>
        </div>

        <h1 class="login-title">${copy.title}</h1>
        <p class="login-subtitle">${copy.subtitle}</p>

        ${
          ['signin', 'signup'].includes(mode)
            ? `
              <div class="segmented" role="group"
                   aria-label="Acessar conta">
                <button
                  class="segment ${mode === 'signin' ? 'is-active' : ''}"
                  type="button"
                  data-mode="signin"
                >Entrar</button>

                <button
                  class="segment ${mode === 'signup' ? 'is-active' : ''}"
                  type="button"
                  data-mode="signup"
                >Criar conta</button>
              </div>
            `
            : ''
        }

        <p data-email-note hidden></p>

        <form class="form-stack" data-form>
          ${
            hasEmail
              ? `
                <label class="field">
                  <span class="field-label">E-mail</span>
                  <input
                    class="input"
                    name="email"
                    type="email"
                    autocomplete="email"
                    maxlength="254"
                    required
                  />
                </label>
              `
              : ''
          }

          ${
            hasPassword
              ? `
                <label class="field">
                  <span class="field-label">
                    ${mode === 'reset' ? 'Nova senha' : 'Senha'}
                  </span>
                  <input
                    class="input"
                    name="password"
                    type="password"
                    minlength="${mode === 'signin' ? '6' : '8'}"
                    autocomplete="${
                      mode === 'signin'
                        ? 'current-password'
                        : 'new-password'
                    }"
                    required
                  />
                </label>
              `
              : ''
          }

          ${
            confirmPassword
              ? `
                <label class="field">
                  <span class="field-label">Confirmar senha</span>
                  <input
                    class="input"
                    name="confirmPassword"
                    type="password"
                    minlength="8"
                    autocomplete="new-password"
                    required
                  />
                </label>
              `
              : ''
          }

          ${
            mode === 'verify'
              ? `
                <label class="field">
                  <span class="field-label">Código recebido</span>
                  <input
                    class="input"
                    name="code"
                    type="text"
                    inputmode="numeric"
                    autocomplete="one-time-code"
                    pattern="[0-9]{6,10}"
                    minlength="6"
                    maxlength="10"
                    aria-label="Código recebido por e-mail"
                    required
                  />
                </label>
              `
              : ''
          }

          <p class="form-error" data-error role="alert" hidden></p>

          <p
            data-success
            role="status"
            style="color:#166534;line-height:1.5;"
            hidden
          ></p>

          <button
            class="btn btn-primary btn-block"
            type="submit"
            data-submit
          >${copy.submit}</button>
        </form>

        ${
          mode === 'signin'
            ? `
              <button
                class="btn btn-outline btn-block"
                type="button"
                data-mode="forgot"
                style="margin-top:12px;"
              >Esqueci minha senha</button>
            `
            : ''
        }

        ${
          mode === 'verify'
            ? `
              <button
                class="btn btn-outline btn-block"
                type="button"
                data-resend
                style="margin-top:12px;"
              >Reenviar código</button>
            `
            : ''
        }

        ${
          !['signin', 'signup'].includes(mode)
            ? `
              <button
                class="btn btn-outline btn-block"
                type="button"
                data-mode="signin"
                style="margin-top:12px;"
              >Voltar para entrar</button>
            `
            : ''
        }
      </section>
    </main>
  `;

  if (mode === 'verify') {
    const note = app.querySelector('[data-email-note]');
    note.textContent = `E-mail informado: ${pendingEmail}`;
    note.hidden = false;
  }

  app.querySelector('[data-form]').addEventListener('submit', onSubmit);
  setBusy(busy);
}

function openCodeStep(email, type) {
  pendingEmail = email;
  purpose = type;
  recoveryVerified = false;
  resendAfter = Date.now() + 60000;
  mode = 'verify';
  render();

  showMessage(
    'Se o e-mail informado puder receber esse código, ' +
      'ele chegará em instantes. Confira também o spam.',
    true
  );
}

async function onSubmit(event) {
  event.preventDefault();

  if (busy) return;

  const form = event.currentTarget;
  if (!form.reportValidity()) return;

  const values = new FormData(form);
  const email = String(values.get('email') || '').trim();
  const password = String(values.get('password') || '');
  const confirmation = String(values.get('confirmPassword') || '');

  if (
    ['signup', 'reset'].includes(mode) &&
    password !== confirmation
  ) {
    showMessage('As senhas não conferem.');
    return;
  }

  showMessage();
  setBusy(true);

  try {
    if (mode === 'signin') {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        showMessage(authMessage(error));
        return;
      }

      location.replace('/');
      return;
    }

    if (mode === 'signup') {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        showMessage(authMessage(error));
        return;
      }

      if (data.session) {
        location.replace('/');
        return;
      }

      openCodeStep(email, 'email');
      return;
    }

    if (mode === 'forgot') {
      const { error } = await supabase.auth.resetPasswordForEmail(email);

      if (error) {
        showMessage(authMessage(error));
        return;
      }

      openCodeStep(email, 'recovery');
      return;
    }

    if (mode === 'verify') {
      const token = String(values.get('code') || '').trim();

      const { data, error } = await supabase.auth.verifyOtp({
        email: pendingEmail,
        token,
        type: purpose,
      });

      if (error) {
        showMessage(authMessage(error));
        return;
      }

      if (!data.session) {
        showMessage('Não foi possível validar a sessão. Solicite outro código.');
        return;
      }

      if (purpose === 'email') {
        location.replace('/');
        return;
      }

      recoveryVerified = true;
      mode = 'reset';
      render();
      return;
    }

    if (mode === 'reset') {
      if (!recoveryVerified) {
        showMessage('Valide o código recebido antes de alterar a senha.');
        return;
      }

      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        showMessage(authMessage(error));
        return;
      }

      recoveryVerified = false;

      const { error: logoutError } = await supabase.auth.signOut({
        scope: 'local',
      });

      const emailToFill = pendingEmail;
      pendingEmail = '';
      mode = 'signin';
      render();

      app.querySelector('[name="email"]').value = emailToFill;

      showMessage(
        logoutError
          ? 'Senha alterada. Não foi possível encerrar a sessão atual.'
          : 'Senha alterada com sucesso! Entre com sua nova senha.',
        true
      );
    }
  } catch {
    showMessage('Falha de conexão. Tente novamente.');
  } finally {
    setBusy(false);
  }
}

async function resendCode() {
  if (busy || mode !== 'verify') return;

  if (Date.now() < resendAfter) {
    const seconds = Math.ceil((resendAfter - Date.now()) / 1000);
    showMessage(`Aguarde ${seconds} segundos para reenviar.`);
    return;
  }

  setBusy(true);
  showMessage();

  try {
    const { error } = purpose === 'recovery'
      ? await supabase.auth.resetPasswordForEmail(pendingEmail)
      : await supabase.auth.resend({
          type: 'signup',
          email: pendingEmail,
        });

    if (error) {
      showMessage(authMessage(error));
      return;
    }

    resendAfter = Date.now() + 60000;

    showMessage(
      'Solicitação enviada. Se receber outro código, use o mais recente.',
      true
    );
  } catch {
    showMessage('Não foi possível reenviar. Tente novamente.');
  } finally {
    setBusy(false);
  }
}

app.addEventListener('click', async (event) => {
  if (busy) return;

  if (event.target.closest('[data-resend]')) {
    await resendCode();
    return;
  }

  const button = event.target.closest('[data-mode]');
  if (!button) return;

  const nextMode = button.dataset.mode;
  if (!['signin', 'signup', 'forgot'].includes(nextMode)) return;

  // Ao sair da recuperação, encerra a sessão criada pelo código.
  if (recoveryVerified) {
    setBusy(true);

    try {
      const { error } = await supabase.auth.signOut({ scope: 'local' });

      if (error) {
        showMessage('Não foi possível encerrar a recuperação. Tente novamente.');
        return;
      }
    } catch {
      showMessage('Falha de conexão. Tente novamente.');
      return;
    } finally {
      setBusy(false);
    }
  }

  recoveryVerified = false;
  pendingEmail = '';
  mode = nextMode;
  history.replaceState(null, '', '/login.html');
  render();
});

async function boot() {
  render();
  setBusy(true);

  try {
    const url = new URL(location.href);

    // Links antigos devem iniciar uma nova recuperação por código.
    if (url.hash || url.searchParams.has('mode')) {
      history.replaceState(null, '', '/login.html');
      mode = 'forgot';
      render();
      showMessage('Informe seu e-mail para receber um novo código.');
      return;
    }

    const { data, error } = await supabase.auth.getSession();

    if (error) {
      showMessage(authMessage(error));
      return;
    }

    if (data.session) {
      location.replace('/');
    }
  } catch {
    showMessage('Não foi possível verificar sua sessão. Recarregue a página.');
  } finally {
    setBusy(false);
  }
}

boot();