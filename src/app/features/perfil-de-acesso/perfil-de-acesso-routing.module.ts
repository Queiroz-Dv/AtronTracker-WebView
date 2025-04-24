import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { PerfilDeAcessoEditComponent } from "./components/perfil-de-acesso-edit/perfil-de-acesso-edit.component";
import { PerfilDeAcessoViewComponent } from "./components/perfil-de-acesso-view/perfil-de-acesso-view.component";

const PERFIL_ROUTES: Routes = [
  { path: '', component: PerfilDeAcessoViewComponent },
  { path: 'novo', component: PerfilDeAcessoEditComponent },
  { path: 'editar/:codigo', component: PerfilDeAcessoEditComponent },
];

@NgModule({
  imports: [RouterModule.forChild(PERFIL_ROUTES)],
  exports: [RouterModule],
})

export class PerfilRoutingModule { } 