import { supabase } from './supabase.js';

const LOGIN_PAGE = '/login.html';

const AUTH_MESSAGES = {
  'Invalid login credentials': 'E-mail ou senha incorretos.',
  'Email not confirmed': 'Confirme seu e-mail antes de entrar.',
  'User already registered': 'Já existe uma conta com este e-mail.',
  'Password should be at least 6 characters.':
    'A senha precisa ter pelo menos 6 caracteres.',
};

function describeAuthError(error) {
  if (AUTH_MESSAGES[error?.message]) {
    return AUTH_MESSAGES[error.message];
  }

  if (
    error?.status === 429 ||
    error?.code === 'over_email_send_rate_limit' ||
    error?.code === 'over_request_rate_limit'
  ) {
    return 'Muitas tentativas. Aguarde alguns minutos e tente novamente.';
  }

  if (error?.code === 'email_not_confirmed') {
    return 'Confirme seu e-mail antes de entrar.';
  }

  if (error?.code === 'weak_password') {
    return 'A senha não atende aos requisitos de segurança.';
  }

  if (error?.code === 'same_password') {
    return 'Escolha uma senha diferente da anterior.';
  }

  if (
    error?.code === 'otp_expired' ||
    error?.code === 'session_not_found'
  ) {
    return 'O link expirou. Solicite um novo e-mail.';
  }

  return 'Não foi possível concluir. Tente novamente.';
}

function loginUrl(params = {}) {
  const url = new URL(LOGIN_PAGE, window.location.origin);

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  return url.href;
}

export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getSession();

  if (error) throw error;

  return data.session?.user ?? null;
}

export async function requireUser() {
  const user = await getCurrentUser();

  if (!user) {
    location.replace(LOGIN_PAGE);
    return null;
  }

  return user;
}

export async function signIn(email, password) {
  const { error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  return error ? describeAuthError(error) : null;
}

export async function signUp(email, password) {
  const { data, error } = await supabase.auth.signUp({
    email: email.trim(),
    password,
    options: {
      emailRedirectTo: loginUrl(),
    },
  });

  if (error) {
    return {
      error: describeAuthError(error),
      needsConfirmation: false,
    };
  }

  return {
    error: null,
    needsConfirmation: !data.session,
  };
}

export async function requestPasswordReset(email) {
  const { error } = await supabase.auth.resetPasswordForEmail(
    email.trim(),
    {
      redirectTo: loginUrl({ mode: 'reset' }),
    }
  );

  return error ? describeAuthError(error) : null;
}

export async function updatePassword(password) {
  const { error } = await supabase.auth.updateUser({
    password,
  });

  return error ? describeAuthError(error) : null;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();

  if (error) throw error;

  location.replace(LOGIN_PAGE);
}