import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Departamento } from '../models/departamento.model';
import { RotasApi } from '../../../shared/models/rotas-api.model';
import { BaseService } from '../../../core/services/base-service';

@Injectable({
  providedIn: 'root'
})

export class DepartamentosService extends BaseService<Departamento> {

  constructor(http: HttpClient) {
    super(http, RotasApi.departamentoEndpoint)
  }
}