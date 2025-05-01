import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, ReplaySubject } from 'rxjs';
import { Router } from '@angular/router';
import { DadosDoUsuario } from '../models/dados-do-usuario.model';
import { Login } from '../models/login.model';
import { LoginRequest } from '../../../../shared/models/request/login-request.model';
import { RotasApi } from '../../../../shared/models/rotas-api.model';
import { RegistrarRequest } from '../../../../shared/models/request/registrar-request.model';

@Injectable({
  providedIn: 'root'
})
export class AcessoService {
  private readonly authToken = 'authToken';
  private readonly usuarioTempData = "usuarioTempData";

  public credentialUserSource = new ReplaySubject<Login>(1); // Sempre que for alterado será verificado
  public credentials$ = this.credentialUserSource.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  preencherAutenticacao(loginResult: Login): void {
    if (!loginResult || !loginResult.userToken || !loginResult.dadosDoUsuario) {
      console.warn('LoginResult incompleto:', loginResult);
      return;
    }

    // Salva token
    localStorage.setItem(this.authToken, JSON.stringify(loginResult.userToken));

    // Salva dados do usuário diretamente (utilizado internamente no sistema)
    // Isso pode ser útil para evitar chamadas desnecessárias ao servidor para obter os dados do usuário
    localStorage.setItem(this.usuarioTempData, JSON.stringify(loginResult.dadosDoUsuario));

    console.log("Autenticação preenchida com sucesso:", loginResult.dadosDoUsuario);
    // Emite os dados para os subscribers (caso algum componente esteja ouvindo)
    this.credentialUserSource.next(loginResult);
  }

  getModulosAcessiveisDoUsuario(): string[] | null {
    const usuarioData = localStorage.getItem(this.usuarioTempData);

    if (!usuarioData) return null;

    try {
      const usuarioDataObj = JSON.parse(usuarioData);
      return usuarioDataObj?.modulosCodigo ?? null;
    } catch (error) {
      console.error('Erro ao converter os dados do usuário', error);
      return null;
    }
  }

  getDadosDoUsuario(): string | null {
    const usuarioData = localStorage.getItem(this.usuarioTempData);

    if (!usuarioData) return null;

    try {
      const usuarioDataObj = JSON.parse(usuarioData);
      return usuarioDataObj?.token ?? null;
    } catch (error) {
      console.error('Erro ao converter os dados do usuário', error);
      return null;
    }
  }

  getToken(): string | null {
    const tokenString = localStorage.getItem(this.authToken);

    if (!tokenString) return null;

    try {
      const tokenObj = JSON.parse(tokenString);
      return tokenObj?.token ?? null;
    } catch (error) {
      console.error('Erro ao converter o token:', error);
      return null;
    }
  }


  logout(): Observable<void> {
    return this.http.get<void>(RotasApi.desconectarEndpoint);
  }

  obterUsuarioLogado(): Observable<DadosDoUsuario> {
    return this.http.get<DadosDoUsuario>(`${RotasApi.usuarioLogadoEndpoint}`);
  }

  autenticar(login: LoginRequest): Observable<void> {
    return this.http.post<Login>(RotasApi.logarEndpoint, login).pipe(
      map(logged => {
        if (logged && logged.userToken && logged.dadosDoUsuario) {
          this.preencherAutenticacao(logged);
        } else {
          throw new Error('Resposta do login incompleta.');
        }
      })
    );
  }

  registrar(dadosDoUsuario: RegistrarRequest) {
    return this.http.post<Login>(RotasApi.registrarEndpoint, dadosDoUsuario).pipe(
      map(logged => {
        if (logged && logged.userToken && logged.dadosDoUsuario) {
          this.preencherAutenticacao(logged);
        } else {
          throw new Error('Resposta do registro incompleta.');
        }
      })
    );
  }
}