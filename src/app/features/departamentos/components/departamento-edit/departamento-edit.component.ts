import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DepartamentosService } from '../../services/departamentos.service';
import { DepartamentoFormComponent } from "../departamento-form/departamento-form.component";
import { SharedModule } from '../../../../shared/modules/shared.module';
import { Departamento } from '../../models/departamento.model';

@Component({
  standalone: true,
  selector: 'c-departamento-edit',
  imports: [DepartamentoFormComponent, ReactiveFormsModule, SharedModule],
  templateUrl: './departamento-edit.component.html',
})

export class DepartamentoEditComponent implements OnInit {
  form!: FormGroup;
  codigo?: string | number;

  constructor(
    private fb: FormBuilder,
    private service: DepartamentosService,
    private route: ActivatedRoute,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      codigo: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      descricao: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]]
    });

    this.codigo = this.route.snapshot.paramMap.get('codigo');
    if (this.codigo) {
      this.form.get('codigo')?.disable();
      this.service.obterPorCodigo(this.codigo).subscribe(dep => this.form.patchValue(dep));
    }
  }

  async salvar() {
    const dadosForm = this.form.getRawValue();
    const departamentoPayload = new Departamento(dadosForm.codigo, dadosForm.descricao);

    const request = this.codigo
      ? this.service.atualizar(this.codigo, departamentoPayload)
      : this.service.gravar(departamentoPayload);

    (request as import('rxjs').Observable<any>).subscribe(() => this.router.navigate(['atron/departamentos']));
  }
}