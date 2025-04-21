import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { DepartamentosService } from '../../services/departamentos.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/modules/shared.module';
import { Departamento } from '../../models/departamento.model';
import { BotaoVoltarComponent } from "../../../../core/layout/botao-voltar/botao-voltar.component";

@Component({
  selector: 'c-departamento-view',
  imports: [ReactiveFormsModule, SharedModule, BotaoVoltarComponent],
  templateUrl: './departamento-view.component.html',
  styleUrls: ['../../departamentos.component.css']
})
export class DepartamentoViewComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<Departamento>;
  dataSource = new MatTableDataSource<Departamento>([]);
  route = inject(ActivatedRoute);
  colunas = ['codigo', 'descricao', 'acoes'];

  constructor(private service: DepartamentosService, public router: Router) { }

  ngOnInit(): void {
    this.carregar();
  }

  carregar() {
    this.service.obterTodos().subscribe(entidades => {
      this.dataSource = new MatTableDataSource(entidades);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.table.dataSource = this.dataSource;
    });
  }

  editar(codigo: string): void {
    this.router.navigate(['atron/departamentos/editar', codigo]);
  }

  excluir(codigo: string): void {
    if (confirm('Confirma a exclusão?')) {
      this.service.deletar(codigo).subscribe(() => this.carregar());
    }
  }
}
