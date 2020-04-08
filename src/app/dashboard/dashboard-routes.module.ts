import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Componentes
import { DashboardComponent } from './dashboard.component';
import { dashboardRoutes } from './dashboard.routes';
// import { AuthGuard } from './services/auth.guard';


const rutasHijas: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: dashboardRoutes
  }
];



@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild( rutasHijas )
  ],
  exports: [
    RouterModule
  ]
})
export class DashboardRoutesModule { }
