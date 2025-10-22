import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ControlErrorComponent } from '../../../../shared/components/control-error/control-error.component';
import { CargoService } from '../../../cargos/services/cargo.service';
import { DepartamentosService } from '../../../departamentos/services/departamentos.service';
import { SharedModule } from '../../../../shared/modules/shared.module';
import { Departamento } from '../../../departamentos/models/departamento.model';
import { CargoModel } from '../../../cargos/models/cargo.model';
import { CargoResponse } from '../../../cargos/models/response/cargo-response.model';

@Component({
  selector: 'c-usuario-form',
  imports: [SharedModule, ReactiveFormsModule, ControlErrorComponent],
  templateUrl: './usuario-form.component.html',
})

export class UsuarioFormComponent implements OnInit {
  @Input() usuarioForm!: FormGroup;

  // Controles individuais para autocomplete
  departamentoControl = new FormControl<string | Departamento>('');
  cargoControl = new FormControl<string | CargoResponse | CargoModel>('');

  // Dados para os selects
  departamentos: Departamento[] = [];
  cargos: CargoResponse[] = [];

  // Backup dos dados originais
  todosDepartamentos: Departamento[] = [];
  todosCargos: CargoResponse[] = [];

  constructor(
    private cargoService: CargoService,
    private departamentoService: DepartamentosService
  ) { }

  ngOnInit(): void {
    this.departamentoService.obterTodos().subscribe(deps => {
      this.todosDepartamentos = deps;
      this.departamentos = this.todosDepartamentos;

      const dptCodigo = this.usuarioForm.get('departamentoCodigo')?.value;
      const selecionado = this.todosDepartamentos.find(d => d.codigo === dptCodigo);
      this.departamentoControl.setValue(selecionado || '');
    });

    this.cargoService.obterTodos().subscribe(crgs => {
      this.todosCargos = crgs;
      this.cargos = this.todosCargos;

      const cargoCodigo = this.usuarioForm.get('cargoCodigo')?.value;
      const selecionado = this.todosCargos.find(c => c.codigo === cargoCodigo);
      this.cargoControl.setValue(selecionado || '');
    });

    this.departamentoControl.valueChanges.subscribe(value => {
      const departamento = value as Departamento;

      if (departamento) {
        // Filtra cargos com base no departamento selecionado
        this.cargos = this.todosCargos.filter(c => c.departamentoCodigo === departamento.codigo);

        this.usuarioForm.patchValue({
          departamentoCodigo: departamento.codigo
        });
      } else {
        this.usuarioForm.patchValue({ departamentoCodigo: null });
        this.cargos = this.todosCargos;
      }
    });

    this.cargoControl.valueChanges.subscribe(value => {
      const cargo = value as CargoModel;

      if (cargo) {
        // Filtra departamentos com base no cargo selecionado
        this.departamentos = this.todosDepartamentos.filter(d => d.codigo === cargo.departamentoCodigo);

        this.usuarioForm.patchValue({
          cargoCodigo: cargo.codigo
        });
      } else {
        this.usuarioForm.patchValue({ cargoCodigo: null });
        this.departamentos = this.todosDepartamentos;
      }
    });
  }

  exibirDepartamentoDescricao = (dpt: Departamento) => dpt?.descricao ?? '';
  exibirCargoDescricao = (crg: CargoModel) => crg?.descricao ?? '';
}