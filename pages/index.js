import React, { Component} from 'react';
import axios from 'axios';
import MovieList from '../components/MovieList';
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
    return (
      <div>
        <div>
          <h2>Your Personal IMDb</h2>
          <div className="inputSection">
            <input
              type="text"
              placeholder="Enter The Movie Title"  
              margin="normal"
              ref={this.textInput} 
              value={this.state.movieTitle}
              onChange={(event) => (this.setState({movieTitle: event.target.value}))}
              onKeyUp={this.handleSearchSubmit}
            />
            <button onClick={this.handleSearchSubmit}>Search</button>
          </div>
          <div className="details">
          { 
            this.state.totalResult === 0 
            ? <div className="noResult">No Result</div>
            :<MovieList apiMovieList={this.state.apiMovieList} ownMovieList={this.state.ownMovieList}/>
          }
          </div>
        </div>
        <div className='footer'>Total Number of Search Results: {this.state.totalResult.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</div>
        <style jsx>{`
          * {
            font-family: Sans-serif
          }
          h2 {
            color: #482880
          }
          input {
            font-size: 16px;
            width: 60%;
            border: none;
            border-bottom: 2px solid #482880;
            padding: 10px
          }

          input:focus {
            outline: none;
            border-bottom: 3px solid #7357b9;
            width: 60%;
          }

          button {
            background-color: #482880;
            color: white;
            width: 100px;
            height: 40px;
            font-size: 14px;
            font-weight: bold;
            border: none;
            border-radius: 3px;
            margin-left: 5px;
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
          .details {
            border: 1px solid #757de8;;            
            border-radius: 5px;
            margin-bottom: 30px;

          }
          .noResult {
            margin: 5px;
            padding: 10px;
            border-style: none;
            border-radius: 5px;
            color: white;
            background-color: #ab003c;
            text-align: center;
            font-weight: bold;
          }

        `}
        </style>
      </div>
    )
  }
}

export default Index;