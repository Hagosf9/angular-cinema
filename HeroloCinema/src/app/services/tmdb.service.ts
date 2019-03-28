import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { MovieDetailedModel } from '../dataModel/movieDetailed.model';
import { DiscoverModel } from '../dataModel/discover.model';
import { MovieModel } from '../dataModel/movie.model';
import { MovieCreditModel } from '../dataModel/movieCredit.model';


@Injectable({
  providedIn: 'root'
})
export class TmdbService {
  private api_key = '9ee82a95315c563b8d277066f4ee9201';
  private url_discover = 'https://api.themoviedb.org/3/discover/movie?api_key=';
  private url_movie = 'https://api.themoviedb.org/3/movie/';
  private url_genre = 'https://api.themoviedb.org/3/genre/movie/list';
  private url_credits = 'https://api.themoviedb.org/3/movie/';
  private _newMovieId : number = 1;

  
  public get newMovieId() : number {
    return this._newMovieId;
  }
  public set newMovieId(v : number) {
    this._newMovieId++;
  }
  
  
  private _currentPage : number = 1;
  public get currentPage() : number {
    return this._currentPage;
  }
  public set currentPage(v : number) {
    this._currentPage = v;
  }
  

  constructor(private http: HttpClient) { }

  getMovieGenres(params: HttpParams): Observable<object> {
    return this.http.get<object>(
      this.url_genre + '?api_key=' + this.api_key, { params }).pipe(
        retry(1),
       catchError(this.handleError)
      );
  }

  isGenresExists() : boolean{
    if(sessionStorage.getItem('genres')) return true;
    return false;
  }

  getMovieDiscover(lang: string, srt: string, p: Number): Observable<DiscoverModel> {
    return this.http.get<DiscoverModel>(
      
      this.url_discover + this.api_key + '&language=' + lang + '&sort_by=' + srt + '&include_adult=true&include_video=false&page=' + p).pipe(
        retry(1),
       catchError(this.handleError)
      );;

  }

  getMovieDetails(movie: MovieModel): Observable<MovieDetailedModel> {
    return this.http.get<MovieDetailedModel>(
      this.url_movie + movie.id + '?api_key=' + this.api_key).pipe(
        retry(1),
       catchError(this.handleError)
      );;

  }

  getMovieCredits(movieId: string): Observable<MovieCreditModel> {
    return this.http.get<MovieCreditModel>(
      this.url_credits + movieId + '/credits?api_key=' + this.api_key).pipe(
        retry(1),
       catchError(this.handleError)
      );;

  }

  isEOPage(): boolean {

    const pageButtom = document.documentElement.scrollHeight;
    if (window.pageYOffset + window.innerHeight >= pageButtom-(window.innerHeight/2))
      return true;
    return false;
  }

  setGenreList(genreList: object) {
    sessionStorage.setItem('genresList', JSON.stringify(genreList))
  }


handleError(error) {
  let errorMessage = '';
  if (error.error instanceof ErrorEvent) {
    errorMessage = `Error: ${error.error.message}`;
  } else {
    errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
  }
  window.alert(errorMessage);
  return throwError(errorMessage);
}
}
