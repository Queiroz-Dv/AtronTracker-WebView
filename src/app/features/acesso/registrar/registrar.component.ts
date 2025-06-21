import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AcessoService } from '../login/services/acesso.service';
import { SharedModule } from '../../../shared/modules/shared.module';
import { ControlErrorComponent } from '../../../shared/components/control-error/control-error.component';
import { senhasIguaisValidator } from '../../../core/validators/senhasIguaisValidator.validator';
import { RegistrarRequest } from '../../../shared/models/request/registrar-request.model';

@Component({
  selector: 'c-registrar',
  imports: [SharedModule, ReactiveFormsModule, ControlErrorComponent, RouterModule],
  templateUrl: './registrar.component.html',
  styleUrls: ['../acesso.component.css'],
  standalone: true,
})

export class RegistrarComponent implements OnInit {
  form!: FormGroup;
  id?: number;

  constructor(
    private fb: FormBuilder,
    private acessoService: AcessoService,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      codigo: ['', Validators.required],
      nome: ['', Validators.required],
      sobrenome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      dataNascimento: ['', Validators.required],
      senha: ['', Validators.required],
      confirmaSenha: ['', Validators.required]
    }, { validators: [senhasIguaisValidator()] });
  }

  registrarNovoUsuario(): void {
    const dadosDoUsuario = new RegistrarRequest(
      this.form.value.codigo,
      this.form.value.nome,
      this.form.value.sobrenome,
      this.form.value.email,
      this.form.value.senha,
      this.form.value.confirmaSenha,
      this.form.value.dataNascimento);

    this.acessoService.registrar(dadosDoUsuario).subscribe({
      next: () => {
        console.log('Registro realizado com sucesso com token:');
        this.router.navigate(['/atron/dashboard']);
      },
      error: (error) => {
        console.error('Registro falhou', error);
      }
    });
  }
}