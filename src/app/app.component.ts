import { Component } from '@angular/core';
import { MoviedbService } from './moviedb.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  movieGenres: object[];
  movies: MovieShortDescription[] = [];

  constructor(private _movidbService: MoviedbService) {}

  ngOnInit() {
    this.fetchMovieGenres();
  }

  private fetchMovieGenres(): void {
    this._movidbService.getGenres().subscribe((res) => {
      this.movieGenres = res['genres'];
    });
  }

  fetchMovies(value): void {
    let movieName: string = value.form.controls.movieName.value;
    if (movieName)
      this._movidbService.fetchMovieDataByName(movieName).subscribe((res) => {
        let m = res['results'];
        m.sort((a, b) => b['popularity'] - a['popularity']);
        m.forEach((item)=>{
          let n:MovieShortDescription = {
            poster_path: item["poster_path"]?`https://image.tmdb.org/t/p/w92${item["poster_path"]}`:"data:image/png;base64,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",
            original_title: item["original_title"],
            vote_average: item["vote_average"],
            release_date: new Date(item["release_date"]).toDateString(),
            id: item["id"],
            overview: item["overview"]
          }
          this.movies.push(n);
        })
        console.table(this.movies);
      });
  }

  showDescription(event):void{
    console.log(event.target.firstChild.textContent)
  }

  clickPropagation(event):void{
    console.log(event);
  }

}

export interface MovieShortDescription{
  poster_path:string,
  original_title: string,
  vote_average: number,
  release_date: string,
  id: number,
  overview: string
}