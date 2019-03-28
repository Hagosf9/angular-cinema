import { Injectable } from '@angular/core';
import { MovieDetailedModel } from '../dataModel/movieDetailed.model'


@Injectable({
  providedIn: 'root'
})
export class ModalDService {

  public _movieD: MovieDetailedModel;
  private _moviesList: MovieDetailedModel[] = new Array;
  private _movieDCopy: MovieDetailedModel;


  public get movieDCopy(): MovieDetailedModel {
    return this._movieDCopy;
  }


  public set movieDCopy(v: MovieDetailedModel) {
    this._movieD = JSON.parse(JSON.stringify(v));
    this._movieDCopy = v;
  }


  public get moviesList(): MovieDetailedModel[] {

    if (this._moviesList.length == 0)
      return JSON.parse(sessionStorage.getItem('moviesList'));
    else
      return JSON.parse(JSON.stringify(this._moviesList));

  }


  public set moviesList(v: MovieDetailedModel[]) {
    if (this._movieD && this._moviesList.length != 0) {
      let tempList = JSON.parse(sessionStorage.getItem('moviesList'));
      this._moviesList = this._moviesList.filter(movie=>movie.id !== this._movieD.id);
      this._moviesList.push(tempList.filter(movie=>movie.id ==this._movieD.id )[0])          
    }
    else {
      this._moviesList = v;
      sessionStorage.setItem('moviesList', JSON.stringify(this._moviesList));
    }
  }

  deleteMovie(v: MovieDetailedModel) {
    this._moviesList.splice(this._moviesList.indexOf(v), 1);
    localStorage.setItem(v.title, v.id);
  }


  cancel(): MovieDetailedModel {
    this.moviesList = JSON.parse(sessionStorage.getItem('moviesList'));
    this._movieDCopy = this._movieD;
    return this.moviesList.filter(movie=>movie.id == this._movieDCopy.id)[0];
  }

  
  saveList(movieD: MovieDetailedModel) {
    this._moviesList.filter(movie => movie.id == movieD.id)[0] = JSON.parse(JSON.stringify(movieD));
    let tempMList: MovieDetailedModel[] = JSON.parse(sessionStorage.getItem('moviesList'));
    tempMList.filter(movie => movie.id == movieD.id).pop();
    tempMList.push(movieD);
    sessionStorage.setItem('moviesList', JSON.stringify(tempMList));
  }

  constructor() { }


}
