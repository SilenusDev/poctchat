// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { AuthGuard } from './guards/auth.guard';
import { UnauthGuard } from './guards/unauth.guard';
import { EnterComponent } from './components/enter/enter.component';
import { HomeComponent } from './components/home/home.component';
import { MeComponent } from './components/me/me.component';
import { SubjectComponent } from './components/subject/subject.component';

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard], pathMatch: 'full' },
  { path: 'enter', component: EnterComponent, canActivate: [UnauthGuard] },
  {
    path: 'posts', // Préfixe pour les routes du module Posts
    loadChildren: () => import('./features/post/post.module').then(m => m.PostsModule), // Charge le PostsModule
    canActivate: [AuthGuard], // Protégé par AuthGuard
  },
  { path: 'me', component: MeComponent, canActivate: [AuthGuard] },
  { path: 'subjects', component: SubjectComponent, canActivate: [AuthGuard] },
  { path: '', loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule) },
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '404' }, // Redirige vers la page 404 pour les routes inconnues
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}