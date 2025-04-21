import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { SalarioService } from '../../services/salario.service';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/modules/shared.module';
import { SalarioViewData } from '../../models/salario-view-data.model';
import { formatLabel } from '../../../../shared/utils/formatar-label.util';
import { BotaoVoltarComponent } from "../../../../core/layout/botao-voltar/botao-voltar.component";

@Component({
  selector: 'c-salario-view',
  templateUrl: './salario-view.component.html',
  imports: [ReactiveFormsModule, SharedModule, BotaoVoltarComponent],
})

export class SalarioViewComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatTable) table!: MatTable<SalarioViewData>;
  dataSource = new MatTableDataSource<SalarioViewData>([]);
  route = inject(ActivatedRoute);

  colunas = ['usuario', 'cargo', 'departamento', 'salario', 'acoes'];

  constructor(
    private service: SalarioService,
    public router: Router) { }

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.service.listar().subscribe(salarios => {
      const salariosViewData: SalarioViewData[] = salarios.map(salario => ({
        id: salario.id,
        usuarioDescricao: `${salario.usuario.codigo} - ${salario.usuario.nome} ${salario.usuario.sobrenome}`,
        cargoDescricao: formatLabel(salario.usuario.cargo?.codigo, salario.usuario.cargo?.descricao),
        departamentoDescricao: formatLabel(salario.usuario.departamento?.codigo, salario.usuario.departamento?.descricao),
        salarioMensal: salario.salarioMensal
      }));

      this.dataSource = new MatTableDataSource(salariosViewData);
      this.dataSource.paginator = this.paginator;
      this.table.dataSource = this.dataSource;
    });
  }

  editar(id: number): void {
    this.router.navigate(['atron/salarios/editar', id]);
  }

  excluir(id: number): void {
    if (confirm('Deseja realmente excluir?')) {
      this.service.deletar(id).subscribe(() => this.carregar());
    }
  }
}
