import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AcessoService } from "../../features/acesso/login/services/acesso.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private loginService: AcessoService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.loginService.getToken();
    if (token) {
      req = req.clone({
        url: req.url,
        setHeaders: { Authorization: `Bearer ${token}` }
      });
    }

    return next.handle(req);
  }
}