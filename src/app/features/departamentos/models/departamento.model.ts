import { DepartamentoItem } from "../interfaces/departamento-item.interface";
import { getDescricaoCompleta } from "../utils/departamento-utils";

export class Departamento implements DepartamentoItem {

  constructor(
    public codigo: string,
    public descricao: string
  ) { }

  getDescricaoCompleta(): string {
    return getDescricaoCompleta(this);
  }
}