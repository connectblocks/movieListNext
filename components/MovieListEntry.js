import React, { Component } from 'react';
import axios from 'axios';
import Link from 'next/link'

class MovieListEntry extends Component {
  constructor(props) {
    super(props);
    this.state = {
      own: props.own
    }   
  }

  handleOwnClick = event => {
    event.stopPropagation()
    if(event.target.value === 'No') {
      axios.post('/movies', { movieId: this.props.movie.id })
        .then((res) => {
          this.setState({ own: 'Yes'})   
        })
        .catch(err => console.log(err))
    } else {
      axios.delete('/movies', {data: { movieId: this.props.movie.id }})
        .then((res) => {
          this.setState({ own: 'No'})   
        })
        .catch(err => console.log(err))
      }
  }

  render () {
    const inStyle = this.state.own === 'Yes' ? 'Green' : 'Grey';
    return (
      <Link as={`/result/${this.props.movie.id}`} href={`/result?id=${this.props.movie.id}`} >
        <div className='listEntryView' >
          <div className='container'>
            <div className='title'>{this.props.movie.title}</div>
            <div className='listEntryItem'><b>Release Date: </b>{this.props.movie.release_date}</div>
          </div>
        <div className='listEntryItem'>
          <span><b>Own it?: </b></span>    
          <button onClick={this.handleOwnClick} value={this.state.own} style={{color: 'White', backgroundColor: inStyle, borderRadius: '5px', borderStyle: 'none'}}>{this.state.own}</button>
        </div>
          <div className='overviewDetails'>
          <div className='listEntryItem'>
            <b>Overview:</b>
            <div>{this.props.movie.overview}</div>
          </div>
        </div>
        <style jsx>{`
          .listEntryView {
            margin: 5px;
            padding: 10px;
            border-style: none;
            border-radius: 5px;
            background-color: rgb(255, 248, 235)
          }
          .listEntryView:hover { 
            background-color: rgb(253, 240, 216);
            cursor: pointer;
          }
          .listEntryItem {
            margin: 0 0 5px 0;
          }
          .overviewDetails {
            font-size: 0.8em;
            padding: 10px;
            margin-top: 5px;
            background-color: white;
            border-radius: 5px
          }
          .container {
            display: grid;
            grid-template-columns: 2fr 1fr
          }
          .title {
            font-weight: bold;
            color: #482880;

          }
        `}
        </style>
        </div>
      </Link>
    )
  }
}

export default MovieListEntry; 