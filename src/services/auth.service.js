import api from './api';

export async function login(email, senha) {
  const { data } = await api.post('/api/auth/login', { email, senha });
  // response: { token, perfil, nome }
  localStorage.setItem('token', data.token);
  localStorage.setItem('usuario', JSON.stringify({
    nome: data.nome,
    perfil: data.perfil  // "ALUNO" ou "COORDENADOR"
  }));
  return data;
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
}

export function getUsuarioLogado() {
  const raw = localStorage.getItem('usuario');
  return raw ? JSON.parse(raw) : null;
}