import {MovieModel} from './movie.model'


export interface CollectionModel{

id: string,
  name: string,
  overview: string,
  poster_path: string,
  backdrop_path: string,
  parts: MovieModel []

  }