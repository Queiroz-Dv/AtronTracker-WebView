import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, ReplaySubject, shareReplay, throwError } from 'rxjs';
import { Login } from '../models/login.model';
import { LoginRequest } from '../../../../shared/models/request/login-request.model';
import { RotasApi } from '../../../../shared/models/rotas-api.model';
import { RegistrarRequest } from '../../../../shared/models/request/registrar-request.model';
import { DadosDoUsuario } from '../models/dados-do-usuario.model';
import { ModuloModel } from '../../../modulos/interfaces/modulo.interface';
import { SessaoInfoService } from '../../../../shared/services/sessaoInfo.service';

@Injectable({
  providedIn: 'root'
})
export class AcessoService {

  private sessionInfo$: Observable<DadosDoUsuario> = this.createSessionInfoStream();

  /** Exponha apenas os módulos acessíveis ao consumidor externo */
  public modulosAcessiveis$: Observable<ModuloModel[]> = this.createModulosStream();

  constructor(private http: HttpClient, private sessaoService: SessaoInfoService) { }

  logout(): Observable<void> {
    return this.http.get<void>(RotasApi.desconectarEndpoint);
  }

  autenticar(login: LoginRequest): Observable<void> {
    return this.http.post<{ token: string, expires: Date }>(RotasApi.logarEndpoint, login).pipe(
      map(response => {
        this.sessaoService.setUsuarioInfo(response.token, response.expires, login.codigoDoUsuario);
        // Se necessário, armazene o token em outro lugar
      }),
      catchError(error => {
        // Trate o erro conforme necessário
        return throwError(() => error);
      })
    );
  }

  private createSessionInfoStream(): Observable<DadosDoUsuario> {
    return this.http
      .get<DadosDoUsuario>(RotasApi.sessionInfoEndpoint)
      .pipe(
        shareReplay({ bufferSize: 1, refCount: true }),
        catchError((error) => {
          console.error('Erro ao obter informações da sessão:', error);
          return throwError(() => error);
        })
      );
  }

  private createModulosStream(): Observable<ModuloModel[]> {
    return this.sessionInfo$.pipe(
      map((info) => info.perfisDeAcesso.flatMap((perfil) => perfil.modulos))
    );
  }

  registrar(dadosDoUsuario: RegistrarRequest) : Observable<boolean> {
    return this.http.post<{registrado: boolean}>(RotasApi.registrarEndpoint, dadosDoUsuario).pipe(
      map((response) => {        
        return response.registrado; // Retorne true se o registro for bem-sucedido
      }),
      catchError((error) => {
        console.error('Erro ao registrar usuário:', error);
        return throwError(() => error); // Propague o erro para o consumidor
      })
    );
  }
}