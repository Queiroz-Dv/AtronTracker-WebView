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
import { ModuloService } from '../modulos/services/modulo.service';
import { ModuloItem } from '../../shared/utils/modulo-functions.util';

@Component({
  standalone: true,
  selector: 'c-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  imports: [MaterialContainerModule, SharedModule, RouterModule]
})
export class DashboardComponent implements OnInit {
  constructor(private router: Router, private moduloService: ModuloService, private acessoService: AcessoService, private visualizacaoService: VisualizacaoService) { }

  ngOnInit() {
    this.moduloService.obterTodos().subscribe(modulos => {
      const modulosAcessiveis = this.acessoService.getModulosAcessiveisDoUsuario();
      this.cardsView = modulos
        .filter(modulo => modulosAcessiveis.includes(modulo.codigo)) // Filter only accessible modules
        .map(modulo => {
          const moduloItem = new ModuloItem(modulo.codigo);
          return {
            code: modulo.codigo,
            title: modulo.descricao,
            icon: moduloItem.icone || 'default-icon', // Use utility function for icon
            description: moduloItem.descricao || 'Descrição não disponível', // Provide a default description
            route: moduloItem.rota, // Use utility function for route
            cols: 1,
            rows: 1
          };
        });
    });
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
    return this.cardsView;
  }

  trocarVisualizacao() {
    this.visualizacaoService.setViewMode('menu');
    this.router.navigate(['/atron/home']);
  }

  authToken: string = 'authToken'; // Define the authToken property
  usuarioTempData: string = 'usuarioTempData'; // Define the usuarioTempData property

  logout() {
    this.acessoService.logout().subscribe(() => {
      localStorage.removeItem(this.authToken);
      localStorage.removeItem(this.usuarioTempData);
      this.acessoService.credentialUserSource.next(null);
      this.acessoService.credentialUserSource.complete();
      this.router.navigate(['/login']);
    });
  }
}