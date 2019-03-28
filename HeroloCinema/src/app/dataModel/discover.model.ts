import{MovieModel} from './movie.model'
export interface DiscoverModel{
page: string,
total_results : string,
total_pages: string,
results: MovieModel []
}