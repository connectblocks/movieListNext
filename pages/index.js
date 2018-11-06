
import React, { Component} from 'react';
import axios from 'axios';
import MovieList from '../components/MovieList';
import { Paper, TextField, Button } from '@material-ui/core/';
import CONFIG from '../config.json';

class Index extends Component {
  constructor() {
    super();
    this.state = {
      movieTitle: "",
      totalResult: "",
      apiMovieList: [],
      ownMovieList: [],
    }
  }
  
  handleSearchSubmit = (event) => {
    event.preventDefault();
    if(event.keyCode === 13 || !event.keyCode) {
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
          <div className="inputSection">
            <TextField
              type="text"
              fullWidth
              label="Enter The Movie Title"
              placeholder="Find Movie"  
              margin="normal"
              ref={this.textInput} 
              value={this.state.movieTitle}
              onChange={(event) => (this.setState({movieTitle: event.target.value}))}
              onKeyUp={this.handleSearchSubmit}
            />
            <Button variant="contained" color="primary" onClick={this.handleSearchSubmit}>Search</Button>
          </div>
          <div>
          { 
            this.state.totalResult === 0 
            ? <div className="noResult">No Result</div>
            :<MovieList apiMovieList={this.state.apiMovieList} ownMovieList={this.state.ownMovieList}/>
          }
          </div>
        </div>
        <div className='footer'>Total Number of Search Results: {numberWithCommas}</div>
        <style jsx>{`
          * {
            font-family: Sans-serif
          }
          h2 {
            color: #482880
          }
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
          .inputSection {
            width: 800px;
            margin-bottom: 20px;
          }
          .noResult {
            margin: 5px;
            padding: 10px;
            border-style: none;
            border-radius: 5px;
            color: white;
            background-color: #ab003c
          }
        `}
        </style>
      </div>
    )
  }
}

export default Index;