import { mockUsuarios } from './mock';

export async function listarUsuarios() { return mockUsuarios; }
export async function criarAluno(aluno) { return { id: Date.now(), ...aluno }; }
export async function criarCoordenador(coord) { return { id: Date.now(), ...coord }; }
export async function excluirUsuario(id) { return true; }
