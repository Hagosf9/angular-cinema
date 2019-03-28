import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

import { MovieDetailedModel } from '../../dataModel/movieDetailed.model';
import { ModalDService } from '../../services/modal.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { GenreModel } from '../../dataModel/genre.model'
import { Router } from '@angular/router';


@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.css']
})
export class MovieDetailsComponent implements OnInit {
  editForm: FormGroup;
  movieDetails: MovieDetailedModel;
  movieList: MovieDetailedModel[];
  genreList: string[] = new Array;
  submitted = false;
  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};
  isSaved: boolean = false;
  isExistName : boolean = true;
  tempt:string = '';

  constructor(private modalDService: ModalDService, private formBuilder: FormBuilder,
    private modalService: NgbModal, private _location: Location, modalConfig: NgbModalConfig,
    private rt: Router) {

    modalConfig.backdrop = 'static';
    modalConfig.keyboard = false;
  }

  ngOnInit() {

    if (sessionStorage.getItem('genresList')) {
      this.getGeners();
      this.setDropDList();
      this.setDropDown();
      this.movieDetails = this.modalDService.movieDCopy;
      this.movieDetails = this.modalDService.movieDCopy;
      this.movieList = JSON.parse(sessionStorage.getItem('moviesList'));
      this.getSelectedGenres();
      
      this.editForm = this.formBuilder.group({
        filmName: ['',[Validators.required, Validators.pattern('[a-zA-Z ]*')]],
        id: ['', Validators.required],
        year: ['', Validators.required],
        runTime: ['', Validators.required],
        genre: ['', Validators.required],
        director: ['', Validators.required]
      }, {
        });
    }
  }
  get f() { return this.editForm.controls; }


  openEditM(content) {
    this.tempt = this.movieDetails.title;
    this.modalService.open(content, { centered: true, size: 'lg' });
  }
  openDeleteM(content) {
    this.modalService.open(content, { size: 'sm' });
  }

  validate(movie: string): boolean {
    let isValid = (!this.checkIfExist(movie)) && this.movieDetails.title != '' && this.movieDetails.id != '' &&
      (Number(this.movieDetails.release_date) > 1000 && Number(this.movieDetails.release_date) < 2020) &&
      Number(this.movieDetails.runtime) > 0 && Number(this.movieDetails.runtime) < 1000 &&
       this.movieDetails.genres.length > 0 && this.isItAbcInput(this.movieDetails.title);
    if (isValid)
      return true;
    return false;
  }
  checkIfExist(movieT: string): boolean {
    let temp: MovieDetailedModel[] = JSON.parse(sessionStorage.getItem('moviesList'));
    console.log(movieT);
    temp.forEach(element => {
      if(element.title ===movieT && movieT!=this.tempt)
      return true;
    });
    return false;
  }

  getGeners() {
    let tempG = JSON.parse(sessionStorage.getItem('genresList'));
    for (const key in tempG) {
      this.genreList.push(key, tempG[key])

    }
  }

  setDropDList() {
    for (let i = 0; i < this.genreList[1].length; i++) {
      this.dropdownList[i] = this.genreList[1][i];
    }
  }


  getSelectedGenres() {
    this.selectedItems.splice(0, this.selectedItems.length)
    this.movieDetails.genres.forEach(object => {
      this.selectedItems.push(object);

    });
  }

  setDropDown() {
    this.dropdownSettings = {
      singleSelection: false,
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 4,
      allowSearchFilter: true,
      maxHeight: 800,
      disabled: false
    };
  }
  onItemSelect(item: any) {
    this.movieDetails.genres.push(item);
  }

  onItemDeSelect(item: GenreModel) {
    let index = this.movieDetails.genres.findIndex(genre => genre.id == item.id);
    this.movieDetails.genres.splice(index, 1);
  }
  onSelectAll(items: any) {
    this.movieDetails.genres.splice(0, this.movieDetails.genres.length);
    this.dropdownList.forEach(element => {
      this.movieDetails.genres.push(element);
    });

  }

  onDeSelectAll(items: any) {
    this.movieDetails.genres.splice(0, this.movieDetails.genres.length);

  }

  counter(i: string) {
    return new Array(Math.trunc(Number(i) / 2));
  }
  restCounter(i: string) {
    return new Array(Math.trunc((10 - Number(i)) / 2) + 1);
  }
  backClicked() {

    this.rt.navigate(['./movies']);
  }
  save() {
    this.isSaved = true;
    this.modalDService.movieDCopy = this.movieDetails;
    this.movieList = this.movieList.filter(movie => movie.id != this.movieDetails.id);
    this.movieList.push(this.movieDetails);
    sessionStorage.setItem('moviesList', JSON.stringify(this.movieList));
    this.modalDService.moviesList = this.movieList;
  }
  cancel(movieId: string) {
    this.movieDetails = this.modalDService.cancel();
    this.getSelectedGenres();
  }
  deleteM() {
    this.modalDService.deleteMovie(this.movieDetails);
  }
  isItAbcInput(input : string) {
    var letters = /^[A-Za-z]+$/;
    if (input.match(letters))
      return true;
    return false;
  
}
}
