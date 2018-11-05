import React, { Component} from 'react';
import axios from 'axios';
import MovieList from '../components/MovieList';
import CONFIG from '../config.json';

class Index extends Component {
  constructor() {
    super();
    this.state = {
      movieTitle: "",
      totalResult: 0,
      apiMovieList: [],
      ownMovieList: [],
    }
  }
  
  handleSearchSubmit = (event) => {
    event.preventDefault();
    if(event.keyCode === 13) {
      if(this.state.movieTitle === '') {
        alert(`please enter the movie you want to search`);
      } else {
        axios.all([
          axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${CONFIG.movie_db_api_key}&query=${this.state.movieTitle}`),
          axios.get(`/movies`)
        ])
        .then(axios.spread((res1, res2) => {
          this.updateStates(res1.data, res2.data);
        }))
        .catch((err) => {
          console.log(err)
        });
      }
    }
  }
  
  updateStates(apiList, myList) {
    const ownMovieList = myList.map(movie => movie.movieId);
    this.setState({
      apiMovieList: apiList.results,
      totalResult: apiList.total_results,
      ownMovieList
    })
  }
  
  render() {
    const numberWithCommas = this.state.totalResult.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return (
      <div>
        <div>
          <h2>Your Personal IMDb</h2>
          <input
            type="text"
            label="Enter The Movie Title and Press Enter"
            placeholder="Find Movie"  
            margin="normal"
            value={this.state.movieTitle}
            onChange={(event) => (this.setState({movieTitle: event.target.value}))}
            onKeyUp={this.handleSearchSubmit}
          />
          <div>
          <MovieList apiMovieList={this.state.apiMovieList} ownMovieList={this.state.ownMovieList}/>
          </div>
        </div>
        <div className='footer'>Total Number of Search Results: {numberWithCommas}</div>
        <style jsx>{`
          .footer {
            position: fixed;
            left: 0;
            bottom: 0;
            width: 100%;
            background-color: #757de8;
            color: white;
            text-align: center;
            font-size: 0.8rem;
            font-weight: bold;
            padding: 5px;
            display: inline-block
          }
        `}
        </style>
      </div>
    )
  }
}

export default Index;