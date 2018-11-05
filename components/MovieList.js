import React from 'react';
import MovieListEntry from './MovieListEntry';

const MovieList = ({ apiMovieList, ownMovieList }) => (
  <div>
  {
    apiMovieList.slice(0, 10).map((movie) => {
      const isOnMyList = ownMovieList.indexOf(movie.id.toString()) < 0 ? "No" : "Yes";
      return <MovieListEntry movie={movie} key={movie.id} own={isOnMyList}/>
    })
  }
  </div>
)

export default MovieList; 

