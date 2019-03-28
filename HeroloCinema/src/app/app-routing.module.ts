import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MoviesComponent } from './movies/movies.component';
import {MovieDetailsComponent} from './movies/movie-details/movie-details.component'
import{AuthGuard} from './auth/auth.guard'



const routes: Routes = [
  {path: '', component: MoviesComponent},
  {path: 'movies', component: MoviesComponent},
  {path: 'movie-details', component: MovieDetailsComponent, canActivate : [AuthGuard]}




];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
