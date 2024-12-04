import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthentificateurComponent } from 'src/app/authentificateur/authentificateur.component';
import { TodoListComponent } from 'src/app/todo-list/todo-list.component';
import { authGuard } from './services/authguard.guard';

const routes: Routes = [
  {
    path: 'todo-list',
    component: TodoListComponent,
    pathMatch: 'full',
    canActivate: [authGuard]
  },
  {
    path: 'auth',
    component: AuthentificateurComponent,
    pathMatch: 'full'
  },
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'auth',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
