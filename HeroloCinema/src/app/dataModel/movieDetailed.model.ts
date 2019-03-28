import{CollectionModel} from './collection.model'
import {GenreModel} from './genre.model'
export interface MovieDetailedModel{
    
    adult: string;
    backdrop_path: string ;
    belongs_to_collection: CollectionModel;
    budget: string;
    directorName : string;
    genres: GenreModel [] ;
    homepage: string;
    id: string;
    imdb_id: string;
    original_language: string;
    original_title: string;
    overview: string;
    popularity: string;
    poster_path: string
    production_companies: [
      {
        id: string,
        logo_path: string,
        name: string,
        origin_country: string
      },
      {
        id: string,
        logo_path: string,
        name: string,
        origin_country: string
      }
    ];
    production_countries: [
      {
        iso_3166_1: string,
        name: string
      }
    ];
    release_date: string;
    revenue: string;
    runtime: string;
    spoken_languages: [
      {
        iso_639_1: string,
        name: string
      }
    ];
    status: string;
    tagline: string;
    title: string;
    video: string;
    vote_average: string;
    vote_count: string
  }