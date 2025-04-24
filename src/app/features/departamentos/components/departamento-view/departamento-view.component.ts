import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { DepartamentosService } from '../../services/departamentos.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
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
export class DepartamentoViewComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource: MatTableDataSource<Departamento>;
  route = inject(ActivatedRoute);
  colunas = ['codigo', 'descricao', 'acoes'];

  constructor(private service: DepartamentosService, public router: Router) { }

  ngAfterViewInit() {
    this.carregar();
  }

  carregar() {
    this.service.obterTodos().subscribe(entidades => {
      this.dataSource = new MatTableDataSource(entidades);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
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
