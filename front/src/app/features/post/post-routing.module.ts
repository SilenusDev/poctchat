// src/app/features/post/post-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormComponent } from './components/form/form.component';
import { DetailComponent } from './components/detail/detail.component';
import { ListComponent } from './components/list/list.component';

const routes: Routes = [
  { title: 'Posts', path: '', component: ListComponent }, // Route pour /posts
  { title: 'Posts - detail', path: 'detail/:id', component: DetailComponent }, // Route pour /posts/detail/:id
  { title: 'Posts - create', path: 'create', component: FormComponent }, // Route pour /posts/create
];

@NgModule({
  imports: [RouterModule.forChild(routes)], // Utilisez forChild pour les modules enfants
  exports: [RouterModule],
})
export class PostRoutingModule {}