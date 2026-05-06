import { MOCK_USUARIOS } from './mock';

export async function login(email, senha) {
  const u = MOCK_USUARIOS.find(x => x.email === email && x.senha === senha);
  if (!u) throw new Error('Credenciais invalidas');
  const data = { token: 'mock-token-' + u.id, perfil: u.perfil, nome: u.nome, id: u.id };
  localStorage.setItem('token', data.token);
  localStorage.setItem('usuario', JSON.stringify({ id: u.id, nome: data.nome, perfil: data.perfil }));
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
