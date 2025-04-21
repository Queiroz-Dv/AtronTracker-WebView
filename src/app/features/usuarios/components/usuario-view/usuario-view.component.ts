import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedModule } from '../../../../shared/modules/shared.module';
import { UsuarioService } from '../../services/usuario.service';
import { ReactiveFormsModule } from '@angular/forms';
import { formatLabel } from '../../../../shared/utils/formatar-label.util';
import { BotaoVoltarComponent } from "../../../../core/layout/botao-voltar/botao-voltar.component";

class UsuarioViewData {
  codigoOriginal: string;
  codigo: string;
  cargo: string;
  departamento: string;
}

@Component({
  selector: 'c-usuario-view',
  templateUrl: './usuario-view.component.html',
  imports: [SharedModule, ReactiveFormsModule, BotaoVoltarComponent],
})
export class UsuarioViewComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatTable) table!: MatTable<UsuarioViewData>;
  dataSource = new MatTableDataSource<UsuarioViewData>();
  route = inject(ActivatedRoute);
  colunas = ['codigo', 'cargo', 'departamento', 'acoes'];

  constructor(private service: UsuarioService, public router: Router) { }

  ngAfterViewInit(): void {
    this.carregar();
  }

  carregar() {
    this.service.obterTodosUsuariosInformados().subscribe(usuarios => {

      const usuarioViewData = usuarios.map(usr => ({
        codigoOriginal: usr.codigo,
        codigo: `${usr.codigo} - ${usr.nome} ${usr.sobrenome}`,
        cargo: formatLabel(usr.cargo?.codigo, usr.cargo?.descricao),
        departamento: formatLabel(usr.departamento?.codigo, usr.departamento?.descricao)
      }));

      this.dataSource = new MatTableDataSource(usuarioViewData);
      this.dataSource.paginator = this.paginator;
      this.table.dataSource = this.dataSource;
    })
  }

  editar(codigo: string): void {
    this.router.navigate(['atron/usuarios/editar', codigo]);
  }

  excluir(codigo: string): void {
    if (confirm('Deseja realmente excluir?')) {
      this.service.deletar(codigo).subscribe(() => this.carregar());
    }
  }
}

