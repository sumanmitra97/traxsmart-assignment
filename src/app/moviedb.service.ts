import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MoviedbService {

  private API_URL:string = "https://api.themoviedb.org/3"
  private API_KEY:string = "api_key=e7a428d31ba9261aa8faf356856a54c8";
  constructor(private _httpClient:HttpClient) { }

  getGenres() {
    return this._httpClient.get(`${this.API_URL}/genre/movie/list?${this.API_KEY}`);
  }

  fetchMovieDataByName(movieName:string){
    return this._httpClient.get(`${this.API_URL}/search/movie?${this.API_KEY}&query=${movieName}`);
  }

}
