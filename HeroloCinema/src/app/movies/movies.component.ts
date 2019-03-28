import { Component, OnInit } from '@angular/core';
import { HttpParams } from "@angular/common/http";
import { Router } from '@angular/router';

import { MovieModel } from '../dataModel/movie.model';
import { DiscoverModel } from '../dataModel/discover.model';
import { MovieDetailedModel } from '../dataModel/movieDetailed.model';
import { MovieCreditModel } from '../dataModel/movieCredit.model';
import { GenreModel } from '../dataModel/genre.model';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { TmdbService } from '../services/tmdb.service';
import { ModalDService } from '../services/modal.service';
import { specialFilter } from './movie-details/pipeFilter'

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.css']
})


export class MoviesComponent implements OnInit {
  newMForm: FormGroup;
  page: number = 1;
  language: string = 'en-US';
  movies: MovieModel[];
  moviesDetailsAll: MovieDetailedModel[] = new Array;
  moviesDetails: MovieDetailedModel[] = new Array;
  newMovieDetails: object = new Object
  discList: DiscoverModel;
  credit: MovieCreditModel;
  orderBy = 'vote_count.desc';
  paramsGenreList = new HttpParams()
    .set('language', 'en-US');
  genreList: string[] = new Array;
  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};
  isExistName: boolean = true;
  filter = new specialFilter();



  constructor(private tmdbService: TmdbService, private modalDService: ModalDService,
    private rt: Router, private formBuilder: FormBuilder, private modalService: NgbModal, ) { }

  ngOnInit() {
    if (this.tmdbService.currentPage == 1) {
      this.discover();

    }
    else {
      this.moviesDetails = this.modalDService.moviesList;
      this.moviesDetailsAll = this.modalDService.moviesList;
    }
    if (!this.tmdbService.isGenresExists())
      this.tmdbService.getMovieGenres(this.paramsGenreList).subscribe((genres) => {
        this.tmdbService.setGenreList(genres);
        this.newMovieDetails['genres'] = new Array();
        this.getGeners();
        this.setDropDList();
        this.setDropDown();
      });

    this.newMForm = this.formBuilder.group({
      filmName: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      id: ['', Validators.required],
      year: ['', Validators.required],
      runTime: ['', [Validators.required, Validators.email]],
      genre: ['', [Validators.required, Validators.minLength(6)]],
      director: ['', Validators.required]
    }, {
      });
  }

  discover() {
    if (this.page === 1 || this.tmdbService.currentPage <= Number(this.discList.total_pages)) {
      this.tmdbService.getMovieDiscover(this.language, this.orderBy, this.tmdbService.currentPage).subscribe((movies) => {
        this.discList = movies;
        this.movies = this.discList.results;
        this.movies.forEach(movie => {
          this.getMoviesDetails(movie);
          this.getMovieCredits(movie.id);
        });
        this.tmdbService.currentPage += 1;
      });
    }
    this.modalDService.moviesList = this.moviesDetailsAll;

  }

  getMoviesDetails(movie: MovieModel) {
    if (!localStorage.getItem(movie.title)) {
      this.tmdbService.getMovieDetails(movie).subscribe((details) => {
        details.title = this.filter.transform(details.title)
        this.moviesDetails.push(details);
        this.moviesDetailsAll.push(details);
        let relDate: string = this.moviesDetails[this.moviesDetails.length - 1].release_date;
        this.moviesDetails[this.moviesDetails.length - 1].release_date = relDate.slice(0, 4);
      });
    }
  }

  getMovieCredits(movieId: string) {
    this.tmdbService.getMovieCredits(movieId).subscribe((movieCredits) => {
      this.credit = movieCredits;
      if (this.moviesDetails.filter(Movie => Movie.id === movieCredits.id)[0] != undefined)
        this.moviesDetails.filter(Movie => Movie.id === movieCredits.id)[0].directorName =
          this.credit.crew.filter(Crew => Crew.job === 'Director')[0].name;
    });
  }
  counter(i: string) {
    return new Array(Math.trunc(Number(i) / 2));
  }
  restCounter(i: string) {
    return new Array(Math.trunc((10 - Number(i)) / 2) + 1);
  }

  open(movieD: string) {
    if (this.moviesDetails === undefined)
      this.moviesDetails = JSON.parse(sessionStorage.getItem('moviesList'));
    this.modalDService.movieDCopy = this.moviesDetails.filter(movie => movie.id == movieD)[0];
    sessionStorage.setItem('moviesList', JSON.stringify(this.moviesDetailsAll));
    this.modalDService.moviesList = this.moviesDetailsAll;
    this.rt.navigate(['./movie-details']);
  }

  initialArr(arr) {
    arr.splice(0, arr.length);
  }

  load() {
    this.initialArr(this.moviesDetails);
    this.discover();

  }

  creatNewMovie(content) {
    this.setNewMovieId();
    this.modalService.open(content, { size: 'lg' });
    setTimeout(() => {
      sessionStorage.setItem('moviesList', JSON.stringify(this.moviesDetailsAll));
    }, 1500)
  }

  setNewMovieId() {
    let movieId = 'HC' + this.tmdbService.newMovieId.toString()
    this.newMovieDetails['id'] = movieId;
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

  onItemDeSelect(item: GenreModel) {
    this.newMovieDetails['genres'] = this.newMovieDetails['genres'].filter(genre => genre.id != item.id);
  }
  onSelectAll(items: any) {
    this.newMovieDetails['genres'] = this.dropdownList;
  }

  onDeSelectAll(items: any) {
    this.newMovieDetails['genres'].splice(0, this.newMovieDetails['genres'].length);

  }

  onItemSelect(item: any) {
    this.newMovieDetails['genres'].push(item);
  }

  validate(movie: string): boolean {
    let isValid = !this.checkIfExist(movie) && (this.newMovieDetails['title'] != '' && this.newMovieDetails['title'] != undefined) &&
      (this.newMovieDetails['id'] != '' && this.newMovieDetails['id'] != undefined) &&
      (Number(this.newMovieDetails['year']) > 1000 && Number(this.newMovieDetails['year']) < 2020) &&
      Number(this.newMovieDetails['runTime']) > 0 && Number(this.newMovieDetails['runTime']) < 1000 &&
      (this.newMovieDetails['director'] != '' && this.newMovieDetails['director'] != undefined) &&
      this.newMovieDetails['genres'].length > 0 && this.isItAbcInput(this.newMovieDetails['title']);
    if (isValid) {
      return true;
    }
    return false;
  }

  checkIfExist(movieT: string): boolean {
    let temp: MovieDetailedModel[] = JSON.parse(sessionStorage.getItem('moviesList'));
    if (temp.filter(movie => movie.title === movieT)[0]) {
      this.isExistName = true;
      return this.isExistName;
    }

    else
      this.isExistName = false;
    return this.isExistName;
  }

  cancel() {
    for (const key in this.newMovieDetails) {
      if (key === 'genres') {
        this.newMovieDetails[key] = new Array();
      }
      else
        this.newMovieDetails[key] = '';
    }
    this.newMForm.reset();
    this.selectedItems.splice(0, this.selectedItems.length);
  }

  save() {
    let JSN = JSON.parse(sessionStorage.getItem('moviesList'));
    let jsnLn = JSN.length;
    let temp = {
      'title': this.filter.camel(this.newMovieDetails['title']),
      'release_date': this.newMovieDetails['year'],
      'id': this.newMovieDetails['id'],
      'directorName': this.newMovieDetails['director'],
      'poster_path': null,
      'vote_average': 5,
      'backdrop_path': null,
      'runtime': this.newMovieDetails['runTime'],
      'genres': this.newMovieDetails['genres']
    }
    JSN.push(temp);
    sessionStorage.setItem('moviesList', JSON.stringify(JSN));
    this.moviesDetailsAll = JSON.parse(sessionStorage.getItem('moviesList'));
    this.moviesDetails = this.moviesDetailsAll;
    this.modalDService.moviesList = JSON.parse(sessionStorage.getItem('moviesList'));

    setTimeout(() => { this.cancel() }
      , 1000)

  }

  isItAbcInput(input: string) {
    var letters = /^[A-Za-z]+$/;
    if (input.match(letters))
      return true;
    return false;

  }

}