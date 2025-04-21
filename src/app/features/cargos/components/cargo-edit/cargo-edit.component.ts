import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CargoService } from '../../services/cargo.service';
import { DepartamentosService } from '../../../departamentos/services/departamentos.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CargoFormComponent } from "../cargo-form/cargo-form.component";
import { SharedModule } from '../../../../shared/modules/shared.module';
import { Departamento } from '../../../departamentos/models/departamento.model';
import { CargoRequest } from '../../models/request/cargo-request.model';

@Component({
  selector: 'c-cargo-edit',
  imports: [ReactiveFormsModule, SharedModule, CargoFormComponent],
  templateUrl: './cargo-edit.component.html',
})

export class CargoEditComponent implements OnInit {
  form!: FormGroup;
  departamentos!: Departamento[];
  codigo?: string | number;

  constructor(
    private fb: FormBuilder,
    private service: CargoService,
    private departamentoService: DepartamentosService,
    private route: ActivatedRoute,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      codigo: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      descricao: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      departamentoCodigo: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]]
    });

    this.departamentoService.obterTodos().subscribe(dpt => this.departamentos = dpt);

    this.codigo = this.route.snapshot.paramMap.get('codigo');
    if (this.codigo) {
      this.form.get('codigo')?.disable();
      this.service.obterPorCodigo(this.codigo).subscribe(cargo => {
        this.form.patchValue(cargo);
      });
    }
  }

  async salvar() {
    const dadosForm = this.form.getRawValue();
    const cargosPayload = new CargoRequest(dadosForm.codigo, dadosForm.descricao, dadosForm.departamentoCodigo);

    const response = this.codigo
      ? this.service.atualizar(this.codigo, cargosPayload)
      : this.service.gravar(cargosPayload);

    response.subscribe(() => this.router.navigate(['atron/cargos']));
  }
}