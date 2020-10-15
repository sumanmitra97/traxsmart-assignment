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
  cast: Cast[];
  crew: Crew[];
  similar: MovieShortDescription[];

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
      let movieId: number = selector.lastChild.textContent;
      this.fetchDetails(movieId);
    }
  }

  loadMovieDetails(event): void {
    let selector = this.findAncestor(event.target, '.similar-movie');
    if (selector) {
      let movieId: number = selector.lastChild.textContent;
      this.fetchDetails(movieId);
    }
  }

  fetchDetails(movieId: number) {
    this._movidbService.fetchMovieDetails(movieId).subscribe((res) => {
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
          adult: res['adult'] < 18 ? '16+' : '18+',
          backdrop_path: res['backdrop_path']
            ? `https://image.tmdb.org/t/p/w1280${res['backdrop_path']}`
            : this._movidbService.backdrop_dummy,
          budget: res['budget'],
          genres: genres,
          homepage: res['homepage'] ? res['homepage'] : null,
          imdb_id: `https://www.imdb.com/title/${res['imdb_id']}`,
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
    this._movidbService.fetchMovieCredits(movieId).subscribe((res) => {
      if (res) {
        this.cast = [];
        this.crew = [];
        for (var index = 0; index < res['cast'].length; index++) {
          if (index > 19) break;
          let item = res['cast'][index];
          let c: Cast = {
            name: item['name'],
            character: item['character'],
            profile_path: item['profile_path']
              ? `https://image.tmdb.org/t/p/w185${item['profile_path']}`
              : this._movidbService.profile_dummy,
          };
          this.cast.push(c);
        }
        for (var index = 0; index < res['crew'].length; index++) {
          if (index > 19) break;
          let item = res['crew'][index];
          let c: Crew = {
            name: item['name'],
            job: item['job'],
            profile_path: item['profile_path']
              ? `https://image.tmdb.org/t/p/w185${item['profile_path']}`
              : this._movidbService.profile_dummy,
          };
          this.crew.push(c);
        }
      }
    });
    this._movidbService.fetchSimilarMovies(movieId).subscribe((res) => {
      if (res) {
        this.similar = [];
        for (var index = 0; index < res['results'].length; index++) {
          if (index > 19) break;
          let item = res['results'][index];
          let c: MovieShortDescription = {
            poster_path: item['poster_path']
              ? `https://image.tmdb.org/t/p/w185${item['poster_path']}`
              : this._movidbService.poster_dummy,
            original_title: item['original_title'],
            vote_average: item['vote_average'],
            release_date: new Date(item['release_date']).toDateString(),
            id: item['id'],
            overview: item['overview'],
          };
          this.similar.push(c);
        }
      }
    });
    window.scroll(0, 0);
  }

  findAncestor(el, sel) {
    while (
      !(el.matches || el.matchesSelector).call(el, sel) &&
      (el = el.parentElement)
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
  adult: string;
  backdrop_path: string;
  budget: number;
  genres: string[];
  homepage: string;
  imdb_id: string;
  original_title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  runtime: string;
  spoken_languages: string[];
  status: string;
  vote_average: number;
}

export interface Cast {
  name: string;
  character: string;
  profile_path: string;
}

export interface Crew {
  name: string;
  job: string;
  profile_path: string;
}
