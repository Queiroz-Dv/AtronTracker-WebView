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
import { MatDialog } from '@angular/material/dialog'; 
import { ConfirmacaoDialogComponent, ConfirmacaoDialogData } from '../../../../shared/components/confirmacao-dialog/confirmacao-dialog.component'; 
import { filter, switchMap } from 'rxjs/operators'; 
import { NotificacaoService, Mensagem, Nivel } from '../../../../core/services/notification.service';

@Component({
  selector: 'c-departamento-view',
  imports: [ReactiveFormsModule, SharedModule, BotaoVoltarComponent],
  standalone: true,
  templateUrl: './departamento-view.component.html',
  styleUrls: ['../../departamentos.component.css']
})

export class DepartamentoViewComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource: MatTableDataSource<Departamento> = new MatTableDataSource(); 
  route = inject(ActivatedRoute);
  colunas = ['codigo', 'descricao', 'acoes'];

  constructor(
private service: DepartamentosService, 
public router: Router,
private dialog: MatDialog, 
private notificacaoService: NotificacaoService
) { }

  ngAfterViewInit() {
    this.carregar();
  }

  carregar() {
    this.service.obterTodos().subscribe(entidades => {
      this.dataSource.data = entidades;
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
    const departamento = this.dataSource.data.find(d => d.codigo === codigo);
    const nomeDepartamento = departamento ? `${departamento.codigo} - ${departamento.descricao}` : `o registro ${codigo}`;

    const dialogData: ConfirmacaoDialogData = {
      titulo: 'Confirmar Exclusão',
      mensagem: `Tem certeza que deseja excluir ${nomeDepartamento}?`,
      textoBotaoConfirmar: 'Excluir',
      textoBotaoCancelar: 'Cancelar'
    };

    const dialogRef = this.dialog.open(ConfirmacaoDialogComponent, {
      width: '500px', 
      data: dialogData
    });

    dialogRef.afterClosed().pipe(
      filter(resultado => resultado === true),      
      switchMap(() => this.service.deletar(codigo))
    ).subscribe({
      next: (resposta: Mensagem[]) => {
        this.notificacaoService.exibirMensagens(resposta);
        this.carregar(); 
      },
      error: (erro: any) => {           
        if (erro && erro.mensagensApi) {
          this.notificacaoService.exibirMensagens(erro.mensagensApi);
        } else {
          this.notificacaoService.exibirMensagem('Ocorreu um erro ao tentar excluir o registro.', Nivel.Error);
        }
      }
    });
  }
}