import { Component, inject, OnInit } from '@angular/core';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { DashboardCard } from '../../core/layout/models/dashboardCard';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { MaterialContainerModule } from '../../material-container.module';
import { SharedModule } from '../../shared/modules/shared.module';
import { AcessoService } from '../acesso/login/services/acesso.service';
import { VisualizacaoService } from '../../core/services/visualizacao-service';

@Component({
  standalone: true,
  selector: 'c-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  imports: [MaterialContainerModule, SharedModule, RouterModule]
})
export class DashboardComponent implements OnInit {

  constructor(private router: Router, private acessoService: AcessoService, private visualizacaoService: VisualizacaoService) { }

  ngOnInit() {
    this.setCardsForView()
  }

  navigate(route: string) {
    this.router.navigateByUrl(route);
  }
  private breakpointObserver = inject(BreakpointObserver);

  cardsView: DashboardCard[] = [];

  setCardsForView() {
    this.cards.subscribe(cards => {
      this.cardsView = cards;
    });
  }

  cards: Observable<DashboardCard[]> = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => this.getCards(matches))
  );

  private getCards(isHandset: boolean): DashboardCard[] {
    const baseCards: DashboardCard[] = [
      {
        code: 'DPT',
        title: 'Departamentos',
        icon: 'business', // ou 'fa-solid fa-building'
        description: 'Gerencie os departamentos da empresa.',
        route: '/atron/departamentos',
        cols: 1,
        rows: 1
      },
      {
        code: 'CRG',
        title: 'Cargos',
        icon: 'work', // ou 'fa-solid fa-briefcase'
        description: 'Gerencie os cargos da empresa.',
        route: '/atron/cargos',
        cols: 1,
        rows: 1
      },
      {
        code: 'USR',
        title: 'Usuários',
        icon: 'group', // ou 'fa-solid fa-users'
        description: 'Gerencie os colaboradores da empresa.',
        route: '/atron/usuarios',
        cols: 1,
        rows: 1
      },
      {
        code: 'TAR',
        title: 'Tarefas',
        icon: 'checklist', // ou 'fa-solid fa-list-check'
        description: 'Gerencie as tarefas da empresa.',
        route: '/atron/tarefas',
        cols: isHandset ? 1 : 1,
        rows: isHandset ? 1 : 1
      },
      {
        code: 'SAL',
        title: 'Salários',
        icon: 'attach_money', // ou 'fa-solid fa-money-bill'
        description: 'Gerencie o salário da empresa.',
        route: '/atron/salarios',
        cols: 1,
        rows: 1
      },
      {
        code: 'PAC',
        title: 'Políticas e Acessos',
        icon: 'tune', // ou 'fa-solid fa-sliders'
        description: 'Gerencie as políticas de acesso do sistema.',
        route: '/atron/politicas-e-acessos',
        cols: 1,
        rows: 1
      }
    ];

    // Em handset, todos 1x1; em desktop, 3 colunas de 1x1
    return baseCards;

  }

  trocarVisualizacao() {
    this.visualizacaoService.setViewMode('menu');
    this.router.navigate(['/atron/home']);
  }

  logout() {
    this.acessoService.logout();
    this.router.navigate(['login']);
  }
}