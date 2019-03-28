import { GenreModel } from './genre.model';

export interface MovieModel {
  vote_count : string,
  id: string,
  video: string,
  vote_average: string,
  title: string,
  popularity: string,
  poster_path: string,
  original_language: string,
  original_title: string,
  genre_ids: GenreModel,
  backdrop_path: string,
  adult: string,
  overview: string,
  release_date : string
  

}