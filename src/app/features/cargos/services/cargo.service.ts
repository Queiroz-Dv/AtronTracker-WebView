import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RotasApi } from '../../../shared/models/rotas-api.model';
import { BaseService } from '../../../core/services/base-service';
import { CargoRequest } from '../models/request/cargo-request.model';

@Injectable({
  providedIn: 'root'
})
export class CargoService extends BaseService<CargoRequest> {

  constructor(http: HttpClient) {
    super(http, RotasApi.cargoEndpoint)
  }
}