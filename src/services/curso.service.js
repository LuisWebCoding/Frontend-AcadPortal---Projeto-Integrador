import { mockCursos, mockRegras } from './mock';

export async function listarCursos() { return mockCursos; }
export async function criarCurso(curso) { return { id: Date.now(), ...curso }; }
export async function editarCurso(id, curso) { return { id, ...curso }; }
export async function excluirCurso(id) { return true; }
export async function listarRegrasDoCurso(idCurso) { return mockRegras; }
export async function criarRegra(idCurso, regra) { return { id: Date.now(), ...regra }; }
export async function excluirRegra(idRegra) { return true; }
