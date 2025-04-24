import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from '../../../core/services/base-service';
import { RotasApi } from '../../../shared/models/rotas-api.model';
import { PerfilDeAcessoModel } from '../interfaces/perfil-de-acesso.interface';

@Injectable({ providedIn: 'root' })

export class PerfilDeAcessoService extends BaseService<PerfilDeAcessoModel> {

  constructor(http: HttpClient) {
    super(http, RotasApi.perfilDeAcessoEndpoint)
  }
}