import { DepartamentoItem } from "../interfaces/departamento-item.interface";

export function getDescricaoCompleta(departamento: DepartamentoItem): string {
  return `${departamento.codigo} - ${departamento.descricao}`;
}