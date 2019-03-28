import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MoviesComponent } from './movies/movies.component';
import { MovieDetailsComponent } from './movies/movie-details/movie-details.component';
import{TmdbService} from './services/tmdb.service';
import {NgbModule,NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AuthGuard } from './auth/auth.guard';
import { AngularFireModule } from '@angular/fire';  
import { environment } from '../environments/environment';


@NgModule({
  declarations: [
    AppComponent,
    MoviesComponent,
    MovieDetailsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebase)
  ],
  providers: [TmdbService,AuthGuard],
  bootstrap: [AppComponent],
  entryComponents: [
    MovieDetailsComponent
  ]
})
export class AppModule { }
