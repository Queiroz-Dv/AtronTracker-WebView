import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { CargoService } from '../../services/cargo.service';
import { ReactiveFormsModule } from '@angular/forms';
import { DepartamentosService } from '../../../departamentos/services/departamentos.service';
import { SharedModule } from '../../../../shared/modules/shared.module';
import { Departamento } from '../../../departamentos/models/departamento.model';
import { CargoModel } from '../../models/cargo.model';
import { BotaoVoltarComponent } from "../../../../core/layout/botao-voltar/botao-voltar.component";

@Component({
  selector: 'c-cargos-view',
  templateUrl: './cargo-view.component.html',
  imports: [ReactiveFormsModule, SharedModule, BotaoVoltarComponent],
})
export class CargosViewComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatTable) table!: MatTable<CargoModel>;
  dataSource = new MatTableDataSource<CargoModel>([]);
  route = inject(ActivatedRoute);
  departamentos: Departamento[] = [];
  colunas = ['codigo', 'descricao', 'departamento', 'acoes'];

  constructor(private cargoService: CargoService,
    private departamentoService: DepartamentosService,
    public router: Router) { }

  ngAfterViewInit(): void {
    this.departamentoService.obterTodos().subscribe(deps => {
      this.departamentos = deps;
      this.carregar();
    });
  }

  carregar() {
    this.cargoService.obterTodos().subscribe(crg => {
      this.dataSource = new MatTableDataSource(crg);
      this.dataSource.paginator = this.paginator;
      this.table.dataSource = this.dataSource;
    });
  }

  editar(codigo: string): void {
    this.router.navigate(['atron/cargos/editar', codigo]);
  }

  excluir(codigo: string): void {
    if (confirm('Deseja realmente excluir?')) {
      this.cargoService.deletar(codigo).subscribe(() => this.carregar());
    }
  }
}