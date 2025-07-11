import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, catchError, filter, map, Observable, shareReplay, throwError } from 'rxjs';
import { LoginRequest } from '../../../../shared/models/request/login-request.model';
import { RotasApi } from '../../../../shared/models/rotas-api.model';
import { RegistrarRequest } from '../../../../shared/models/request/registrar-request.model';
import { DadosDoUsuario } from '../models/dados-do-usuario.model';
import { ModuloModel } from '../../../modulos/interfaces/modulo.interface';
import { SessaoInfoService } from '../../../../shared/services/sessaoInfo.service';
import { UserToken } from '../models/userToken';

@Injectable({
  providedIn: 'root'
})
export class AcessoService {

  private sessionInfoSubject = new BehaviorSubject<DadosDoUsuario | null>(null);
  private sessionInfo$: Observable<DadosDoUsuario> = this.sessionInfoSubject.asObservable();

  /** Exponha apenas os módulos acessíveis ao consumidor externo */
  public modulosAcessiveis$: Observable<ModuloModel[]> = this.sessionInfo$.pipe(
    filter(info => info !== null), // Filtra valores nulos
    map((info) => info.perfisDeAcesso.flatMap((perfil) => perfil.modulos)),
  );

  constructor(private http: HttpClient, private sessaoService: SessaoInfoService) {
    //this.fetchSessionInfoFromApi();
  }

  logout(): Observable<boolean> {
    return this.http.get<{ deslogado: boolean }>(RotasApi.desconectarEndpoint).pipe(
      map(response => {
        if (response.deslogado) {
          this.sessionInfo$ = null;
          this.modulosAcessiveis$ = null;
        }
        return response.deslogado;
      })
    );
  }

  autenticar(login: LoginRequest): Observable<void> {
    return this.http.post<UserToken>(RotasApi.logarEndpoint, login).pipe(
      map(response => {
        this.sessaoService.setUsuarioInfo(response.token, response.expires, login.codigoDoUsuario);
        this.fetchSessionInfoFromApi(); // Fetch session info after login  
        // Se necessário, armazene o token em outro lugar
      }),
      catchError(error => {
        // Trate o erro conforme necessário
        return throwError(() => error);
      })
    );
  }

private fetchSessionInfoFromApi(): void {
  const token = this.sessaoService.getToken();
  if (!token) return;

  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  this.http.get<DadosDoUsuario>(RotasApi.sessionInfoEndpoint, { headers }).subscribe({
    next: (info) => this.sessionInfoSubject.next(info),
    error: (err) => {
      console.error('Erro ao buscar sessão:', err);
      this.sessionInfoSubject.next(null);
    }
  });
}


  registrar(dadosDoUsuario: RegistrarRequest): Observable<boolean> {
    return this.http.post<{ registrado: boolean }>(RotasApi.registrarEndpoint, dadosDoUsuario).pipe(
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