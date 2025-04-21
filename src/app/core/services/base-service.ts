import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export abstract class BaseService<T> {
  constructor(protected http: HttpClient, protected endpoint: string) { }

  obterTodos(): Observable<T[]> {
    return this.http.get<T[]>(this.endpoint)
      .pipe(catchError(this.handleError));
  }

  obterPorCodigo(codigo: string | number): Observable<T> {
    if (typeof codigo === "number") {
      return this.obterPorId(codigo);
    }
    return this.http.get<T>(`${this.endpoint}/${codigo}`)
      .pipe(catchError(this.handleError));
  }

  obterPorId(id: number): Observable<T> {
    return this.http.get<T>(`${this.endpoint}/${id}`)
      .pipe(catchError(this.handleError));
  }

  gravarPorRequest<R>(requestModel: R): Observable<R> {
    return this.http.post<R>(this.endpoint, requestModel)
      .pipe(catchError(this.handleError));
  }

  gravar(model: T): Observable<T> {
    return this.http.post<T>(this.endpoint, model)
      .pipe(catchError(this.handleError));
  }

  atualizar(codigo: string | number, model: T): Observable<T> {
    return this.http.put<T>(`${this.endpoint}/${codigo}`, model)
      .pipe(catchError(this.handleError));
  }

  deletar(codigo: string | number): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${codigo}`)
      .pipe(catchError(this.handleError));
  }

  protected handleError(error: any): Observable<never> {
    console.error('[BaseService] Erro detectado:', error);
    // Aqui você pode disparar notificações, enviar logs, etc.
    return throwError(() => error);
  }
}
