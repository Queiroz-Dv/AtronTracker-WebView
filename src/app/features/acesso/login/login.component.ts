import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AcessoService } from './services/acesso.service';
import { SharedModule } from '../../../shared/modules/shared.module';
import { ControlErrorComponent } from '../../../shared/components/control-error/control-error.component';
import { LoginRequest } from '../../../shared/models/request/login-request.model';
import { VisualizacaoService } from '../../../core/services/visualizacao-service';

@Component({
  standalone: true,
  selector: 'c-login',
  imports: [SharedModule, ReactiveFormsModule, ControlErrorComponent, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['../acesso.component.css'],
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  id?: number;

  constructor(
    private fb: FormBuilder,
    private loginService: AcessoService,
    public router: Router,
    public visualizacaoService: VisualizacaoService
  ) { }

  ngOnInit(): void {
    const token = this.loginService.getToken();
    const usuarioData = this.loginService.getDadosDoUsuario();

    if (token != null || usuarioData != null) {
      this.loginService.obterUsuarioLogado().subscribe({
        next: (dados) => {
          // Se quiser guardar novamente os dados:
          localStorage.setItem('usuarioTempData', JSON.stringify(dados));
          const rota = this.getRotaPorVisualizacao();
          this.router.navigate([rota]);
        },
        error: () => {
          console.log("Deslogando usuário por falta de informações para manter a sessão");
          this.loginService.logout();// Token expirado ou inválido
        }
      });
    }
    this.form = this.fb.group({
      codigo: ['', Validators.required],
      senha: ['', Validators.required]
    });
  }

  async autenticar() {
    let loginPayload = new LoginRequest();
    loginPayload.codigoDoUsuario = this.form.value.codigo;
    loginPayload.senha = this.form.value.senha;

    this.loginService.autenticar(loginPayload).subscribe({
      next: () => {
        const rota = this.getRotaPorVisualizacao();
        this.router.navigate([rota]);
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }

  private getRotaPorVisualizacao(): string {
    const modo = this.visualizacaoService.getViewMode();
    this.visualizacaoService.setViewMode(modo);
    return modo === 'menu' ? '/atron/home' : '/atron/dashboard';
  }

  registrar() {
    this.router.navigate(['/registrar']);
  }
}