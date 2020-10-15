import { Component } from '@angular/core';
import { MoviedbService } from './moviedb.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  movies: MovieShortDescription[];
  details: MoveDetails;

  constructor(private _movidbService: MoviedbService) {}

  ngOnInit() {}

  fetchMovies(value): void {
    this.details = null;
    let movieName: string = value.form.controls.movieName.value;
    if (movieName)
      this._movidbService.fetchMovieDataByName(movieName).subscribe((res) => {
        let m = res['results'];
        if (m) {
          this.movies = [];
          m.sort((a, b) => b['popularity'] - a['popularity']);
          m.forEach((item) => {
            let n: MovieShortDescription = {
              poster_path: item['poster_path']
                ? `https://image.tmdb.org/t/p/w92${item['poster_path']}`
                : this._movidbService.poster_short,
              original_title: item['original_title'],
              vote_average: item['vote_average'],
              release_date: new Date(item['release_date']).toDateString(),
              id: item['id'],
              overview: item['overview'],
            };
            this.movies.push(n);
          });
        }
      });
  }

  showDescription(event): void {
    let selector = this.findAncestor(event.target, '.movie');
    if (selector) {
      this._movidbService
        .fetchMovieDetails(selector.lastChild.textContent)
        .subscribe((res) => {
          if (res) {
            let genres: string[] = [];
            res['genres'].forEach((item) => {
              genres.push(item['name']);
            });
            let spoken_languages: string[] = [];
            res['spoken_languages'].forEach((item) => {
              spoken_languages.push(item['name']);
            });
            this.details = {
              adult: res['adult'],
              backdrop_path: res['backdrop_path']
                ? `https://image.tmdb.org/t/p/w1280${res['backdrop_path']}`
                : this._movidbService.backdrop_dummy,
              budget: res['budget'],
              genres: genres,
              homepage: res['homepage']?res['homepage']:null,
              imdb_id: `https://www.imdb.com/title/${res['imdb_id']}`,
              original_language: res['original_language'],
              original_title: res['original_title'],
              overview: res['overview'],
              poster_path: res['poster_path']
                ? `https://image.tmdb.org/t/p/w185${res['poster_path']}`
                : this._movidbService.poster_dummy,
              release_date: new Date(res['release_date']).toDateString(),
              runtime: `${res['runtime']} min`,
              spoken_languages: spoken_languages,
              status: res['status'],
              vote_average: res['vote_average'],
            };
          }
        });
      window.scroll(0, 0);
    }
  }

  findAncestor(el, sel) {
    while (
      (el = el.parentElement) &&
      !(el.matches || el.matchesSelector).call(el, sel)
    );
    return el;
  }
}

export interface MovieShortDescription {
  poster_path: string;
  original_title: string;
  vote_average: number;
  release_date: string;
  id: number;
  overview: string;
}

export interface MoveDetails {
  adult: boolean;
  backdrop_path: string;
  budget: number;
  genres: string[];
  homepage: string;
  imdb_id: string;
  original_language: string;
  original_title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  runtime: string;
  spoken_languages: string[];
  status: string;
  vote_average: number;
}
