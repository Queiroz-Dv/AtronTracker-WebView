import { Departamento } from "../../../departamentos/models/departamento.model";
import { CargoModel } from "../cargo.model";

export class CargoResponse implements CargoModel {
  codigo: string;
  descricao: string;
  departamentoCodigo: string;
  //departamentoDescricao?: string; // opcional, caso queira exibir nome junto
  departamento: Departamento;
}